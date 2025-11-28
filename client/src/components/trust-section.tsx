import { Lock, Eye, Zap, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TrustSection() {
  const trustItems = [
    {
      icon: Eye,
      title: "No Tracking",
      subtitle: "Zero logs — we can't access your inbox.",
      isDominant: true
    },
    {
      icon: ShieldAlert,
      title: "No Data Storage",
      subtitle: "Emails auto-delete — nothing stored.",
      isDominant: false
    },
    {
      icon: Lock,
      title: "Cryptographic Security",
      subtitle: "Military-grade encryption in every request.",
      isDominant: false
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 px-4">
        {trustItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <Card 
              key={index}
              className={`group overflow-hidden transition-all duration-300 ${
                item.isDominant
                  ? "p-7 md:p-8 border-2 border-primary bg-primary/8 hover:bg-primary/12 shadow-md hover:shadow-lg"
                  : "p-6 md:p-7 border border-border/30 hover:border-border/50 bg-muted/20 hover:bg-muted/30"
              }`}
            >
              <div className="flex flex-col h-full gap-4 md:gap-5">
                {/* Icon Container */}
                <div className={`rounded-lg w-fit p-3.5 md:p-4 transition-all duration-300 ${
                  item.isDominant
                    ? "bg-primary/15 group-hover:bg-primary/20"
                    : "bg-muted/40 group-hover:bg-muted/60"
                }`}>
                  <Icon className={`transition-all duration-300 ${
                    item.isDominant
                      ? "h-9 w-9 md:h-10 md:w-10 text-primary"
                      : "h-7 w-7 md:h-8 md:w-8 text-muted-foreground group-hover:text-foreground/80"
                  }`} />
                </div>

                {/* Content */}
                <div>
                  <h3 className={`font-bold text-base md:text-lg mb-2 transition-colors ${
                    item.isDominant
                      ? "text-primary"
                      : "text-foreground"
                  }`}>
                    {item.title}
                  </h3>
                  
                  {/* Explanatory Subtitle - Key Proof Point */}
                  <p className={`text-sm leading-relaxed transition-colors ${
                    item.isDominant
                      ? "text-foreground/85"
                      : "text-muted-foreground/80"
                  }`}>
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
