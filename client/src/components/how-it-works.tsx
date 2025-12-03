import { AnimatedDemo } from "./animated-demo";
import { useTranslation } from "@/hooks/use-translation";
import { ChevronRight } from "lucide-react";

// Assume 'steps' and 'ChevronRight' are defined elsewhere or imported.
// For demonstration purposes, let's assume they are defined like this:
const steps = [
  {
    icon: ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15z" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15zm0 3.75a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" /></svg>,
    title: "Setup Your Account",
    description: "Create your account in minutes. We guide you through a simple onboarding process.",
    example: "npx create-next-app@latest my-app --typescript --tailwind --eslint"
  },
  {
    icon: ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a7.841 7.841 0 00-.975-1.948C14.484 2.665 12.653 2.25 10.5 2.25c-2.153 0-4.035.415-5.25.979.975.948.975 1.948.975 1.948M16.862 4.487a7.841 7.841 0 01-.975 1.948m0-1.948l-1.143 2.858a1.531 1.531 0 01-1.287 1.064 3.565 3.565 0 01-2.708 0 1.531 1.531 0 01-1.287-1.064m0-1.948L14.11 6.39a3.565 3.565 0 01-2.708 0m0 1.948h.005v.005L11.464 8.39a3.565 3.565 0 01-2.708 0m1.143-2.858c-.013-.035-.034-.067-.063-.097M10.5 2.25c-2.153 0-4.035.415-5.25.979.975.948.975 1.948.975 1.948M10.5 2.25L9.357 4.487c-.132.329-.25.67-.357.975c-.233.777-.367 1.773-.367 2.858m0 0a3.565 3.565 0 012.708 0M10.5 2.25h1.143m-3.035 0h1.143M10.5 2.25A7.841 7.841 0 005.25 3.229a7.841 7.841 0 00-.975 1.948M10.5 2.25L6.749 3.229c-.29.444-.496.96-.648 1.531L5.25 5.25" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 5.636a4.5 4.5 0 011.881 8.424m-1.881-8.424L10.5 15m-1.881-8.424A4.5 4.5 0 006.943 14.066" /></svg>,
    title: "Connect Your Data",
    description: "Link your existing data sources securely. We support a wide range of popular platforms.",
    example: "npm install @react-oauth/google"
  },
  {
    icon: ({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM11.25 3.75h1.5v1.5h-1.5v-1.5zM11.25 17.25h1.5v1.5h-1.5v-1.5zM11.25 6.75h1.5v1.5h-1.5v-1.5zM11.25 10.5h1.5v1.5h-1.5v-1.5zM11.25 13.5h1.5v1.5h-1.5v-1.5zM14.625 12h-1.5v-1.5h1.5v1.5zm-1.5 3h1.5v1.5h-1.5v-1.5zm3-1.5v-1.5h-1.5v1.5h1.5zm0 3h1.5v1.5h-1.5v-1.5zm0-4.5v-1.5h-1.5v1.5h1.5z" /></svg>,
    title: "Analyze & Visualize",
    description: "Gain insights with powerful analytics and interactive visualizations. Understand your data like never before.",
    example: "chart.updateChart({ type: 'bar', data: chartData });"
  }
];

export function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section className="space-y-8 py-16 md:py-24">
      <div className="container mx-auto text-center space-y-4 md:space-y-5">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{t("how.title")}</h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
          {t("how.subtitle")}
        </p>
      </div>

      {/* Updated How It Works Section */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 relative">
          {/* Connection line - Desktop only */}
          <div className="hidden md:block absolute top-20 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-emerald-500/30 via-emerald-400/50 to-emerald-500/30" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative group fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Card with hover effect */}
                <div className="relative p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1">
                  {/* Step number badge */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-base flex items-center justify-center shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="mb-6 relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-10 w-10 text-emerald-500" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-emerald-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {step.description}
                  </p>
                  {step.example && (
                    <p className="text-xs font-mono text-emerald-400/80 bg-emerald-500/10 px-4 py-2.5 rounded-lg border border-emerald-500/20">
                      {step.example}
                    </p>
                  )}
                </div>

                {/* Arrow connector - Desktop only */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-20 -right-8 items-center justify-center z-10">
                    <ChevronRight className="h-7 w-7 text-emerald-500/50" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}