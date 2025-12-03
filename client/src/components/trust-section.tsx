import { Lock, Eye, Shield, CheckCircle2, Zap, Database, Check, Code2, Globe, Users, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export function TrustSection() {
  const { t } = useTranslation();

  const trustItems = [
    {
      icon: Eye,
      title: t("trust.item1.title"),
      subtitle: t("trust.item1.subtitle"),
      details: t("trust.item1.details"),
      glowColor: "from-emerald-500/30 to-emerald-600/20",
      step: 1,
    },
    {
      icon: Lock,
      title: t("trust.item2.title"),
      subtitle: t("trust.item2.subtitle"),
      details: t("trust.item2.details"),
      glowColor: "from-blue-500/30 to-blue-600/20",
      step: 2,
    },
    {
      icon: Shield,
      title: t("trust.item3.title"),
      subtitle: t("trust.item3.subtitle"),
      details: t("trust.item3.details"),
      glowColor: "from-purple-500/30 to-purple-600/20",
      step: 3,
    },
  ];

  const certifications = [
    { name: t("trust.gdpr"), icon: Lock, description: t("trust.gdprDesc") },
    { name: t("trust.ssl"), icon: Shield, description: t("trust.sslDesc") },
    { name: t("trust.opensource"), icon: Code2, description: t("trust.opensourceDesc") },
    { name: t("trust.nologs"), icon: Check, description: t("trust.nologsDesc") },
  ];

  const globalStats = [
    { value: "1M+", label: t("trust.metric.emails"), icon: Mail },
    { value: "100K+", label: t("trust.metric.users"), icon: Users },
    { value: "99.9%", label: t("trust.metric.uptime"), icon: Zap },
  ];

  return (
    <section className="mt-24 md:mt-32 pt-16 md:pt-20 pb-12 md:pb-16 -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 border-t border-border/30 relative overflow-hidden">
      {/* Subtle Background - Reduced for performance */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl" />
      </div>

      {/* Header */}
      <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
        <div className="inline-block mb-4 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <p className="text-sm font-bold text-emerald-400 uppercase tracking-wide">{t("trust.whyTrust")}</p>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          {t("trust.title")}
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          {t("trust.subtitle")}
        </p>
      </div>

      {/* Global Stats - Clean Grid Layout */}
      <div className="relative max-w-4xl mx-auto px-4 mb-16 md:mb-20">
        {/* Unified Stats Grid - Mobile & Desktop */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {globalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="relative group"
              >
                <div className="relative p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors duration-300">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-emerald-500/20">
                      <Icon className="h-5 w-5 sm:h-8 sm:w-8 text-emerald-400" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-4xl lg:text-5xl font-bold text-emerald-400 mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Items Grid - Simplified */}
      <div className="max-w-5xl mx-auto px-4 mb-16 md:mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {trustItems.map((item, index) => {
            const Icon = item.icon;
            
            return (
              <div key={index} className="group relative">
                {/* Step Number */}
                <div className="flex items-start mb-4">
                  <div className="relative z-10">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-lg shadow-md">
                      {item.step}
                    </div>
                  </div>
                </div>

                {/* Card */}
                <Card 
                  className="relative group overflow-visible transition-colors duration-300 h-full p-7 md:p-8 border border-border/40 hover:border-emerald-500/30 bg-card/50 hover:bg-card/80"
                >
                  <div className="flex flex-col gap-5 h-full">
                    {/* Icon Container - Simplified */}
                    <div className="w-fit rounded-xl p-4 md:p-5 bg-emerald-500/15 ring-1 ring-emerald-500/25 group-hover:bg-emerald-500/20 transition-colors duration-300">
                      <Icon className="h-9 w-9 md:h-10 md:w-10 text-emerald-400" aria-hidden="true" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg md:text-xl mb-2 text-foreground group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-sm md:text-base leading-relaxed mb-4 text-muted-foreground">
                        {item.subtitle}
                      </p>

                      {/* Details */}
                      <div className="flex items-start gap-2 pt-3 border-t border-border/20">
                        <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-emerald-500/70" aria-hidden="true" />
                        <p className="text-sm leading-relaxed text-muted-foreground">
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

      {/* Security Certifications - Horizontal Scroll on Mobile */}
      <div className="max-w-5xl mx-auto px-4 pt-8 md:pt-12 border-t border-border/30">
        <div className="text-center mb-8">
          <p className="text-center text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">
            {t("trust.security")}
          </p>
          <p className="text-sm text-muted-foreground">{t("trust.standardsDesc")}</p>
        </div>
        
        {/* Mobile: Horizontal Scroll with snap */}
        <div className="md:hidden overflow-x-auto scrollbar-hide scroll-snap-x scroll-peek -mx-4 px-4 pb-4">
          <div className="flex gap-4 min-w-max">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <Card
                  key={index}
                  className="group relative flex-shrink-0 w-48 p-5 border border-border/40 bg-gradient-to-br from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/25 hover:border-emerald-500/30 shadow-sm transition-all duration-300 flex flex-col items-center text-center scroll-snap-start"
                >
                  <div className="mb-3 p-3 rounded-xl bg-emerald-500/15 group-hover:bg-emerald-500/20 ring-1 ring-emerald-500/20 transition-all duration-300">
                    <Icon className="h-7 w-7 text-emerald-400" aria-hidden="true" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground mb-1">{cert.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{cert.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid grid-cols-4 gap-5">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <Card
                key={index}
                className="group relative p-7 border border-border/40 bg-gradient-to-br from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/25 hover:border-emerald-500/30 shadow-sm transition-all duration-300 flex flex-col items-center text-center h-full overflow-visible"
              >
                <div className="mb-4 p-4 rounded-xl bg-emerald-500/15 group-hover:bg-emerald-500/20 ring-1 ring-emerald-500/20 transition-all duration-300">
                  <Icon className="h-8 w-8 text-emerald-400" aria-hidden="true" />
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="font-bold text-base text-foreground mb-2">{cert.name}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cert.description}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-border/20 w-full">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500/70 mx-auto" aria-hidden="true" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
