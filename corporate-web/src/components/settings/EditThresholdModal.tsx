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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  FLOW_TYPE_LABELS,
  type ApprovalThreshold,
  type ApprovalStep,
  type ApprovalFlowType,
} from "@/types/approvals";
import type { CorporateRole } from "@/types/roles";

const ROLE_OPTIONS: { value: CorporateRole; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "authorizer", label: "Authorizer" },
  { value: "initiator", label: "Initiator" },
];

interface EditThresholdModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  threshold: ApprovalThreshold | null;
  onSave: (threshold: ApprovalThreshold) => void;
}

export default function EditThresholdModal({
  open,
  onOpenChange,
  threshold,
  onSave,
}: EditThresholdModalProps) {
  const isNew = !threshold;
  const [form, setForm] = useState<ApprovalThreshold>(
    threshold ?? {
      id: `th-${Date.now()}`,
      label: "",
      category: "transfers",
      minAmount: 0,
      maxAmount: null,
      currency: "NGN",
      requiredApprovers: 1,
      flowType: "sequential",
      enabled: true,
      steps: [],
    },
  );

  // Reset form when threshold changes
  const [lastThresholdId, setLastThresholdId] = useState(threshold?.id);
  if (threshold && threshold.id !== lastThresholdId) {
    setForm(threshold);
    setLastThresholdId(threshold.id);
  }

  const updateField = <K extends keyof ApprovalThreshold>(
    key: K,
    value: ApprovalThreshold[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addStep = () => {
    const newStep: ApprovalStep = {
      id: `s-${Date.now()}`,
      order: form.steps.length + 1,
      role: "authorizer",
      label: `Step ${form.steps.length + 1}`,
      required: true,
    };
    updateField("steps", [...form.steps, newStep]);
  };

  const updateStep = (index: number, updates: Partial<ApprovalStep>) => {
    const newSteps = form.steps.map((s, i) =>
      i === index ? { ...s, ...updates } : s,
    );
    updateField("steps", newSteps);
  };

  const removeStep = (index: number) => {
    const newSteps = form.steps
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, order: i + 1 }));
    updateField("steps", newSteps);
  };

  const handleSave = () => {
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle
            className="text-lg font-extrabold"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {isNew ? "New Threshold Tier" : "Edit Threshold Tier"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure amount ranges, approval flow, and required steps.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Label */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Label</Label>
            <Input
              value={form.label}
              onChange={(e) => updateField("label", e.target.value)}
              placeholder="e.g. Low Value, High Value"
              className="text-sm"
            />
          </div>

          {/* Amount range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Min Amount (₦)</Label>
              <Input
                type="number"
                value={form.minAmount}
                onChange={(e) =>
                  updateField("minAmount", Number(e.target.value))
                }
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Max Amount (₦)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={form.maxAmount ?? ""}
                  onChange={(e) =>
                    updateField(
                      "maxAmount",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  placeholder="Unlimited"
                  className="text-sm"
                  disabled={form.maxAmount === null}
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <Switch
                    checked={form.maxAmount === null}
                    onCheckedChange={(checked) =>
                      updateField("maxAmount", checked ? null : 10_000_000)
                    }
                  />
                  <span className="text-[10px] text-muted-foreground font-medium">
                    No limit
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Flow type & approvers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Flow Type</Label>
              <Select
                value={form.flowType}
                onValueChange={(v) =>
                  updateField("flowType", v as ApprovalFlowType)
                }
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FLOW_TYPE_LABELS).map(
                    ([key, { label, description }]) => (
                      <SelectItem key={key} value={key} className="text-sm">
                        <span className="font-medium">{label}</span>
                        <span className="text-muted-foreground ml-1 text-xs">
                          – {description}
                        </span>
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Required Approvers
              </Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={form.requiredApprovers}
                onChange={(e) =>
                  updateField("requiredApprovers", Number(e.target.value))
                }
                className="text-sm"
              />
            </div>
          </div>

          {/* Approval Steps */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Approval Steps</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs rounded-sm gap-1 h-7"
                onClick={addStep}
              >
                <Plus className="h-3 w-3" />
                Add Step
              </Button>
            </div>

            {form.steps.length === 0 && (
              <p
                className="text-xs py-3 text-center rounded-xl"
                style={{
                  color: "rgb(var(--foreground-subtle))",
                  border: "1px dashed rgb(var(--border))",
                }}
              >
                No steps configured. Add at least one approval step.
              </p>
            )}

            <div className="space-y-2">
              {form.steps.map((step, i) => (
                <div
                  key={step.id}
                  className="flex items-center gap-2 p-2.5 rounded-xl"
                  style={{
                    background: "rgb(var(--surface))",
                    border: "1px solid rgb(var(--border))",
                  }}
                >
                  <GripVertical
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: "rgb(var(--foreground-subtle))" }}
                  />
                  <span
                    className="text-[10px] font-bold shrink-0 w-6 text-center px-1 py-0.5 rounded-pill"
                    style={{
                      background: "rgb(var(--soft))",
                      color: "rgb(var(--brand-primary))",
                    }}
                  >
                    {step.order}
                  </span>
                  <Input
                    value={step.label}
                    onChange={(e) => updateStep(i, { label: e.target.value })}
                    className="text-xs h-8 flex-1"
                    placeholder="Step label"
                  />
                  <Select
                    value={step.role}
                    onValueChange={(v) =>
                      updateStep(i, { role: v as CorporateRole })
                    }
                  >
                    <SelectTrigger className="text-xs h-8 w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((r) => (
                        <SelectItem
                          key={r.value}
                          value={r.value}
                          className="text-xs"
                        >
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1 shrink-0">
                    <Switch
                      checked={step.required}
                      onCheckedChange={(checked) =>
                        updateStep(i, { required: checked })
                      }
                    />
                    <span className="text-[10px] text-muted-foreground">
                      Req
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 shrink-0"
                    onClick={() => removeStep(i)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
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
          <Button
            variant="outline"
            size="sm"
            className="text-xs rounded-sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button size="sm" className="text-xs rounded-sm" onClick={handleSave}>
            {isNew ? "Create Tier" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
