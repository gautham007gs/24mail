export function TrustSection() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 space-y-12">
        {/* Trust Heading */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Burner Email is Trusted by 150K+ Users</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our burner email service has processed over 1 million temporary emails with a proven 99.9% uptime guarantee. Users worldwide trust us for spam prevention, privacy protection, and anonymous email communication without compromising on security.
          </p>
        </div>

        {/* Security & Privacy Content */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">100% Free Temporary Email Service</h3>
            <p className="text-muted-foreground leading-relaxed">
              Create disposable email addresses instantly without payment or signup requirements. Burner Email eliminates hidden fees, subscription walls, and payment friction. Every user gets immediate access to temporary email addresses for free, making it the most accessible burner email solution available.
            </p>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">Complete Privacy & Zero Logs</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your privacy is paramount. We maintain zero logs of email activity, sender information, or user behavior. All temporary emails are automatically deleted after expiration. GDPR compliant, SSL encrypted, and fully anonymous - your real email stays protected from spam, marketing lists, and data breaches while using our temp mail service.
            </p>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">Instant Email Generation - No Signup Required</h3>
            <p className="text-muted-foreground leading-relaxed">
              Get your temporary email in seconds. No account creation, no email verification, no personal information required. Simply visit Burner Email, copy your disposable address, and start using it immediately for signups, trials, and privacy-sensitive services. Perfect for testing accounts or receiving verification codes anonymously.
            </p>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-3">Enterprise-Grade Security & Compliance</h3>
            <p className="text-muted-foreground leading-relaxed">
              Burner Email infrastructure meets GDPR, CCPA, and international data protection standards. SSL/TLS encryption secures all data in transit. Open-source validation and third-party security audits ensure our platform maintains the highest security standards for temporary email services. No data brokers, no selling user information - complete email privacy guaranteed.
            </p>
          </div>
        </div>

        {/* Trust Stats */}
        <div className="border-t border-border pt-12">
          <h3 className="text-lg font-semibold text-foreground mb-6">Proven at Scale</h3>
          <p className="text-muted-foreground mb-6">
            Join millions of users who trust Burner Email for spam prevention and privacy protection:
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span><strong>1M+ Temporary Emails Generated</strong> - Processed safely with zero security incidents</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span><strong>150K+ Active Users</strong> - Growing community trusting our disposable email service</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span><strong>99.9% Uptime Guarantee</strong> - Reliable temporary email access anytime, anywhere</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-bold mt-1">•</span>
              <span><strong>Multiple Premium Domains</strong> - Choose from trusted providers (ProtonMail, Tutanota, Zoho, GMX) for enhanced credibility</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
