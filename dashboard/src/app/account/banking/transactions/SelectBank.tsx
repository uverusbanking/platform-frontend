"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

type Item = {
  bank_name: string;
  bank_code: string;
  logo: string;
};

interface Props {
  items: Item[];
  onSelect: (item: Item) => void;
  selectedItem?: string;
  height?: number;
  itemHeight?: number;
}

export default function SearchableVirtualSelect({
  items,
  onSelect,
  selectedItem,
  height = 300,
  itemHeight = 40,
}: Props) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // Keep selected in sync with selectedItem prop
  useEffect(() => {
    if (selectedItem) {
      const found = items.find((item) => item.bank_code === selectedItem);
      setSelected(found || null);
    } else {
      setSelected(null);
    }
  }, [selectedItem, items]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (!debouncedQuery) return items;
    return items.filter((item) =>
      item.bank_name
        .toLowerCase()
        .trim()
        .includes(debouncedQuery.toLowerCase().trim()),
    );
  }, [items, debouncedQuery]);

  // Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
    overscan: 5,
  });

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setHighlightedIndex((i) => Math.min(i + 1, filteredItems.length - 1));
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        e.preventDefault();
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        const item = filteredItems[highlightedIndex];
        if (item) handleSelect(item);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filteredItems, highlightedIndex]);

  const handleSelect = (item: Item) => {
    setSelected(item);
    setOpen(false);
    setQuery("");
    setDebouncedQuery("");
    setHighlightedIndex(-1);
    onSelect(item);
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
        <span className="flex items-center gap-2">
          {selected ? (
            <>
              {/* {selected.logo && (
                <img src={selected.logo} alt="logo" className="w-5 h-5 object-contain rounded-full bg-muted" />
              )} */}
              <span className="text-foreground">
                {selected.bank_name.trim()}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">Select a bank…</span>
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
            {filteredItems.length === 0 ? (
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
                  const item = filteredItems[virtualRow.index];
                  const isHighlighted = virtualRow.index === highlightedIndex;
                  return (
                    <div
                      key={item.bank_code}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setHighlightedIndex(virtualRow.index)}
                      className={`absolute left-0 right-0 px-3 flex items-center cursor-pointer select-none transition-colors ${isHighlighted ? "bg-primary/10 text-primary" : "hover:bg-accent hover:text-accent-foreground"}`}
                      style={{
                        height: virtualRow.size,
                        transform: `translateY(${virtualRow.start}px)`,
                        zIndex: isHighlighted ? 1 : undefined,
                      }}
                      role="option"
                      aria-selected={isHighlighted}
                    >
                      <span className="truncate">{item.bank_name.trim()}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
