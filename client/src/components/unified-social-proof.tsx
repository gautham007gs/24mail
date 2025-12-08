import { useRef } from "react";
import { Shield, Zap, Lock, Eye, Globe, Star } from "@/lib/icons";
import { Card } from "@/components/ui/card";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  glowColor: string;
  hoverAnimation: string;
}

export function UnifiedSocialProof() {
  const containerRef = useRef<HTMLDivElement>(null);

  const features: FeatureItem[] = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Privacy Shield",
      description: "Military-grade encryption protects your identity",
      glowColor: "from-emerald-500/30 to-emerald-600/20",
      hoverAnimation: "group-hover:rotate-3 transition-transform duration-300",
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Zero Tracking",
      description: "No cookies, no logs, no traces left behind",
      glowColor: "from-blue-500/30 to-blue-600/20",
      hoverAnimation: "group-hover:animate-shake",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Setup",
      description: "Get your email in under 3 seconds",
      glowColor: "from-orange-500/30 to-orange-600/20",
      hoverAnimation: "group-hover:scale-110 transition-transform duration-300",
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Open Source",
      description: "Fully transparent and auditable code",
      glowColor: "from-purple-500/30 to-purple-600/20",
      hoverAnimation: "group-hover:animate-pulse",
    },
  ];

  return (
    <div ref={containerRef} className="space-y-12">
      {/* Section Header - Merged stats removed to avoid duplication with TrustSection */}
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
          Proven at Scale
        </h2>
        <p className="text-base md:text-lg text-muted-foreground">
          Trusted by developers globally
        </p>
      </div>

      {/* Features Section - Simplified */}
      <div className="pt-8">
        <div className="text-center max-w-2xl mx-auto px-4 mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Why Choose Burner Email?
          </h3>
          <p className="text-muted-foreground">
            Premium features designed for privacy-conscious users
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-4 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="group relative p-6 border border-border/40 bg-gradient-to-br from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/25 hover:border-emerald-500/30 transition-colors duration-300 overflow-visible"
              style={{ minHeight: '200px' }}
            >
              <div className="space-y-4">
                {/* Icon - Simplified without excessive glow */}
                <div className="w-fit p-4 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/25 group-hover:bg-emerald-500/20 transition-colors duration-300">
                  <div className="text-emerald-400" aria-hidden="true">
                    {feature.icon}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg text-foreground group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials Section - Simplified */}
      <div className="pt-10 border-t border-border/30">
        <div className="text-center max-w-2xl mx-auto px-4 mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            What Users Say
          </h3>
          <p className="text-muted-foreground">
            Join thousands of satisfied users worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 max-w-5xl mx-auto">
          {[
            {
              quote: "Finally, a temp mail service that actually works. Fast, reliable, and truly private.",
              author: "Alex M.",
              role: "Developer",
              rating: 5,
            },
            {
              quote: "I use this daily for signing up to newsletters. No more spam in my real inbox!",
              author: "Sarah K.",
              role: "Content Creator",
              rating: 5,
            },
            {
              quote: "The best disposable email service I've found. Clean interface and instant delivery.",
              author: "Mike R.",
              role: "Privacy Advocate",
              rating: 5,
            },
          ].map((testimonial, idx) => (
            <Card
              key={idx}
              className="group relative p-6 border border-border/40 bg-gradient-to-br from-card/80 to-card/40 hover:border-emerald-500/30 transition-colors duration-300 overflow-visible"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4" role="img" aria-label={`Rating: ${testimonial.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>

              <blockquote className="text-foreground/90 text-sm leading-relaxed mb-4">
                "{testimonial.quote}"
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-border/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/25 to-emerald-600/15 flex items-center justify-center text-emerald-400 font-bold text-sm" aria-hidden="true">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
