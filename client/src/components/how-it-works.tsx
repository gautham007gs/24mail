import { AnimatedDemo } from "./animated-demo";

export function HowItWorks() {
  return (
    <section className="space-y-8 py-8 md:py-12 -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent">
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
