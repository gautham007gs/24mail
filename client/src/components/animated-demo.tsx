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
    <div className="w-full">
      {/* Demo Container - Wide Horizontal */}
      <div className="relative bg-gradient-to-r from-primary/10 via-primary/8 to-primary/10 border border-primary/25 rounded-3xl p-10 md:p-16 overflow-hidden shadow-lg">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Content - Horizontal Row */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-12">
          {/* Step 1: Generate */}
          <div className={`flex flex-col items-center gap-4 transition-all duration-500 transform flex-shrink-0 ${
            step === 0 ? "scale-100 opacity-100" : "scale-90 opacity-50"
          }`}>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/15 flex items-center justify-center border-2 border-primary/50 shadow-md">
              <AtSign className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-base md:text-lg font-bold text-foreground">Generate</p>
              <p className="text-xs md:text-sm text-muted-foreground font-mono mt-2">user@barid.site</p>
            </div>
          </div>

          {/* Arrow 1 */}
          <ChevronRight className="w-7 h-7 md:w-8 md:h-8 text-primary/70 flex-shrink-0 hidden sm:block" />

          {/* Step 2: Copy */}
          <div className={`flex flex-col items-center gap-4 transition-all duration-500 transform flex-shrink-0 ${
            step === 1 ? "scale-100 opacity-100" : "scale-90 opacity-50"
          }`}>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/15 flex items-center justify-center border-2 border-primary/50 shadow-md">
              {showCopied ? (
                <Check className="w-10 h-10 md:w-12 md:h-12 text-primary animate-pulse" />
              ) : (
                <Copy className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              )}
            </div>
            <div className="text-center">
              <p className="text-base md:text-lg font-bold text-foreground">Copy</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">Paste anywhere</p>
            </div>
          </div>

          {/* Arrow 2 */}
          <ChevronRight className="w-7 h-7 md:w-8 md:h-8 text-primary/70 flex-shrink-0 hidden sm:block" />

          {/* Step 3: Receive */}
          <div className={`flex flex-col items-center gap-4 transition-all duration-500 transform flex-shrink-0 ${
            step === 2 ? "scale-100 opacity-100" : "scale-90 opacity-50"
          }`}>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/15 flex items-center justify-center border-2 border-primary/50 shadow-md">
              <svg className="w-10 h-10 md:w-12 md:h-12 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-base md:text-lg font-bold text-foreground">Receive</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">In your inbox</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator - Centered Below */}
        <div className="flex justify-center gap-3 mt-10">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-primary" : "w-2.5 bg-primary/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
