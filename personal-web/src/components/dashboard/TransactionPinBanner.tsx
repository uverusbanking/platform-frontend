import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { SetupPinDialog } from "../TransactionPinDialog";
import { useAuth } from "@/contexts/AuthContext";

export function TransactionPinBanner() {
  const [setupOpen, setSetupOpen] = useState(false);
  const { user, loading: authLoading, refreshProfile } = useAuth();

  if (user?.pin_set || authLoading) return null;

  return (
    <>
      <div
        className="rounded-2xl p-5 flex items-start gap-3 shadow-card"
        style={{
          background: "rgb(var(--soft))",
          border: "1px solid rgb(var(--brand-primary) / 0.2)",
        }}
      >
        <div
          className="w-9 h-9 rounded-pill flex items-center justify-center shrink-0"
          style={{ background: "rgb(var(--brand-primary) / 0.1)" }}
        >
          <LockKeyhole
            size={16}
            style={{ color: "rgb(var(--brand-primary))" }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="font-semibold text-sm mb-0.5"
            style={{ color: "rgb(var(--brand-primary))" }}
          >
            Transaction PIN Required
          </p>
          <p
            className="text-xs leading-relaxed mb-3"
            style={{ color: "rgb(var(--brand-primary) / 0.8)" }}
          >
            Set up a transaction PIN to send money and perform secure actions.
          </p>
          <button
            onClick={() => setSetupOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill text-xs font-semibold transition-opacity hover:opacity-80"
            style={{
              background: "rgb(var(--brand-primary))",
              color: "#fff",
            }}
          >
            Set Up PIN
          </button>
        </div>
      </div>

      <SetupPinDialog
        open={setupOpen}
        onOpenChange={setSetupOpen}
        onSuccess={refreshProfile}
      />
    </>
  );
}
