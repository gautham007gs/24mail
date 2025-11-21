import { Mail } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Left - Empty Space */}
          <div className="w-20" />

          {/* Center - Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight" data-testid="text-app-title">
              TEMPMAIL
            </h1>
          </div>

          {/* Right - Theme Toggle */}
          <div className="flex items-center justify-end w-20">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
