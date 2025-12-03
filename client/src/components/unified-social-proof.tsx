import { useState, useEffect, useRef } from "react";
import { Mail, Users, Shield, Zap, Lock, Eye, Globe, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

interface StatItem {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel?: string;
}

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  glowColor: string;
  hoverAnimation: string;
}

function AnimatedCounter({ target, shouldAnimate }: { target: string; shouldAnimate: boolean }) {
  const [count, setCount] = useState("0");
  const numericValue = parseInt(target.replace(/[^0-9]/g, "")) || 0;

  useEffect(() => {
    if (!shouldAnimate) {
      setCount(target);
      return;
    }

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += numericValue / steps;
      if (current >= numericValue) {
        setCount(target);
        clearInterval(interval);
      } else {
        const formatted = target.includes("M") 
          ? `${current.toFixed(1)}M+`
          : target.includes("K")
          ? `${Math.round(current)}K+`
          : target.includes("%")
          ? `${Math.round(current)}%`
          : target;
        setCount(formatted);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [target, numericValue, shouldAnimate]);

  return <span>{count}</span>;
}

export function UnifiedSocialProof() {
  const { t } = useTranslation();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !shouldAnimate) {
        setShouldAnimate(true);
      }
    }, { threshold: 0.2 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldAnimate]);

  const stats: StatItem[] = [
    {
      icon: <Mail className="h-7 w-7" />,
      value: "1M+",
      label: t("social.emailsGenerated"),
      sublabel: t("social.processedDaily")
    },
    {
      icon: <Users className="h-7 w-7" />,
      value: "500K+",
      label: t("social.activeUsers"),
      sublabel: t("social.worldwide")
    },
    {
      icon: <Shield className="h-7 w-7" />,
      value: "100%",
      label: t("social.private"),
      sublabel: t("social.zeroTracking")
    }
  ];

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
    <div ref={containerRef} className="space-y-16">
      {/* Stats Section Header */}
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
          {t("social.title")}
        </h2>
        <p className="text-base md:text-lg text-muted-foreground">
          {t("social.subtitle")}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-4 max-w-4xl mx-auto">
        {stats.map((item, idx) => (
          <Card
            key={idx}
            className="group relative p-8 border border-border/30 bg-gradient-to-br from-card/80 to-card/40 hover:from-card hover:to-card/80 transition-all duration-300 text-center overflow-visible shadow-lg hover:shadow-xl"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

            <div className="space-y-4">
              <div className="flex justify-center p-4 rounded-xl bg-emerald-500/15 group-hover:bg-emerald-500/25 w-fit mx-auto ring-1 ring-emerald-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                <div className="text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)] group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.6)] transition-all duration-300">
                  {item.icon}
                </div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                  <AnimatedCounter target={item.value} shouldAnimate={shouldAnimate} />
                </div>
                <p className="text-base font-semibold text-foreground mt-2">{item.label}</p>
                {item.sublabel && (
                  <p className="text-sm text-muted-foreground mt-1">{item.sublabel}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="pt-12 border-t border-border/30">
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
              className="group relative p-6 border border-border/40 bg-gradient-to-br from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/25 hover:border-emerald-500/30 transition-all duration-300 overflow-visible"
            >
              {/* Neon glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.glowColor} rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

              <div className="space-y-4">
                {/* Icon with micro-animation */}
                <div className={`w-fit p-4 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/30 group-hover:bg-emerald-500/25 group-hover:ring-emerald-500/50 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] ${feature.hoverAnimation}`}>
                  <div className="text-emerald-400 drop-shadow-[0_0_4px_rgba(16,185,129,0.4)] group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]">
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

              {/* Corner accent */}
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-500/40 group-hover:bg-emerald-400 transition-colors" />
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="pt-12 border-t border-border/30">
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
              className="group relative p-6 border border-border/40 bg-gradient-to-br from-card/80 to-card/40 hover:border-emerald-500/30 transition-all duration-300 overflow-visible"
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-orange-400 fill-orange-400" />
                ))}
              </div>

              <blockquote className="text-foreground/90 text-sm leading-relaxed mb-4">
                "{testimonial.quote}"
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-border/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
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
