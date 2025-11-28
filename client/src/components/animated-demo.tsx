import { useState, useEffect } from "react";
import { Copy, Check, AtSign, ChevronRight } from "lucide-react";

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
    <div className="w-full max-w-5xl mx-auto">
      {/* Demo Container - Horizontal */}
      <div className="relative bg-gradient-to-br from-primary/8 to-primary/3 border border-primary/20 rounded-2xl p-8 md:p-12 overflow-hidden">
        {/* Content - Horizontal Row */}
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
          {/* Step 1: Generate */}
          <div className={`flex flex-col items-center gap-3 transition-all duration-500 transform flex-shrink-0 ${
            step === 0 ? "scale-100 opacity-100" : "scale-95 opacity-40"
          }`}>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-primary/20 flex items-center justify-center border-2 border-primary/40">
              <AtSign className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm md:text-base font-bold text-foreground">Generate</p>
              <p className="text-xs text-muted-foreground font-mono mt-1">user@barid.site</p>
            </div>
          </div>

          {/* Arrow 1 */}
          <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-primary/60 flex-shrink-0 hidden sm:block" />

          {/* Step 2: Copy */}
          <div className={`flex flex-col items-center gap-3 transition-all duration-500 transform flex-shrink-0 ${
            step === 1 ? "scale-100 opacity-100" : "scale-95 opacity-40"
          }`}>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-primary/20 flex items-center justify-center border-2 border-primary/40">
              {showCopied ? (
                <Check className="w-8 h-8 md:w-10 md:h-10 text-primary animate-pulse" />
              ) : (
                <Copy className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm md:text-base font-bold text-foreground">Copy</p>
              <p className="text-xs text-muted-foreground mt-1">Paste anywhere</p>
            </div>
          </div>

          {/* Arrow 2 */}
          <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-primary/60 flex-shrink-0 hidden sm:block" />

          {/* Step 3: Receive */}
          <div className={`flex flex-col items-center gap-3 transition-all duration-500 transform flex-shrink-0 ${
            step === 2 ? "scale-100 opacity-100" : "scale-95 opacity-40"
          }`}>
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-primary/20 flex items-center justify-center border-2 border-primary/40">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm md:text-base font-bold text-foreground">Receive</p>
              <p className="text-xs text-muted-foreground mt-1">In your inbox</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? "w-7 bg-primary" : "w-2 bg-primary/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
