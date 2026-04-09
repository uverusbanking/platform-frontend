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
import { useState } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiClient";
import { useFreezeCustomer } from "@/hooks/mutations/useCustomerMutations";

const categoryOptions = ["REGULATORY", "SECURITY", "USER"] as const;
const reasonOptions = [
  "AML_REVIEW",
  "KYC_INCOMPLETE",
  "NFIU_REQUEST",
  "COURT_ORDER",
  "SUSPECTED_FRAUD",
  "USER_REQUEST",
  "PARTNER_BANK_DIRECTIVE",
] as const;

const isCategoryOption = (
  value: string,
): value is (typeof categoryOptions)[number] =>
  (categoryOptions as readonly string[]).includes(value);

const isReasonOption = (
  value: string,
): value is (typeof reasonOptions)[number] =>
  (reasonOptions as readonly string[]).includes(value);

interface FreezeCustomerDialogProps {
  id: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function FreezeCustomerDialog({
  id,
  open,
  onOpenChange,
}: FreezeCustomerDialogProps) {
  const [category, setCategory] =
    useState<(typeof categoryOptions)[number]>("REGULATORY");
  const [reason, setReason] =
    useState<(typeof reasonOptions)[number]>("AML_REVIEW");
  const { mutateAsync: freezeCustomer, isPending: isFreezingCustomer } =
    useFreezeCustomer();

  const handleSubmit = async () => {
    const referenceId = `REF/${new Date().getFullYear()}/${crypto
      .randomUUID()
      .slice(0, 8)
      .toUpperCase()}`;
    freezeCustomer(
      { id, payload: { category, reason, referenceId } },
      {
        onSuccess: () => {
          toast.success("Customer frozen successfully");
          onOpenChange(false);
        },
        onError: (error) => {
          const message = getApiErrorMessage(
            error,
            "Failed to freeze customer",
          );
          toast.error(message);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Freeze Customer</DialogTitle>
          <DialogDescription>
            This will temporarily restrict the customer’s access to their
            account and services.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="freeze-category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => {
                if (isCategoryOption(value)) {
                  setCategory(value);
                }
              }}
            >
              <SelectTrigger id="freeze-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="freeze-reason">Reason</Label>
            <Select
              value={reason}
              onValueChange={(value) => {
                if (isReasonOption(value)) {
                  setReason(value);
                }
              }}
            >
              <SelectTrigger id="freeze-reason">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {reasonOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2 mt-12">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isFreezingCustomer}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/60 cursor-pointer"
          >
            {isFreezingCustomer ? "Freezing..." : "Freeze Customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
