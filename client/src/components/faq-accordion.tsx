import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqItems } from "@/lib/blog-data";

export function FAQAccordion() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div 
      className="space-y-3"
      role="region"
      aria-label="Frequently asked questions"
    >
      {faqItems.map((item, idx) => (
        <div
          key={idx}
          className="border border-border/50 rounded-lg overflow-hidden hover-elevate transition-all"
          data-testid={`faq-item-${idx}`}
          role="region"
          aria-labelledby={`faq-button-${idx}`}
        >
          <button
            id={`faq-button-${idx}`}
            onClick={() => setExpanded(expanded === idx ? null : idx)}
            className="w-full px-6 py-4 flex items-center justify-between text-left bg-card hover:bg-card/80 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            data-testid={`button-faq-${idx}`}
            aria-expanded={expanded === idx}
            aria-controls={`faq-answer-${idx}`}
          >
            <span className="font-semibold text-foreground pr-4">{item.question}</span>
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                expanded === idx ? "rotate-180" : ""
              }`}
              data-testid={`chevron-faq-${idx}`}
            />
          </button>
          {expanded === idx && (
            <div
              id={`faq-answer-${idx}`}
              className="px-6 py-4 bg-background/50 text-muted-foreground border-t border-border/30 animate-in fade-in-50 slide-in-from-top-2 duration-300 overflow-hidden"
              data-testid={`faq-answer-${idx}`}
              role="region"
            >
              <p className="text-sm leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
