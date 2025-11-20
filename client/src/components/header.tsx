import { Mail } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Mail className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground" data-testid="text-app-title">TempMail</h1>
            <p className="text-xs text-muted-foreground" data-testid="text-app-subtitle">Temporary Email Service</p>
          </div>
        </div>
      </div>
    </header>
  );
}
