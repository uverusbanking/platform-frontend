import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface SessionTimeoutModalProps {
  open: boolean;
  countdown: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

export function SessionTimeoutModal({
  open,
  countdown,
  onStayLoggedIn,
  onLogout,
}: SessionTimeoutModalProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-warning">
            <Clock className="h-5 w-5" />
            Session Timeout Warning
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>
              You have been inactive for a while. For your security, you will be
              automatically logged out in:
            </p>
            <div className="text-3xl font-bold text-center text-primary tabular-nums">
              {countdown}s
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mob:flex-col gap-2 mt-4">
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full sm:w-auto"
          >
            Log Out Now
          </Button>
          <Button
            variant="default"
            onClick={onStayLoggedIn}
            className="w-full sm:w-auto"
          >
            Stay Logged In
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
