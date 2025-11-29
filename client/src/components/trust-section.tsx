import { Lock, Eye, Shield, CheckCircle2, Zap, Database, Check, Code2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export function TrustSection() {
  const { t } = useTranslation();
  const metrics = [
    { value: "1M+", label: t("trust.metric.emails"), icon: Zap },
    { value: "100K+", label: t("trust.metric.users"), icon: Database },
    { value: "99.9%", label: t("trust.metric.uptime"), icon: Shield },
  ];

  const trustItems = [
    {
      icon: Eye,
      title: t("trust.item1.title"),
      subtitle: t("trust.item1.subtitle"),
      details: t("trust.item1.details"),
      isDominant: true,
      step: 1,
    },
    {
      icon: Lock,
      title: t("trust.item2.title"),
      subtitle: t("trust.item2.subtitle"),
      details: t("trust.item2.details"),
      isDominant: false,
      step: 2,
    },
    {
      icon: Shield,
      title: t("trust.item3.title"),
      subtitle: t("trust.item3.subtitle"),
      details: t("trust.item3.details"),
      isDominant: false,
      step: 3,
    },
  ];

  const certifications = [
    { name: t("trust.gdpr"), icon: Lock, description: t("trust.gdprDesc") },
    { name: t("trust.ssl"), icon: Shield, description: t("trust.sslDesc") },
    { name: t("trust.opensource"), icon: Code2, description: t("trust.opensourceDesc") },
    { name: t("trust.nologs"), icon: Check, description: t("trust.nologsDesc") },
  ];

  return (
    <section className="mt-24 md:mt-32 pt-16 md:pt-20 pb-12 md:pb-16 -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 border-t border-border/30 bg-gradient-to-b from-muted/25 via-muted/10 to-transparent">
      {/* Header */}
      <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
        <div className="inline-block mb-4 px-3 py-1.5 rounded-full bg-emerald-100/50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/50">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">{t("trust.whyTrust")}</p>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          {t("trust.title")}
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          {t("trust.subtitle")}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto px-4 mb-12 md:mb-16">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div 
              key={index}
              className="group p-6 rounded-lg border border-emerald-200/30 dark:border-emerald-800/30 bg-gradient-to-br from-emerald-50/40 dark:from-emerald-950/20 to-transparent hover:from-emerald-100/50 dark:hover:from-emerald-900/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-100/70 dark:bg-emerald-950/50 group-hover:bg-emerald-200/70 dark:group-hover:bg-emerald-900/50 transition-colors">
                  <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                {metric.value}
              </div>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </div>
          );
        })}
      </div>

      {/* Progress Indicator - Visual Thread */}
      <div className="max-w-5xl mx-auto px-4 mb-12 md:mb-16">
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 rounded-full" />
          
          {/* Trust Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              
              return (
                <div key={index} className="group">
                  {/* Step Number - Visual Progress Indicator */}
                  <div className="flex items-start mb-4">
                    <div className="relative z-10">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-shadow">
                        {item.step}
                      </div>
                    </div>
                  </div>

                  {/* Card */}
                  <Card 
                    className={`group overflow-hidden transition-all duration-300 h-full ${
                      item.isDominant
                        ? "p-6 md:p-7 border-2 border-primary bg-gradient-to-br from-primary/12 to-primary/3 hover:from-primary/18 hover:to-primary/5 shadow-md hover:shadow-lg"
                        : "p-6 md:p-7 border border-border/40 hover:border-border/60 bg-muted/20 hover:bg-muted/35 shadow-sm hover:shadow-md transition-all"
                    }`}
                  >
                    <div className="flex flex-col gap-4 h-full">
                      {/* Icon Container */}
                      <div className={`w-fit rounded-lg p-3 md:p-3.5 transition-all duration-300 ${
                        item.isDominant
                          ? "bg-primary/25 ring-1 ring-primary/30"
                          : "bg-muted/50 group-hover:bg-muted/70 ring-1 ring-border/40 group-hover:ring-border/60"
                      }`}>
                        <Icon className={`transition-all duration-300 ${
                          item.isDominant
                            ? "h-7 w-7 md:h-8 md:w-8 text-primary"
                            : "h-7 w-7 md:h-8 md:w-8 text-muted-foreground group-hover:text-foreground/90"
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className={`font-bold text-base md:text-lg mb-1.5 transition-colors ${
                          item.isDominant
                            ? "text-primary"
                            : "text-foreground"
                        }`}>
                          {item.title}
                        </h3>

                        <p className={`text-xs md:text-sm leading-relaxed mb-3 transition-colors ${
                          item.isDominant
                            ? "text-foreground/75"
                            : "text-muted-foreground/75"
                        }`}>
                          {item.subtitle}
                        </p>

                        {/* Details */}
                        <div className="flex items-start gap-2 pt-2 border-t border-border/20">
                          <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            item.isDominant
                              ? "text-primary/70"
                              : "text-muted-foreground/50"
                          }`} />
                          <p className={`text-xs leading-relaxed ${
                            item.isDominant
                              ? "text-foreground/60"
                              : "text-muted-foreground/60"
                          }`}>
                            {item.details}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Security Certifications - Premium Redesign */}
      <div className="max-w-5xl mx-auto px-4 pt-8 md:pt-12 border-t border-border/30">
        <div className="text-center mb-8">
          <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t("trust.security")}
          </p>
          <p className="text-sm text-muted-foreground">{t("trust.standardsDesc")}</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <Card
                key={index}
                className="group p-6 border border-border/40 bg-gradient-to-br from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/25 hover:border-border/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center h-full"
              >
                {/* Icon */}
                <div className="mb-4 p-3.5 rounded-lg bg-primary/15 group-hover:bg-primary/25 ring-1 ring-primary/30 transition-all duration-300">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="font-bold text-sm md:text-base text-foreground mb-1.5">
                    {cert.name}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cert.description}
                  </p>
                </div>

                {/* Checkmark */}
                <div className="mt-4 pt-4 border-t border-border/20 w-full">
                  <CheckCircle2 className="h-4 w-4 text-primary/70 mx-auto" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
