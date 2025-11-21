import { Link } from "wouter";
import { Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/30 bg-background/50 mt-12 md:mt-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-lg">TempMail</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Free temporary email addresses to protect your privacy.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Temporary Email
                </Link>
              </li>
              <li>
                <Link href="/browser-extension" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Browser Extension
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog & Guides
                </Link>
              </li>
              <li>
                <Link href="/referral" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium text-emerald-600 dark:text-emerald-400">
                  Refer & Earn
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/success-stories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@tempmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  support@tempmail.com
                </a>
              </li>
              <li>
                <a href="mailto:privacy@tempmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  privacy@tempmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} TempMail. All rights reserved. | Protecting your privacy is our priority.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>100% Free & Anonymous</span>
            <span>•</span>
            <span>No Registration Required</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
