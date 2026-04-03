import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "stable";
  className?: string;
}

export function KPICard({
  title,
  value,
  change,
  changeType = "neutral",
  description,
  icon: Icon,
  className,
}: KPICardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "bg-success/80 border-success";
      case "negative":
        return "bg-error/80 border-error";
      default:
        return "bg-primary/80 border-primary";
    }
  };

  return (
    <Card
      className={cn(
        "bg-gradient-card shadow-fintech hover:shadow-lg transition-all duration-300 animate-fade-in",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          <div className="flex items-center gap-2">
            {change && (
              <Badge
                variant="secondary"
                className={cn("text-xs", getChangeColor())}
              >
                {change}
              </Badge>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
