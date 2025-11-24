import { Link } from "wouter";
import { Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 bg-background/50 mt-12 md:mt-16 lg:mt-20">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-8 md:py-12 lg:py-16">
        {/* Main Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 flex-shrink-0">
                <Mail className="h-5 w-5 text-white dark:text-emerald-100" />
              </div>
              <h3 className="font-bold text-base md:text-lg">TempMail</h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Free temporary email addresses to protect your privacy online.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm md:text-base">Product</h4>
            <ul className="space-y-2.5 md:space-y-3">
              <li>
                <Link href="/" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block" data-testid="footer-link-home">
                  Temporary Email
                </Link>
              </li>
              <li>
                <Link href="/browser-extension" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block" data-testid="footer-link-extension">
                  Browser Extension
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block" data-testid="footer-link-blog">
                  Blog & Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm md:text-base">Legal</h4>
            <ul className="space-y-2.5 md:space-y-3">
              <li>
                <Link href="/success-stories" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block" data-testid="footer-link-stories">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block" data-testid="footer-link-terms">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block" data-testid="footer-link-privacy">
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
                <a href="mailto:support@tempmail.com" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block break-all" data-testid="footer-email-support">
                  support@tempmail.com
                </a>
              </li>
              <li>
                <a href="mailto:privacy@tempmail.com" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block break-all" data-testid="footer-email-privacy">
                  privacy@tempmail.com
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
            &copy; {currentYear} TempMail. All rights reserved. Protecting your privacy is our priority.
          </p>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-muted-foreground order-1 sm:order-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-medium whitespace-nowrap">100% Free</span>
            <span className="hidden sm:inline text-border/50">•</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-medium whitespace-nowrap">Anonymous</span>
            <span className="hidden sm:inline text-border/50">•</span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-medium whitespace-nowrap">No Signup</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
