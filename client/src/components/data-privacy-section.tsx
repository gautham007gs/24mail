import { Lock, Eye, Zap, Database, Trash2, Shield } from "lucide-react";

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
    <section className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-border/30">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Is My Data Private? 🔒
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Privacy isn't marketing for us—it's how we operate. Here's what you need to know.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faqs.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index}
              className="p-6 rounded-lg border border-border/50 hover:border-accent/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-sm leading-tight mb-2">
                    {item.question}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
