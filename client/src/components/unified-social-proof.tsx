import { useState, useEffect } from "react";
import { Mail, Users, CheckCircle, Zap, Lock, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel?: string;
}

function AnimatedCounter({ target }: { target: string }) {
  const [count, setCount] = useState("0");
  const numericValue = parseInt(target.replace(/[^0-9]/g, "")) || 0;

  useEffect(() => {
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
        const formatted = target.includes("M") 
          ? `${current.toFixed(1)}M+`
          : target.includes("K")
          ? `${Math.round(current)}K+`
          : target.includes("%")
          ? `${Math.round(current)}%`
          : target.includes("s")
          ? `${current.toFixed(1)}s`
          : target;
        setCount(formatted);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [target, numericValue]);

  return <span>{count}</span>;
}

export function UnifiedSocialProof() {
  const stats: StatItem[] = [
    {
      icon: <Mail className="h-6 w-6" />,
      value: "1M+",
      label: "Emails Generated",
      sublabel: "daily growth"
    },
    {
      icon: <Users className="h-6 w-6" />,
      value: "500K+",
      label: "Active Users",
      sublabel: "worldwide"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      value: "99.9%",
      label: "Uptime",
      sublabel: "18 months"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      value: "0.3s",
      label: "Response Time",
      sublabel: "industry fastest"
    }
  ];

  const trust: StatItem[] = [
    {
      icon: <Lock className="h-6 w-6" />,
      value: "256-bit",
      label: "Encryption",
      sublabel: "HTTPS secured"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      value: "100%",
      label: "Private",
      sublabel: "zero tracking"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      value: "Auto",
      label: "Delete",
      sublabel: "10 min expiry"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      value: "Real",
      label: "Time",
      sublabel: "instant delivery"
    }
  ];

  return (
    <div className="space-y-14">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
          Trusted at Scale
        </h2>
        <p className="text-base md:text-lg text-muted-foreground">
          Millions of emails processed. Zero compromises on privacy.
        </p>
      </div>

      {/* Stats Section */}
      <div className="space-y-4 px-4">
        <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          Performance Metrics
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((item, idx) => (
            <Card
              key={idx}
              className="p-5 md:p-6 border border-border/20 bg-card/30 hover:bg-card/50 transition-all group text-center"
            >
              <div className="space-y-3">
                <div className="flex justify-center p-2.5 rounded-lg bg-background/60 group-hover:bg-background w-fit mx-auto">
                  <div className="text-foreground/70 group-hover:text-foreground transition-colors">
                    {item.icon}
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    <AnimatedCounter target={item.value} />
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-foreground mt-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="space-y-4 px-4">
        <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          Security & Trust
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {trust.map((item, idx) => (
            <Card
              key={idx}
              className="p-5 md:p-6 border border-border/20 bg-card/30 hover:bg-card/50 transition-all group text-center"
            >
              <div className="space-y-3">
                <div className="flex justify-center p-2.5 rounded-lg bg-background/60 group-hover:bg-background w-fit mx-auto">
                  <div className="text-foreground/70 group-hover:text-foreground transition-colors">
                    {item.icon}
                  </div>
                </div>
                <div>
                  <p className="text-sm md:text-base font-bold text-foreground">{item.value}</p>
                  <p className="text-xs md:text-sm font-semibold text-foreground mt-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Live Badge */}
      <div className="flex justify-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-background/40 border border-border/20">
          <div className="h-2 w-2 rounded-full bg-foreground/40 animate-pulse" />
          <span className="text-xs md:text-sm font-medium text-foreground/70">
            2,847 emails processed today • 0 breaches ever
          </span>
        </div>
      </div>
    </div>
  );
}
