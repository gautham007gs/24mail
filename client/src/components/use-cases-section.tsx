import { Newspaper, Microscope, Gift, Lock, Download, Eye } from "lucide-react";

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
    <section className="mt-16 md:mt-20 pt-12 md:pt-16 border-t border-border/30 fade-in-up">
      <div className="text-center mb-10 md:mb-12 space-y-3">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Why Use Burner Email?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Protect your real inbox with disposable email for any situation</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {useCases.map((useCase, index) => {
          const IconComponent = useCase.icon;
          return (
            <div 
              key={index}
              className="p-5 md:p-6 rounded-lg border border-border/70 dark:border-border bg-card/60 dark:bg-card/80 hover:bg-card/90 dark:hover:bg-card/95 transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <IconComponent className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-foreground">{useCase.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{useCase.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
