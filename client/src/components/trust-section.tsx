import { Lock, Eye, Shield, CheckCircle2, Zap, Database, Check, Code2, Globe, Users, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TrustSection() {
  const trustItems = [
    {
      icon: Eye,
      title: "100% Free",
      subtitle: "No payment needed",
      details: "Forever free, no hidden charges",
      glowColor: "from-emerald-500/30 to-emerald-600/20",
      step: 1,
    },
    {
      icon: Lock,
      title: "Anonymous",
      subtitle: "Complete privacy",
      details: "We don't store your data",
      glowColor: "from-blue-500/30 to-blue-600/20",
      step: 2,
    },
    {
      icon: Shield,
      title: "Instant",
      subtitle: "Ready in seconds",
      details: "No signup required",
      glowColor: "from-purple-500/30 to-purple-600/20",
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
    <section className="mt-16 md:mt-24 pt-12 md:pt-16 pb-8 md:pb-12 -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 border-t border-border/30 relative overflow-hidden">
      {/* Subtle Background - Reduced for performance */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl" />
      </div>

      {/* Header */}
      <div className="text-center mb-8 md:mb-12 max-w-2xl mx-auto">
        <div className="inline-block mb-4 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <p className="text-sm font-bold text-emerald-400 uppercase tracking-wide">Why Trust Us</p>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          Why Trust Us
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          Proven at Scale
        </p>
      </div>

      {/* Global Stats - Clean Grid Layout */}
      <div className="relative max-w-4xl mx-auto px-4 mb-12 md:mb-16">
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

      {/* Trust Items - 2-Column Bullet List */}
      <div className="max-w-4xl mx-auto px-4 mb-12 md:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {trustItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className="flex items-start gap-4">
                {/* Icon + Checkmark */}
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/25">
                    <Icon className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                  </div>
                </div>

                {/* Text Content */}
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

      {/* Security Certifications Grid */}
      <div className="max-w-5xl mx-auto px-4 pt-8 md:pt-12 border-t border-border/30">
        <div className="text-center mb-8">
          <p className="text-center text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">
            Security & Compliance
          </p>
          <p className="text-sm text-muted-foreground">Industry-leading standards</p>
        </div>

        {/* Responsive Grid - All devices */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <Card
                key={index}
                className="group relative p-6 md:p-7 border border-border/60 bg-gradient-to-br from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/25 hover:border-emerald-500/40 shadow-xs transition-all duration-300 flex flex-col items-center text-center h-full overflow-visible"
                style={{ minHeight: '260px' }}
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
