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
  const [justification, setJustification] = useState("");
  const { mutateAsync: unfreezeCustomer, isPending: isUnfreezingCustomer } =
    useUnfreezeCustomer();

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
          toast.success("Customer unfrozen successfully");
          setJustification("");
          onOpenChange(false);
        },
        onError: (error) => {
          const err = apiErrorResponse(error, "Failed to unfreeze customer");
          toast.error(err.error || "Failed to unfreeze customer");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
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
            onClick={handleSubmit}
            disabled={isUnfreezingCustomer || !justification.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            {isUnfreezingCustomer ? "Unfreezing..." : "Unfreeze Customer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
