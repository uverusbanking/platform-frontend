import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ESCALATION_ACTIONS,
  type EscalationRule,
  type EscalationAction,
} from "@/types/approvals";
import type { CorporateRole } from "@/types/roles";

const NOTIFY_ROLE_OPTIONS: { value: CorporateRole; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "authorizer", label: "Authorizer" },
  { value: "initiator", label: "Initiator" },
];

interface EditEscalationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: EscalationRule | null;
  onSave: (rule: EscalationRule) => void;
}

export default function EditEscalationModal({
  open,
  onOpenChange,
  rule,
  onSave,
}: EditEscalationModalProps) {
  const isNew = !rule;
  const [form, setForm] = useState<EscalationRule>(
    rule ?? {
      id: `esc-${Date.now()}`,
      label: "",
      triggerHours: 24,
      action: "notify_owner",
      notifyRoles: ["owner"],
      enabled: true,
    }
  );

  const [lastRuleId, setLastRuleId] = useState(rule?.id);
  if (rule && rule.id !== lastRuleId) {
    setForm(rule);
    setLastRuleId(rule.id);
  }

  const updateField = <K extends keyof EscalationRule>(key: K, value: EscalationRule[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleNotifyRole = (role: CorporateRole) => {
    const current = form.notifyRoles;
    const next = current.includes(role) ? current.filter((r) => r !== role) : [...current, role];
    updateField("notifyRoles", next);
  };

  const handleSave = () => {
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle
            className="text-lg font-extrabold"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {isNew ? "New Escalation Rule" : "Edit Escalation Rule"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure when and how pending approvals should be escalated.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Label */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Label</Label>
            <Input
              value={form.label}
              onChange={(e) => updateField("label", e.target.value)}
              placeholder="e.g. Pending too long"
              className="text-sm"
            />
          </div>

          {/* Trigger hours */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Trigger After (hours)</Label>
            <Input
              type="number"
              min={1}
              max={168}
              value={form.triggerHours}
              onChange={(e) => updateField("triggerHours", Number(e.target.value))}
              className="text-sm"
            />
            <p className="text-[10px] text-muted-foreground">
              Escalation triggers if approval is pending for this many hours.
            </p>
          </div>

          {/* Action */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Escalation Action</Label>
            <Select
              value={form.action}
              onValueChange={(v) => updateField("action", v as EscalationAction)}
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ESCALATION_ACTIONS).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="text-sm">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notify roles */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Notify Roles</Label>
            <div className="flex flex-col gap-2">
              {NOTIFY_ROLE_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={form.notifyRoles.includes(opt.value)}
                    onCheckedChange={() => toggleNotifyRole(opt.value)}
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Enabled */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Label className="text-xs font-semibold">Enabled</Label>
            <Switch
              checked={form.enabled}
              onCheckedChange={(checked) => updateField("enabled", checked)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" className="text-xs rounded-sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" className="text-xs rounded-sm" onClick={handleSave}>
            {isNew ? "Create Rule" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
