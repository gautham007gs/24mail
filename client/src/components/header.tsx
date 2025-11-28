import { Link, useLocation } from "wouter";
import { Mail, Menu, X, ChevronDown, Home, BookOpen, Award, AtSign, Crown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type Domain } from "@shared/schema";

interface HeaderProps {
  domains?: Domain[];
  selectedDomain?: string;
  onDomainChange?: (domain: string) => void;
}

const PREMIUM_DOMAINS = new Set(["gmx.com", "mail.com", "protonmail.com", "tutanota.com", "privatemail.com", "zoho.com"]);

const isPremiumDomain = (domain: string): boolean => {
  return PREMIUM_DOMAINS.has(domain.toLowerCase());
};

export function Header({ domains = [], selectedDomain = "", onDomainChange }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDomainMenu, setShowDomainMenu] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Blog", href: "/blog", icon: BookOpen },
    { label: "Stories", href: "/success-stories", icon: Award },
  ];

  const isActive = (href: string) => location === href;

  return (
    <>
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Desktop Navigation */}
            <Link 
              href="/" 
              className="flex items-center gap-2.5 md:gap-3 hover:opacity-80 transition-opacity no-underline flex-shrink-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md" 
              data-testid="link-home"
            >
              <div className="flex items-center justify-center flex-shrink-0">
                <img 
                  srcSet="/logo-32.png?v=2 1x, /logo-64.png?v=2 2x" 
                  src="/logo-32.png?v=2" 
                  alt="Burner Email" 
                  className="h-10 md:h-11 w-10 md:w-11 flex-shrink-0 object-contain logo-transparent" 
                />
              </div>
              <span className="text-base md:text-lg font-black tracking-tight leading-none hidden sm:inline" data-testid="text-app-title">
                BURNER EMAIL
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              {navItems.map((item) => {
                const isActiveRoute = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 no-underline block focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      isActiveRoute
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`nav-link-${item.label.toLowerCase()}`}
                    aria-current={isActiveRoute ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side - Domain Selector + Utilities */}
            <div className="flex items-center gap-2 md:gap-2.5 flex-shrink-0">
              {/* Desktop Domain Selector */}
              {domains.length > 0 && (
                <div className="hidden lg:block relative">
                  <button
                    onClick={() => setShowDomainMenu(!showDomainMenu)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      showDomainMenu
                        ? "bg-accent/20 text-accent dark:bg-accent/20 dark:text-accent border border-accent/40"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                    data-testid="button-domain-selector-desktop"
                    aria-label="Select email domain"
                    aria-expanded={showDomainMenu}
                    aria-haspopup="listbox"
                  >
                    <span>Domain:</span>
                    <span className="font-semibold text-accent">{selectedDomain || "Choose"}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${showDomainMenu ? "rotate-180" : ""}`} />
                  </button>
                  {showDomainMenu && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                      <div className="max-h-72 overflow-y-auto p-1 space-y-1">
                        {domains.map((domain) => {
                          const isPremium = isPremiumDomain(domain);
                          return (
                            <button
                              key={domain}
                              onClick={() => {
                                onDomainChange?.(domain);
                                setShowDomainMenu(false);
                              }}
                              role="option"
                              aria-selected={selectedDomain === domain}
                              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                                selectedDomain === domain
                                  ? "bg-accent text-accent-foreground"
                                  : "text-foreground hover:bg-secondary/50"
                              }`}
                              data-testid={`domain-option-desktop-${domain}`}
                            >
                              <span>{domain}</span>
                              {isPremium && (
                                <Crown className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 fill-current" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <ThemeToggle />
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2.5 hover:bg-secondary rounded-lg transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                data-testid="button-mobile-menu"
                aria-label="Toggle navigation menu"
                aria-expanded={isOpen}
                aria-controls="mobile-nav"
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <nav 
              className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-sm absolute left-0 right-0 top-16 max-h-[calc(100vh-4rem)] overflow-y-auto z-50 animate-in slide-in-from-top duration-300 w-full pb-safe" 
              id="mobile-nav"
            >
              <div className="py-2.5 px-3 space-y-1">
                {/* Main Navigation */}
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActiveRoute = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg font-semibold transition-all no-underline text-base focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                        isActiveRoute
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-secondary/50"
                      }`}
                      data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                      aria-current={isActiveRoute ? "page" : undefined}
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {/* Domain Selector - Mobile */}
                {domains.length > 0 && (
                  <>
                    <div className="h-px bg-border/30 my-3 mx-2" />
                    <div className="space-y-2 px-2">
                      <button
                        onClick={() => setShowDomainMenu(!showDomainMenu)}
                        className={`w-full flex items-center justify-between px-3 py-3.5 rounded-lg font-semibold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                          showDomainMenu
                            ? "bg-accent/10 text-accent dark:text-accent border border-accent/30 dark:border-accent/50"
                            : "text-foreground hover:bg-secondary/50"
                        }`}
                        data-testid="button-domain-menu"
                        aria-label="Select email domain"
                        aria-expanded={showDomainMenu}
                        aria-haspopup="listbox"
                      >
                        <span className="flex items-center gap-3">
                          <AtSign className="h-5 w-5 text-accent flex-shrink-0" />
                          <span>Email Domain</span>
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${showDomainMenu ? "rotate-180" : ""}`} />
                      </button>
                      {showDomainMenu && (
                        <div className="bg-accent/10 dark:bg-accent/10 rounded-lg p-2 space-y-1 border border-accent/30 dark:border-accent/30 animate-in fade-in duration-200">
                          {domains.map((domain, idx) => {
                            const isPremium = isPremiumDomain(domain);
                            return (
                              <button
                                key={domain}
                                onClick={() => {
                                  onDomainChange?.(domain);
                                  setShowDomainMenu(false);
                                }}
                                role="option"
                                aria-selected={selectedDomain === domain}
                                className={`w-full flex items-center justify-between px-3 py-3 rounded text-sm font-medium transition-all text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                                  selectedDomain === domain
                                    ? "bg-accent text-accent-foreground dark:bg-accent dark:text-accent-foreground"
                                    : "text-foreground hover:bg-secondary/50"
                                }`}
                                data-testid={`mobile-domain-${domain}`}
                                style={{ animationDelay: `${idx * 30}ms` }}
                              >
                                <span className="flex items-center gap-2">
                                  <AtSign className="h-4 w-4 text-accent flex-shrink-0" />
                                  <span>{domain}</span>
                                </span>
                                {isPremium && (
                                  <Crown className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 flex-shrink-0" data-testid={`premium-badge-mobile-${domain}`} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Footer Links */}
                <div className="h-px bg-border/30 my-3 mx-2" />
                <div className="space-y-1 px-2">
                  <Link
                    href="/terms"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3.5 rounded-lg font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors no-underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    data-testid="mobile-nav-link-terms"
                  >
                    Terms & Conditions
                  </Link>
                  <Link
                    href="/privacy"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3.5 rounded-lg font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors no-underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    data-testid="mobile-nav-link-privacy"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
