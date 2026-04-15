import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export const StatusBadge = ({
  status,
  variant = "default",
}: StatusBadgeProps) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return (
        <Badge
          className="bg-success/10 text-success border-success/20 hover:bg-success/20 transition-colors font-medium capitalize"
          variant={variant}
        >
          Active
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20 transition-colors font-medium capitalize"
          variant={variant}
        >
          Pending
        </Badge>
      );
    case "BLOCKED":
      return (
        <Badge
          className="bg-error/10 text-error border-error/20 hover:bg-error/20 transition-colors font-medium capitalize"
          variant={variant}
        >
          Blocked
        </Badge>
      );
    default:
      return (
        <Badge variant={variant} className="font-medium capitalize">
          {status || "Unknown"}
        </Badge>
      );
  }
};
