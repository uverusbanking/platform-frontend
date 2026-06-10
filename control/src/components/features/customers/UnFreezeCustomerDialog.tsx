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
import { useUnfreezeCustomer } from "@/hooks/mutations/useCustomerMutations";
import { apiErrorResponse } from "@/lib/axios";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface UnFreezeCustomerDialogProps {
  id: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function UnFreezeCustomerDialog({
  id,
  open,
  onOpenChange,
}: UnFreezeCustomerDialogProps) {
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [justification, setJustification] = useState("");
  const { mutateAsync: unfreezeCustomer, isPending: isUnfreezingCustomer } =
    useUnfreezeCustomer();

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setStep("form");
        setJustification("");
      }, 300);
    }
  };

  const handleNext = () => setStep("confirm");

  const handleSubmit = async () => {
    unfreezeCustomer(
      {
        id,
        payload: {
          justification,
        },
      },
      {
        onSuccess: () => {
          setStep("success");
        },
        onError: (error) => {
          const err = apiErrorResponse(error, "Failed to unfreeze customer");
          toast.error(err.error || "Failed to unfreeze customer");
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
              <DialogTitle>Unfreeze Customer</DialogTitle>
              <DialogDescription>
                This will restore the customer’s access to their account and
                services.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="unfreeze-justification">Justification</Label>
              <Textarea
                id="unfreeze-justification"
                placeholder="KYC verified and cleared by compliance Officer"
                value={justification}
                onChange={(event) => setJustification(event.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter className="gap-2 mt-12">
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleNext}
                disabled={!justification.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
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
                <AlertTriangle className="h-5 w-5 text-primary" />
                Are you absolutely sure?
              </DialogTitle>
              <DialogDescription className="pt-2">
                This action will restore the customer's account, granting them
                full access to all transactions and services again.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-muted p-3 rounded-md text-sm">
                <div className="font-semibold mb-1">
                  Justification provided:
                </div>
                <div className="italic text-muted-foreground">
                  "{justification}"
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setStep("form")}
                disabled={isUnfreezingCustomer}
                className="cursor-pointer"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isUnfreezingCustomer}
                className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                {isUnfreezingCustomer
                  ? "Unfreezing..."
                  : "Yes, Unfreeze Customer"}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Customer Unfrozen Successfully
            </h2>
            <p className="text-muted-foreground mb-6">
              The customer's account has been restored and access is granted.
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
