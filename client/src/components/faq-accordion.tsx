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
              {/* Render translated FAQ items */}
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                    expanded === idx - 1 
                      ? "border-emerald-500/30 bg-card/60 shadow-sm" 
                      : "border-border/30 hover:border-border/50 hover:shadow-sm"
                  }`}
                  data-testid={`faq-item-${idx - 1}`}
                  role="region"
                  aria-labelledby={`faq-button-${idx - 1}`}
                >
                  <button
                    id={`faq-button-${idx - 1}`}
                    onClick={() => setExpanded(expanded === idx - 1 ? null : idx - 1)}
                    className={`w-full px-4 sm:px-5 md:px-6 py-4 sm:py-4 md:py-5 flex items-center justify-between gap-4 text-left transition-colors focus-visible:outline-3 focus-visible:outline focus-visible:outline-[rgba(0,196,107,0.4)] focus-visible:outline-offset-[3px] min-h-12 ${
                      expanded === idx - 1 ? "bg-card/80" : "bg-card/40 hover:bg-card/60"
                    }`}
                    data-testid={`button-faq-${idx - 1}`}
                    aria-expanded={expanded === idx - 1}
                    aria-controls={`faq-answer-${idx - 1}`}
                  >
                    <span className="font-semibold text-foreground text-sm sm:text-base break-words leading-tight">
                      {t(`faq.q${idx}`)}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-foreground/60 flex-shrink-0 transition-transform duration-300 ease-out ${
                        expanded === idx - 1 ? "rotate-180 text-emerald-500" : ""
                      }`}
                      data-testid={`chevron-faq-${idx}`}
                      aria-hidden="true"
                    />
                  </button>
                  {expanded === idx - 1 && (
                    <div
                      id={`faq-answer-${idx - 1}`}
                      className="px-4 sm:px-5 md:px-6 py-4 sm:py-4 md:py-5 bg-muted/30 text-foreground/80 border-t border-border/20 animate-in fade-in-50 slide-in-from-top-2 duration-300"
                      data-testid={`faq-answer-${idx - 1}`}
                      role="region"
                    >
                      <p className="text-sm leading-relaxed">{t(`faq.a${idx}`)}</p>
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
