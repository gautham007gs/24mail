import { Mail, Download, Award } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-center justify-between gap-4">
          {/* Left - App Links */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs md:text-sm font-medium gap-2"
              data-testid="button-app-store"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">App Store</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs md:text-sm font-medium gap-2"
              data-testid="button-play-store"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Google Play</span>
            </Button>
          </div>

          {/* Center - Logo */}
          <div className="flex items-center gap-2.5 flex-1 justify-center md:flex-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight" data-testid="text-app-title">
              TEMPMAIL
            </h1>
          </div>

          {/* Right - Premium & Theme */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-xs md:text-sm"
              data-testid="button-premium"
            >
              Premium
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
