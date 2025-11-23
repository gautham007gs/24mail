import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface StatItem {
  value: string;
  label: string;
  suffix: string;
}

const stats: StatItem[] = [
  {
    value: "1M+",
    label: "Emails Generated",
    suffix: "daily",
  },
  {
    value: "500K+",
    label: "Active Users",
    suffix: "monthly",
  },
  {
    value: "99.9%",
    label: "Uptime SLA",
    suffix: "guaranteed",
  },
  {
    value: "0.3s",
    label: "Response Time",
    suffix: "avg delivery",
  },
];

// Animated number counter
function AnimatedCounter({ target }: { target: string }) {
  const [count, setCount] = useState("0");
  const isPercentage = target.includes("%");
  const isTime = target.includes("s");
  
  // Extract numeric value
  const numericValue = parseInt(target.replace(/[^0-9]/g, "")) || 0;

  useEffect(() => {
    if (isPercentage || isTime) {
      // For percentages and time, just animate to the value
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
      // For millions, count up to the value
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
      // For thousands, count up to the value
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

export function StatsCounter() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="p-6 text-center hover-elevate transition-all neomorphic"
          data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <div
            className="text-3xl md:text-4xl font-bold text-primary mb-2"
            data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <AnimatedCounter target={stat.value} />
          </div>
          <p
            className="text-sm font-semibold text-foreground mb-1"
            data-testid={`stat-label-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {stat.label}
          </p>
          <p className="text-xs text-muted-foreground">{stat.suffix}</p>
        </Card>
      ))}
    </div>
  );
}
