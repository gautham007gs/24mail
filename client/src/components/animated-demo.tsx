import { useState, useEffect } from "react";
import { Copy, Check, AtSign } from "lucide-react";

export function AnimatedDemo() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        const next = (prev + 1) % 3 as 0 | 1 | 2;
        if (next === 2) {
          setShowCopied(true);
          setTimeout(() => setShowCopied(false), 1000);
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Demo Container */}
      <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 border border-border/30 rounded-2xl p-8 md:p-12 overflow-hidden">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-grid-pattern" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center gap-8">
          {/* Step 1: Generate */}
          <div className={`transition-all duration-500 transform ${
            step === 0 ? "scale-100 opacity-100" : "scale-95 opacity-40"
          }`}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-primary/20 flex items-center justify-center border-2 border-primary/40">
                <AtSign className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Generate Email</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">user@barid.site</p>
              </div>
            </div>
          </div>

          {/* Arrow Down */}
          <div className={`transition-all duration-500 ${
            step >= 1 ? "opacity-100 translate-y-0" : "opacity-30 -translate-y-2"
          }`}>
            <div className="animate-bounce">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* Step 2: Copy */}
          <div className={`transition-all duration-500 transform ${
            step === 1 ? "scale-100 opacity-100" : "scale-95 opacity-40"
          }`}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-primary/20 flex items-center justify-center border-2 border-primary/40">
                {showCopied ? (
                  <Check className="w-8 h-8 md:w-10 md:h-10 text-primary animate-pulse" />
                ) : (
                  <Copy className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Copy & Use</p>
                <p className="text-xs text-muted-foreground mt-1">Paste anywhere online</p>
              </div>
            </div>
          </div>

          {/* Arrow Down */}
          <div className={`transition-all duration-500 ${
            step === 2 ? "opacity-100 translate-y-0" : "opacity-30 -translate-y-2"
          }`}>
            <div className="animate-bounce">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* Step 3: Receive */}
          <div className={`transition-all duration-500 transform ${
            step === 2 ? "scale-100 opacity-100" : "scale-95 opacity-40"
          }`}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-primary/20 flex items-center justify-center border-2 border-primary/40">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Receive Emails</p>
                <p className="text-xs text-muted-foreground mt-1">Instantly in your inbox</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Caption */}
      <p className="text-center text-xs md:text-sm text-muted-foreground mt-4">
        Animates automatically • Loops every 9 seconds
      </p>
    </div>
  );
}
