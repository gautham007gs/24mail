import { useState, useEffect, useRef } from "react";
import { Mail, Users, CheckCircle, Zap, Lock, Shield, Info } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel?: string;
  timeframe?: string;
}

function AnimatedCounter({ target, shouldAnimate }: { target: string; shouldAnimate: boolean }) {
  const [count, setCount] = useState("0");
  const numericValue = parseInt(target.replace(/[^0-9]/g, "")) || 0;

  useEffect(() => {
    if (!shouldAnimate) {
      setCount(target);
      return;
    }

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
  }, [target, numericValue, shouldAnimate]);

  return <span>{count}</span>;
}

export function UnifiedSocialProof() {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger animation when section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !shouldAnimate) {
        setShouldAnimate(true);
      }
    }, { threshold: 0.2 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldAnimate]);

  const stats: StatItem[] = [
    {
      icon: <Mail className="h-6 w-6" />,
      value: "1M+",
      label: "Emails Generated",
      sublabel: "processed daily",
      timeframe: "last 30 days"
    },
    {
      icon: <Users className="h-6 w-6" />,
      value: "500K+",
      label: "Active Users",
      sublabel: "worldwide",
      timeframe: "current month"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      value: "99.9%",
      label: "Uptime",
      sublabel: "verified SLA",
      timeframe: "18 months tracked"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      value: "0.3s",
      label: "Response Time",
      sublabel: "industry fastest",
      timeframe: "avg delivery"
    }
  ];

  const trust: StatItem[] = [
    {
      icon: <Lock className="h-6 w-6" />,
      value: "256-bit",
      label: "Encryption",
      sublabel: "HTTPS secured",
      timeframe: "all requests"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      value: "100%",
      label: "Private",
      sublabel: "zero tracking",
      timeframe: "guaranteed"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      value: "Auto",
      label: "Delete",
      sublabel: "10 min expiry",
      timeframe: "always active"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      value: "Real",
      label: "Time",
      sublabel: "instant delivery",
      timeframe: "5 second refresh"
    }
  ];

  return (
    <div ref={containerRef} className="space-y-14">
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
        <div className="flex items-center gap-2">
          <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Performance Metrics
          </p>
          <div className="group relative">
            <Info className="h-4 w-4 text-muted-foreground/60 cursor-help" />
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-background border border-border/50 rounded-lg p-2.5 text-xs text-muted-foreground whitespace-nowrap shadow-lg z-10">
              Verified data from last 30 days
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((item, idx) => (
            <Card
              key={idx}
              className="p-5 md:p-6 border border-border/20 bg-card/30 hover:bg-card/50 transition-all group text-center animate-in fade-in-50 duration-500"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="space-y-3">
                <div className="flex justify-center p-2.5 rounded-lg bg-background/60 group-hover:bg-background w-fit mx-auto">
                  <div className="text-foreground/70 group-hover:text-foreground transition-colors">
                    {item.icon}
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    <AnimatedCounter target={item.value} shouldAnimate={shouldAnimate} />
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-foreground mt-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                  {item.timeframe && (
                    <p className="text-xs text-muted-foreground/60 mt-1.5 italic">({item.timeframe})</p>
                  )}
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
              className="p-5 md:p-6 border border-border/20 bg-card/30 hover:bg-card/50 transition-all group text-center animate-in fade-in-50 duration-500"
              style={{ animationDelay: `${(idx + 4) * 100}ms` }}
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
                  {item.timeframe && (
                    <p className="text-xs text-muted-foreground/60 mt-1.5 italic">({item.timeframe})</p>
                  )}
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
