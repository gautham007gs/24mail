import { Lock, Eye, Zap, Database, Trash2, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export function DataPrivacySection() {
  const faqs = [
    {
      icon: Eye,
      question: "Is my data private?",
      answer: "Yes. We never log, store, or share your data. Your emails are kept private and automatically deleted after expiration."
    },
    {
      icon: Lock,
      question: "Can you see my emails?",
      answer: "No. Our system doesn't store emails after you view them. They're completely inaccessible to us once created."
    },
    {
      icon: Database,
      question: "Do you sell my data?",
      answer: "Never. We don't collect personal data and have nothing to sell. Your privacy is our priority."
    },
    {
      icon: Trash2,
      question: "How long do emails last?",
      answer: "Emails automatically expire after 10 minutes. Complete cleanup means zero trace of your activity."
    },
    {
      icon: Shield,
      question: "Is this secure?",
      answer: "Yes. We use modern encryption, secure infrastructure, and industry best practices to protect all communications."
    },
    {
      icon: Zap,
      question: "Can I recover deleted emails?",
      answer: "No. Once deleted or expired, emails are permanently gone. This is intentional for your privacy protection."
    }
  ];

  return (
    <section className="mt-16 md:mt-20 pt-12 md:pt-16 border-t border-border/20">
      <div className="text-center mb-12 md:mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Privacy & Security
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          Privacy isn't marketing for us—it's how we operate. Here's what you need to know.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {faqs.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className="p-6 md:p-7 border border-border/30 hover:border-border/60 hover:shadow-md transition-all group bg-card/40 hover:bg-card/70"
            >
              <div className="flex flex-col items-start space-y-4">
                <div className="p-3 rounded-lg bg-background/80 group-hover:bg-background transition-colors">
                  <Icon className="h-5 w-5 text-foreground/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground text-sm md:text-base leading-tight mb-2">
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
