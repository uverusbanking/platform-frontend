import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeftRight,
  Layers,
  Briefcase,
  Settings,
  Users,
  ChevronRight,
  Clock,
  AlertTriangle,
  Plus,
  GitBranch,
  ArrowDown,
  Zap,
} from "lucide-react";
import {
  MOCK_WORKFLOWS,
  FLOW_TYPE_LABELS,
  type ApprovalWorkflow,
  type ApprovalFlowType,
  type TransactionCategory,
} from "@/types/approvals";
import { ROLE_DEFINITIONS } from "@/types/roles";
import WorkflowDetail from "@/components/settings/WorkflowDetail";

const CATEGORY_ICONS: Record<TransactionCategory, React.ElementType> = {
  transfers: ArrowLeftRight,
  bulk_payments: Layers,
  payroll: Briefcase,
  account_management: Settings,
  user_management: Users,
};

const FLOW_ICONS: Record<ApprovalFlowType, React.ElementType> = {
  sequential: ArrowDown,
  parallel: GitBranch,
  any_one: Zap,
};

function WorkflowCard({
  workflow,
  onClick,
  isSelected,
}: {
  workflow: ApprovalWorkflow;
  onClick: () => void;
  isSelected: boolean;
}) {
  const Icon = CATEGORY_ICONS[workflow.category];
  const FlowIcon = FLOW_ICONS[workflow.flowType];
  const thresholdCount = workflow.thresholds.length;
  const escalationCount = workflow.escalationRules.filter(
    (e) => e.enabled,
  ).length;

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
        <Switch
          checked={workflow.enabled}
          onClick={(e) => e.stopPropagation()}
        />
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
        {workflow.name}
      </h4>
      <p
        className="text-xs leading-relaxed mb-3"
        style={{
          color: isSelected
            ? "rgba(255,255,255,0.5)"
            : "rgb(var(--foreground-subtle))",
        }}
      >
        {workflow.description}
      </p>
      <div
        className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs"
        style={{
          color: isSelected
            ? "rgba(255,255,255,0.45)"
            : "rgb(var(--foreground-subtle))",
        }}
      >
        <div className="flex items-center gap-1">
          <FlowIcon className="h-3 w-3" />
          <span>{FLOW_TYPE_LABELS[workflow.flowType].label}</span>
        </div>
        <span>•</span>
        <span>
          {thresholdCount} tier{thresholdCount !== 1 ? "s" : ""}
        </span>
        {escalationCount > 0 && (
          <>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {escalationCount} rule{escalationCount !== 1 ? "s" : ""}
              </span>
            </div>
          </>
        )}
      </div>
      <div
        className="flex items-center gap-1 mt-3 text-xs font-medium"
        style={{
          color: isSelected
            ? "rgba(255,255,255,0.7)"
            : "rgb(var(--brand-primary))",
        }}
      >
        <span>Configure</span>
        <ChevronRight className="h-3 w-3" />
      </div>
    </button>
  );
}

export default function ApprovalRulesPage() {
  const [workflows, setWorkflows] =
    useState<ApprovalWorkflow[]>(MOCK_WORKFLOWS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedWorkflow = workflows.find((w) => w.id === selectedId) ?? null;

  const handleUpdateWorkflow = (updated: ApprovalWorkflow) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === updated.id ? updated : w)),
    );
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
          <p className="eyebrow mb-1">Administration</p>
          <h2 className="display">Approval Rules</h2>
          <p
            className="text-sm mt-1"
            style={{ color: "rgb(var(--foreground-subtle))" }}
          >
            Configure approval workflows, thresholds, and escalation policies
          </p>
        </div>
        <div className="flex gap-2">
          <div
            className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-pill"
            style={{ background: "rgb(var(--lemon) / 0.3)", color: "#7a6200" }}
          >
            <AlertTriangle className="h-3 w-3" />
            <span className="hidden sm:inline">Maker-Checker Enforced</span>
            <span className="sm:hidden">M-C</span>
          </div>
          <button className="btn-pill btn-primary text-xs gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Workflow</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          {
            label: "Active",
            value: `${enabledCount}`,
            suffix: `/ ${workflows.length}`,
          },
          {
            label: "Tiers",
            value: `${workflows.reduce((sum, w) => sum + w.thresholds.length, 0)}`,
            suffix: "",
          },
          {
            label: "Escalations",
            value: `${workflows.reduce((sum, w) => sum + w.escalationRules.filter((e) => e.enabled).length, 0)}`,
            suffix: "",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-3 sm:p-4 shadow-card"
            style={{ background: "rgb(var(--surface-highest))" }}
          >
            <p className="eyebrow mb-1">{stat.label}</p>
            <p
              className="text-xl sm:text-2xl font-extrabold"
              style={{
                fontFamily: "Manrope, sans-serif",
                color: "rgb(var(--foreground))",
              }}
            >
              {stat.value}
              {stat.suffix && (
                <span
                  className="text-xs sm:text-sm font-normal ml-1"
                  style={{ color: "rgb(var(--foreground-subtle))" }}
                >
                  {stat.suffix}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Workflow Cards Grid */}
      <div>
        <p className="eyebrow mb-4">Workflow Categories</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {workflows.map((wf) => (
            <WorkflowCard
              key={wf.id}
              workflow={wf}
              isSelected={false}
              onClick={() => setSelectedId(wf.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
