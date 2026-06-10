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
import { CheckCircle2, AlertTriangle } from "lucide-react";

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
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [category, setCategory] =
    useState<(typeof categoryOptions)[number]>("REGULATORY");
  const [reason, setReason] =
    useState<(typeof reasonOptions)[number]>("AML_REVIEW");
  const { mutateAsync: freezeCustomer, isPending: isFreezingCustomer } =
    useFreezeCustomer();

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setTimeout(() => setStep("form"), 300);
    }
  };

  const handleNext = () => setStep("confirm");

  const handleSubmit = async () => {
    const referenceId = `REF/${new Date().getFullYear()}/${crypto
      .randomUUID()
      .slice(0, 8)
      .toUpperCase()}`;
    freezeCustomer(
      { id, payload: { category, reason, referenceId } },
      {
        onSuccess: () => {
          setStep("success");
        },
        onError: (error) => {
          const message = getApiErrorMessage(
            error,
            "Failed to freeze customer",
          );
          toast.error(message);
          setStep("form");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        {step === "form" && (
          <>
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
                onClick={handleNext}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
              >
                Proceed
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Are you absolutely sure?
              </DialogTitle>
              <DialogDescription className="pt-2">
                This action will temporarily freeze the customer's account and
                prevent them from performing any transactions.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-muted p-3 rounded-md text-sm">
                <div className="mb-1">
                  <span className="font-semibold">Category:</span>{" "}
                  {category.replace(/_/g, " ")}
                </div>
                <div>
                  <span className="font-semibold">Reason:</span>{" "}
                  {reason.replace(/_/g, " ")}
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setStep("form")}
                disabled={isFreezingCustomer}
                className="cursor-pointer"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isFreezingCustomer}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
              >
                {isFreezingCustomer ? "Freezing..." : "Yes, Freeze Customer"}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Customer Frozen Successfully
            </h2>
            <p className="text-muted-foreground mb-6">
              The customer's account has been frozen and access is restricted.
            </p>
            <Button
              onClick={() => handleOpenChange(false)}
              className="cursor-pointer w-full max-w-[200px]"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
