import { Lock, Eye, Shield, Check, Code2, Users, Mail, Zap } from "lucide-react";

export function TrustSection() {
  const globalStats = [
    { value: "1M+", label: "Emails Generated", icon: Mail },
    { value: "150K+", label: "Active Users", icon: Users },
    { value: "99.9%", label: "Uptime", icon: Zap },
  ];

  const features = [
    { icon: Eye, title: "100% Free", desc: "No payment, no hidden fees" },
    { icon: Lock, title: "Anonymous", desc: "Zero logs, complete privacy" },
    { icon: Shield, title: "Instant", desc: "Ready in seconds, no signup" },
  ];

  const certifications = [
    { name: "GDPR", icon: Lock },
    { name: "SSL", icon: Shield },
    { name: "Open Source", icon: Code2 },
    { name: "No Logs", icon: Check },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#1b1b1b]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight">
            Why Trust Us
          </h2>
          <p className="text-gray-400 text-lg">
            Proven at Scale
          </p>
        </div>

        {/* Stats Row - Premium Style */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-16">
          {globalStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="text-center p-6 md:p-8 bg-black rounded-xl border border-[#2a2a2a]"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-[#FFA31A]/20">
                  <Icon className="h-6 w-6 text-[#FFA31A]" aria-hidden="true" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-[#FFA31A] mb-1">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="flex items-start gap-4 p-6 bg-black rounded-xl border border-[#2a2a2a]"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#FFA31A]/20">
                    <Icon className="h-6 w-6 text-[#FFA31A]" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certifications */}
        <div className="border-t border-[#2a2a2a] pt-12">
          <p className="text-center text-sm font-bold text-[#FFA31A] uppercase tracking-wider mb-8">
            Security & Compliance
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center p-6 bg-black rounded-xl border border-[#2a2a2a] text-center"
                >
                  <div className="mb-3 p-3 rounded-lg bg-[#FFA31A]/20">
                    <Icon className="h-5 w-5 text-[#FFA31A]" aria-hidden="true" />
                  </div>
                  <h4 className="font-bold text-sm text-white mb-2">{cert.name}</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-[#FFA31A]" />
                    <span className="text-xs font-semibold text-[#FFA31A] uppercase">Verified</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
