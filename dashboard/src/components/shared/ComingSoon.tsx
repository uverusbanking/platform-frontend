"use client";

import { Wrench } from "lucide-react";

interface ComingSoonProps {
  feature: string;
  description?: string;
}

export function ComingSoon({
  feature,
  description = "We're building this feature. Check back soon.",
}: ComingSoonProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{feature}</h2>
      </div>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
          <Wrench className="w-7 h-7 text-muted-foreground/60" />
        </div>
        <p className="text-lg font-semibold text-foreground mb-2">
          Coming Soon
        </p>
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      </div>
    </div>
  );
}
