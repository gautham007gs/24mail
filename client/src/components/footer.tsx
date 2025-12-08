import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { IconGithub, IconX, IconInstagram } from "@/components/icons/social-icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-gradient-to-b from-background to-background/80 mt-8 md:mt-12 lg:mt-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-4 md:px-6 py-10 md:py-14 lg:py-18 relative">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center">
                <picture>
                  <source 
                    type="image/webp" 
                    srcSet="/logo-32.webp 1x, /logo-64.webp 2x"
                  />
                  <img 
                    srcSet="/logo-32.png?v=2 1x, /logo-64.png?v=2 2x" 
                    src="/logo-32.png?v=2" 
                    alt="Burner Email" 
                    className="h-12 w-12 flex-shrink-0 object-contain logo-transparent"
                    width="48"
                    height="48"
                  />
                </picture>
              </div>
              <h3 className="font-bold text-lg md:text-xl leading-none">Burner Email</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Anonymous temporary email addresses that protect your privacy. No signup, no ads, no tracking.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a 
                href="https://twitter.com/burneremail" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 hover:text-emerald-400 transition-all duration-200 group"
                data-testid="footer-social-twitter"
                aria-label="Follow us on X (Twitter)"
              >
                <IconX className="h-5 w-5 group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
              </a>
              <a 
                href="https://github.com/burneremail" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 hover:text-emerald-400 transition-all duration-200 group"
                data-testid="footer-social-github"
                aria-label="Visit our GitHub"
              >
                <IconGithub className="h-5 w-5 group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
              </a>
              <a 
                href="https://instagram.com/burneremail" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 hover:text-emerald-400 transition-all duration-200 group"
                data-testid="footer-social-instagram"
                aria-label="Follow us on Instagram"
              >
                <IconInstagram className="h-5 w-5 group-hover:drop-shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-5 text-base">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors inline-block" data-testid="footer-link-home">
                  Temporary Email
                </Link>
              </li>
              <li>
                <Link href="/browser-extension" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors inline-block" data-testid="footer-link-extension">
                  Browser Extension
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors inline-block" data-testid="footer-link-blog">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-5 text-base">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/success-stories" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors inline-block" data-testid="footer-link-stories">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors inline-block" data-testid="footer-link-terms">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors inline-block" data-testid="footer-link-privacy">
                  Privacy
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:abuse@burneremail.email" 
                  className="text-sm text-orange-400/80 hover:text-orange-400 transition-colors inline-flex items-center gap-1.5" 
                  data-testid="footer-link-abuse"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Report Abuse
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-5 text-base">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@burneremail.email" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors inline-block break-all" data-testid="footer-email-support">
                  support@burneremail.email
                </a>
              </li>
              <li>
                <a href="mailto:privacy@burneremail.email" className="text-sm text-muted-foreground hover:text-emerald-400 transition-colors inline-block break-all" data-testid="footer-email-privacy">
                  privacy@burneremail.email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/30 my-8 md:my-10" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 md:gap-6">
          <p className="text-sm text-muted-foreground leading-relaxed order-2 sm:order-1">
            &copy; {currentYear} Burner Email. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-muted-foreground order-1 sm:order-2">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium whitespace-nowrap border border-emerald-500/20">100% Free</span>
            <span className="hidden sm:inline text-border/50">|</span>
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium whitespace-nowrap border border-emerald-500/20">Anonymous</span>
            <span className="hidden sm:inline text-border/50">|</span>
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium whitespace-nowrap border border-emerald-500/20">Instant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
