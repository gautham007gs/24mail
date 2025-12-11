import { useState, useEffect, useRef } from "react";
import { Copy, Check, AtSign, ChevronRight, Mail, ArrowRight } from "@/lib/icons";

export function AnimatedDemo() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [showCopied, setShowCopied] = useState(false);
  const [emailFlying, setEmailFlying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px"
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);


  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setStep((prev) => {
        const next = (prev + 1) % 3 as 0 | 1 | 2;
        if (next === 1) {
          setShowCopied(true);
          setTimeout(() => setShowCopied(false), 1000);
        }
        if (next === 2) {
          setEmailFlying(true);
          setTimeout(() => setEmailFlying(false), 2000);
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);


  return (
    <div ref={sectionRef} className="w-full max-w-5xl mx-auto px-4 md:px-0">
      {/* Demo Container - Premium Design */}
      <div className="relative bg-gradient-to-br from-primary/8 via-primary/4 to-transparent border border-primary/20 rounded-3xl p-4 md:p-8 overflow-hidden">
        {/* Background glow - subtle */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/3 rounded-full blur-2xl" />
        </div>

        {/* Animated connecting line */}
        <div className="hidden sm:block absolute top-1/2 left-[15%] right-[15%] h-0.5 -translate-y-1/2 z-0">
          <div className="h-full bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-full" />
          {/* Animated dot traveling along the line */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full transition-all duration-1000"
            style={{
              left: step === 0 ? '0%' : step === 1 ? '50%' : '100%',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) scale(0.5)',
            }}
          />
        </div>

        {/* Content - Horizontal Row */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-6">
          {/* Step 1: Generate */}
          <div className={`flex flex-col items-center gap-4 transition-all duration-500 transform flex-shrink-0 z-10 ${
            step === 0 ? "scale-110 opacity-100" : "scale-95 opacity-50"
          }`}>
            <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
              step === 0
                ? "bg-primary/20 border-primary"
                : "bg-primary/10 border-primary/40"
            }`}>
              <AtSign className={`w-10 h-10 md:w-12 md:h-12 transition-all duration-500 ${
                step === 0 ? "text-primary" : "text-primary/60"
              }`} />
              {step === 0 && isVisible && (
                <div className="absolute inset-0 rounded-2xl animate-ping bg-primary/20" style={{ animationDuration: '1.5s' }} />
              )}
            </div>
            <div className="text-center mt-3">
              <p className={`text-base md:text-lg font-bold transition-colors ${step === 0 ? "text-primary" : "text-foreground"}`}>
                Generate
              </p>
              <p className="text-xs md:text-sm text-foreground/80 mt-2 font-semibold">user@barid.site</p>
            </div>
          </div>

          {/* Arrow 1 - Mobile Hidden */}
          <div className="hidden sm:flex items-center justify-center flex-shrink-0 z-10">
            <ArrowRight className={`w-5 h-5 transition-all duration-500 ${
              step >= 1 ? "text-primary" : "text-primary/30"
            }`} />
          </div>

          {/* Step 2: Copy */}
          <div className={`flex flex-col items-center gap-4 transition-all duration-500 transform flex-shrink-0 z-10 ${
            step === 1 ? "scale-110 opacity-100" : "scale-95 opacity-50"
          }`}>
            <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
              step === 1
                ? "bg-primary/20 border-primary"
                : "bg-primary/10 border-primary/40"
            }`}>
              {showCopied ? (
                <Check className="w-10 h-10 md:w-12 md:h-12 text-primary animate-bounce" />
              ) : (
                <Copy className={`w-10 h-10 md:w-12 md:h-12 transition-all duration-500 ${
                  step === 1 ? "text-primary" : "text-primary/60"
                }`} />
              )}
              {step === 1 && !showCopied && isVisible && (
                <div className="absolute inset-0 rounded-2xl animate-ping bg-primary/20" style={{ animationDuration: '1.5s' }} />
              )}
            </div>
            <div className="text-center mt-3">
              <p className={`text-base md:text-lg font-bold transition-colors ${step === 1 ? "text-primary" : "text-foreground"}`}>
                Copy
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-2">Paste anywhere</p>
            </div>
          </div>

          {/* Arrow 2 - Mobile Hidden */}
          <div className="hidden sm:flex items-center justify-center flex-shrink-0 z-10">
            <ArrowRight className={`w-5 h-5 transition-all duration-500 ${
              step >= 2 ? "text-primary" : "text-primary/30"
            }`} />
          </div>

          {/* Step 3: Receive */}
          <div className={`relative flex flex-col items-center gap-4 transition-all duration-500 transform flex-shrink-0 z-10 ${
            step === 2 ? "scale-110 opacity-100" : "scale-95 opacity-50"
          }`}>
            {/* Flying email animation */}
            {emailFlying && isVisible && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
                <Mail className="w-6 h-6 text-amber-400" />
              </div>
            )}

            <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
              step === 2
                ? "bg-primary/20 border-primary"
                : "bg-primary/10 border-primary/40"
            }`}>
              <Mail className={`w-10 h-10 md:w-12 md:h-12 transition-all duration-500 ${
                step === 2 ? "text-primary" : "text-primary/60"
              }`} />
              {step === 2 && isVisible && (
                <div className="absolute inset-0 rounded-2xl animate-ping bg-primary/20" style={{ animationDuration: '1.5s' }} />
              )}
            </div>
            <div className="text-center">
              <p className={`text-base md:text-lg font-bold transition-colors ${step === 2 ? "text-primary" : "text-foreground"}`}>
                Receive
              </p>
              <p className="text-xs md:text-sm text-foreground/80 mt-1 font-semibold">
                In your inbox
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator - Enhanced */}
        <div className="flex justify-center gap-3 mt-10">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setStep(i as 0 | 1 | 2)}
              aria-label={`Go to step ${i + 1}`}
              className={`min-h-[44px] min-w-[44px] p-2 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
            >
              <span className={`h-3 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-10 bg-primary"
                  : "w-3 bg-primary/30 hover:bg-primary/50"
              }`} />
            </button>
          ))}
        </div>

        {/* Labels under progress */}
        <div className="flex justify-center gap-16 mt-3 text-xs text-muted-foreground">
          <span className={step === 0 ? "text-primary font-semibold" : ""}>Generate</span>
          <span className={step === 1 ? "text-primary font-semibold" : ""}>Copy</span>
          <span className={step === 2 ? "text-primary font-semibold" : ""}>Receive</span>
        </div>
      </div>
    </div>
  );
}