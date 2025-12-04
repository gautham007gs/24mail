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
    <div ref={sectionRef} className="w-full max-w-5xl mx-auto">
      {/* Demo Container - Premium Design */}
      <div className="relative bg-gradient-to-br from-emerald-500/8 via-emerald-500/4 to-transparent border border-emerald-500/20 rounded-3xl p-8 md:p-14 overflow-hidden">
        {/* Background glow - subtle */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-emerald-600/3 rounded-full blur-2xl" />
        </div>

        {/* Animated connecting line */}
        <div className="hidden sm:block absolute top-1/2 left-[15%] right-[15%] h-0.5 -translate-y-1/2 z-0">
          <div className="h-full bg-gradient-to-r from-emerald-500/20 via-emerald-500/40 to-emerald-500/20 rounded-full" />
          {/* Animated dot traveling along the line */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full transition-all duration-1000"
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
                ? "bg-emerald-500/20 border-emerald-400"
                : "bg-emerald-500/10 border-emerald-500/40"
            }`}>
              <AtSign className={`w-10 h-10 md:w-12 md:h-12 transition-all duration-500 ${
                step === 0 ? "text-emerald-400" : "text-emerald-500/60"
              }`} />
              {step === 0 && isVisible && (
                <div className="absolute inset-0 rounded-2xl animate-ping bg-emerald-400/20" style={{ animationDuration: '1.5s' }} />
              )}
            </div>
            <div className="text-center">
              <p className={`text-base md:text-lg font-bold transition-colors ${step === 0 ? "text-emerald-400" : "text-foreground"}`}>
                Generate
              </p>
              <p className="text-xs md:text-sm text-foreground/80 mt-1 font-semibold">user@barid.site</p>
            </div>
          </div>

          {/* Arrow 1 - Mobile Hidden */}
          <div className="hidden sm:flex items-center justify-center flex-shrink-0 z-10">
            <ArrowRight className={`w-8 h-8 transition-all duration-500 ${
              step >= 1 ? "text-emerald-400" : "text-emerald-500/30"
            }`} />
          </div>

          {/* Step 2: Copy */}
          <div className={`flex flex-col items-center gap-4 transition-all duration-500 transform flex-shrink-0 z-10 ${
            step === 1 ? "scale-110 opacity-100" : "scale-95 opacity-50"
          }`}>
            <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
              step === 1
                ? "bg-emerald-500/20 border-emerald-400"
                : "bg-emerald-500/10 border-emerald-500/40"
            }`}>
              {showCopied ? (
                <Check className="w-10 h-10 md:w-12 md:h-12 text-emerald-400 animate-bounce" />
              ) : (
                <Copy className={`w-10 h-10 md:w-12 md:h-12 transition-all duration-500 ${
                  step === 1 ? "text-emerald-400" : "text-emerald-500/60"
                }`} />
              )}
              {step === 1 && !showCopied && isVisible && (
                <div className="absolute inset-0 rounded-2xl animate-ping bg-emerald-400/20" style={{ animationDuration: '1.5s' }} />
              )}
            </div>
            <div className="text-center">
              <p className={`text-base md:text-lg font-bold transition-colors ${step === 1 ? "text-emerald-400" : "text-foreground"}`}>
                Copy
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Paste anywhere</p>
            </div>
          </div>

          {/* Arrow 2 - Mobile Hidden */}
          <div className="hidden sm:flex items-center justify-center flex-shrink-0 z-10">
            <ArrowRight className={`w-8 h-8 transition-all duration-500 ${
              step >= 2 ? "text-emerald-400" : "text-emerald-500/30"
            }`} />
          </div>

          {/* Step 3: Receive */}
          <div className={`relative flex flex-col items-center gap-4 transition-all duration-500 transform flex-shrink-0 z-10 ${
            step === 2 ? "scale-110 opacity-100" : "scale-95 opacity-50"
          }`}>
            {/* Flying email animation */}
            {emailFlying && isVisible && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
                <Mail className="w-6 h-6 text-orange-400" />
              </div>
            )}

            <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
              step === 2
                ? "bg-emerald-500/20 border-emerald-400"
                : "bg-emerald-500/10 border-emerald-500/40"
            }`}>
              <Mail className={`w-10 h-10 md:w-12 md:h-12 transition-all duration-500 ${
                step === 2 ? "text-emerald-400" : "text-emerald-500/60"
              }`} />
              {step === 2 && isVisible && (
                <div className="absolute inset-0 rounded-2xl animate-ping bg-emerald-400/20" style={{ animationDuration: '1.5s' }} />
              )}
            </div>
            <div className="text-center">
              <p className={`text-base md:text-lg font-bold transition-colors ${step === 2 ? "text-emerald-400" : "text-foreground"}`}>
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
              className={`h-2.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                i === step
                  ? "w-10 bg-emerald-400"
                  : "w-2.5 bg-emerald-500/30 hover:bg-emerald-500/50"
              }`}
            />
          ))}
        </div>

        {/* Labels under progress */}
        <div className="flex justify-center gap-16 mt-3 text-xs text-muted-foreground">
          <span className={step === 0 ? "text-emerald-400 font-semibold" : ""}>Generate</span>
          <span className={step === 1 ? "text-emerald-400 font-semibold" : ""}>Copy</span>
          <span className={step === 2 ? "text-emerald-400 font-semibold" : ""}>Receive</span>
        </div>
      </div>
    </div>
  );
}