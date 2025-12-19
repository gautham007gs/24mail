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
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-3 tracking-tight">
            FAQ
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqData.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-xl overflow-hidden border transition-all ${
                expanded === idx 
                  ? "border-primary/50 bg-card" 
                  : "border-border bg-card hover:border-border/70"
              }`}
              data-testid={`faq-item-${idx}`}
            >
              <button
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover-elevate"
                data-testid={`button-faq-${idx}`}
                aria-expanded={expanded === idx}
              >
                <span className="font-bold text-foreground text-base md:text-lg">
                  {item.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
                    expanded === idx ? "rotate-180 text-primary" : "text-muted-foreground"
                  }`}
                  aria-hidden="true"
                />
              </button>
              {expanded === idx && (
                <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
