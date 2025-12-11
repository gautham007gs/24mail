import { useRef } from "react";
import { Shield, Zap, Lock, Globe, Star } from "@/lib/icons";
import { Card } from "@/components/ui/card";

export function UnifiedSocialProof() {
  const containerRef = useRef<HTMLDivElement>(null);

  const features = [
    { icon: Shield, title: "Privacy Shield", desc: "Military-grade encryption" },
    { icon: Lock, title: "Zero Tracking", desc: "No cookies, no logs" },
    { icon: Zap, title: "Instant Setup", desc: "Ready in seconds" },
    { icon: Globe, title: "Open Source", desc: "Fully transparent code" },
  ];

  const testimonials = [
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
  ];

  return (
    <div ref={containerRef} className="space-y-12 md:space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Why Choose Burner Email
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Trusted by developers globally
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/8 ring-1 ring-primary/20">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-10 md:pt-12 border-t border-border/30">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            What Users Say
          </h3>
          <p className="text-muted-foreground text-sm">
            Join thousands of satisfied users worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-4xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <Card
              key={idx}
              className="p-5 border border-border/50 bg-card/60 hover:border-primary/25 transition-colors duration-200 overflow-visible"
            >
              <div className="flex gap-0.5 mb-3" role="img" aria-label={`Rating: ${testimonial.rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
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

              <div className="flex items-center gap-2.5 pt-3 border-t border-border/30">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold text-xs" aria-hidden="true">
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
