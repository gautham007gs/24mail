import { Link, useLocation } from "wouter";
import { Mail, Menu, X, ChevronDown, Home, BookOpen, Zap, Award, AtSign } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type Domain } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  domains?: Domain[];
  selectedDomain?: string;
  onDomainChange?: (domain: string) => void;
}

export function Header({ domains = [], selectedDomain = "", onDomainChange }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDomainMenu, setShowDomainMenu] = useState(false);
  const [location] = useLocation();
  const { toast } = useToast();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Blog", href: "/blog", icon: BookOpen },
    { label: "Extension", href: "/browser-extension", icon: Zap },
    { label: "Stories", href: "/success-stories", icon: Award },
  ];

  const isActive = (href: string) => location === href;

  return (
    <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between min-h-14 md:h-16">
          {/* Logo - Compact on mobile */}
          <Link href="/" className="flex items-center gap-1.5 md:gap-2.5 hover:opacity-80 transition-opacity no-underline flex-shrink-0" data-testid="link-home">
            <div className="flex h-7 md:h-8 w-7 md:w-8 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600 flex-shrink-0">
              <svg className="h-4 md:h-5 w-4 md:w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-base md:text-lg font-black tracking-tight hidden sm:inline" data-testid="text-app-title">
              TEMPMAIL
            </span>
          </Link>

          {/* Desktop Navigation - Improved spacing */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.href === "/browser-extension" ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toast({
                        title: "Coming Soon!",
                        description: "Browser extension is launching very soon. Stay tuned!",
                      });
                    }}
                    className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-md transition-all duration-200 cursor-pointer hover-elevate ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`nav-link-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-md transition-all duration-200 no-underline block hover-elevate ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    data-testid={`nav-link-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side - Theme Toggle + Mobile Menu Button */}
          <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-1.5 hover:bg-secondary rounded-md transition-colors"
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Full Screen Menu */}
        {isOpen && (
          <nav className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-sm absolute left-0 right-0 top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto z-50 animate-in slide-in-from-top duration-300 w-full pb-safe">
            <div className="py-2 px-3 space-y-1">
              {/* Main Navigation Section */}
              <div className="space-y-1">
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.href}>
                      {item.href === "/browser-extension" ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                            toast({
                              title: "Coming Soon! 🎉",
                              description: "Browser extension is launching very soon. Stay tuned!",
                            });
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg font-semibold transition-all text-base text-left cursor-pointer active-elevate-2 ${
                            isActive(item.href)
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-secondary/50"
                          }`}
                          data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span>{item.label}</span>
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg font-semibold transition-all no-underline text-base active-elevate-2 ${
                            isActive(item.href)
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-secondary/50"
                          }`}
                          data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Domain Selector - Collapsible */}
              {domains.length > 0 && (
                <>
                  <div className="h-px bg-border/30 my-3 mx-2" />
                  <div className="space-y-2 px-2">
                    <button
                      onClick={() => setShowDomainMenu(!showDomainMenu)}
                      className={`w-full flex items-center justify-between px-3 py-4 rounded-lg font-semibold transition-all cursor-pointer ${
                        showDomainMenu
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50"
                          : "text-foreground hover:bg-secondary/50"
                      }`}
                      data-testid="button-domain-menu"
                    >
                      <span className="flex items-center gap-3">
                        <AtSign className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <span>Email Domain</span>
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform flex-shrink-0 ${showDomainMenu ? "rotate-180" : ""}`} />
                    </button>
                    {showDomainMenu && (
                      <div className="bg-emerald-50/30 dark:bg-emerald-950/10 rounded-lg p-2 space-y-1 border border-emerald-200/30 dark:border-emerald-800/30 animate-in fade-in duration-200">
                        {domains.map((domain, idx) => (
                          <button
                            key={domain}
                            onClick={() => {
                              onDomainChange?.(domain);
                              setShowDomainMenu(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-3 rounded text-sm font-medium transition-all text-left active-elevate-2 ${
                              selectedDomain === domain
                                ? "bg-emerald-600 text-white"
                                : "text-foreground hover:bg-secondary/50"
                            }`}
                            data-testid={`mobile-domain-${domain}`}
                            style={{ animationDelay: `${idx * 30}ms` }}
                          >
                            <AtSign className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                            <span>{domain}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Footer Links Section */}
              <div className="h-px bg-border/30 my-3 mx-2" />
              <div className="space-y-1 px-2">
                <Link
                  href="/terms"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors no-underline active-elevate-2"
                  data-testid="mobile-nav-link-terms"
                >
                  Terms & Conditions
                </Link>
                <Link
                  href="/privacy"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg font-medium text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors no-underline active-elevate-2"
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
  );
}
