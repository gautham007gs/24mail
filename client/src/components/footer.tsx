import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { IconGithub, IconX, IconInstagram } from "@/components/icons/social-icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-[#2a2a2a]">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <picture>
                <source 
                  type="image/webp" 
                  srcSet="/logo-32.webp 1x, /logo-64.webp 2x"
                />
                <img 
                  srcSet="/logo-32.png?v=2 1x, /logo-64.png?v=2 2x" 
                  src="/logo-32.png?v=2" 
                  alt="Burner Email" 
                  className="h-10 w-10 object-contain"
                  width="40"
                  height="40"
                />
              </picture>
              <span className="font-black text-xl text-white">
                Burner<span className="bg-[#FFA31A] text-black px-1.5 py-0.5 rounded ml-1">Email</span>
              </span>
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center gap-2">
              <a 
                href="https://twitter.com/burneremail" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#1b1b1b] hover:bg-[#FFA31A]/20 hover:text-[#FFA31A] transition-all text-gray-400"
                data-testid="footer-social-twitter"
                aria-label="Follow us on X"
              >
                <IconX className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/burneremail" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#1b1b1b] hover:bg-[#FFA31A]/20 hover:text-[#FFA31A] transition-all text-gray-400"
                data-testid="footer-social-github"
                aria-label="Visit our GitHub"
              >
                <IconGithub className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com/burneremail" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#1b1b1b] hover:bg-[#FFA31A]/20 hover:text-[#FFA31A] transition-all text-gray-400"
                data-testid="footer-social-instagram"
                aria-label="Follow us on Instagram"
              >
                <IconInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#FFA31A] transition-colors text-sm" data-testid="footer-link-home">
                  Temporary Email
                </Link>
              </li>
              <li>
                <Link href="/browser-extension" className="text-gray-400 hover:text-[#FFA31A] transition-colors text-sm" data-testid="footer-link-extension">
                  Browser Extension
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-[#FFA31A] transition-colors text-sm" data-testid="footer-link-blog">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/success-stories" className="text-gray-400 hover:text-[#FFA31A] transition-colors text-sm" data-testid="footer-link-stories">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-[#FFA31A] transition-colors text-sm" data-testid="footer-link-terms">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-[#FFA31A] transition-colors text-sm" data-testid="footer-link-privacy">
                  Privacy
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:abuse@burneremail.email" 
                  className="text-[#FFA31A]/80 hover:text-[#FFA31A] transition-colors text-sm inline-flex items-center gap-1.5" 
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
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@burneremail.email" className="text-gray-400 hover:text-[#FFA31A] transition-colors text-sm break-all" data-testid="footer-email-support">
                  support@burneremail.email
                </a>
              </li>
              <li>
                <a href="mailto:privacy@burneremail.email" className="text-gray-400 hover:text-[#FFA31A] transition-colors text-sm break-all" data-testid="footer-email-privacy">
                  privacy@burneremail.email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#2a2a2a] my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            {currentYear} Burner Email. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-sm">
            <span className="px-3 py-1.5 rounded-full bg-[#FFA31A]/10 text-[#FFA31A] font-bold text-xs">100% FREE</span>
            <span className="px-3 py-1.5 rounded-full bg-[#FFA31A]/10 text-[#FFA31A] font-bold text-xs">ANONYMOUS</span>
            <span className="px-3 py-1.5 rounded-full bg-[#FFA31A]/10 text-[#FFA31A] font-bold text-xs">INSTANT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
