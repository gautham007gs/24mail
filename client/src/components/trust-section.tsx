import { Lock, Shield, Check, Code2, Mail, Users, Zap } from "lucide-react";

export function TrustSection() {
  const metrics = [
    { value: "1M+", label: "Emails Generated", icon: Mail },
    { value: "150K+", label: "Active Users", icon: Users },
    { value: "99.9%", label: "Uptime", icon: Zap },
  ];

  const features = [
    { icon: Mail, title: "1M+ Emails Generated", desc: "Trusted by thousands daily" },
    { icon: Users, title: "150K+ Active Users", desc: "Active monthly" },
    { icon: Zap, title: "99.9% Uptime", desc: "Reliable delivery" },
    { icon: Check, title: "100% Free", desc: "No hidden fees, forever free" },
  ];

  const certifications = [
    { name: "GDPR Compliant", icon: Lock, description: "EU data protection" },
    { name: "SSL Encrypted", icon: Shield, description: "256-bit encryption" },
    { name: "Open Source", icon: Code2, description: "Fully transparent" },
    { name: "No Logs Policy", icon: Check, description: "Zero data retention" },
  ];

  return (
    <section className="mt-16 md:mt-20 pt-12 md:pt-16 pb-8 md:pb-12 border-t border-border/30 relative">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 md:mb-10">
          <span className="inline-block text-xs text-primary uppercase font-semibold tracking-wider rounded-full px-3 py-1.5 bg-primary/8 border border-primary/20 mb-4">
            Why Trust Us
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Proven at Scale
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Everything you need for complete privacy
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mb-12 md:mb-14">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-none w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{item.title}</div>
                  <div className="text-muted-foreground text-sm mt-0.5">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-8 md:pt-10 border-t border-border/30">
          <div className="text-center mb-6 md:mb-8">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
              Security & Compliance
            </p>
            <p className="text-sm text-muted-foreground">Industry-leading standards</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-border/60 bg-card/50 text-center transition-colors duration-200 hover:border-primary/30 hover:bg-primary/5"
                >
                  <div className="mb-2 inline-flex p-2.5 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <h4 className="font-semibold text-sm text-foreground mb-0.5">{cert.name}</h4>
                  <p className="text-xs text-muted-foreground">{cert.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
