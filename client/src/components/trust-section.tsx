import { Lock, Eye, Shield, CheckCircle2, Zap, Check, Code2, Users, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TrustSection() {
  const trustItems = [
    {
      icon: Eye,
      title: "100% Free",
      subtitle: "No payment needed",
      details: "Forever free, no hidden charges",
      step: 1,
    },
    {
      icon: Lock,
      title: "Anonymous",
      subtitle: "Complete privacy",
      details: "We don't store your data",
      step: 2,
    },
    {
      icon: Shield,
      title: "Instant",
      subtitle: "Ready in seconds",
      details: "No signup required",
      step: 3,
    },
  ];

  const certifications = [
    { name: "GDPR Compliant", icon: Lock, description: "EU data protection" },
    { name: "SSL Encrypted", icon: Shield, description: "256-bit encryption" },
    { name: "Open Source", icon: Code2, description: "Fully transparent" },
    { name: "No Logs Policy", icon: Check, description: "Zero data retention" },
  ];

  const globalStats = [
    { value: "1M+", label: "Emails Generated", icon: Mail },
    { value: "150K+", label: "Active Users", icon: Users },
    { value: "99.9%", label: "Uptime", icon: Zap },
  ];

  return (
    <section className="mt-16 md:mt-24 pt-10 md:pt-12 pb-6 md:pb-10 -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 border-t border-border/30 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl" />
      </div>

      <div className="text-center mb-6 md:mb-10 max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" />
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
          Why Trust Us
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          Proven at Scale
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 mb-10 md:mb-12">
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {globalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="relative group"
              >
                <div className="relative p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-orange-500/25 bg-orange-500/5 hover:bg-orange-500/10 transition-all duration-300 shadow-md dark:shadow-lg shadow-black/5 dark:shadow-black/20">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-orange-500/20">
                      <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-orange-500 dark:text-orange-400" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="text-xl sm:text-4xl lg:text-5xl font-bold text-orange-500 dark:text-orange-400 mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mb-10 md:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {trustItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-500/15 ring-1 ring-orange-500/25">
                    <Icon className="h-5 w-5 text-orange-500 dark:text-orange-400" aria-hidden="true" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base md:text-lg text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mb-10 md:mb-12">
        <div className="text-center mb-8">
          <p className="text-center text-sm font-bold text-orange-500 dark:text-orange-400 uppercase tracking-wider mb-2">
            Why You'll Love Burner Email
          </p>
          <p className="text-sm text-muted-foreground">Everything you need for complete privacy</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[
            { icon: Check, text: "1M+ Emails Generated" },
            { icon: Check, text: "150K+ Active Users" },
            { icon: Check, text: "99.9% Uptime" },
            { icon: Check, text: "100% Free — No hidden fees" },
            { icon: Check, text: "Full Privacy — Zero logs" },
            { icon: Check, text: "Instant Setup — Ready in seconds" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-orange-500/15 ring-1 ring-orange-500/25">
                    <Icon className="h-5 w-5 text-orange-500 dark:text-orange-400" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base md:text-lg text-foreground">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-6 md:pt-10 border-t border-border/30">
        <div className="text-center mb-8">
          <p className="text-center text-sm font-bold text-orange-500 dark:text-orange-400 uppercase tracking-wider mb-2">
            Security & Compliance
          </p>
          <p className="text-sm text-muted-foreground">Industry-leading standards</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <Card
                key={index}
                className="group relative p-4 md:p-5 border border-orange-500/25 bg-orange-500/5 hover:bg-orange-500/10 transition-all duration-300 flex flex-col items-center text-center h-full overflow-visible shadow-md dark:shadow-lg shadow-black/5 dark:shadow-black/20"
                style={{ minHeight: '200px' }}
              >
                <div className="mb-3 p-3 rounded-lg bg-orange-500/20 group-hover:bg-orange-500/30 ring-1 ring-orange-500/30 transition-all duration-300">
                  <Icon className="h-5 w-5 text-orange-500 dark:text-orange-400" aria-hidden="true" />
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="font-bold text-sm md:text-base text-foreground mb-1">{cert.name}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{cert.description}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-border/20 w-full">
                  <CheckCircle2 className="h-4 w-4 text-orange-500 dark:text-orange-400 mx-auto" aria-hidden="true" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
