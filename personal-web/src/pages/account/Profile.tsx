import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/services/user.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
} from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const data = await UserService.getProfile();
      setProfile({
        id: data.id,
        user_id: data.id,
        email: data.email,
        full_name: `${data.first_name} ${data.last_name}`,
        phone: data.phone_number || "",
        avatar_url: null,
      });
      setFullName(`${data.first_name} ${data.last_name}`);
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
      // Split full name to first/last
      const names = fullName.split(" ");
      const firstName = names[0];
      const lastName = names.slice(1).join(" ");

      await UserService.updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
      });

      toast.success("Profile updated!");
      // Refresh profile
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
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <AppLayout showHeader={false}>
      {/* Header */}
      <header className="bg-gradient-hero safe-top">
        <div className="container mx-auto px-4 sm:px-6 py-4 max-w-4xl">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors text-white touch-manipulation"
            >
              <User size={20} className="opacity-0" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-white">
              Profile
            </h1>
          </div>

          {/* Profile Avatar */}
          <div className="flex flex-col items-center py-2 sm:py-4">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4 border-4 border-white/20">
              <AvatarFallback className="bg-white/20 text-white text-xl sm:text-2xl font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg sm:text-xl font-semibold text-white">
              {profile?.full_name || "User"}
            </h2>
            <p className="text-white/70 text-sm sm:text-base">{user?.email}</p>
            {isAdmin && (
              <span className="mt-2 px-3 py-1 rounded-full bg-warning/20 text-warning text-xs sm:text-sm font-medium">
                Admin
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 max-w-4xl">
        {/* Profile Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3 sm:py-4">
            <CardTitle className="text-base sm:text-lg">
              Personal Information
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 sm:h-9 text-xs sm:text-sm"
              onClick={() => setEditing(!editing)}
            >
              <Pencil size={14} className="mr-1" />
              {editing ? "Cancel" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 pt-0">
            {editing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="h-11 sm:h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="h-11 sm:h-10"
                  />
                </div>
                <Button
                  variant="gradient"
                  className="w-full h-11 sm:h-10"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <User size={18} className="text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Full Name
                    </p>
                    <p className="font-medium text-sm sm:text-base truncate">
                      {profile?.full_name || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail size={18} className="text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Email
                    </p>
                    <p className="font-medium text-sm sm:text-base truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone size={18} className="text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Phone
                    </p>
                    <p className="font-medium text-sm sm:text-base">
                      {profile?.phone || "Not set"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tier & KYC Documents */}
        <TierDocumentsCard />

        {/* Settings */}
        <Card>
          <CardHeader className="py-3 sm:py-4">
            <CardTitle className="text-base sm:text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <button
              className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 active:bg-muted transition-colors touch-manipulation"
              onClick={() => navigate("/account/settings")}
            >
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-muted-foreground" />
                <span className="text-sm sm:text-base">Account Settings</span>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>

            {isAdmin && (
              <button
                className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 active:bg-muted transition-colors border-t border-border touch-manipulation"
                onClick={() => navigate("/admin")}
              >
                <div className="flex items-center gap-3">
                  <Shield size={18} className="text-warning" />
                  <span className="text-warning font-medium text-sm sm:text-base">
                    Admin Console
                  </span>
                </div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </button>
            )}
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Button
          variant="destructive"
          className="w-full h-11 sm:h-10"
          onClick={handleSignOut}
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </AppLayout>
  );
};

export default Profile;
