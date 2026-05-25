import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiClient";
import {
  useFreezeWallet,
  useUnfreezeWallet,
} from "@/hooks/mutations/useWalletMutations";
import { IWallet } from "@/types/wallet.types";

interface WalletFreezeDialogProps {
  wallet: IWallet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletFreezeDialog({
  wallet,
  open,
  onOpenChange,
}: WalletFreezeDialogProps) {
  const isFundingFrozen = wallet.is_funding_frozen;
  const isTransferFrozen = wallet.is_transfer_frozen;

  // Freeze form state
  const [freezeTransfer, setFreezeTransfer] = useState(true);
  const [freezeFunding, setFreezeFunding] = useState(true);

  // Unfreeze form state — pre-tick whichever flags are currently frozen
  const [unfreezeTransfer, setUnfreezeTransfer] = useState(isTransferFrozen);
  const [unfreezeFunding, setUnfreezeFunding] = useState(isFundingFrozen);

  const isAnyFrozen = isFundingFrozen || isTransferFrozen;
  const mode: "freeze" | "unfreeze" = isAnyFrozen ? "unfreeze" : "freeze";

  const { mutateAsync: doFreeze, isPending: isFreezing } = useFreezeWallet();
  const { mutateAsync: doUnfreeze, isPending: isUnfreezing } =
    useUnfreezeWallet();

  const isPending = isFreezing || isUnfreezing;

  const handleFreeze = () => {
    if (!freezeTransfer && !freezeFunding) {
      toast.error("Select at least one capability to freeze");
      return;
    }
    doFreeze(
      {
        walletId: wallet.id,
        payload: { transfer: freezeTransfer, funding: freezeFunding },
      },
      {
        onSuccess: () => {
          toast.success("Wallet frozen successfully");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, "Failed to freeze wallet"));
        },
      },
    );
  };

  const handleUnfreeze = () => {
    if (!unfreezeTransfer && !unfreezeFunding) {
      toast.error("Select at least one capability to unfreeze");
      return;
    }
    doUnfreeze(
      {
        walletId: wallet.id,
        payload: { transfer: unfreezeTransfer, funding: unfreezeFunding },
      },
      {
        onSuccess: () => {
          toast.success(
            unfreezeFunding
              ? "Wallet unfrozen — held deposits will be released to the balance"
              : "Wallet transfer freeze lifted",
          );
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(getApiErrorMessage(error, "Failed to unfreeze wallet"));
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "freeze" ? "Freeze Wallet" : "Unfreeze Wallet"}
          </DialogTitle>
          <DialogDescription>
            {mode === "freeze"
              ? "Choose which wallet capabilities to freeze. Freezing funding will hold incoming deposits instead of crediting them."
              : "Choose which wallet capabilities to restore. Unfreezing funding will automatically release any held deposits to the wallet balance."}
          </DialogDescription>
        </DialogHeader>

        {/* Current status badges */}
        <div className="flex gap-2 text-xs font-semibold">
          <span
            className={`px-2 py-1 rounded-full border ${
              isTransferFrozen
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : "bg-success/10 text-success border-success/20"
            }`}
          >
            Transfers: {isTransferFrozen ? "Frozen" : "Active"}
          </span>
          <span
            className={`px-2 py-1 rounded-full border ${
              isFundingFrozen
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : "bg-success/10 text-success border-success/20"
            }`}
          >
            Deposits: {isFundingFrozen ? "Frozen" : "Active"}
          </span>
        </div>

        <div className="space-y-4 pt-2">
          <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {mode === "freeze" ? "Freeze" : "Unfreeze"}
          </Label>

          {mode === "freeze" ? (
            <>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="freeze-transfer"
                  checked={freezeTransfer}
                  onCheckedChange={(v) => setFreezeTransfer(!!v)}
                />
                <label
                  htmlFor="freeze-transfer"
                  className="text-sm font-medium cursor-pointer"
                >
                  Outgoing transfers
                  <p className="text-xs text-muted-foreground font-normal">
                    Block the customer from sending money
                  </p>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="freeze-funding"
                  checked={freezeFunding}
                  onCheckedChange={(v) => setFreezeFunding(!!v)}
                />
                <label
                  htmlFor="freeze-funding"
                  className="text-sm font-medium cursor-pointer"
                >
                  Incoming deposits
                  <p className="text-xs text-muted-foreground font-normal">
                    Hold inbound payments instead of crediting the balance
                  </p>
                </label>
              </div>
            </>
          ) : (
            <>
              {isTransferFrozen && (
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="unfreeze-transfer"
                    checked={unfreezeTransfer}
                    onCheckedChange={(v) => setUnfreezeTransfer(!!v)}
                  />
                  <label
                    htmlFor="unfreeze-transfer"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Outgoing transfers
                    <p className="text-xs text-muted-foreground font-normal">
                      Re-enable the customer's ability to send money
                    </p>
                  </label>
                </div>
              )}
              {isFundingFrozen && (
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="unfreeze-funding"
                    checked={unfreezeFunding}
                    onCheckedChange={(v) => setUnfreezeFunding(!!v)}
                  />
                  <label
                    htmlFor="unfreeze-funding"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Incoming deposits
                    <p className="text-xs text-muted-foreground font-normal">
                      Re-enable deposits — held funds will be released
                      immediately
                    </p>
                  </label>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={mode === "freeze" ? handleFreeze : handleUnfreeze}
            disabled={isPending}
            className={`cursor-pointer ${
              mode === "freeze"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }`}
          >
            {isPending
              ? mode === "freeze"
                ? "Freezing..."
                : "Unfreezing..."
              : mode === "freeze"
                ? "Freeze Wallet"
                : "Unfreeze Wallet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
