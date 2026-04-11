import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useSetPin,
  useVerifyPin,
} from "@/hooks/mutations/useSecurityMutations";
import { toast } from "sonner";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";

interface SetupPinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SetupPinDialog({
  open,
  onOpenChange,
  onSuccess,
}: SetupPinDialogProps) {
  const { mutateAsync: setPinMutation } = useSetPin();
  const [step, setStep] = useState<"create" | "confirm">("create");
  const [pin, setPinValue] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep("create");
      setPinValue("");
      setConfirmPin("");
    }
  }, [open]);

  const handleComplete = async () => {
    if (pin !== confirmPin) {
      toast.error("PINs do not match");
      setConfirmPin("");
      setStep("create");
      return;
    }

    setLoading(true);
    try {
      const result = await setPinMutation({ pin });
      if (result.status === "success" || result.status === undefined) {
        onSuccess?.();
        onOpenChange(false);
        setStep("create");
        setPinValue("");
        setConfirmPin("");
      } else {
        toast.error(result.message || "Failed to set PIN");
      }
    } catch (error: any) {
      console.error("Error setting PIN:", error);
      toast.error(
        error.response?.data?.message || error.message || "Failed to set PIN",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            {step === "create"
              ? "Create Transaction PIN"
              : "Confirm Transaction PIN"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === "create"
              ? "Set a 4-digit PIN for your transactions"
              : "Re-enter your PIN to confirm"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-6">
          <InputOTP
            maxLength={4}
            value={step === "create" ? pin : confirmPin}
            onChange={step === "create" ? setPinValue : setConfirmPin}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-12 text-lg" masked />
              <InputOTPSlot index={1} className="w-12 h-12 text-lg" masked />
              <InputOTPSlot index={2} className="w-12 h-12 text-lg" masked />
              <InputOTPSlot index={3} className="w-12 h-12 text-lg" masked />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <DialogFooter className="sm:justify-center">
          {step === "create" ? (
            <Button
              type="button"
              className="w-full sm:w-auto min-w-[120px]"
              disabled={pin.length !== 4}
              onClick={() => setStep("confirm")}
            >
              Continue
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full sm:w-auto min-w-[120px]"
              disabled={confirmPin.length !== 4 || loading}
              onClick={handleComplete}
            >
              {loading ? "Setting PIN..." : "Confirm PIN"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface VerifyPinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export function VerifyPinDialog({
  open,
  onOpenChange,
  onSuccess,
  title = "Enter Transaction PIN",
  description = "Please enter your 4-digit PIN to continue",
}: VerifyPinDialogProps) {
  const { mutateAsync: verifyPinMutation } = useVerifyPin();
  const [pin, setPinValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (value: string) => {
    setPinValue(value);

    if (value.length === 4) {
      setLoading(true);
      try {
        const result = await verifyPinMutation({ pin: value });
        if (result.status === "success") {
          onSuccess();
          onOpenChange(false);
          setPinValue("");
        } else {
          toast.error(result.message || "Incorrect PIN");
          setPinValue("");
        }
      } catch (error: any) {
        console.error("Error verifying PIN:", error);
        toast.error(
          error.response?.data?.message || error.message || "Incorrect PIN",
        );
        setPinValue("");
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset PIN when dialog closes
  useEffect(() => {
    if (!open) {
      setPinValue("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-6">
          <InputOTP
            maxLength={4}
            value={pin}
            onChange={handleVerify}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-12 text-lg" masked />
              <InputOTPSlot index={1} className="w-12 h-12 text-lg" masked />
              <InputOTPSlot index={2} className="w-12 h-12 text-lg" masked />
              <InputOTPSlot index={3} className="w-12 h-12 text-lg" masked />
            </InputOTPGroup>
          </InputOTP>
        </div>
        {loading && (
          <div className="flex justify-center pb-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface EnterPinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (pin: string) => void;
  title?: string;
  description?: string;
  loading?: boolean;
}

export function EnterPinDialog({
  open,
  onOpenChange,
  onSuccess,
  title = "Enter Transaction PIN",
  description = "Please enter your 4-digit PIN to continue",
  loading = false,
}: EnterPinDialogProps) {
  const [pin, setPinValue] = useState("");

  const handleComplete = (value: string) => {
    setPinValue(value);
    console.log(value.length);
    if (value.length === 4) {
      onSuccess(value);
      // We don't close the dialog here, let the parent handle it after the API call
    }
  };

  // Reset PIN when dialog closes
  useEffect(() => {
    if (!open) {
      setPinValue("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-6">
          <InputOTP
            maxLength={4}
            value={pin}
            onChange={handleComplete}
            disabled={loading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-12 text-lg" masked />
              <InputOTPSlot index={1} className="w-12 h-12 text-lg" masked />
              <InputOTPSlot index={2} className="w-12 h-12 text-lg" masked />
              <InputOTPSlot index={3} className="w-12 h-12 text-lg" masked />
            </InputOTPGroup>
          </InputOTP>
        </div>
        {loading && (
          <div className="flex justify-center pb-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
