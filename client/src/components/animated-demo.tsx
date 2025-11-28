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
    <div className="w-full max-w-4xl mx-auto">
      {/* Demo Container - Horizontal */}
      <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 border border-border/30 rounded-2xl p-6 md:p-8 overflow-hidden">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-grid-pattern" style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Content - Horizontal Row */}
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-3">
          {/* Step 1: Generate */}
          <div className={`flex flex-col items-center gap-2 transition-all duration-500 transform flex-shrink-0 ${
            step === 0 ? "scale-100 opacity-100" : "scale-90 opacity-50"
          }`}>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-primary/20 flex items-center justify-center border-2 border-primary/40">
              <AtSign className="w-7 h-7 md:w-8 md:h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-xs md:text-sm font-semibold text-foreground">Generate</p>
              <p className="text-[10px] md:text-xs text-muted-foreground font-mono">user@barid.site</p>
            </div>
          </div>

          {/* Arrow 1 */}
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-primary/50 flex-shrink-0 hidden sm:block" />

          {/* Step 2: Copy */}
          <div className={`flex flex-col items-center gap-2 transition-all duration-500 transform flex-shrink-0 ${
            step === 1 ? "scale-100 opacity-100" : "scale-90 opacity-50"
          }`}>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-primary/20 flex items-center justify-center border-2 border-primary/40">
              {showCopied ? (
                <Check className="w-7 h-7 md:w-8 md:h-8 text-primary animate-pulse" />
              ) : (
                <Copy className="w-7 h-7 md:w-8 md:h-8 text-primary" />
              )}
            </div>
            <div className="text-center">
              <p className="text-xs md:text-sm font-semibold text-foreground">Copy</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">Paste anywhere</p>
            </div>
          </div>

          {/* Arrow 2 */}
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-primary/50 flex-shrink-0 hidden sm:block" />

          {/* Step 3: Receive */}
          <div className={`flex flex-col items-center gap-2 transition-all duration-500 transform flex-shrink-0 ${
            step === 2 ? "scale-100 opacity-100" : "scale-90 opacity-50"
          }`}>
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg bg-primary/20 flex items-center justify-center border-2 border-primary/40">
              <svg className="w-7 h-7 md:w-8 md:h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xs md:text-sm font-semibold text-foreground">Receive</p>
              <p className="text-[10px] md:text-xs text-muted-foreground">In your inbox</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Caption */}
      <p className="text-center text-xs md:text-sm text-muted-foreground mt-3">
        Loops every 9 seconds
      </p>
    </div>
  );
}
