import { Lock, Eye, Shield } from "lucide-react";
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
      icon: Shield,
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
    <section className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-border/30">
      <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Privacy Built In
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          No compromises. No backdoors. Just pure privacy protection.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 max-w-5xl mx-auto px-4">
        {trustItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <Card 
              key={index}
              className={`group overflow-hidden transition-all duration-300 ${
                item.isDominant
                  ? "p-6 md:p-7 border-2 border-primary bg-gradient-to-br from-primary/8 to-primary/3 hover:from-primary/12 hover:to-primary/5 shadow-sm hover:shadow-md"
                  : "p-6 md:p-7 border border-border/30 hover:border-border/50 bg-muted/15 hover:bg-muted/25 transition-all"
              }`}
            >
              <div className="flex flex-col gap-4">
                {/* Icon */}
                <div className={`w-fit rounded-lg p-3 md:p-3.5 transition-all duration-300 ${
                  item.isDominant
                    ? "bg-primary/20"
                    : "bg-muted/40 group-hover:bg-muted/60"
                }`}>
                  <Icon className={`transition-all duration-300 ${
                    item.isDominant
                      ? "h-6 w-6 md:h-7 md:w-7 text-primary"
                      : "h-6 w-6 md:h-7 md:w-7 text-muted-foreground group-hover:text-foreground/80"
                  }`} />
                </div>

                {/* Title */}
                <div>
                  <h3 className={`font-bold text-base md:text-lg mb-1.5 transition-colors ${
                    item.isDominant
                      ? "text-primary"
                      : "text-foreground"
                  }`}>
                    {item.title}
                  </h3>

                  {/* One-line subtitle explanation */}
                  <p className={`text-xs md:text-sm leading-relaxed transition-colors ${
                    item.isDominant
                      ? "text-foreground/75"
                      : "text-muted-foreground/75"
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
