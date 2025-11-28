import { Lock, Eye, Zap, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TrustSection() {
  const trustItems = [
    {
      icon: <Eye className="h-6 w-6 text-foreground/60" />,
      title: "No Tracking",
      description: "We never track your activity. Your privacy is sacred."
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-foreground/60" />,
      title: "No Logs",
      description: "Zero email logs stored. Everything expires automatically."
    },
    {
      icon: <Zap className="h-6 w-6 text-foreground/60" />,
      title: "No Sign-up",
      description: "Start instantly. No registration needed. Never."
    },
    {
      icon: <Lock className="h-6 w-6 text-foreground/60" />,
      title: "Secure Random Generation",
      description: "Cryptographically random emails you can trust completely."
    }
  ];

  return (
    <section className="mt-16 md:mt-20 pt-12 md:pt-16 border-t border-border/20 fade-in">
      <div className="text-center mb-12 md:mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Why Trust Us?
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Privacy isn't a feature—it's our core commitment. Built on principles of complete transparency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {trustItems.map((item, index) => (
          <Card 
            key={index}
            className="p-6 md:p-7 border border-border/30 hover:border-border/60 hover:shadow-md transition-all duration-300 group bg-card/40 hover:bg-card/70"
          >
            <div className="flex flex-col items-start space-y-4">
              <div className="p-3 rounded-lg bg-background/80 group-hover:bg-background transition-colors">
                {item.icon}
              </div>
              <h3 className="font-bold text-foreground text-sm md:text-base leading-tight">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
