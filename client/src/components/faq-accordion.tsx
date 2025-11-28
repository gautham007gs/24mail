import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqItems } from "@/lib/blog-data";

export function FAQAccordion() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="space-y-3 max-w-2xl mx-auto px-4 py-8 md:py-12 -mx-4 sm:-mx-6 md:mx-0 sm:px-6 md:px-4 bg-gradient-to-b from-muted/15 to-transparent rounded-none md:rounded-lg">
      {faqItems.map((item, idx) => (
        <div
          key={idx}
          className="border border-border/20 rounded-lg overflow-hidden transition-all group"
          data-testid={`faq-item-${idx}`}
          role="region"
          aria-labelledby={`faq-button-${idx}`}
        >
          <button
            id={`faq-button-${idx}`}
            onClick={() => setExpanded(expanded === idx ? null : idx)}
            className="w-full px-5 md:px-6 py-4 md:py-5 flex items-center justify-between text-left bg-card/40 hover:bg-card/60 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-14"
            data-testid={`button-faq-${idx}`}
            aria-expanded={expanded === idx}
            aria-controls={`faq-answer-${idx}`}
          >
            <span className="font-semibold text-foreground pr-4 md:pr-5 text-sm md:text-base break-words">
              {item.question}
            </span>
            <ChevronDown
              className={`h-5 w-5 text-foreground/50 flex-shrink-0 transition-transform duration-300 min-w-5 ${
                expanded === idx ? "rotate-180" : ""
              }`}
              data-testid={`chevron-faq-${idx}`}
              aria-hidden="true"
            />
          </button>
          {expanded === idx && (
            <div
              id={`faq-answer-${idx}`}
              className="px-5 md:px-6 py-4 md:py-5 bg-background/30 text-muted-foreground border-t border-border/20 animate-in fade-in-50 slide-in-from-top-2 duration-300 overflow-hidden"
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
