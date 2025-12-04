import { AnimatedDemo } from "./animated-demo";
import { useTranslation } from "@/hooks/use-translation";

export function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">{t("how.title")}</h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          {t("how.subtitle")}
        </p>
      </div>

      {/* Only Animated Demo - No Duplicate Static Cards */}
      <AnimatedDemo />
    </section>
  );
}
