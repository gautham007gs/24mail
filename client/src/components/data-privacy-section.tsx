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
    <section className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-border/30">
      <div className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Privacy Built In
        </h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Your privacy is our priority. Everything encrypted, nothing stored, complete peace of mind.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto px-4">
        {faqs.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className="p-5 md:p-6 border border-emerald-500/15 bg-gradient-to-br from-emerald-50/5 to-emerald-950/5 dark:from-emerald-950/15 dark:to-emerald-900/10 hover:border-emerald-500/25 hover:bg-emerald-50/8 dark:hover:bg-emerald-950/15 transition-all duration-300 group hover:shadow-sm hover:-translate-y-0.5"
            >
              <div className="flex flex-col h-full gap-4">
                <div className="p-3 rounded-lg bg-emerald-500/12 group-hover:bg-emerald-500/18 transition-colors w-fit">
                  <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">
                    {item.question}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
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
