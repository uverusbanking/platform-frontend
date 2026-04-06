import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  ArrowDown,
  GitBranch,
  Zap,
  Clock,
  ChevronRight,
  AlertTriangle,
  Check,
  Crown,
  CheckCircle2,
  Eye,
  Send,
  Plus,
  Pencil,
} from "lucide-react";
import {
  FLOW_TYPE_LABELS,
  ESCALATION_ACTIONS,
  type ApprovalWorkflow,
  type ApprovalThreshold,
  type EscalationRule,
  type ApprovalFlowType,
} from "@/types/approvals";
import type { CorporateRole } from "@/types/roles";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditThresholdModal from "@/components/settings/EditThresholdModal";
import EditEscalationModal from "@/components/settings/EditEscalationModal";

const FLOW_ICONS: Record<ApprovalFlowType, React.ElementType> = {
  sequential: ArrowDown,
  parallel: GitBranch,
  any_one: Zap,
};

const ROLE_ICONS: Record<CorporateRole, React.ElementType> = {
  owner: Crown,
  initiator: Send,
  authorizer: CheckCircle2,
  viewer: Eye,
};

const ROLE_COLORS: Record<CorporateRole, string> = {
  owner: "bg-primary/10 text-primary border-primary/20",
  initiator: "bg-warning/10 text-warning border-warning/20",
  authorizer: "bg-success/10 text-success border-success/20",
  viewer: "bg-muted text-muted-foreground border-border",
};

