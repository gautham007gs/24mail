import { Newspaper, Microscope, Gift, Lock, Download, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

export function UseCasesSection() {
  const useCases = [
    {
      icon: Newspaper,
      title: "Newsletter Signups",
      description: "Unsubscribe anytime. Keep your real inbox clean from marketing emails.",
    },
    {
      icon: Microscope,
      title: "App Testing",
      description: "Test multiple instances without fake account restrictions.",
    },
    {
      icon: Gift,
      title: "Free Trials",
      description: "Stack unlimited trials without repeat customer flags.",
    },
    {
      icon: Lock,
      title: "Data Breach Protection",
      description: "If the site leaks, your real email stays completely safe.",
    },
    {
      icon: Download,
      title: "Untrusted Downloads",
      description: "Grab files from sketchy sites without identity exposure.",
    },
    {
      icon: Eye,
      title: "Ad Privacy",
      description: "Avoid targeted ads and behavioral tracking networks.",
    }
  ];

  return (
    <section className="mt-20 md:mt-24 pt-16 md:pt-20 border-t border-border/10">
      <div className="text-center mb-14 md:mb-16 max-w-2xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
          Built For Every Situation
        </h2>
        <p className="text-base md:text-lg text-muted-foreground">
          From newsletters to testing—protect your inbox in every scenario.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 px-4">
        {useCases.map((useCase, index) => {
          const IconComponent = useCase.icon;
          return (
            <Card
              key={index}
              className="p-7 md:p-8 border border-border/20 hover:border-border/40 bg-card/30 hover:bg-card/50 transition-all duration-300 group"
            >
              <div className="flex flex-col h-full gap-5">
                <div className="p-3.5 rounded-lg bg-background/60 group-hover:bg-background w-fit">
                  <IconComponent className="h-7 w-7 text-foreground/70 group-hover:text-foreground transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground mb-2">{useCase.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{useCase.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
