import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqItems } from "@/lib/blog-data";
import { useTranslation } from "@/hooks/use-translation";

export function FAQAccordion() {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="w-full">
      {/* Full-width background with no max-width constraint */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-b from-muted/20 to-transparent py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Inner container for centered content */}
        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="w-full max-w-4xl mx-auto">
            {/* FAQ Heading */}
            <div className="mb-6 md:mb-8 text-center max-w-2xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t("faq.title")}</h2>
              <p className="text-sm md:text-base text-muted-foreground">{t("faq.subtitle")}</p>
            </div>
            {/* FAQ Items - Single column */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              {faqItems.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-border/30 rounded-lg overflow-hidden transition-all group hover:border-border/50 hover:shadow-md duration-300"
                  data-testid={`faq-item-${idx}`}
                  role="region"
                  aria-labelledby={`faq-button-${idx}`}
                >
                  <button
                    id={`faq-button-${idx}`}
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                    className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 flex items-center justify-between text-left bg-card/40 hover:bg-card/60 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-12 sm:min-h-13 md:min-h-14 group"
                    data-testid={`button-faq-${idx}`}
                    aria-expanded={expanded === idx}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className="font-semibold text-foreground pr-3 sm:pr-4 md:pr-5 text-xs sm:text-sm md:text-base break-words leading-tight">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 sm:h-5 sm:w-5 text-foreground/50 flex-shrink-0 transition-transform duration-300 group-hover:text-foreground/70 ${
                        expanded === idx ? "rotate-180" : ""
                      }`}
                      data-testid={`chevron-faq-${idx}`}
                      aria-hidden="true"
                    />
                  </button>
                  {expanded === idx && (
                    <div
                      id={`faq-answer-${idx}`}
                      className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 bg-background/30 text-muted-foreground border-t border-border/30 animate-in fade-in-50 slide-in-from-top-2 duration-300 overflow-hidden"
                      data-testid={`faq-answer-${idx}`}
                      role="region"
                    >
                      <p className="text-xs sm:text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
