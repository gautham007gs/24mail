import { Link, useLocation } from "wouter";
import { Mail, Menu, X, Home, BookOpen, Award } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type Domain } from "@shared/schema";

interface HeaderProps {
  domains?: Domain[];
  selectedDomain?: string;
  onDomainChange?: (domain: string) => void;
}

export function Header({ domains = [], selectedDomain = "", onDomainChange }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
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
            {/* Logo + Navigation - Left Side */}
            <div className="flex items-center gap-6 md:gap-8 flex-1">
              {/* Logo */}
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
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActiveRoute = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2.5 text-sm font-semibold rounded-md transition-all duration-200 no-underline block focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                        isActiveRoute
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                      }`}
                      data-testid={`nav-link-${item.label.toLowerCase()}`}
                      aria-current={isActiveRoute ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side - Utilities with Low Contrast */}
            <div className="flex items-center gap-2 md:gap-1.5 flex-shrink-0">
              {/* Theme Toggle - Subtle */}
              <div className="opacity-60 hover:opacity-100 transition-opacity focus-within:opacity-100">
                <ThemeToggle />
              </div>

              {/* Mobile Menu Button - Subtle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2.5 opacity-60 hover:opacity-100 transition-opacity focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg active-elevate-2"
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
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
