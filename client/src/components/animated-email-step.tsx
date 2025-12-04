
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, Copy, Mail } from "lucide-react";

interface AnimatedEmailStepProps {
  step: string;
  title: string;
  description: string;
  delay: number;
  shouldAnimate?: boolean;
}

export function AnimatedEmailStep({ step, title, description, delay, shouldAnimate = false }: AnimatedEmailStepProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setShow(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate, delay]);

  const icons = {
    "1": Sparkles,
    "2": Copy,
    "3": Mail,
  };

  const IconComponent = icons[step as keyof typeof icons] || Sparkles;

  return (
    <Card
      className={`p-6 md:p-7 border border-border/20 bg-card/30 transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <IconComponent className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="font-bold text-base text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </Card>
  );
}
