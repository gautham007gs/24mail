import { Zap, Copy, InboxIcon } from "lucide-react";
import { AnimatedDemo } from "./animated-demo";

export function HowItWorks() {
  const steps = [
    {
      icon: Zap,
      title: "Generate",
      description: "Click to create an instant temporary email address.",
    },
    {
      icon: Copy,
      title: "Copy",
      description: "Paste your email anywhere online.",
    },
    {
      icon: InboxIcon,
      title: "Receive",
      description: "Emails arrive instantly in your inbox.",
    },
  ];

  return (
    <section className="space-y-12 md:space-y-16">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">How It Works</h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
          Three simple steps to complete privacy.
        </p>
      </div>

      {/* Animated Demo */}
      <div className="flex justify-center">
        <AnimatedDemo />
      </div>

      {/* 3-Step Horizontal Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4"
              data-testid={`step-card-${index + 1}`}
            >
              {/* Step Number Badge */}
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/15 border-2 border-primary/30">
                <span className="text-2xl font-bold text-primary">{index + 1}</span>
              </div>

              {/* Icon */}
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <div className="space-y-2 max-w-xs">
                <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
