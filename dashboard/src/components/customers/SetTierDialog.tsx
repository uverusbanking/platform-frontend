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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiClient";
import { useSetCustomerTier } from "@/hooks/mutations/useCustomerMutations";

const tierOptions = [
  { value: 1, label: "Tier 1 — Basic" },
  { value: 2, label: "Tier 2 — Intermediate" },
  { value: 3, label: "Tier 3 — Full" },
] as const;

interface SetTierDialogProps {
  id: string;
  currentTier: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SetTierDialog({
  id,
  currentTier,
  open,
  onOpenChange,
}: SetTierDialogProps) {
  const [tier, setTier] = useState<number>(currentTier);
  const [justification, setJustification] = useState("");
  const { mutateAsync: setCustomerTier, isPending } = useSetCustomerTier();

  const handleSubmit = async () => {
    if (!justification.trim()) {
      toast.error("Justification is required");
      return;
    }
    setCustomerTier(
      { id, payload: { kyc_level: tier, justification: justification.trim() } },
      {
        onSuccess: () => {
          toast.success(`Customer tier set to Tier ${tier}`);
          setJustification("");
          onOpenChange(false);
        },
        onError: (error) => {
          const message = getApiErrorMessage(error, "Failed to set tier");
          toast.error(message);
        },
      },
    );
  };

  const isDowngrade = tier < currentTier;
  const isUnchanged = tier === currentTier;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Override Customer Tier</DialogTitle>
          <DialogDescription>
            Bypasses KYC validation. Record the justification clearly — this
            action is logged for compliance. Current tier:{" "}
            <strong>Tier {currentTier}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="set-tier-select">Target Tier</Label>
            <Select
              value={String(tier)}
              onValueChange={(v) => setTier(Number(v))}
            >
              <SelectTrigger id="set-tier-select">
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                {tierOptions.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    {opt.label}
                    {opt.value === currentTier ? " (current)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="set-tier-justification">Justification</Label>
            <Textarea
              id="set-tier-justification"
              placeholder="e.g. Temporary upgrade pending BVN verification — revert after 7 days"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {isDowngrade && (
            <p className="text-xs text-amber-600 font-semibold bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              This is a downgrade. The customer's transaction limits will be
              reduced immediately.
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isPending || isUnchanged || !justification.trim()}
            className="cursor-pointer"
          >
            {isPending ? "Saving..." : `Set to Tier ${tier}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
