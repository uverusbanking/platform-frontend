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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useUnfreezeWallet } from "@/hooks/mutations/useWalletMutations";
import { apiErrorResponse } from "@/lib/axios";

interface UnfreezeWalletDialogProps {
  walletId: string;
  customerId: string;
  accountNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UnfreezeWalletDialog({
  walletId,
  customerId,
  accountNumber,
  open,
  onOpenChange,
}: UnfreezeWalletDialogProps) {
  const [justification, setJustification] = useState("");
  const { mutate: unfreezeWallet, isPending } = useUnfreezeWallet(customerId);

  const handleSubmit = () => {
    unfreezeWallet(
      { id: walletId, payload: { justification } },
      {
        onSuccess: () => {
          toast.success("Wallet unfrozen successfully");
          setJustification("");
          onOpenChange(false);
        },
        onError: (error) => {
          const err = apiErrorResponse(error, "Failed to unfreeze wallet");
          toast.error(err.error || "Failed to unfreeze wallet");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Unfreeze Wallet</DialogTitle>
          <DialogDescription>
            Restore full access to wallet{" "}
            <span className="font-mono font-bold text-foreground">
              {accountNumber}
            </span>
            . All transfer and funding restrictions will be lifted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="unfreeze-wallet-justification">Justification</Label>
          <Textarea
            id="unfreeze-wallet-justification"
            placeholder="e.g. Cleared by compliance after AML review"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter className="gap-2 mt-2">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !justification.trim()}
            className="cursor-pointer"
          >
            {isPending ? "Unfreezing..." : "Unfreeze Wallet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
