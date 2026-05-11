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
          className="bg-success/10 text-success border-success/20 hover:bg-success/20 transition-colors font-bold capitalize"
          variant={variant}
        >
          Active
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20 transition-colors font-bold capitalize"
          variant={variant}
        >
          Pending
        </Badge>
      );
    case "RESTRICTED":
      return (
        <Badge
          className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20 transition-colors font-bold capitalize"
          variant={variant}
        >
          Restricted
        </Badge>
      );
    case "BLOCKED":
    case "SUSPENDED":
    case "FROZEN":
      return (
        <Badge
          className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 transition-colors font-bold capitalize"
          variant={variant}
        >
          {status.toLowerCase()}
        </Badge>
      );
    case "INACTIVE":
    case "CLOSED":
    case "ARCHIVED":
      return (
        <Badge
          className="bg-muted text-muted-foreground border-border hover:bg-muted/80 transition-colors font-bold capitalize"
          variant={variant}
        >
          {status.toLowerCase()}
        </Badge>
      );
    default:
      return (
        <Badge variant={variant} className="font-bold capitalize">
          {status || "Unknown"}
        </Badge>
      );
  }
};
