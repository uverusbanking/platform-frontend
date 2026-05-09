import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/services/user.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppLayout } from "@/components/AppLayout";
import { TierDocumentsCard } from "@/components/profile/TierDocumentsCard";
import {
  User,
  Mail,
  Phone,
  Shield,
  LogOut,
  ChevronRight,
  Loader2,
  Pencil,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const response = await UserService.getProfile();
      const data = response.data;
      setProfile({
        id: data.id,
        user_id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number || "",
        avatar_url: null,
      });
      setFullName(`${data.first_name || ""} ${data.last_name || ""}`.trim());
      setPhone(data.phone_number || "");
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const names = fullName.split(" ");
      const firstName = names[0];
      const lastName = names.slice(1).join(" ");
      await UserService.updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
      });
      toast.success("Profile updated!");
      fetchProfile();
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${(profile.first_name || "")[0] || ""}${(profile.last_name || "")[0] || ""}`.toUpperCase();
    }
    return user?.email?.slice(0, 2).toUpperCase() || "U";
  };

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ""}`.trim()
    : "Your Account";

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
        <div>
          <p className="eyebrow mb-2">Account</p>
          <h1 className="display text-[clamp(26px,3.5vw,44px)] m-0 leading-none">
            Your{" "}
            <span
              className="serif-italic"
              style={{ color: "rgb(var(--brand-primary))" }}
            >
              profile.
            </span>
          </h1>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] items-start">
        {/* Left column */}
        <div className="space-y-5">
          {/* Avatar card */}
          <div
            className="rounded-2xl p-7 relative overflow-hidden"
            style={{ background: "rgb(var(--foreground))", color: "#fff" }}
          >
            <div
              className="absolute -right-16 -top-16 w-52 h-52 rounded-pill pointer-events-none"
              style={{
                background: "rgb(var(--brand-primary))",
                opacity: 0.4,
                filter: "blur(60px)",
              }}
            />
            <div className="relative flex items-center gap-5">
              <div
                className="w-16 h-16 rounded-pill flex items-center justify-center text-xl font-bold shrink-0"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                {getInitials()}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-lg leading-tight truncate">
                  {displayName}
                </p>
                <p className="text-sm truncate" style={{ opacity: 0.6 }}>
                  {user?.email}
                </p>
                {isAdmin && (
                  <span
                    className="inline-block mt-1.5 px-2.5 py-0.5 rounded-pill text-xs font-semibold"
                    style={{
                      background: "rgba(255,193,7,0.2)",
                      color: "#ffc107",
                    }}
                  >
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Personal info card */}
          <div
            className="rounded-2xl overflow-hidden shadow-card"
            style={{
              background: "rgb(var(--surface-highest))",
              border: "1px solid rgb(var(--surface-high))",
            }}
          >
            <div
              className="flex items-center justify-between px-5 pt-5 pb-4"
              style={{ borderBottom: "1px solid rgb(var(--surface-high))" }}
            >
              <p className="font-bold text-base">Personal Information</p>
              <button
                onClick={() => setEditing(!editing)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-semibold transition-colors hover:bg-surface"
                style={{
                  border: "1px solid rgb(var(--surface-high))",
                }}
              >
                {editing ? (
                  <>
                    <X size={12} />
                    Cancel
                  </>
                ) : (
                  <>
                    <Pencil size={12} />
                    Edit
                  </>
                )}
              </button>
            </div>

            {loading ? (
              <div className="px-5 py-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "rgb(var(--surface))" }}
                  >
                    <div
                      className="w-5 h-5 rounded"
                      style={{ background: "rgb(var(--surface-high))" }}
                    />
                    <div className="flex-1 space-y-1.5">
                      <div
                        className="h-3 w-16 rounded-pill"
                        style={{ background: "rgb(var(--surface-high))" }}
                      />
                      <div
                        className="h-3.5 w-28 rounded-pill"
                        style={{ background: "rgb(var(--surface-high))" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : editing ? (
              <div className="px-5 py-4 space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="fullName"
                    className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="rounded-xl"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-pill text-sm font-semibold bg-foreground text-surface-highest hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            ) : (
              <div className="px-5 py-4 space-y-2">
                {[
                  { icon: User, label: "Full Name", value: displayName },
                  { icon: Mail, label: "Email", value: user?.email || "—" },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: profile?.phone_number || "Not set",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: "rgb(var(--surface))" }}
                  >
                    <Icon
                      size={16}
                      className="text-foreground-subtle shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs text-foreground-subtle">{label}</p>
                      <p className="font-medium text-sm truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Tier & KYC documents */}
          <TierDocumentsCard />

          {/* Settings links */}
          <div
            className="rounded-2xl overflow-hidden shadow-card"
            style={{
              background: "rgb(var(--surface-highest))",
              border: "1px solid rgb(var(--surface-high))",
            }}
          >
            <p className="eyebrow px-5 pt-5 pb-3">Settings</p>
            <button
              className="w-full flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-surface"
              style={{ borderTop: "1px solid rgb(var(--surface-high))" }}
              onClick={() => navigate("/account/settings")}
            >
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-foreground-subtle" />
                <span className="text-sm font-medium">Account Settings</span>
              </div>
              <ChevronRight size={14} className="text-foreground-subtle" />
            </button>

            {isAdmin && (
              <button
                className="w-full flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-surface"
                style={{ borderTop: "1px solid rgb(var(--surface-high))" }}
                onClick={() => navigate("/admin")}
              >
                <div className="flex items-center gap-3">
                  <Shield size={16} style={{ color: "#ffc107" }} />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#ffc107" }}
                  >
                    Admin Console
                  </span>
                </div>
                <ChevronRight size={14} className="text-foreground-subtle" />
              </button>
            )}
          </div>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-pill text-sm font-semibold transition-colors"
            style={{
              background: "rgb(var(--soft))",
              color: "rgb(var(--brand-primary))",
              border: "1px solid rgb(var(--brand-primary) / 0.2)",
            }}
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