function formatAmount(amount: number): string {
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(0)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}K`;
  return `₦${amount}`;
}

function ThresholdCard({
  threshold,
  onEdit,
}: {
  threshold: ApprovalThreshold;
  onEdit: () => void;
}) {
  const FlowIcon = FLOW_ICONS[threshold.flowType];
  const rangeLabel = threshold.maxAmount
    ? `${formatAmount(threshold.minAmount)} – ${formatAmount(threshold.maxAmount)}`
    : `${formatAmount(threshold.minAmount)}+`;

  return (
    <div className="bg-surface-container border border-border rounded-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-foreground" style={{ fontFamily: "Manrope, sans-serif" }}>
              {threshold.label}
            </h4>
            <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider">
              {rangeLabel}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FlowIcon className="h-3 w-3" />
            <span>{FLOW_TYPE_LABELS[threshold.flowType].label}</span>
            <span className="text-border">•</span>
            <span>{threshold.requiredApprovers} approver{threshold.requiredApprovers !== 1 ? "s" : ""} required</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={threshold.enabled} />
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Approval chain visualization */}
      <div className="flex items-center gap-2 flex-wrap">
        {threshold.steps.map((step, i) => {
          const RIcon = ROLE_ICONS[step.role];
          return (
            <div key={step.id} className="flex items-center gap-2">
              {i > 0 && (
                <div className="flex items-center">
                  {threshold.flowType === "sequential" ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <span className="text-xs text-muted-foreground font-medium px-1">+</span>
                  )}
                </div>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-semibold ${ROLE_COLORS[step.role]}`}>
                    <RIcon className="h-3.5 w-3.5" />
                    <span>{step.label}</span>
                    {step.required && (
                      <span className="text-[9px] opacity-60">*</span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Step {step.order} • {step.required ? "Required" : "Optional"} • Role: {step.role}
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EscalationCard({
  rule,
  onEdit,
}: {
  rule: EscalationRule;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-surface-container border border-border rounded-sm">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-sm bg-warning/10 flex items-center justify-center">
          <Clock className="h-4 w-4 text-warning" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{rule.label}</p>
          <p className="text-xs text-muted-foreground">
            After {rule.triggerHours}h → {ESCALATION_ACTIONS[rule.action]}
            {rule.notifyRoles.length > 0 && (
              <span> • Notify: {rule.notifyRoles.join(", ")}</span>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={rule.enabled} />
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}

export default function WorkflowDetail({
  workflow,
  onBack,
  onUpdateWorkflow,
}: {
  workflow: ApprovalWorkflow;
  onBack: () => void;
  onUpdateWorkflow?: (updated: ApprovalWorkflow) => void;
}) {
  const FlowIcon = FLOW_ICONS[workflow.flowType];

  // Threshold modal state
  const [thresholdModalOpen, setThresholdModalOpen] = useState(false);
  const [editingThreshold, setEditingThreshold] = useState<ApprovalThreshold | null>(null);

  // Escalation modal state
  const [escalationModalOpen, setEscalationModalOpen] = useState(false);
  const [editingEscalation, setEditingEscalation] = useState<EscalationRule | null>(null);

  const openThresholdEdit = (threshold: ApprovalThreshold | null) => {
    setEditingThreshold(threshold);
    setThresholdModalOpen(true);
  };

  const openEscalationEdit = (rule: EscalationRule | null) => {
    setEditingEscalation(rule);
    setEscalationModalOpen(true);
  };

  const handleSaveThreshold = (updated: ApprovalThreshold) => {
    const exists = workflow.thresholds.some((t) => t.id === updated.id);
    const newThresholds = exists
      ? workflow.thresholds.map((t) => (t.id === updated.id ? updated : t))
      : [...workflow.thresholds, updated];
    onUpdateWorkflow?.({ ...workflow, thresholds: newThresholds });
  };

  const handleSaveEscalation = (updated: EscalationRule) => {
    const exists = workflow.escalationRules.some((r) => r.id === updated.id);
    const newRules = exists
      ? workflow.escalationRules.map((r) => (r.id === updated.id ? updated : r))
      : [...workflow.escalationRules, updated];
    onUpdateWorkflow?.({ ...workflow, escalationRules: newRules });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Approval Rules
        </button>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2
                className="text-[2rem] font-extrabold text-foreground leading-tight"
                style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.03em" }}
              >
                {workflow.name}
              </h2>
              <Badge
                className={`text-[10px] font-semibold uppercase tracking-wider border-0 ${
                  workflow.enabled ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                }`}
              >
                {workflow.enabled ? "Active" : "Disabled"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs rounded-sm gap-1.5">
              <FlowIcon className="h-3.5 w-3.5" />
              {FLOW_TYPE_LABELS[workflow.flowType].label}
            </Button>
            <Button size="sm" className="text-xs rounded-sm gap-1.5">
              <Pencil className="h-3.5 w-3.5" />
              Edit Workflow
            </Button>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/15 rounded-sm">
        <AlertTriangle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <div className="text-xs text-foreground leading-relaxed">
          <span className="font-bold">Maker-Checker Principle:</span> Initiators cannot approve their own submissions. 
          Owners have full access but are subject to approval rules for transactions exceeding threshold limits.
        </div>
      </div>

      {/* Threshold Tiers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider" style={{ fontFamily: "Manrope, sans-serif" }}>
            Threshold Tiers
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="text-xs rounded-sm gap-1.5"
            onClick={() => openThresholdEdit(null)}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Tier
          </Button>
        </div>
        {workflow.thresholds.length > 0 ? (
          <div className="space-y-3">
            {workflow.thresholds.map((th) => (
              <ThresholdCard
                key={th.id}
                threshold={th}
                onEdit={() => openThresholdEdit(th)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-surface-container border border-border rounded-sm p-8 text-center">
            <p className="text-sm text-muted-foreground">No threshold tiers configured</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 text-xs rounded-sm gap-1.5"
              onClick={() => openThresholdEdit(null)}
            >
              <Plus className="h-3.5 w-3.5" />
              Create First Tier
            </Button>
          </div>
        )}
      </div>

      {/* Escalation Rules */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider" style={{ fontFamily: "Manrope, sans-serif" }}>
            Escalation Rules
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="text-xs rounded-sm gap-1.5"
            onClick={() => openEscalationEdit(null)}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Rule
          </Button>
        </div>
        {workflow.escalationRules.length > 0 ? (
          <div className="space-y-3">
            {workflow.escalationRules.map((rule) => (
              <EscalationCard
                key={rule.id}
                rule={rule}
                onEdit={() => openEscalationEdit(rule)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-surface-container border border-border rounded-sm p-8 text-center">
            <p className="text-sm text-muted-foreground">No escalation rules configured</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 text-xs rounded-sm gap-1.5"
              onClick={() => openEscalationEdit(null)}
            >
              <Plus className="h-3.5 w-3.5" />
              Create First Rule
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <EditThresholdModal
        open={thresholdModalOpen}
        onOpenChange={setThresholdModalOpen}
        threshold={editingThreshold}
        onSave={handleSaveThreshold}
      />
      <EditEscalationModal
        open={escalationModalOpen}
        onOpenChange={setEscalationModalOpen}
        rule={editingEscalation}
        onSave={handleSaveEscalation}
      />
    </div>
  );
}
