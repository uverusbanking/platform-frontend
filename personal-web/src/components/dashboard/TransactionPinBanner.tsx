import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { SetupPinDialog } from "../TransactionPinDialog";
import { useAuth } from "@/contexts/AuthContext";

export function TransactionPinBanner() {
  const [setupOpen, setSetupOpen] = useState(false);
  const { user, loading: authLoading, refreshProfile } = useAuth();

  // If PIN is already set, or we're still loading the user profile, don't show the banner
  if (user?.pin_set || authLoading) {
    return null;
  }

  return (
    <>
      <Alert
        variant="destructive"
        className="mb-6 border-red-200 bg-red-50 text-red-900 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-200"
      >
        <LockKeyhole className="h-4 w-4" />
        <AlertTitle>Transaction PIN Required</AlertTitle>
        <AlertDescription className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p>
            You need to set up a transaction PIN to send money and perform other
            secure actions.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="whitespace-nowrap bg-white text-red-900 border-red-200 hover:bg-red-50 dark:bg-transparent dark:text-red-200 dark:border-red-800 dark:hover:bg-red-900/40"
            onClick={() => setSetupOpen(true)}
          >
            Set Up PIN
          </Button>
        </AlertDescription>
      </Alert>

      <SetupPinDialog
        open={setupOpen}
        onOpenChange={setSetupOpen}
        onSuccess={refreshProfile}
      />
    </>
  );
}
