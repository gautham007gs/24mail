import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { testimonials } from "@/lib/trust-data";

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000); // Change testimonial every 6 seconds

    return () => clearInterval(interval);
  }, [autoPlay]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoPlay(false);
  };

  const testimonial = testimonials[current];

  return (
    <div className="w-full">
      <Card className="p-8 md:p-12 neomorphic relative overflow-hidden">
        {/* Quote Icon Background */}
        <div className="absolute top-0 right-0 opacity-5">
          <Quote className="h-32 w-32" />
        </div>

        <div className="relative z-10">
          {/* Stars */}
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-5 w-5 fill-primary text-primary"
                data-testid={`star-${i}`}
              />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-lg md:text-xl text-foreground mb-6 italic font-medium leading-relaxed">
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

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            data-testid="button-prev-testimonial"
            className="button-press"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrent(idx);
                  setAutoPlay(false);
                }}
                className={`h-2 rounded-full transition-all ${
                  idx === current ? 'bg-primary w-6' : 'bg-primary/30 w-2'
                }`}
                data-testid={`dot-${idx}`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={next}
            data-testid="button-next-testimonial"
            className="button-press"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Auto-play indicator */}
        <div className="text-center mt-4">
          <p className="text-xs text-muted-foreground">
            {current + 1} / {testimonials.length}
          </p>
        </div>
      </Card>
    </div>
  );
}
