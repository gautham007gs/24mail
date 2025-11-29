import { Link } from "wouter";
import { ChevronDown } from "lucide-react";
import { useLanguage, type Language } from "@/contexts/language-context";
import { LANGUAGE_FLAGS } from "@/lib/language-utils";
import { useLocalizedLink } from "@/hooks/use-localized-link";
import { useState } from "react";

const LANGUAGES = [
  { code: "en" as Language, name: "English" },
  { code: "es" as Language, name: "Español" },
  { code: "pt" as Language, name: "Português" },
  { code: "fr" as Language, name: "Français" },
  { code: "de" as Language, name: "Deutsch" },
  { code: "hi" as Language, name: "हिन्दी" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { language, setLanguage } = useLanguage();
  const getLocalizedLink = useLocalizedLink();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const currentLangFlag = LANGUAGE_FLAGS[language];

  return (
    <footer className="border-t border-border/50 bg-background/50 mt-8 md:mt-12 lg:mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-4 md:px-6 py-8 md:py-12 lg:py-16">
        {/* Main Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center">
                <img 
                  srcSet="/logo-32.png?v=2 1x, /logo-64.png?v=2 2x" 
                  src="/logo-32.png?v=2" 
                  alt="Burner Email" 
                  className="h-11 w-11 flex-shrink-0 object-contain logo-transparent" 
                />
              </div>
              <h3 className="font-bold text-base md:text-lg leading-none">Burner Email</h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Fast, secure, and anonymous temporary email service
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm md:text-base">Product</h4>
            <ul className="space-y-2.5 md:space-y-3">
              <li>
                <Link href={getLocalizedLink("/")} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block" data-testid="footer-link-home">
                  Temporary Email
                </Link>
              </li>
              <li>
                <Link href={getLocalizedLink("/browser-extension")} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block" data-testid="footer-link-extension">
                  Browser Extension
                </Link>
              </li>
              <li>
                <Link href={getLocalizedLink("/blog")} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block" data-testid="footer-link-blog">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm md:text-base">Legal</h4>
            <ul className="space-y-2.5 md:space-y-3">
              <li>
                <Link href={getLocalizedLink("/success-stories")} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block" data-testid="footer-link-stories">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href={getLocalizedLink("/terms")} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block" data-testid="footer-link-terms">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href={getLocalizedLink("/privacy")} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block" data-testid="footer-link-privacy">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm md:text-base">Contact</h4>
            <ul className="space-y-2.5 md:space-y-3">
              <li>
                <a href="mailto:support@burneremail.email" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block break-all" data-testid="footer-email-support">
                  support@burneremail.email
                </a>
              </li>
              <li>
                <a href="mailto:privacy@burneremail.email" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block break-all" data-testid="footer-email-privacy">
                  privacy@burneremail.email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/30 my-8 md:my-10" />

        {/* Bottom Section - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 md:gap-6">
          <p className="text-xs text-muted-foreground leading-relaxed order-2 sm:order-1">
            &copy; {currentYear} Burner Email. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-muted-foreground order-1 sm:order-2">
            <span className="px-2.5 py-1 rounded-full bg-accent/10 dark:bg-accent/10 text-accent dark:text-accent font-medium whitespace-nowrap">100% Free</span>
            <span className="hidden sm:inline text-border/50">•</span>
            <span className="px-2.5 py-1 rounded-full bg-accent/10 dark:bg-accent/10 text-accent dark:text-accent font-medium whitespace-nowrap">Anonymous</span>
            <span className="hidden sm:inline text-border/50">•</span>
            <span className="px-2.5 py-1 rounded-full bg-accent/10 dark:bg-accent/10 text-accent dark:text-accent font-medium whitespace-nowrap">No Signup</span>
            <span className="hidden sm:inline text-border/50">•</span>
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors"
                title="Select language"
                data-testid="button-language-selector"
              >
                <span className="text-base">{currentLangFlag}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {showLanguageDropdown && (
                <div className="absolute bottom-full right-0 mb-2 bg-background border border-border/50 rounded-lg shadow-lg overflow-hidden z-50">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLanguageDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-xs text-left hover:bg-muted/50 transition-colors flex items-center gap-2 ${
                        language === lang.code ? "bg-accent/10 text-accent font-semibold" : "text-foreground/80"
                      }`}
                      data-testid={`language-option-${lang.code}`}
                    >
                      <span className="text-base">{LANGUAGE_FLAGS[lang.code]}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
