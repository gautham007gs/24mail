import { Lock, Eye, Zap, Database, Trash2, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export function DataPrivacySection() {
  const faqs = [
    {
      icon: Eye,
      question: "Is my data private?",
      answer: "100%. We never log, store, or access your data. Emails auto-delete after expiration."
    },
    {
      icon: Lock,
      question: "Can you see my emails?",
      answer: "Never. Emails vanish after viewing. We can't recover them even if we wanted to."
    },
    {
      icon: Database,
      question: "Do you sell my data?",
      answer: "No. We collect zero personal data. There's nothing to sell."
    },
    {
      icon: Trash2,
      question: "How long do emails last?",
      answer: "10 minutes max. Then they're permanently wiped from our servers."
    },
    {
      icon: Shield,
      question: "Is this secure?",
      answer: "Yes. Modern encryption + secure infrastructure + industry best practices."
    },
    {
      icon: Zap,
      question: "Can I recover deleted emails?",
      answer: "No. By design. Once gone, they're gone forever for your protection."
    }
  ];

  return (
    <section className="mt-20 md:mt-24 pt-16 md:pt-20 border-t border-border/10">
      <div className="text-center mb-14 md:mb-16 max-w-2xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
          Your Questions Answered
        </h2>
        <p className="text-base md:text-lg text-muted-foreground">
          Transparency matters. Here's what you need to know.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 px-4">
        {faqs.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className="p-7 md:p-8 border border-border/20 hover:border-border/40 bg-card/30 hover:bg-card/50 transition-all duration-300 group"
            >
              <div className="flex flex-col h-full gap-5">
                <div className="p-3.5 rounded-lg bg-background/60 group-hover:bg-background w-fit">
                  <Icon className="h-7 w-7 text-foreground/70 group-hover:text-foreground transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground mb-2">
                    {item.question}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
