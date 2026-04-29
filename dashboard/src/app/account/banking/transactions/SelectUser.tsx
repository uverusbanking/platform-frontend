"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronDown } from "lucide-react";
import { useGetCustomers } from "@/hooks/queries/useCustomerQueries";
import { ICustomer } from "@/types/customer.types";
import { currencyDisplay } from "@/utils/resources";

interface Props {
  onSelect: (user: ICustomer) => void;
  selectedUser?: ICustomer;
  height?: number;
  itemHeight?: number;
}

export default function SearchableUserVirtualSelect({
  onSelect,
  selectedUser,
  height = 300,
  itemHeight = 48,
}: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ICustomer | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 30;

  // Accumulate customers across pages
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const { data: customerResponse, isLoading: isLoadingCustomers } =
    useGetCustomers({
      page: page + 1,
      limit: PAGE_SIZE,
      environment: "SANDBOX",
      search: debouncedQuery || undefined,
    });

  // Update customers list on response
  useEffect(() => {
    if (customerResponse?.data) {
      if (page === 0) {
        setCustomers(customerResponse.data);
      } else {
        setCustomers((prev) => {
          // Avoid duplicates if API returns overlapping data
          const ids = new Set(prev.map((u) => u.id));
          return [
            ...prev,
            ...customerResponse.data.filter((u) => !ids.has(u.id)),
          ];
        });
      }
    }
    // Update hasMore based on pagination
    if (customerResponse?.meta?.pagination) {
      setHasMore(
        customerResponse.meta.pagination.page <
          customerResponse.meta.pagination.total_pages,
      );
    } else {
      setHasMore(false);
    }
    setLoading(isLoadingCustomers);
  }, [customerResponse, page, isLoadingCustomers]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 200);
    return () => clearTimeout(t);
  }, [query]);

  // Reset on new search
  useEffect(() => {
    setPage(0);
  }, [debouncedQuery]);

  // Keep selected in sync
  useEffect(() => {
    if (selectedUser && selectedUser.id) {
      setSelected(selectedUser);
    }
  }, [selectedUser]);

  // Filtered users (all loaded customers)
  const filteredUsers = useMemo(() => customers, [customers]);

  // Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: filteredUsers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 5,
  });

  // Infinite scroll
  useEffect(() => {
    if (!open) return;
    const parent = parentRef.current;
    if (!parent) return;
    const onScroll = () => {
      if (
        parent.scrollTop + parent.clientHeight >= parent.scrollHeight - 40 &&
        !loading &&
        hasMore
      ) {
        setPage((p) => p + 1);
      }
    };
    parent.addEventListener("scroll", onScroll);
    return () => parent.removeEventListener("scroll", onScroll);
  }, [open, loading, hasMore]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setHighlightedIndex((i) => Math.min(i + 1, filteredUsers.length - 1));
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        e.preventDefault();
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        const user = filteredUsers[highlightedIndex];
        if (user) handleSelect(user);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filteredUsers, highlightedIndex]);

  const handleSelect = (user: ICustomer) => {
    setSelected(user);
    setOpen(false);
    setQuery("");
    setDebouncedQuery("");
    setHighlightedIndex(-1);
    onSelect(user);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex flex-col items-start gap-0.5">
          {selected ? (
            <>
              <span className="font-medium text-foreground">
                {selected.first_name} {selected.last_name}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">Select user account…</span>
          )}
        </span>
        <span
          className={`ml-2 flex-shrink-0 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          aria-hidden="true"
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </span>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-popover border border-border rounded-md shadow-lg animate-in fade-in slide-in-from-top-2">
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(0);
            }}
            placeholder="Search..."
            className="w-full px-3 py-2 border-b border-border outline-none bg-background text-foreground placeholder:text-muted-foreground"
          />
          <div
            ref={parentRef}
            className="overflow-auto"
            style={{ height, maxHeight: height }}
            tabIndex={-1}
            role="listbox"
          >
            {filteredUsers.length === 0 && !loading ? (
              <div className="p-4 text-sm text-muted-foreground">
                No results found
              </div>
            ) : (
              <div
                style={{
                  height: rowVirtualizer.getTotalSize(),
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const user = filteredUsers[virtualRow.index];
                  const isHighlighted = virtualRow.index === highlightedIndex;
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleSelect(user)}
                      onMouseEnter={() => setHighlightedIndex(virtualRow.index)}
                      className={`absolute left-0 right-0 px-3 flex flex-col py-2 cursor-pointer select-none transition-colors ${isHighlighted ? "bg-primary/10 text-primary" : "hover:bg-accent hover:text-accent-foreground"}`}
                      style={{
                        height: virtualRow.size,
                        transform: `translateY(${virtualRow.start}px)`,
                        zIndex: isHighlighted ? 1 : undefined,
                      }}
                      role="option"
                      aria-selected={isHighlighted}
                    >
                      <span className="font-medium">
                        {user.first_name} {user.last_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Acct: {user.account_number}{" "}
                        {user.balance !== undefined &&
                          " • " + currencyDisplay(user.balance)}
                      </span>
                    </div>
                  );
                })}
                {loading && (
                  <div className="absolute left-0 right-0 bottom-0 p-2 text-xs text-muted-foreground text-center bg-background">
                    Loading…
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
