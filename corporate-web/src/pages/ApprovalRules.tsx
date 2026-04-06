import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeftRight, Layers, Briefcase, Settings, Users, ChevronRight,
  Clock, AlertTriangle, Plus, GitBranch, ArrowDown, Zap,
} from "lucide-react";
import {
  MOCK_WORKFLOWS, FLOW_TYPE_LABELS, type ApprovalWorkflow, type ApprovalFlowType, type TransactionCategory,
} from "@/types/approvals";
import { ROLE_DEFINITIONS } from "@/types/roles";
import WorkflowDetail from "@/components/settings/WorkflowDetail";

const CATEGORY_ICONS: Record<TransactionCategory, React.ElementType> = {
  transfers: ArrowLeftRight, bulk_payments: Layers, payroll: Briefcase, account_management: Settings, user_management: Users,
};

const FLOW_ICONS: Record<ApprovalFlowType, React.ElementType> = {
  sequential: ArrowDown, parallel: GitBranch, any_one: Zap,
};

function WorkflowCard({ workflow, onClick, isSelected }: { workflow: ApprovalWorkflow; onClick: () => void; isSelected: boolean }) {
  const Icon = CATEGORY_ICONS[workflow.category];
  const FlowIcon = FLOW_ICONS[workflow.flowType];
  const thresholdCount = workflow.thresholds.length;
  const escalationCount = workflow.escalationRules.filter((e) => e.enabled).length;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 sm:p-5 rounded-sm border transition-all ${
        isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-surface-container hover:border-primary/30"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-sm bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <Switch checked={workflow.enabled} onClick={(e) => e.stopPropagation()} />
      </div>
      <h4 className="text-sm font-bold text-foreground mb-1" style={{ fontFamily: "Manrope, sans-serif" }}>{workflow.name}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{workflow.description}</p>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <FlowIcon className="h-3 w-3" />
          <span>{FLOW_TYPE_LABELS[workflow.flowType].label}</span>
        </div>
        <span className="text-border">•</span>
        <span>{thresholdCount} tier{thresholdCount !== 1 ? "s" : ""}</span>
        {escalationCount > 0 && (
          <>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{escalationCount} rule{escalationCount !== 1 ? "s" : ""}</span>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-1 mt-3 text-xs text-primary font-medium">
        <span>Configure</span>
        <ChevronRight className="h-3 w-3" />
      </div>
    </button>
  );
}

export default function ApprovalRulesPage() {
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>(MOCK_WORKFLOWS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedWorkflow = workflows.find((w) => w.id === selectedId) ?? null;

  const handleUpdateWorkflow = (updated: ApprovalWorkflow) => {
    setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  if (selectedWorkflow) {
    return (
      <WorkflowDetail
        workflow={selectedWorkflow}
        onBack={() => setSelectedId(null)}
        onUpdateWorkflow={handleUpdateWorkflow}
      />
    );
  }

  const enabledCount = workflows.filter((w) => w.enabled).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-[2rem] font-extrabold text-foreground leading-tight" style={{ fontFamily: "Manrope, sans-serif", letterSpacing: "-0.03em" }}>
            Approval Rules
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Configure approval workflows, thresholds, and escalation policies</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-[10px] sm:text-xs font-semibold gap-1.5 px-2 sm:px-3 py-1.5">
            <AlertTriangle className="h-3 w-3" />
            <span className="hidden sm:inline">Maker-Checker Enforced</span>
            <span className="sm:hidden">M-C</span>
          </Badge>
          <Button size="sm" className="text-xs rounded-sm gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Workflow</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-surface-container border border-border rounded-sm p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Active</p>
          <p className="text-xl sm:text-2xl font-extrabold text-foreground" style={{ fontFamily: "Manrope, sans-serif" }}>
            {enabledCount}<span className="text-xs sm:text-sm text-muted-foreground font-normal ml-1">/ {workflows.length}</span>
          </p>
        </div>
        <div className="bg-surface-container border border-border rounded-sm p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Tiers</p>
          <p className="text-xl sm:text-2xl font-extrabold text-foreground" style={{ fontFamily: "Manrope, sans-serif" }}>
            {workflows.reduce((sum, w) => sum + w.thresholds.length, 0)}
          </p>
        </div>
        <div className="bg-surface-container border border-border rounded-sm p-3 sm:p-4">
          <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Escalations</p>
          <p className="text-xl sm:text-2xl font-extrabold text-foreground" style={{ fontFamily: "Manrope, sans-serif" }}>
            {workflows.reduce((sum, w) => sum + w.escalationRules.filter((e) => e.enabled).length, 0)}
          </p>
        </div>
      </div>

      {/* Workflow Cards Grid */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider" style={{ fontFamily: "Manrope, sans-serif" }}>
          Workflow Categories
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {workflows.map((wf) => (
            <WorkflowCard key={wf.id} workflow={wf} isSelected={false} onClick={() => setSelectedId(wf.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
