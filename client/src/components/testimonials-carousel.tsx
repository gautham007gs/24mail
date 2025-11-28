import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { testimonials } from "@/lib/trust-data";

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!autoPlay || isHovered) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [autoPlay, isHovered]);

  const slideAnnouncementId = `testimonial-slide-${current}`;
  const testimonial = testimonials[current];
  const nextTestimonial = testimonials[(current + 1) % testimonials.length];

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoPlay(false);
  };

  const goToSlide = (idx: number) => {
    setCurrent(idx);
    setAutoPlay(false);
  };

  return (
    <div 
      className="w-full space-y-6 px-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Desktop: Show 2 testimonials side-by-side */}
      <div className="hidden lg:grid grid-cols-2 gap-6 px-0">
        <Card 
          className="p-8 md:p-10 border border-border/20 bg-card/30 hover:bg-card/50 relative overflow-hidden transition-all"
          role="region"
          aria-label="Current user testimonial"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="absolute top-0 right-0 opacity-10">
            <Quote className="h-40 w-40 text-foreground/20" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-foreground/40 text-foreground/40"
                  data-testid={`star-current-${i}`}
                />
              ))}
            </div>

            <blockquote className="text-base md:text-lg text-foreground italic font-medium leading-relaxed">
              "{testimonial.quote}"
            </blockquote>

            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 rounded-full bg-gradient-to-br ${testimonial.bgColor} flex items-center justify-center flex-shrink-0`}
                data-testid={`avatar-current-${testimonial.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className="text-white font-bold text-xs">{testimonial.avatar}</span>
              </div>
              <div>
                <p className="font-bold text-foreground text-sm" data-testid={`name-current-${testimonial.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  {testimonial.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/20">
            <p className="text-xs text-muted-foreground text-center">
              {current + 1} of {testimonials.length}
            </p>
          </div>
        </Card>

        <Card 
          className="p-8 md:p-10 border border-border/20 bg-card/30 hover:bg-card/50 relative overflow-hidden opacity-60 hover:opacity-100 transition-all cursor-pointer"
          onClick={next}
          role="button"
          aria-label={`Next testimonial from ${nextTestimonial.name}`}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && next()}
        >
          <div className="absolute top-0 right-0 opacity-10">
            <Quote className="h-40 w-40 text-foreground/20" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-foreground/40 text-foreground/40"
                  data-testid={`star-next-${i}`}
                />
              ))}
            </div>

            <blockquote className="text-base md:text-lg text-foreground italic font-medium leading-relaxed line-clamp-3">
              "{nextTestimonial.quote}"
            </blockquote>

            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 rounded-full bg-gradient-to-br ${nextTestimonial.bgColor} flex items-center justify-center flex-shrink-0`}
                data-testid={`avatar-next-${nextTestimonial.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className="text-white font-bold text-xs">{nextTestimonial.avatar}</span>
              </div>
              <div>
                <p className="font-bold text-foreground text-sm" data-testid={`name-next-${nextTestimonial.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  {nextTestimonial.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {nextTestimonial.role}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/20">
            <p className="text-xs text-muted-foreground text-center">Click to view</p>
          </div>
        </Card>
      </div>

      {/* Mobile/Tablet: Full-width single testimonial */}
      <Card 
        className="lg:hidden p-6 sm:p-8 md:p-10 border border-border/20 bg-card/30 relative overflow-hidden"
        role="region"
        aria-label="User testimonials carousel"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <Quote className="h-40 w-40 text-foreground/20" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-foreground/40 text-foreground/40"
                data-testid={`star-${i}`}
              />
            ))}
          </div>

          <blockquote className="text-base sm:text-lg text-foreground italic font-medium leading-relaxed">
            "{testimonial.quote}"
          </blockquote>

          <div className="flex items-center gap-3">
            <div
              className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br ${testimonial.bgColor} flex items-center justify-center flex-shrink-0`}
              data-testid={`avatar-${testimonial.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-foreground text-sm sm:text-base truncate" data-testid={`name-${testimonial.name.toLowerCase().replace(/\s+/g, '-')}`}>
                {testimonial.name}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {testimonial.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 gap-3" role="group" aria-label="Testimonial controls">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            data-testid="button-prev-testimonial"
            className="h-9 w-9 flex-shrink-0"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex gap-2 justify-center" role="group" aria-label="Testimonial selector">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === current 
                    ? 'bg-foreground/60 w-3 h-3' 
                    : 'bg-foreground/20 w-2 h-2'
                }`}
                data-testid={`dot-${idx}`}
                aria-label={`Go to testimonial ${idx + 1}`}
                aria-current={idx === current ? "page" : "false"}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={next}
            data-testid="button-next-testimonial"
            className="h-9 w-9 flex-shrink-0"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs font-medium text-foreground/60" id={slideAnnouncementId}>
            {current + 1} of {testimonials.length}
          </p>
        </div>
      </Card>
    </div>
  );
}
