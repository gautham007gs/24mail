import { AnimatedDemo } from "./animated-demo";
import { useTranslation } from "@/hooks/use-translation";

export function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">How It Works</h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
          Three simple steps to complete privacy.
        </p>
      </div>

      {/* Only Animated Demo - No Duplicate Static Cards */}
      <AnimatedDemo />
    </section>
  );
}
