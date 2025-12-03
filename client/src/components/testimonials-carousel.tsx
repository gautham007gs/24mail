import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, Star, ArrowRight } from "lucide-react";
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
        {/* Current Testimonial */}
        <Card 
          className="p-8 md:p-10 border border-border/20 bg-card/40 hover:bg-card/60 relative overflow-hidden transition-all"
          role="region"
          aria-label="Current user testimonial"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="absolute -top-4 -right-4 opacity-10">
            <Quote className="h-48 w-48 text-foreground" />
          </div>

          <div className="relative z-10 space-y-5">
            {/* Stars */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-foreground/50 text-foreground/50"
                  data-testid={`star-current-${i}`}
                />
              ))}
            </div>

            {/* Quote - Normal weight, high contrast */}
            <blockquote className="text-base md:text-lg text-foreground font-normal leading-relaxed">
              {testimonial.quote}
            </blockquote>

            {/* Use-case badge */}
            <div className="inline-block">
              <span className="px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-xs font-medium text-primary">
                {testimonial.useCase}
              </span>
            </div>

            {/* Author info */}
            <div className="flex items-center gap-4 pt-2">
              <div
                className={`h-14 w-14 rounded-full bg-gradient-to-br ${testimonial.bgColor} flex items-center justify-center flex-shrink-0 shadow-md`}
                data-testid={`avatar-current-${testimonial.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground text-sm" data-testid={`name-current-${testimonial.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  {testimonial.name}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {testimonial.role}
                </p>
                <p className="text-xs text-muted-foreground/70 font-medium">
                  {testimonial.company}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/20">
            <p className="text-xs font-medium text-muted-foreground/60 text-center">
              {current + 1} of {testimonials.length}
            </p>
          </div>
        </Card>

        {/* Next Testimonial Preview */}
        <Card 
          className="p-8 md:p-10 border border-border/20 bg-card/40 hover:bg-card/60 relative overflow-hidden opacity-60 hover:opacity-100 transition-all cursor-pointer group"
          onClick={next}
          role="button"
          aria-label={`Next testimonial from ${nextTestimonial.name}`}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && next()}
        >
          <div className="absolute -top-4 -right-4 opacity-10">
            <Quote className="h-48 w-48 text-foreground" />
          </div>

          <div className="relative z-10 space-y-5">
            {/* Stars */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-foreground/50 text-foreground/50"
                  data-testid={`star-next-${i}`}
                />
              ))}
            </div>

            {/* Quote - Normal weight, high contrast */}
            <blockquote className="text-base md:text-lg text-foreground font-normal leading-relaxed line-clamp-3">
              {nextTestimonial.quote}
            </blockquote>

            {/* Use-case badge */}
            <div className="inline-block">
              <span className="px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-xs font-medium text-primary">
                {nextTestimonial.useCase}
              </span>
            </div>

            {/* Author info */}
            <div className="flex items-center gap-4 pt-2">
              <div
                className={`h-14 w-14 rounded-full bg-gradient-to-br ${nextTestimonial.bgColor} flex items-center justify-center flex-shrink-0 shadow-md`}
                data-testid={`avatar-next-${nextTestimonial.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <span className="text-white font-bold text-sm">{nextTestimonial.avatar}</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground text-sm" data-testid={`name-next-${nextTestimonial.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  {nextTestimonial.name}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {nextTestimonial.role}
                </p>
                <p className="text-xs text-muted-foreground/70 font-medium">
                  {nextTestimonial.company}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/20">
            <p className="text-xs font-medium text-muted-foreground/60 text-center group-hover:text-foreground/70 transition-colors flex items-center justify-center gap-1">
              Click to view <ArrowRight className="h-3 w-3" />
            </p>
          </div>
        </Card>
      </div>

      {/* Mobile/Tablet: Full-width single testimonial */}
      <Card 
        className="lg:hidden p-6 sm:p-8 md:p-10 border border-border/20 bg-card/40 relative overflow-hidden"
        role="region"
        aria-label="User testimonials carousel"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="absolute -top-4 -right-4 opacity-10">
          <Quote className="h-48 w-48 text-foreground" />
        </div>

        <div className="relative z-10 space-y-5">
          {/* Stars */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-foreground/50 text-foreground/50"
                data-testid={`star-${i}`}
              />
            ))}
          </div>

          {/* Quote - Normal weight, high contrast */}
          <blockquote className="text-base sm:text-lg text-foreground font-normal leading-relaxed">
            {testimonial.quote}
          </blockquote>

          {/* Use-case badge */}
          <div className="inline-block">
            <span className="px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-xs font-medium text-primary">
              {testimonial.useCase}
            </span>
          </div>

          {/* Author info */}
          <div className="flex items-center gap-4 pt-2">
            <div
              className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br ${testimonial.bgColor} flex items-center justify-center flex-shrink-0 shadow-md`}
              data-testid={`avatar-${testimonial.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="text-white font-bold text-sm sm:text-base">{testimonial.avatar}</span>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-foreground text-sm sm:text-base truncate" data-testid={`name-${testimonial.name.toLowerCase().replace(/\s+/g, '-')}`}>
                {testimonial.name}
              </p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                {testimonial.role}
              </p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground/70 truncate">
                {testimonial.company}
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
            className="min-h-[44px] min-w-[44px] flex-shrink-0"
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
            className="min-h-[44px] min-w-[44px] flex-shrink-0"
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

        {/* CTA */}
        <Button
          variant="outline"
          className="w-full mt-6"
          data-testid="button-read-more-stories"
        >
          Read More Stories
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </Card>

      {/* Desktop CTA */}
      <div className="hidden lg:flex justify-center">
        <Button
          variant="outline"
          size="lg"
          data-testid="button-read-more-stories-desktop"
        >
          Read More Success Stories
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
