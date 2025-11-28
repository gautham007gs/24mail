import { AtSign, Crown, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { type Domain } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface DomainSelectorPillProps {
  domains: Domain[];
  selectedDomain: string;
  onDomainChange: (domain: string) => void;
}

const PREMIUM_DOMAINS = new Set(["gmx.com", "mail.com", "protonmail.com", "tutanota.com", "privatemail.com", "zoho.com"]);

const isPremiumDomain = (domain: string): boolean => {
  return PREMIUM_DOMAINS.has(domain.toLowerCase());
};

export function DomainSelectorPill({ domains, selectedDomain, onDomainChange }: DomainSelectorPillProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (domains.length === 0) return null;

  const isPremium = selectedDomain && isPremiumDomain(selectedDomain);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 h-auto min-h-8 border-border/30 hover:border-border/50 hover:bg-background/50 text-xs md:text-sm"
        aria-label="Select email domain"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        data-testid="button-domain-selector-pill"
      >
        <AtSign className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="hidden sm:inline text-muted-foreground">Domain:</span>
        <span className="font-semibold text-foreground/70">{selectedDomain}</span>
        {isPremium && (
          <Crown className="h-3 w-3 text-amber-500 dark:text-amber-400 fill-current" />
        )}
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-52 md:w-56 bg-background border border-border/30 rounded-lg shadow-lg z-50 overflow-hidden animate-in fade-in-50 slide-in-from-top-1 duration-200"
          role="listbox"
          data-testid="domain-selector-dropdown"
        >
          <div className="max-h-60 overflow-y-auto p-1 space-y-1">
            {domains.map((domain) => {
              const isPrem = isPremiumDomain(domain);
              return (
                <button
                  key={domain}
                  onClick={() => {
                    onDomainChange(domain);
                    setIsOpen(false);
                  }}
                  role="option"
                  aria-selected={selectedDomain === domain}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all text-left ${
                    selectedDomain === domain
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-background/60"
                  }`}
                  data-testid={`domain-option-${domain}`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <AtSign className="h-3.5 w-3.5 flex-shrink-0 opacity-60" />
                    <span className="truncate">{domain}</span>
                  </span>
                  {isPrem && (
                    <Crown className="h-3 w-3 text-amber-500 dark:text-amber-400 fill-current flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
