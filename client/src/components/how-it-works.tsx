import { AnimatedDemo } from "./animated-demo";

export function HowItWorks() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" />
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">Three Simple Steps</h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          Get a burner email in seconds
        </p>
      </div>

      {/* Only Animated Demo - No Duplicate Static Cards */}
      <AnimatedDemo />
    </section>
  );
}
