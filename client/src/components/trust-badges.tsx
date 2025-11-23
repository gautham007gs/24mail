import { Lock, Shield, CheckCircle, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const iconMap = {
  Lock,
  Shield,
  CheckCircle,
  Zap,
};

export function TrustBadges() {
  const badges = [
    {
      id: "https",
      icon: "Lock",
      label: "HTTPS Secure",
      description: "256-bit encrypted",
    },
    {
      id: "privacy",
      icon: "Shield",
      label: "Privacy Protected",
      description: "No tracking, anonymous",
    },
    {
      id: "uptime",
      icon: "CheckCircle",
      label: "99.9% Uptime",
      description: "Enterprise reliability",
    },
    {
      id: "instant",
      icon: "Zap",
      label: "Instant Delivery",
      description: "0.3s response time",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {badges.map((badge) => {
        const Icon = iconMap[badge.icon as keyof typeof iconMap];
        return (
          <Card
            key={badge.id}
            className="p-4 text-center hover-elevate transition-all neomorphic"
            data-testid={`badge-${badge.id}`}
          >
            <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">{badge.label}</p>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </Card>
        );
      })}
    </div>
  );
}
