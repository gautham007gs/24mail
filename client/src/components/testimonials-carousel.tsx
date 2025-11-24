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
    }, 9000); // Increased to 9 seconds for better reading time

    return () => clearInterval(interval);
  }, [autoPlay, isHovered]);

  // Announce slide changes to screen readers
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
      className="w-full space-y-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Desktop: Show 2 testimonials side-by-side */}
      <div className="hidden lg:grid grid-cols-2 gap-6">
        {/* Current Testimonial */}
        <Card 
          className="p-8 md:p-10 neomorphic relative overflow-hidden"
          role="region"
          aria-label="Current user testimonial"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Quote Icon Background - More Visible */}
          <div className="absolute top-0 right-0 opacity-15 dark:opacity-10">
            <Quote className="h-40 w-40 text-primary/20" />
          </div>

          <div className="relative z-10 space-y-6">
            {/* Stars */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-emerald-500 text-emerald-500"
                  data-testid={`star-current-${i}`}
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-base md:text-lg text-foreground italic font-medium leading-relaxed break-words">
              "{testimonial.quote}"
            </blockquote>

            {/* Author */}
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
                  {testimonial.role} at {testimonial.company}
                </p>
              </div>
            </div>
          </div>

          {/* Slide Indicator */}
          <div className="mt-6 pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground text-center">
              Slide {current + 1} of {testimonials.length}
            </p>
          </div>
        </Card>

        {/* Next Testimonial Preview */}
        <Card 
          className="p-8 md:p-10 neomorphic relative overflow-hidden opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={next}
          role="button"
          aria-label={`Next testimonial from ${nextTestimonial.name}`}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && next()}
        >
          {/* Quote Icon Background */}
          <div className="absolute top-0 right-0 opacity-15 dark:opacity-10">
            <Quote className="h-40 w-40 text-primary/20" />
          </div>

          <div className="relative z-10 space-y-6">
            {/* Stars */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-emerald-500 text-emerald-500"
                  data-testid={`star-next-${i}`}
                />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-lg text-foreground italic font-medium leading-relaxed line-clamp-3">
              "{nextTestimonial.quote}"
            </blockquote>

            {/* Author */}
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
                  {nextTestimonial.role} at {nextTestimonial.company}
                </p>
              </div>
            </div>
          </div>

          {/* "Click to view" indicator */}
          <div className="mt-6 pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground text-center">Click to view</p>
          </div>
        </Card>
      </div>

      {/* Mobile/Tablet: Single testimonial carousel */}
      <Card 
        className="lg:hidden p-8 md:p-12 neomorphic relative overflow-hidden"
        role="region"
        aria-label="User testimonials carousel"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Quote Icon Background - More Visible */}
        <div className="absolute top-0 right-0 opacity-15 dark:opacity-10">
          <Quote className="h-40 w-40 text-primary/20" />
        </div>

        <div className="relative z-10 space-y-6">
          {/* Stars */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-emerald-500 text-emerald-500"
                data-testid={`star-${i}`}
              />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-base sm:text-lg md:text-xl text-foreground italic font-medium leading-relaxed break-words hyphens-auto">
            "{testimonial.quote}"
          </blockquote>

          {/* Author */}
          <div className="flex items-center gap-4">
            <div
              className={`h-14 w-14 rounded-full bg-gradient-to-br ${testimonial.bgColor} flex items-center justify-center flex-shrink-0`}
              data-testid={`avatar-${testimonial.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="text-white font-bold text-sm">{testimonial.avatar}</span>
            </div>
            <div>
              <p className="font-bold text-foreground" data-testid={`name-${testimonial.name.toLowerCase().replace(/\s+/g, '-')}`}>
                {testimonial.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {testimonial.role} at {testimonial.company}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation & Indicators */}
        <div className="flex items-center justify-between mt-8 gap-4" role="group" aria-label="Testimonial carousel controls">
          {/* Previous Button - More Prominent */}
          <Button
            variant="outline"
            size="lg"
            onClick={prev}
            data-testid="button-prev-testimonial"
            className="flex-shrink-0 hover:bg-primary/10 hover:border-primary transition-all active-elevate-2"
            aria-label="Previous testimonial"
            aria-controls={slideAnnouncementId}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {/* Dot Indicators - Enhanced Styling */}
          <div className="flex gap-2" role="group" aria-label="Testimonial selector">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded-full hover-elevate ${
                  idx === current 
                    ? 'bg-emerald-600 dark:bg-emerald-500 w-8 h-3 shadow-sm' 
                    : 'bg-emerald-200 dark:bg-emerald-900 w-2 h-2'
                }`}
                data-testid={`dot-${idx}`}
                aria-label={`Go to testimonial ${idx + 1} of ${testimonials.length}`}
                aria-current={idx === current ? "page" : "false"}
              />
            ))}
          </div>

          {/* Next Button - More Prominent */}
          <Button
            variant="outline"
            size="lg"
            onClick={next}
            data-testid="button-next-testimonial"
            className="flex-shrink-0 hover:bg-primary/10 hover:border-primary transition-all active-elevate-2"
            aria-label="Next testimonial"
            aria-controls={slideAnnouncementId}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Slide Counter and Screen Reader Announcement */}
        <div className="text-center mt-4 space-y-2">
          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {current + 1} of {testimonials.length}
          </p>
          <p className="text-xs text-muted-foreground" id={slideAnnouncementId}>
            {testimonial.name} from {testimonial.company}
          </p>
        </div>
      </Card>

      {/* Pause on hover hint for desktop */}
      <p className="text-center text-xs text-muted-foreground hidden md:block">
        Hover to pause • Auto-play: {autoPlay && !isHovered ? 'On' : 'Off'}
      </p>
    </div>
  );
}
