import { Copy, Mail, Inbox, Trash2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Copy,
      title: "Generate Email",
      description: "Click the button to instantly create a temporary email address. No signup required.",
    },
    {
      icon: Mail,
      title: "Use Anywhere",
      description: "Copy and paste your email on any website or app. No personal data needed.",
    },
    {
      icon: Inbox,
      title: "Receive Emails",
      description: "Emails arrive instantly in your inbox. View HTML content or plain text.",
    },
    {
      icon: Trash2,
      title: "Auto-Delete",
      description: "Your email and all messages automatically expire after 10 minutes. Complete privacy.",
    },
  ];

  return (
    <section className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
          Get a temporary email in seconds. No registration, no spam, complete anonymity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center space-y-4 p-6 rounded-lg bg-card border border-border/50 hover-elevate transition-all"
              data-testid={`step-card-${index + 1}`}
            >
              {/* Step Number */}
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <span className="text-lg font-bold text-primary">{index + 1}</span>
              </div>

              {/* Icon */}
              <div className="w-16 h-16 rounded-lg bg-muted/40 flex items-center justify-center">
                <Icon className="w-8 h-8 text-foreground/70" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Connector line (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute w-6 h-0.5 bg-primary/20 ml-32 -right-12 transform scale-x-150" />
              )}
            </div>
          );
        })}
      </div>

      {/* Feature highlights below steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-8 border-t border-border/20">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
          <div>
            <p className="font-semibold text-foreground text-sm">Instant Access</p>
            <p className="text-xs text-muted-foreground">Start using your email immediately</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
          <div>
            <p className="font-semibold text-foreground text-sm">100% Anonymous</p>
            <p className="text-xs text-muted-foreground">No personal info required</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
          <div>
            <p className="font-semibold text-foreground text-sm">Auto-Cleanup</p>
            <p className="text-xs text-muted-foreground">Emails self-destruct after expiry</p>
          </div>
        </div>
      </div>
    </section>
  );
}
