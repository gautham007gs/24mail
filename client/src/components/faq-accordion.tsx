import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqData = [
  {
    question: "Is temporary email legal and safe to use?",
    answer: "Yes, temporary email is completely legal and safe. It's a privacy tool designed to protect your real email address from spam, data breaches, and unwanted marketing. Many privacy experts recommend using temporary emails for signups and one-time verifications."
  },
  {
    question: "Can I use temporary email for important accounts?",
    answer: "No, temporary emails are not suitable for important accounts like banking, social media, or any service you need long-term access to. Since temporary emails expire, you'll lose access to password recovery and important notifications. Use them only for signups, trials, and one-time verifications."
  },
  {
    question: "Can you see my emails?",
    answer: "No. Your emails are completely private. We use end-to-end encryption and don't store or read any email content. Emails are automatically deleted after they expire, leaving no trace on our servers."
  },
  {
    question: "How long does a temporary email last?",
    answer: "Your temporary email remains active during your session. By default, emails expire after 15 minutes, but you can refresh to extend the time. Once you close your browser or the email expires, all data is permanently deleted."
  },
  {
    question: "Why does BurnerEmail have 99.9% uptime?",
    answer: "We use enterprise-grade distributed infrastructure across multiple regions. Our servers are load-balanced and redundant, ensuring your temporary email is always available when you need it. We monitor 24/7 and have automatic failover systems in place."
  },
  {
    question: "What makes BurnerEmail's QR code feature unique?",
    answer: "We're the ONLY temporary email service offering QR code sharing. This lets you instantly share your temporary email address with another device - just scan the code with your phone's camera. Perfect for when you're signing up on a computer but need to verify on mobile."
  }
];

export function FAQAccordion() {
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
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Frequently Asked Questions</h2>
              <p className="text-sm md:text-base text-muted-foreground">Everything you need to know about Burner Email</p>
            </div>
            {/* FAQ Items - Single column */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              {faqData.map((item, idx) => (
                <div
                  key={idx}
                  className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                    expanded === idx 
                      ? "border-emerald-500/30 bg-card/60 shadow-sm" 
                      : "border-border/30 hover:border-border/50 hover:shadow-sm"
                  }`}
                  data-testid={`faq-item-${idx}`}
                  role="region"
                  aria-labelledby={`faq-button-${idx}`}
                >
                  <button
                    id={`faq-button-${idx}`}
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                    className={`w-full px-4 sm:px-5 md:px-6 py-4 sm:py-4 md:py-5 flex items-center justify-between gap-4 text-left transition-colors focus-visible:outline-3 focus-visible:outline focus-visible:outline-[rgba(0,196,107,0.4)] focus-visible:outline-offset-[3px] min-h-12 ${
                      expanded === idx ? "bg-card/80" : "bg-card/40 hover:bg-card/60"
                    }`}
                    data-testid={`button-faq-${idx}`}
                    aria-expanded={expanded === idx}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className="font-semibold text-foreground text-sm sm:text-base break-words leading-tight">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-foreground/60 flex-shrink-0 transition-transform duration-300 ease-out ${
                        expanded === idx ? "rotate-180 text-emerald-500" : ""
                      }`}
                      data-testid={`chevron-faq-${idx}`}
                      aria-hidden="true"
                    />
                  </button>
                  {expanded === idx && (
                    <div
                      id={`faq-answer-${idx}`}
                      className="px-4 sm:px-5 md:px-6 py-4 sm:py-4 md:py-5 bg-muted/30 text-foreground/80 border-t border-border/20 animate-in fade-in-50 slide-in-from-top-2 duration-300"
                      data-testid={`faq-answer-${idx}`}
                      role="region"
                    >
                      <p className="text-sm leading-relaxed">{item.answer}</p>
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
