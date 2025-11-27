import { Lock, Eye, Zap, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TrustSection() {
  const trustItems = [
    {
      icon: <Eye className="h-6 w-6 text-accent" />,
      title: "No Tracking",
      description: "We never track your activity. Your privacy is sacred."
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-accent" />,
      title: "No Logs",
      description: "Zero email logs stored. Everything expires automatically."
    },
    {
      icon: <Zap className="h-6 w-6 text-accent" />,
      title: "No Sign-up",
      description: "Start instantly. No registration needed. Never."
    },
    {
      icon: <Lock className="h-6 w-6 text-accent" />,
      title: "Secure Random Generation",
      description: "Cryptographically random emails you can trust completely."
    }
  ];

  return (
    <section className="mt-16 md:mt-20 pt-10 md:pt-12 border-t border-border/30 fade-in">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Why Trust Us? 🔥
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Privacy isn't a feature—it's our commitment to you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {trustItems.map((item, index) => (
          <Card 
            key={index}
            className="p-6 border-2 border-accent/20 hover:border-accent/40 hover:shadow-lg transition-all duration-300 group trust-card shadow-sm"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-bold text-foreground text-sm md:text-base">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
