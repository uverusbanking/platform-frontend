import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Shield } from 'lucide-react';

interface SessionWarningModalProps {
  isOpen: boolean;
  countdown: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

export const SessionWarningModal: React.FC<SessionWarningModalProps> = ({
  isOpen,
  countdown,
  onStayLoggedIn,
  onLogout,
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-full">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <AlertDialogTitle className="text-xl">
              Session Timeout Warning
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">
                    Your session is about to expire due to inactivity
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    You will be automatically logged out for security reasons
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">
                    Time remaining:
                  </span>
                </div>
                <div className="text-5xl font-bold text-red-600 tabular-nums">
                  {countdown}
                </div>
                <span className="text-sm text-muted-foreground mt-1">
                  second{countdown !== 1 ? 's' : ''}
                </span>
              </div>

              <p className="text-sm text-center text-muted-foreground">
                Click "Stay Logged In" to continue your session
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              onClick={onLogout}
              className="w-full sm:w-auto"
            >
              Logout Now
            </Button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              onClick={onStayLoggedIn}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              Stay Logged In
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
