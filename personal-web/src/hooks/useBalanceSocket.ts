import { useEffect, useRef, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  connectBalanceSocket,
  disconnectBalanceSocket,
  onBalanceUpdated,
  type BalanceUpdatedPayload,
} from "@/lib/balanceSocket";
import { useAuth } from "@/contexts/AuthContext";

const TOKEN_KEY = "sb-access-token";

export interface UseBalanceSocketOptions {
  /** Called on every balance.updated event */
  onUpdate?: (payload: BalanceUpdatedPayload) => void;
  /** Show a toast on credit/debit/transfer (default: true) */
  showToast?: boolean;
  /** If provided, only updates socketBalance for this specific wallet */
  walletId?: string;
}

export interface UseBalanceSocketResult {
  /** Latest balance string pushed by the server (e.g. "12500.00").
   *  null until the first socket event arrives — fall back to wallet REST data. */
  socketBalance: string | null;
  /** True for ~1 second after each balance update — use to trigger a CSS flash */
  balanceFlash: boolean;
  /** Last full payload received, or null */
  lastPayload: BalanceUpdatedPayload | null;
}

/**
 * Connects to the /banking WebSocket namespace and:
 * - Returns socketBalance / balanceFlash for immediate UI rendering
 * - Updates the React Query "wallet" cache on balance.updated
 * - Optionally shows a Sonner toast notification
 * - Calls a custom onUpdate callback
 *
 * Automatically connects when the user is authenticated and
 * disconnects on sign-out or unmount.
 */
export function useBalanceSocket(
  options: UseBalanceSocketOptions = {},
): UseBalanceSocketResult {
  const { showToast = true, onUpdate } = options;
  const { accessToken, user } = useAuth();
  const queryClient = useQueryClient();
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const [socketBalance, setSocketBalance] = useState<string | null>(null);
  const [balanceFlash, setBalanceFlash] = useState(false);
  const [lastPayload, setLastPayload] = useState<BalanceUpdatedPayload | null>(
    null,
  );

  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBalanceUpdated = useCallback(
    (payload: BalanceUpdatedPayload) => {
      // 1. Store the latest socket value in local state for direct rendering
      // Only update if it matches the filtered walletId or no filter is provided
      if (!options.walletId || payload.walletId === options.walletId) {
        setSocketBalance(payload.balance);
        setLastPayload(payload);

        // 2. Trigger a flash animation for 1 second
        setBalanceFlash(true);
        if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
        flashTimerRef.current = setTimeout(() => setBalanceFlash(false), 1000);
      }

      // 3. Update the React Query wallet cache in-place (instant, no re-fetch flicker)
      queryClient.setQueryData(["wallet"], (old: any) => {
        if (!old || !Array.isArray(old.data)) return old;
        // Cache shape is now ApiResponse<WalletDto[]>
        return {
          ...old,
          data: old.data.map((w: any) =>
            w.id === payload.walletId ? { ...w, balance: payload.balance } : w,
          ),
        };
      });

      // 4. Invalidate to confirm server state shortly after
      queryClient.invalidateQueries({ queryKey: ["wallet"] });

      // 5. Toast notification
      if (showToast) {
        const currencySymbol =
          payload.currency === "NGN" ? "₦" : payload.currency;
        const amount = parseFloat(payload.amount).toLocaleString("en-NG", {
          minimumFractionDigits: 2,
        });

        if (payload.event === "wallet.credit") {
          toast.success(`${currencySymbol}${amount} credited to your account`, {
            description: payload.description || "Wallet Credit",
            duration: 5000,
          });
        } else if (payload.event === "wallet.debit") {
          toast.info(`${currencySymbol}${amount} debited from your account`, {
            description: payload.description || "Wallet Debit",
            duration: 5000,
          });
        } else if (payload.event === "wallet.transfer") {
          toast.info(`Transfer of ${currencySymbol}${amount} processed`, {
            description: payload.description || "Wallet Transfer",
            duration: 5000,
          });
        }
      }

      // 6. User-supplied callback
      onUpdateRef.current?.(payload);
    },
    [queryClient, showToast, options.walletId],
  );

  useEffect(() => {
    const token = accessToken || localStorage.getItem(TOKEN_KEY);
    if (!user || !token) return;

    connectBalanceSocket(token);
    const cleanup = onBalanceUpdated(handleBalanceUpdated);

    return () => {
      cleanup();
      disconnectBalanceSocket();
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, [user, accessToken, handleBalanceUpdated]);

  return { socketBalance, balanceFlash, lastPayload };
}
