import { Link, useLocation } from "wouter";
import { Mail, Menu, X, ChevronDown } from "lucide-react";
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
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Extension", href: "/browser-extension" },
    { label: "Stories", href: "/success-stories" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-3 md:px-6">
        <div className="flex items-center justify-between min-h-14 md:h-16">
          {/* Logo - Compact on mobile */}
          <Link href="/" className="flex items-center gap-1.5 md:gap-2.5 hover:opacity-80 transition-opacity no-underline flex-shrink-0">
            <div className="flex h-7 md:h-8 w-7 md:w-8 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600 flex-shrink-0">
              <svg className="h-4 md:h-5 w-4 md:w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-base md:text-lg font-black tracking-tight hidden sm:inline" data-testid="text-app-title">
              TEMPMAIL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <div key={item.href}>
                {item.href === "/browser-extension" ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toast({
                        title: "Coming Soon! 🎉",
                        description: "Browser extension is launching very soon. Stay tuned!",
                      });
                    }}
                    className={`px-3 py-2 text-xs lg:text-sm font-semibold rounded-md transition-colors cursor-pointer ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                    data-testid={`nav-link-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2 text-xs lg:text-sm font-semibold rounded-md transition-colors no-underline block ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
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
          <nav className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-sm absolute left-0 right-0 top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto z-50 animate-in slide-in-from-top duration-300 w-full">
            <div className="py-4 px-3 space-y-2">
              {/* Navigation Links */}
              {navItems.map((item) => (
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
                      className={`w-full block px-4 py-3 rounded-lg font-semibold transition-colors text-base text-left cursor-pointer ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary/50"
                      }`}
                      data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-lg font-semibold transition-colors no-underline text-base ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary/50"
                      }`}
                      data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Domain Selector - Collapsible */}
              {domains.length > 0 && (
                <>
                  <div className="h-px bg-border/30 my-4" />
                  <button
                    onClick={() => setShowDomainMenu(!showDomainMenu)}
                    className="w-full px-4 py-3 rounded-lg font-semibold text-foreground hover:bg-secondary/50 transition-colors flex items-center justify-between"
                    data-testid="button-domain-menu"
                  >
                    <span>Email Domain</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showDomainMenu ? "rotate-180" : ""}`} />
                  </button>
                  {showDomainMenu && (
                    <div className="bg-secondary/30 rounded-lg p-2 space-y-1 mx-2">
                      {domains.map((domain) => (
                        <button
                          key={domain}
                          onClick={() => {
                            onDomainChange?.(domain);
                            setShowDomainMenu(false);
                          }}
                          className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors text-left ${
                            selectedDomain === domain
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-secondary/50"
                          }`}
                          data-testid={`mobile-domain-${domain}`}
                        >
                          @{domain}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              <div className="h-px bg-border/30 my-4" />
              <Link
                href="/terms"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg font-semibold text-foreground hover:bg-secondary/50 transition-colors no-underline text-base"
                data-testid="mobile-nav-link-terms"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg font-semibold text-foreground hover:bg-secondary/50 transition-colors no-underline text-base"
                data-testid="mobile-nav-link-privacy"
              >
                Privacy Policy
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
