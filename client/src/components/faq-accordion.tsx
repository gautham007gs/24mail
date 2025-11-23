import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqItems } from "@/lib/blog-data";

export function FAQAccordion() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqItems.map((item, idx) => (
        <div
          key={idx}
          className="border border-border/50 rounded-lg overflow-hidden hover-elevate transition-all"
          data-testid={`faq-item-${idx}`}
        >
          <button
            onClick={() => setExpanded(expanded === idx ? null : idx)}
            className="w-full px-6 py-4 flex items-center justify-between text-left bg-card hover:bg-card/80 transition-colors"
            data-testid={`button-faq-${idx}`}
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
              className="px-6 py-4 bg-background/50 text-muted-foreground border-t border-border/30 animate-in fade-in-50 duration-300"
              data-testid={`faq-answer-${idx}`}
            >
              <p className="text-sm leading-relaxed">{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
