import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert } from "lucide-react";

export default function ChangePasswordPage() {
  const { changePassword, user } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    const result = await changePassword(current, newPass);
    setLoading(false);
    if (result.success) navigate("/dashboard");
    else setError(result.error ?? "Failed to change password");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "rgb(var(--background))" }}
    >
      <div className="w-full max-w-md space-y-8">
        <div
          className="rounded-2xl p-8 shadow-card space-y-6"
          style={{ background: "rgb(var(--surface-highest))" }}
        >
          {/* Icon + heading */}
          <div className="text-center space-y-4">
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: "rgb(var(--lemon) / 0.4)" }}
            >
              <ShieldAlert
                className="h-7 w-7"
                style={{ color: "rgb(var(--foreground))" }}
              />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "rgb(var(--foreground))",
                }}
              >
                Change your password
              </h2>
              <p
                className="text-sm mt-1"
                style={{ color: "rgb(var(--foreground-subtle))" }}
              >
                {user?.force_password_change
                  ? "You must change your temporary password before continuing"
                  : "Update your password"}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="p-3 text-sm rounded-xl"
                style={{
                  background: "rgb(var(--destructive) / 0.1)",
                  color: "rgb(var(--destructive))",
                }}
              >
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="current"
                className="eyebrow"
                style={{ color: "rgb(var(--foreground-subtle))" }}
              >
                Current Password
              </Label>
              <Input
                id="current"
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
                className="h-12 rounded-xl border-0 focus-visible:ring-2"
                style={{ background: "rgb(var(--surface))" }}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="new"
                className="eyebrow"
                style={{ color: "rgb(var(--foreground-subtle))" }}
              >
                New Password
              </Label>
              <Input
                id="new"
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
                minLength={8}
                className="h-12 rounded-xl border-0 focus-visible:ring-2"
                style={{ background: "rgb(var(--surface))" }}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="confirm"
                className="eyebrow"
                style={{ color: "rgb(var(--foreground-subtle))" }}
              >
                Confirm New Password
              </Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
                className="h-12 rounded-xl border-0 focus-visible:ring-2"
                style={{ background: "rgb(var(--surface))" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-pill btn-primary w-full h-12 justify-center text-sm disabled:opacity-50"
            >
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
