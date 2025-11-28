import { Lock, Eye, Zap, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TrustSection() {
  const trustItems = [
    {
      icon: <Eye className="h-7 w-7" />,
      title: "No Tracking",
      description: "We never log your activity. Complete privacy guaranteed."
    },
    {
      icon: <ShieldAlert className="h-7 w-7" />,
      title: "No Data Storage",
      description: "Emails auto-delete. Zero logs kept. Ever."
    },
    {
      icon: <Zap className="h-7 w-7" />,
      title: "Instant Setup",
      description: "No signup. No forms. Start immediately."
    },
    {
      icon: <Lock className="h-7 w-7" />,
      title: "Cryptographic Security",
      description: "Military-grade random email generation."
    }
  ];

  return (
    <section className="mt-20 md:mt-24 pt-16 md:pt-20 border-t border-border/10">
      <div className="text-center mb-14 md:mb-16 max-w-2xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
          Privacy Built In
        </h2>
        <p className="text-base md:text-lg text-muted-foreground">
          No compromises. No backdoors. Just pure privacy protection.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 px-4">
        {trustItems.map((item, index) => (
          <Card 
            key={index}
            className="p-7 md:p-8 border border-border/20 hover:border-border/40 bg-card/30 hover:bg-card/50 transition-all duration-300 group"
          >
            <div className="flex flex-col h-full gap-5">
              <div className="p-3.5 rounded-lg bg-background/60 group-hover:bg-background w-fit">
                <div className="text-foreground/70 group-hover:text-foreground transition-colors">
                  {item.icon}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
