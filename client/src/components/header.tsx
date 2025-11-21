import { Mail, Lock, Zap, Eye } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto px-4 py-6 md:px-6">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent" data-testid="text-app-title">TempMail</h1>
              <p className="text-xs text-muted-foreground" data-testid="text-app-subtitle">Anonymous Email in Seconds</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        
        {/* Trust Badges */}
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye className="h-3.5 w-3.5 text-primary" />
            <span>No Registration</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <span>HTTPS Encrypted</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span>Instant Setup</span>
          </div>
        </div>
      </div>
    </header>
  );
}
