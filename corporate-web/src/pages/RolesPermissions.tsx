import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Crown,
  Send,
  CheckCircle2,
  Eye,
  Check,
  X,
  Users,
  Info,
} from "lucide-react";
import {
  ROLE_DEFINITIONS,
  PERMISSION_CATEGORIES,
  type CorporateRole,
  type RoleDefinition,
} from "@/types/roles";

const ROLE_ICONS: Record<CorporateRole, React.ElementType> = {
  owner: Crown,
  initiator: Send,
  authorizer: CheckCircle2,
  viewer: Eye,
};

const mockMembers = [
  {
    name: "Adewale Johnson",
    email: "adewale@sovereignvault.com",
    role: "owner" as CorporateRole,
    status: "active",
  },
  {
    name: "Ngozi Okafor",
    email: "ngozi@sovereignvault.com",
    role: "initiator" as CorporateRole,
    status: "active",
  },
  {
    name: "Emeka Nwosu",
    email: "emeka@sovereignvault.com",
    role: "authorizer" as CorporateRole,
    status: "active",
  },
  {
    name: "Fatima Bello",
    email: "fatima@sovereignvault.com",
    role: "authorizer" as CorporateRole,
    status: "active",
  },
  {
    name: "Chidi Eze",
    email: "chidi@sovereignvault.com",
    role: "viewer" as CorporateRole,
    status: "invited",
  },
];

