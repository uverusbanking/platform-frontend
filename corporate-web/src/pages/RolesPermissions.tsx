import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield, Crown, Send, CheckCircle2, Eye, Check, X, Users, Info,
} from "lucide-react";
import {
  ROLE_DEFINITIONS, PERMISSION_CATEGORIES,
  type CorporateRole, type RoleDefinition,
} from "@/types/roles";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ROLE_ICONS: Record<CorporateRole, React.ElementType> = {
  owner: Crown, initiator: Send, authorizer: CheckCircle2, viewer: Eye,
};

const mockMembers = [
  { name: "Adewale Johnson", email: "adewale@sovereignvault.com", role: "owner" as CorporateRole, status: "active" },
  { name: "Ngozi Okafor", email: "ngozi@sovereignvault.com", role: "initiator" as CorporateRole, status: "active" },
  { name: "Emeka Nwosu", email: "emeka@sovereignvault.com", role: "authorizer" as CorporateRole, status: "active" },
  { name: "Fatima Bello", email: "fatima@sovereignvault.com", role: "authorizer" as CorporateRole, status: "active" },
  { name: "Chidi Eze", email: "chidi@sovereignvault.com", role: "viewer" as CorporateRole, status: "invited" },
];

function RoleCard({ role, isSelected, onClick }: { role: RoleDefinition; isSelected: boolean; onClick: () => void }) {
  const Icon = ROLE_ICONS[role.id];
  const memberCount = mockMembers.filter((m) => m.role === role.id).length;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 sm:p-5 rounded-sm border transition-all ${
        isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-surface-container hover:border-primary/30"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-sm flex items-center justify-center ${role.color}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider">
          {memberCount} {memberCount === 1 ? "member" : "members"}
        </Badge>
      </div>
      <h4 className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>{role.label}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{role.description}</p>
    </button>
  );
}

function PermissionsMatrix({ selectedRole }: { selectedRole: RoleDefinition }) {
  return (
    <div className="bg-surface-container rounded-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          <div className="grid grid-cols-[1fr_repeat(4,60px)] sm:grid-cols-[1fr_repeat(4,80px)] gap-0 px-4 sm:px-6 py-3 bg-surface-low border-b border-border">
            <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">Permission</p>
            {ROLE_DEFINITIONS.map((r) => {
              const Icon = ROLE_ICONS[r.id];
              return (
                <div key={r.id} className="flex flex-col items-center gap-1">
                  <Icon className={`h-3.5 w-3.5 ${r.id === selectedRole.id ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider ${r.id === selectedRole.id ? "text-primary" : "text-muted-foreground"}`}>
                    {r.label.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {PERMISSION_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <div className="px-4 sm:px-6 py-2 bg-surface-low/50">
                <p className="text-xs font-bold text-foreground uppercase tracking-wider">{cat.label}</p>
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
                    <span className="text-xs sm:text-sm text-foreground">{action.label}</span>
                    {ROLE_DEFINITIONS.map((r) => {
                      const perm = r.permissions.find((p) => p.category === cat.id);
                      const act = perm?.actions.find((a) => a.id === action.id);
                      const allowed = act?.allowed ?? false;
                      const isHighlighted = r.id === selectedRole.id;

                      return (
                        <div key={r.id} className="flex justify-center">
                          {allowed ? (
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                              isHighlighted ? "bg-primary text-primary-foreground" : "bg-success/15 text-success"
                            }`}>
                              <Check className="h-3 w-3" />
                            </div>
                          ) : (
                            <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                              isHighlighted ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground/40"
                            }`}>
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
  const filtered = selectedRole ? mockMembers.filter((m) => m.role === selectedRole) : mockMembers;

  return (
    <div className="bg-surface-container rounded-sm border border-border overflow-hidden">
      {/* Desktop header */}
      <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-surface-low border-b border-border">
        <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">Member</p>
        <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">Role</p>
        <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">Status</p>
        <p className="text-xs font-semibold tracking-[0.05em] text-muted-foreground uppercase">Action</p>
      </div>
      {filtered.map((member, i) => {
        const roleDef = ROLE_DEFINITIONS.find((r) => r.id === member.role)!;
        const initials = member.name.split(" ").map((w) => w[0]).join("").toUpperCase();
        return (
          <div key={member.email}>
            {/* Desktop row */}
            <div className={`hidden sm:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-surface-low transition-colors ${
              i < filtered.length - 1 ? "border-b border-border/50" : ""
            }`}>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-surface-low flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <Badge className={`${roleDef.color} border-0 text-[10px] font-semibold uppercase tracking-wider w-fit`}>{roleDef.label}</Badge>
              <Badge className={`border-0 text-[10px] font-semibold uppercase tracking-wider w-fit ${
                member.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              }`}>{member.status}</Badge>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">Edit</Button>
            </div>

            {/* Mobile card */}
            <div className={`sm:hidden p-4 space-y-2 ${i < filtered.length - 1 ? "border-b border-border/50" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-surface-low flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">Edit</Button>
              </div>
              <div className="flex items-center gap-2 pl-12">
                <Badge className={`${roleDef.color} border-0 text-[10px] font-semibold uppercase tracking-wider`}>{roleDef.label}</Badge>
                <Badge className={`border-0 text-[10px] font-semibold uppercase tracking-wider ${
                  member.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                }`}>{member.status}</Badge>
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
  const activeRole = ROLE_DEFINITIONS.find((r) => r.id === selectedRole)!;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-[2rem] font-extrabold text-foreground leading-tight" style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.03em" }}>
            Roles & Permissions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Manage corporate user roles and access controls</p>
        </div>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs rounded-sm gap-1.5">
                <Info className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Maker-Checker</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs text-xs">
              All roles follow the maker-checker principle. The Owner has full access but is still subject to approval workflows for high-value operations.
            </TooltipContent>
          </Tooltip>
          <Button size="sm" className="text-xs rounded-sm gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {ROLE_DEFINITIONS.map((role) => (
          <RoleCard key={role.id} role={role} isSelected={selectedRole === role.id} onClick={() => setSelectedRole(role.id)} />
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="permissions" className="space-y-6">
        <TabsList className="bg-surface-low rounded-sm h-9">
          <TabsTrigger value="permissions" className="text-xs font-semibold rounded-sm data-[state=active]:bg-background">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="members" className="text-xs font-semibold rounded-sm data-[state=active]:bg-background">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Members
          </TabsTrigger>
        </TabsList>
        <TabsContent value="permissions"><PermissionsMatrix selectedRole={activeRole} /></TabsContent>
        <TabsContent value="members"><TeamMembers selectedRole={null} /></TabsContent>
      </Tabs>
    </div>
  );
}
