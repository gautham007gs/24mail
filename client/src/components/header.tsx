import { Link, useLocation } from "wouter";
import { Mail, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Blog & Guides", href: "/blog" },
    { label: "Browser Extension", href: "/browser-extension" },
    { label: "Success Stories", href: "/success-stories" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <header className="border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2.5 hover:opacity-80 transition-opacity no-underline">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-lg md:text-xl font-black tracking-tight" data-testid="text-app-title">
                TEMPMAIL
              </span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`px-3.5 py-2 text-sm font-medium rounded-md transition-colors no-underline ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`nav-link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Right Side - Theme Toggle + Mobile Menu Button */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-md transition-colors"
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
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
          <nav className="md:hidden border-t border-border/30 py-3 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-md font-medium transition-colors no-underline ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  }`}
                  data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
            <Link href="/terms">
              <a
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-md font-medium text-foreground hover:bg-secondary transition-colors no-underline"
                data-testid="mobile-nav-link-terms"
              >
                Terms & Conditions
              </a>
            </Link>
            <Link href="/privacy">
              <a
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-md font-medium text-foreground hover:bg-secondary transition-colors no-underline"
                data-testid="mobile-nav-link-privacy"
              >
                Privacy Policy
              </a>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
