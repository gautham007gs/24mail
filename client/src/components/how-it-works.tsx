import { AnimatedDemo } from "./animated-demo";

export function HowItWorks() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">How It Works</h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          Three simple steps to complete privacy
        </p>
      </div>

      {/* Only Animated Demo - No Duplicate Static Cards */}
      <AnimatedDemo />
    </section>
  );
}
