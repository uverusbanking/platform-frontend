"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
import {
  useAdjustExternalDebit,
  useAdjustExternalCredit,
  useCollectFee,
  useManualCorrection,
  useReverseTransaction,
} from "@/hooks/mutations/useWalletMutations";
import {
  AdjustmentType,
  ProviderChannel,
  FeeType,
  CorrectionDirection,
} from "@/types/adjustment.types";

interface LedgerAdjustmentDialogProps {
  walletId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OPERATION_OPTIONS: {
  value: AdjustmentType;
  label: string;
  description: string;
}[] = [
  {
    value: "EXTERNAL_DEBIT",
    label: "External Debit",
    description:
      "Money already moved out by a provider — deduct from wallet balance",
  },
  {
    value: "EXTERNAL_CREDIT",
    label: "External Credit",
    description:
      "Money already received via a provider — credit to wallet balance",
  },
  {
    value: "FEE",
    label: "Fee Collection",
    description: "Collect a platform fee or charge from the wallet",
  },
  {
    value: "CORRECTION",
    label: "Manual Correction",
    description: "Fix a balance discrepancy with a debit or credit entry",
  },
  {
    value: "REVERSAL",
    label: "Reversal",
    description: "Reverse a previously completed transaction by its reference",
  },
];

const CHANNELS: { value: ProviderChannel; label: string }[] = [
  { value: "BUDPAY", label: "Budpay" },
  { value: "FLUTTERWAVE", label: "Flutterwave" },
  { value: "MONNIFY", label: "Monnify" },
  { value: "PROVIDUS", label: "Providus" },
  { value: "INTERNAL", label: "Internal" },
];

const FEE_TYPES: { value: FeeType; label: string }[] = [
  { value: "PLATFORM_FEE", label: "Platform Fee" },
  { value: "SERVICE_CHARGE", label: "Service Charge" },
  { value: "PENALTY", label: "Penalty" },
  { value: "MAINTENANCE_FEE", label: "Maintenance Fee" },
];

function toISOLocal(value: string): string {
  if (!value) return "";
  // datetime-local gives "YYYY-MM-DDTHH:mm" — convert to full ISO
  return new Date(value).toISOString();
}

export function LedgerAdjustmentDialog({
  walletId,
  open,
  onOpenChange,
}: LedgerAdjustmentDialogProps) {
  const [operationType, setOperationType] =
    useState<AdjustmentType>("EXTERNAL_DEBIT");

  // Shared fields
  const [amount, setAmount] = useState("");
  const [narration, setNarration] = useState("");
  const [allowNegative, setAllowNegative] = useState(false);

  // External debit/credit
  const [providerReference, setProviderReference] = useState("");
  const [effectiveAt, setEffectiveAt] = useState("");
  const [channel, setChannel] = useState<ProviderChannel>("FLUTTERWAVE");

  // Fee
  const [feeType, setFeeType] = useState<FeeType>("PLATFORM_FEE");

  // Correction
  const [correctionDirection, setCorrectionDirection] =
    useState<CorrectionDirection>("DEBIT");
  const [correctionReason, setCorrectionReason] = useState("");

  // Reversal
  const [originalReference, setOriginalReference] = useState("");

  const { mutateAsync: doExternalDebit, isPending: isDebitPending } =
    useAdjustExternalDebit();
  const { mutateAsync: doExternalCredit, isPending: isCreditPending } =
    useAdjustExternalCredit();
  const { mutateAsync: doFee, isPending: isFeePending } = useCollectFee();
  const { mutateAsync: doCorrection, isPending: isCorrectionPending } =
    useManualCorrection();
  const { mutateAsync: doReversal, isPending: isReversalPending } =
    useReverseTransaction();

  const isPending =
    isDebitPending ||
    isCreditPending ||
    isFeePending ||
    isCorrectionPending ||
    isReversalPending;

  const isDebitOperation =
    operationType === "EXTERNAL_DEBIT" ||
    operationType === "FEE" ||
    (operationType === "CORRECTION" && correctionDirection === "DEBIT");

  const isValid = (): boolean => {
    if (operationType === "REVERSAL")
      return !!originalReference.trim() && !!narration.trim();
    if (!amount || Number(amount) <= 0 || !narration.trim()) return false;
    if (
      operationType === "EXTERNAL_DEBIT" ||
      operationType === "EXTERNAL_CREDIT"
    ) {
      return !!providerReference.trim() && !!effectiveAt;
    }
    if (operationType === "CORRECTION") return !!correctionReason.trim();
    return true;
  };

  const reset = () => {
    setAmount("");
    setNarration("");
    setAllowNegative(false);
    setProviderReference("");
    setEffectiveAt("");
    setChannel("FLUTTERWAVE");
    setFeeType("PLATFORM_FEE");
    setCorrectionDirection("DEBIT");
    setCorrectionReason("");
    setOriginalReference("");
  };

  const handleSubmit = async () => {
    if (!isValid()) return;

    const handlers: Record<AdjustmentType, () => Promise<any>> = {
      EXTERNAL_DEBIT: () =>
        doExternalDebit({
          walletId,
          payload: {
            amount: Number(amount),
            provider_reference: providerReference.trim(),
            effective_at: toISOLocal(effectiveAt),
            narration: narration.trim(),
            channel,
            allow_negative: allowNegative,
          },
        }),
      EXTERNAL_CREDIT: () =>
        doExternalCredit({
          walletId,
          payload: {
            amount: Number(amount),
            provider_reference: providerReference.trim(),
            effective_at: toISOLocal(effectiveAt),
            narration: narration.trim(),
            channel,
          },
        }),
      FEE: () =>
        doFee({
          walletId,
          payload: {
            amount: Number(amount),
            fee_type: feeType,
            narration: narration.trim(),
            allow_negative: allowNegative,
          },
        }),
      CORRECTION: () =>
        doCorrection({
          walletId,
          payload: {
            direction: correctionDirection,
            amount: Number(amount),
            reason: correctionReason.trim(),
            narration: narration.trim(),
            allow_negative: allowNegative,
          },
        }),
      REVERSAL: () =>
        doReversal({
          walletId,
          payload: {
            original_reference: originalReference.trim(),
            narration: narration.trim(),
          },
        }),
    };

    try {
      const result = await handlers[operationType]();
      const label = OPERATION_OPTIONS.find(
        (o) => o.value === operationType,
      )?.label;
      toast.success(
        `${label} applied — balance: ₦${Number(result.balance_after).toLocaleString()}`,
      );
      reset();
      onOpenChange(false);
    } catch (err) {
      const label = OPERATION_OPTIONS.find(
        (o) => o.value === operationType,
      )?.label;
      toast.error(getApiErrorMessage(err, `Failed to apply ${label}`));
    }
  };

  const selectedOption = OPERATION_OPTIONS.find(
    (o) => o.value === operationType,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ledger Adjustment</DialogTitle>
          <DialogDescription>
            Direct writes to the wallet ledger. All adjustments are audit-logged
            and irreversible without a subsequent correction or reversal.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Operation selector */}
          <div className="space-y-1.5">
            <Label>Operation</Label>
            <Select
              value={operationType}
              onValueChange={(v) => {
                setOperationType(v as AdjustmentType);
                reset();
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPERATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedOption && (
              <p className="text-xs text-muted-foreground">
                {selectedOption.description}
              </p>
            )}
          </div>

          {/* REVERSAL-specific fields */}
          {operationType === "REVERSAL" && (
            <div className="space-y-1.5">
              <Label htmlFor="original-reference">
                Original Transaction Reference
              </Label>
              <Input
                id="original-reference"
                placeholder="e.g. FLW-REF-123456 or CORR-1234567890-ABC"
                value={originalReference}
                onChange={(e) => setOriginalReference(e.target.value)}
              />
            </div>
          )}

          {/* External debit/credit fields */}
          {(operationType === "EXTERNAL_DEBIT" ||
            operationType === "EXTERNAL_CREDIT") && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="provider-ref">Provider Reference</Label>
                <Input
                  id="provider-ref"
                  placeholder="e.g. FLW-REF-123456789"
                  value={providerReference}
                  onChange={(e) => setProviderReference(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Channel</Label>
                  <Select
                    value={channel}
                    onValueChange={(v) => setChannel(v as ProviderChannel)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CHANNELS.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="effective-at">Effective Date & Time</Label>
                  <Input
                    id="effective-at"
                    type="datetime-local"
                    value={effectiveAt}
                    onChange={(e) => setEffectiveAt(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {/* Fee-specific fields */}
          {operationType === "FEE" && (
            <div className="space-y-1.5">
              <Label>Fee Type</Label>
              <Select
                value={feeType}
                onValueChange={(v) => setFeeType(v as FeeType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FEE_TYPES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Correction-specific fields */}
          {operationType === "CORRECTION" && (
            <>
              <div className="space-y-1.5">
                <Label>Direction</Label>
                <div className="flex gap-3">
                  {(["DEBIT", "CREDIT"] as CorrectionDirection[]).map((dir) => (
                    <label
                      key={dir}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="direction"
                        value={dir}
                        checked={correctionDirection === dir}
                        onChange={() => setCorrectionDirection(dir)}
                        className="accent-primary"
                      />
                      <span className="text-sm font-medium">{dir}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="correction-reason">Reason</Label>
                <Textarea
                  id="correction-reason"
                  placeholder="Describe why this correction is needed..."
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  rows={2}
                />
              </div>
            </>
          )}

          {/* Amount — all except reversal */}
          {operationType !== "REVERSAL" && (
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount (NGN)</Label>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          )}

          {/* Narration — all */}
          <div className="space-y-1.5">
            <Label htmlFor="narration">Narration</Label>
            <Textarea
              id="narration"
              placeholder="Brief description for the customer's transaction record..."
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              rows={2}
            />
          </div>

          {/* Allow negative — debit operations only */}
          {isDebitOperation && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="allow-negative"
                checked={allowNegative}
                onCheckedChange={(v) => setAllowNegative(!!v)}
              />
              <label
                htmlFor="allow-negative"
                className="text-sm cursor-pointer"
              >
                Allow negative balance
                <p className="text-xs text-muted-foreground font-normal">
                  Proceed even if the debit exceeds the current balance
                </p>
              </label>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 mt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={reset}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !isValid()}
            className={`cursor-pointer ${isDebitOperation ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}`}
          >
            {isPending
              ? "Applying..."
              : `Apply ${selectedOption?.label ?? "Adjustment"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
