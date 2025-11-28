import { Lock, Eye, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TrustSection() {
  const trustItems = [
    {
      icon: Eye,
      title: "No Tracking",
      isDominant: true
    },
    {
      icon: Shield,
      title: "No Data Storage",
      isDominant: false
    },
    {
      icon: Lock,
      title: "Cryptographic Security",
      isDominant: false
    }
  ];

  return (
    <section className="mt-24 md:mt-32 pt-16 md:pt-24 border-t border-border/10">
      <div className="text-center mb-16 md:mb-20 max-w-2xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
          Privacy Built In
        </h2>
        <p className="text-base md:text-lg text-muted-foreground">
          No compromises. No backdoors. Just pure privacy protection.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
        {trustItems.map((item, index) => {
          const Icon = item.icon;
          
          return (
            <Card 
              key={index}
              className={`group overflow-hidden transition-all duration-300 ${
                item.isDominant
                  ? "p-8 md:p-10 border-2 border-primary bg-gradient-to-br from-primary/8 to-primary/3 hover:from-primary/12 hover:to-primary/5 shadow-sm hover:shadow-md"
                  : "p-8 md:p-10 border border-border/30 hover:border-border/50 bg-muted/15 hover:bg-muted/25 transition-all"
              }`}
            >
              <div className="flex flex-col gap-6">
                {/* Icon */}
                <div className={`w-fit rounded-lg p-3.5 md:p-4 transition-all duration-300 ${
                  item.isDominant
                    ? "bg-primary/20"
                    : "bg-muted/40 group-hover:bg-muted/60"
                }`}>
                  <Icon className={`transition-all duration-300 ${
                    item.isDominant
                      ? "h-9 w-9 md:h-11 md:w-11 text-primary"
                      : "h-8 w-8 md:h-10 md:w-10 text-muted-foreground group-hover:text-foreground/80"
                  }`} />
                </div>

                {/* Title */}
                <h3 className={`font-bold text-lg md:text-xl transition-colors ${
                  item.isDominant
                    ? "text-primary"
                    : "text-foreground"
                }`}>
                  {item.title}
                </h3>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
