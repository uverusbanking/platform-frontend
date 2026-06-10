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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";
import { useFreezeWallet } from "@/hooks/mutations/useWalletMutations";
import { apiErrorResponse } from "@/lib/axios";
import {
  WALLET_FREEZE_REASONS,
  TWalletFreezeReason,
} from "@/types/wallet.types";
import { ArrowUpDown, Lock } from "lucide-react";

interface FreezeWalletDialogProps {
  walletId: string;
  customerId: string;
  accountNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FreezeWalletDialog({
  walletId,
  customerId,
  accountNumber,
  open,
  onOpenChange,
}: FreezeWalletDialogProps) {
  const [reason, setReason] = useState<TWalletFreezeReason>("SUSPECTED_FRAUD");
  const [freezeTransfer, setFreezeTransfer] = useState(true);
  const [freezeFunding, setFreezeFunding] = useState(false);

  const { mutate: freezeWallet, isPending } = useFreezeWallet(customerId);

  const handleSubmit = () => {
    if (!freezeTransfer && !freezeFunding) {
      toast.error("Select at least one restriction — transfer or funding.");
      return;
    }
    freezeWallet(
      {
        id: walletId,
        payload: { reason, transfer: freezeTransfer, funding: freezeFunding },
      },
      {
        onSuccess: () => {
          toast.success("Wallet frozen successfully");
          onOpenChange(false);
        },
        onError: (error) => {
          const err = apiErrorResponse(error, "Failed to freeze wallet");
          toast.error(err.error || "Failed to freeze wallet");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Freeze Wallet</DialogTitle>
          <DialogDescription>
            Restrict transfer or funding on wallet{" "}
            <span className="font-mono font-bold text-foreground">
              {accountNumber}
            </span>
            . At least one restriction must be selected.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label>Reason</Label>
            <Select
              value={reason}
              onValueChange={(v) => setReason(v as TWalletFreezeReason)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WALLET_FREEZE_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl border border-border/40 divide-y divide-border/30 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <ArrowUpDown className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-sm font-bold">Freeze Transfers</p>
                  <p className="text-[11px] text-muted-foreground">
                    Block outbound transfers
                  </p>
                </div>
              </div>
              <Switch
                checked={freezeTransfer}
                onCheckedChange={setFreezeTransfer}
              />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-red-500" />
                <div>
                  <p className="text-sm font-bold">Freeze Funding</p>
                  <p className="text-[11px] text-muted-foreground">
                    Block inbound deposits
                  </p>
                </div>
              </div>
              <Switch
                checked={freezeFunding}
                onCheckedChange={setFreezeFunding}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 mt-2">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/80 cursor-pointer"
          >
            {isPending ? "Freezing..." : "Freeze Wallet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
