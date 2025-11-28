import { CheckCircle } from "lucide-react";

export function PerformanceBadge() {
  return (
    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
          <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-primary opacity-30 animate-pulse" style={{ animationDelay: "0.2s" }} />
        </div>
        <span className="text-sm font-bold text-primary">99.9% Uptime</span>
      </div>
      <span className="text-xs font-medium text-primary/70">18 months verified</span>
    </div>
  );
}
