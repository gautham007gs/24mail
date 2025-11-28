import { Newspaper, Microscope, Gift, Lock, Download, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

export function UseCasesSection() {
  const useCases = [
    {
      icon: Newspaper,
      title: "Newsletter Signups",
      description: "Sign up for newsletters and marketing emails without cluttering your real inbox"
    },
    {
      icon: Microscope,
      title: "Test Apps & Sites",
      description: "Developer and QA testing without creating permanent accounts"
    },
    {
      icon: Gift,
      title: "Free Trial Access",
      description: "Use multiple trials without getting marked as a repeat customer"
    },
    {
      icon: Lock,
      title: "Avoid Data Breaches",
      description: "If a site gets breached, your real email stays completely safe"
    },
    {
      icon: Download,
      title: "Download Files",
      description: "Get files from sketchy sites without exposing your real identity"
    },
    {
      icon: Eye,
      title: "Online Privacy",
      description: "Stay anonymous and avoid targeted ads and spam"
    }
  ];

  return (
    <section className="mt-16 md:mt-20 pt-12 md:pt-16 border-t border-border/20 fade-in-up">
      <div className="text-center mb-12 md:mb-14 space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Use Cases</h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">Protect your real inbox with disposable email for any situation</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {useCases.map((useCase, index) => {
          const IconComponent = useCase.icon;
          return (
            <Card
              key={index}
              className="p-6 md:p-7 border border-border/30 hover:border-border/60 hover:shadow-md transition-all group bg-card/40 hover:bg-card/70"
            >
              <div className="flex flex-col items-start space-y-4">
                <div className="p-3 rounded-lg bg-background/80 group-hover:bg-background transition-colors">
                  <IconComponent className="h-5 w-5 text-foreground/60" />
                </div>
                <h3 className="font-bold text-foreground text-sm md:text-base leading-tight">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{useCase.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
