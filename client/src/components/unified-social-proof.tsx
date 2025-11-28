import { useState, useEffect, useRef } from "react";
import { Mail, Users, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel?: string;
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
      sublabel: "processed daily"
    },
    {
      icon: <Users className="h-6 w-6" />,
      value: "500K+",
      label: "Active Users",
      sublabel: "worldwide"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      value: "100%",
      label: "Private",
      sublabel: "zero tracking"
    }
  ];

  return (
    <div ref={containerRef} className="space-y-3">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 leading-tight">
          Proven at Scale
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Trusted by developers, teams, and security professionals globally
        </p>
      </div>

      {/* Mobile: Minimal inline layout | Desktop: Card layout */}
      {/* Mobile: 3 items in tight grid with just icon + number + label */}
      <div className="md:hidden">
        <div className="grid grid-cols-3 gap-2 px-2 max-w-md mx-auto">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="text-center py-3 animate-in fade-in-50 duration-500"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex justify-center mb-1.5">
                <div className="text-foreground/70">
                  {item.icon}
                </div>
              </div>
              <div className="text-xl font-bold text-foreground">
                <AnimatedCounter target={item.value} shouldAnimate={shouldAnimate} />
              </div>
              <p className="text-xs font-semibold text-foreground mt-0.5 leading-tight">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Card grid with full details */}
      <div className="hidden md:grid grid-cols-3 gap-6 px-4 max-w-3xl mx-auto">
        {stats.map((item, idx) => (
          <Card
            key={idx}
            className="p-8 border border-border/20 bg-card/30 hover:bg-card/50 transition-all group text-center animate-in fade-in-50 duration-500"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="space-y-4">
              <div className="flex justify-center p-3 rounded-lg bg-background/60 group-hover:bg-background w-fit mx-auto">
                <div className="text-foreground/70 group-hover:text-foreground transition-colors">
                  {item.icon}
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-foreground">
                  <AnimatedCounter target={item.value} shouldAnimate={shouldAnimate} />
                </div>
                <p className="text-base font-semibold text-foreground mt-2">{item.label}</p>
                {item.sublabel && (
                  <p className="text-xs text-muted-foreground mt-1">{item.sublabel}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
