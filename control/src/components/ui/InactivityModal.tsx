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

interface InactivityModalProps {
  isOpen: boolean;
  onStayLoggedIn: () => void;
  onLogout: () => void; // Added for explicit logout action if needed
  remainingTime: number;
}

export function InactivityModal({
  isOpen,
  onStayLoggedIn,
  remainingTime,
}: InactivityModalProps) {
  // Format remaining time nicely if needed, but seconds is usually fine for short durations
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent
        className="z-[99999]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <AlertDialogTitle>Inactivity Warning</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            You will be logged out in{" "}
            <span className="font-bold text-foreground">
              {remainingTime} seconds
            </span>{" "}
            due to inactivity. Please confirm if you are still there.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* <Button variant="ghost" onClick={onLogout}>Log out</Button> */}
          <Button onClick={onStayLoggedIn} className="w-full sm:w-auto">
            Stay Logged In
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
