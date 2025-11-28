import { ChevronDown, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { faqItems } from "@/lib/blog-data";
import { Input } from "@/components/ui/input";

export function FAQAccordion() {
  const [expanded, setExpanded] = useState<number | null>(0); // Desktop: first item expanded by default
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQ items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return faqItems;
    
    const query = searchQuery.toLowerCase();
    return faqItems.filter(item => 
      item.question.toLowerCase().includes(query) || 
      item.answer.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Top 3 questions for quick links
  const topQuestions = [
    { index: 0, label: "Is it safe?" },
    { index: 1, label: "Banking accounts?" },
    { index: 2, label: "Privacy?" }
  ];

  const handleQuickLink = (index: number) => {
    setExpanded(expanded === index ? null : index);
    setSearchQuery("");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search questions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-2.5 text-sm"
          data-testid="input-faq-search"
        />
      </div>

      {/* Quick Links - Only show when not searching */}
      {!searchQuery.trim() && (
        <div className="grid grid-cols-3 gap-2">
          {topQuestions.map((q) => (
            <button
              key={q.index}
              onClick={() => handleQuickLink(q.index)}
              className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all border ${
                expanded === q.index
                  ? "bg-primary/15 border-primary/50 text-primary"
                  : "bg-muted/50 border-border/50 text-foreground hover:bg-muted hover:border-border"
              }`}
              data-testid={`button-quick-link-${q.index}`}
            >
              {q.label}
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No questions found matching "{searchQuery}"</p>
        </div>
      )}

      {/* FAQ Items */}
      <div className="space-y-3 px-4">
        {filteredItems.map((item, idx) => {
          // Find original index for proper expanded state management
          const originalIndex = faqItems.findIndex(
            faq => faq.question === item.question
          );

          return (
            <div
              key={idx}
              className="border border-border/20 rounded-lg overflow-hidden transition-all group"
              data-testid={`faq-item-${idx}`}
              role="region"
              aria-labelledby={`faq-button-${idx}`}
            >
              <button
                id={`faq-button-${idx}`}
                onClick={() => setExpanded(expanded === originalIndex ? null : originalIndex)}
                className="w-full px-5 md:px-6 py-4 md:py-5 flex items-center justify-between text-left bg-card/40 hover:bg-card/60 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 min-h-14"
                data-testid={`button-faq-${idx}`}
                aria-expanded={expanded === originalIndex}
                aria-controls={`faq-answer-${idx}`}
              >
                <span className="font-semibold text-foreground pr-4 md:pr-5 text-sm md:text-base break-words">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-foreground/50 flex-shrink-0 transition-transform duration-300 min-w-5 ${
                    expanded === originalIndex ? "rotate-180" : ""
                  }`}
                  data-testid={`chevron-faq-${idx}`}
                  aria-hidden="true"
                />
              </button>
              {expanded === originalIndex && (
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
          );
        })}
      </div>
    </div>
  );
}
