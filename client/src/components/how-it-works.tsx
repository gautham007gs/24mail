import { Mail, Copy, Shield } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Mail,
      title: "Get Your Email",
      description: "Instant temporary email address generated for you"
    },
    {
      number: "02", 
      icon: Copy,
      title: "Copy & Use",
      description: "Use it anywhere - signups, verifications, trials"
    },
    {
      number: "03",
      icon: Shield,
      title: "Stay Private",
      description: "Your real email stays protected from spam"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-black">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg">
            Three simple steps to privacy
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index}
                className="relative p-8 bg-[#1b1b1b] rounded-xl border border-[#2a2a2a] text-center group"
              >
                {/* Step Number */}
                <div className="absolute top-4 right-4 text-5xl font-black text-[#2a2a2a]">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-xl bg-[#FFA31A] group-hover:scale-105 transition-transform">
                  <Icon className="h-8 w-8 text-black" aria-hidden="true" />
                </div>
                
                {/* Content */}
                <h3 className="font-bold text-xl text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
