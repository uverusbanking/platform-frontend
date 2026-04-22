import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await UserService.requestAccountDeletion();
      toast.success("Deletion request submitted. Your organisation will review it shortly.");
      onOpenChange(false);
      await signOut();
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit deletion request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6 text-destructive" />
          </div>
          <DialogTitle className="text-center text-xl">
            Request Account Deletion
          </DialogTitle>
          <DialogDescription className="text-center">
            Your request will be sent to your organisation for review. Once approved, your account and wallets will be closed.
            <br /><br />
            You will be logged out immediately after submitting.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