function RoleCard({
  role,
  isSelected,
  onClick,
}: {
  role: RoleDefinition;
  isSelected: boolean;
  onClick: () => void;
}) {
  const Icon = ROLE_ICONS[role.id];
  const memberCount = mockMembers.filter((m) => m.role === role.id).length;

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 sm:p-5 rounded-2xl transition-all shadow-card"
      style={{
        background: isSelected
          ? "rgb(var(--foreground))"
          : "rgb(var(--surface-highest))",
        border: isSelected ? "none" : "1px solid rgb(var(--border))",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center"
          style={{
            background: isSelected
              ? "rgba(255,255,255,0.12)"
              : "rgb(var(--soft))",
          }}
        >
          <Icon
            className="h-4 w-4 sm:h-5 sm:w-5"
            style={{
              color: isSelected ? "white" : "rgb(var(--brand-primary))",
            }}
          />
        </div>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-pill"
          style={{
            background: isSelected
              ? "rgba(255,255,255,0.12)"
              : "rgb(var(--surface))",
            color: isSelected
              ? "rgba(255,255,255,0.7)"
              : "rgb(var(--foreground-subtle))",
          }}
        >
          {memberCount} {memberCount === 1 ? "member" : "members"}
        </span>
      </div>
      <h4
        className="text-sm font-bold mb-1"
        style={{
          fontFamily: "Manrope, sans-serif",
          color: isSelected
            ? "rgba(255,255,255,0.95)"
            : "rgb(var(--foreground))",
        }}
      >
        {role.label}
      </h4>
      <p
        className="text-xs leading-relaxed"
        style={{
          color: isSelected
            ? "rgba(255,255,255,0.5)"
            : "rgb(var(--foreground-subtle))",
        }}
      >
        {role.description}
      </p>
    </button>
  );
}

function PermissionsMatrix({ selectedRole }: { selectedRole: RoleDefinition }) {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-card"
      style={{ background: "rgb(var(--surface-highest))" }}
    >
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          <div
            className="grid grid-cols-[1fr_repeat(4,60px)] sm:grid-cols-[1fr_repeat(4,80px)] gap-0 px-4 sm:px-6 py-3"
            style={{
              background: "rgb(var(--surface))",
              borderBottom: "1px solid rgb(var(--border))",
            }}
          >
            <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">
              Permission
            </p>
            {ROLE_DEFINITIONS.map((r) => {
              const Icon = ROLE_ICONS[r.id];
              return (
                <div key={r.id} className="flex flex-col items-center gap-1">
                  <Icon
                    className={`h-3.5 w-3.5 ${r.id === selectedRole.id ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span
                    className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider ${r.id === selectedRole.id ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {r.label.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {PERMISSION_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <div
                className="px-4 sm:px-6 py-2"
                style={{ background: "rgb(var(--surface) / 0.5)" }}
              >
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                  {cat.label}
                </p>
              </div>
              {ROLE_DEFINITIONS[0].permissions
                .find((p) => p.category === cat.id)
                ?.actions.map((action, i) => (
                  <div
                    key={action.id}
                    className={`grid grid-cols-[1fr_repeat(4,60px)] sm:grid-cols-[1fr_repeat(4,80px)] gap-0 px-4 sm:px-6 py-2.5 items-center ${
                      i > 0 ? "border-t border-border/50" : ""
                    }`}
                  >
                    <span className="text-xs sm:text-sm text-foreground">
                      {action.label}
                    </span>
                    {ROLE_DEFINITIONS.map((r) => {
                      const perm = r.permissions.find(
                        (p) => p.category === cat.id,
                      );
                      const act = perm?.actions.find((a) => a.id === action.id);
                      const allowed = act?.allowed ?? false;
                      const isHighlighted = r.id === selectedRole.id;

                      return (
                        <div key={r.id} className="flex justify-center">
                          {allowed ? (
                            <div
                              className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                isHighlighted
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-success/15 text-success"
                              }`}
                            >
                              <Check className="h-3 w-3" />
                            </div>
                          ) : (
                            <div
                              className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                isHighlighted
                                  ? "bg-destructive/15 text-destructive"
                                  : "bg-muted text-muted-foreground/40"
                              }`}
                            >
                              <X className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamMembers({ selectedRole }: { selectedRole: CorporateRole | null }) {
  const filtered = selectedRole
    ? mockMembers.filter((m) => m.role === selectedRole)
    : mockMembers;

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-card"
      style={{ background: "rgb(var(--surface-highest))" }}
    >
      {/* Desktop header */}
      <div
        className="hidden sm:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-3"
        style={{
          background: "rgb(var(--surface))",
          borderBottom: "1px solid rgb(var(--border))",
        }}
      >
        <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">
          Member
        </p>
        <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">
          Role
        </p>
        <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">
          Status
        </p>
        <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">
          Action
        </p>
      </div>
      {filtered.map((member, i) => {
        const roleDef = ROLE_DEFINITIONS.find((r) => r.id === member.role)!;
        const initials = member.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase();
        return (
          <div key={member.email}>
            {/* Desktop row */}
            <div
              className={`hidden sm:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-surface-low transition-colors ${
                i < filtered.length - 1 ? "border-b border-border/50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-surface-low flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">
                    {initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </div>
              </div>
              <Badge
                className={`${roleDef.color} border-0 text-[10px] font-semibold uppercase tracking-wider w-fit`}
              >
                {roleDef.label}
              </Badge>
              <Badge
                className={`border-0 text-[10px] font-semibold uppercase tracking-wider w-fit ${
                  member.status === "active"
                    ? "bg-success/10 text-success"
                    : "bg-warning/10 text-warning"
                }`}
              >
                {member.status}
              </Badge>
              <button
                className="text-xs px-2 py-1 rounded-pill transition-colors"
                style={{ color: "rgb(var(--foreground-subtle))" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgb(var(--foreground))")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    "rgb(var(--foreground-subtle))")
                }
              >
                Edit
              </button>
            </div>

            {/* Mobile card */}
            <div
              className={`sm:hidden p-4 space-y-2 ${i < filtered.length - 1 ? "border-b border-border/50" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-surface-low flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {initials}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  Edit
                </Button>
              </div>
              <div className="flex items-center gap-2 pl-12">
                <Badge
                  className={`${roleDef.color} border-0 text-[10px] font-semibold uppercase tracking-wider`}
                >
                  {roleDef.label}
                </Badge>
                <Badge
                  className={`border-0 text-[10px] font-semibold uppercase tracking-wider ${
                    member.status === "active"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  {member.status}
                </Badge>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function RolesPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState<CorporateRole>("owner");
  const [activeTab, setActiveTab] = useState<"permissions" | "members">(
    "permissions",
  );
  const activeRole = ROLE_DEFINITIONS.find((r) => r.id === selectedRole)!;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="eyebrow mb-1">Administration</p>
          <h2 className="display">Roles & Permissions</h2>
          <p
            className="text-sm mt-1"
            style={{ color: "rgb(var(--foreground-subtle))" }}
          >
            Manage corporate user roles and access controls
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-pill btn-outline text-xs gap-1.5">
            <Info className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Maker-Checker</span>
          </button>
          <button className="btn-pill btn-primary text-xs gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Invite Member
          </button>
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {ROLE_DEFINITIONS.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            isSelected={selectedRole === role.id}
            onClick={() => setSelectedRole(role.id)}
          />
        ))}
      </div>

      {/* Tab switcher */}
      <div className="space-y-6">
        <div
          className="inline-flex rounded-pill p-1 gap-1"
          style={{ background: "rgb(var(--surface))" }}
        >
          {(["permissions", "members"] as const).map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-pill text-xs font-semibold transition-all"
                style={
                  active
                    ? { background: "rgb(var(--foreground))", color: "white" }
                    : { color: "rgb(var(--foreground-subtle))" }
                }
              >
                {tab === "permissions" ? (
                  <Shield className="h-3.5 w-3.5" />
                ) : (
                  <Users className="h-3.5 w-3.5" />
                )}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            );
          })}
        </div>
        {activeTab === "permissions" && (
          <PermissionsMatrix selectedRole={activeRole} />
        )}
        {activeTab === "members" && <TeamMembers selectedRole={null} />}
      </div>
    </div>
  );
}
