import { useState, useEffect } from "react";
import { 
  Mail, 
  Users, 
  CheckCircle, 
  Zap, 
  Lock, 
  Shield, 
  TrendingUp 
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  growth?: string;
  growthTrend?: "up" | "down";
  category: "stats" | "trust";
  description?: string;
}

// Animated number counter
function AnimatedCounter({ target }: { target: string }) {
  const [count, setCount] = useState("0");
  const isPercentage = target.includes("%");
  const isTime = target.includes("s");
  
  const numericValue = parseInt(target.replace(/[^0-9]/g, "")) || 0;

  useEffect(() => {
    if (isPercentage || isTime) {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += numericValue / steps;
        if (current >= numericValue) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(
            isPercentage
              ? `${Math.round(current)}`
              : `${current.toFixed(2)}`
          );
        }
      }, stepDuration);

      return () => clearInterval(interval);
    } else if (target.includes("M")) {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += numericValue / steps;
        if (current >= numericValue) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(`${current.toFixed(2)}M+`);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    } else if (target.includes("K")) {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += numericValue / steps;
        if (current >= numericValue) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(`${current.toFixed(0)}K+`);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }

    setCount(target);
  }, [target, numericValue, isPercentage, isTime]);

  return <span>{count}</span>;
}

export function UnifiedSocialProof() {
  const items: StatItem[] = [
    // Stats - Top row with growth indicators
    {
      icon: <Mail className="h-7 w-7" />,
      value: "1M+",
      label: "Emails Generated",
      growth: "↑ 50% growth",
      growthTrend: "up",
      category: "stats",
      description: "daily",
    },
    {
      icon: <Users className="h-7 w-7" />,
      value: "500K+",
      label: "Active Users",
      growth: "↑ 35% this month",
      growthTrend: "up",
      category: "stats",
      description: "monthly",
    },
    {
      icon: <CheckCircle className="h-7 w-7" />,
      value: "99.9%",
      label: "Uptime SLA",
      growth: "No downtime in 18mo",
      category: "stats",
      description: "guaranteed",
    },
    {
      icon: <Zap className="h-7 w-7" />,
      value: "0.3s",
      label: "Avg Response",
      growth: "Fastest in market",
      category: "stats",
      description: "delivery time",
    },
    // Trust - Bottom row
    {
      icon: <Lock className="h-7 w-7" />,
      label: "HTTPS Secure",
      value: "256-bit",
      category: "trust",
      description: "Encrypted connection",
    },
    {
      icon: <Shield className="h-7 w-7" />,
      label: "Privacy Protected",
      value: "100%",
      category: "trust",
      description: "Anonymous, no tracking",
    },
    {
      icon: <TrendingUp className="h-7 w-7" />,
      label: "Proven Reliable",
      value: "18mo+",
      category: "trust",
      description: "Enterprise tested",
    },
    {
      icon: <Zap className="h-7 w-7" />,
      label: "Instant Delivery",
      value: "Real-time",
      category: "trust",
      description: "No delays ever",
    },
  ];

  const statsItems = items.filter(item => item.category === "stats");
  const trustItems = items.filter(item => item.category === "trust");

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-foreground/5 dark:bg-foreground/10 border border-border/30">
          <TrendingUp className="h-4 w-4 text-foreground/60" />
          <span className="text-sm font-semibold text-foreground/70">
            Trusted by Thousands Worldwide
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Enterprise Grade • Developer Loved
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Join millions who trust Burner Email for anonymous, disposable privacy protection
        </p>
      </div>

      {/* Stats Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-2">
          Impact & Growth
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {statsItems.map((item, idx) => (
            <Card
              key={idx}
              className="relative p-5 md:p-6 text-center hover:shadow-md transition-all border border-border/30 hover:border-border/60 bg-card/40 hover:bg-card/70 group overflow-hidden"
              data-testid={`social-proof-stat-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="relative z-10 space-y-3">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="p-2.5 rounded-lg bg-background/80 group-hover:bg-background transition-colors text-foreground/60">
                    {item.icon}
                  </div>
                </div>

                {/* Value */}
                <div className="text-2xl md:text-3xl font-bold text-foreground break-words">
                  <AnimatedCounter target={item.value} />
                </div>

                {/* Label */}
                <div className="min-h-10 flex flex-col justify-center">
                  <p className="text-xs md:text-sm font-semibold text-foreground line-clamp-2">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                </div>

                {/* Growth Indicator */}
                {item.growth && (
                  <div className="inline-flex items-center justify-center gap-1 px-2 py-1 rounded-full bg-foreground/5 border border-foreground/10">
                    <TrendingUp className="h-3 w-3 text-foreground/50" />
                    <span className="text-xs font-semibold text-foreground/70">
                      {item.growth}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-2">
          Security & Trust
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {trustItems.map((item, idx) => (
            <Card
              key={idx}
              className="relative p-5 md:p-6 text-center hover:shadow-md transition-all border border-border/30 hover:border-border/60 bg-card/40 hover:bg-card/70 group overflow-hidden"
              data-testid={`social-proof-trust-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="relative z-10 space-y-3">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="p-2.5 rounded-lg bg-background/80 group-hover:bg-background transition-colors text-foreground/60">
                    {item.icon}
                  </div>
                </div>

                {/* Trust Value */}
                <div className="text-sm md:text-base font-bold text-foreground break-words">
                  {item.value}
                </div>

                {/* Label */}
                <div className="min-h-10 flex flex-col justify-center">
                  <p className="text-xs md:text-sm font-semibold text-foreground line-clamp-2">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Live Activity Badge */}
      <div className="flex justify-center px-2">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-foreground/5 dark:bg-foreground/10 border border-border/30">
          <div className="h-2 w-2 rounded-full bg-foreground/40 animate-pulse flex-shrink-0" />
          <span className="text-xs md:text-sm font-medium text-foreground/70 break-words">
            847 emails checked today • 0 breaches ever
          </span>
        </div>
      </div>
    </div>
  );
}
