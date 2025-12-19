export function HowItWorks() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How to Create a Burner Email in Three Simple Steps</h2>
        
        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
          Getting started with Burner Email is instant and requires zero setup. Follow these simple steps to get your temporary email address and start protecting your privacy immediately.
        </p>

        <div className="space-y-10">
          {/* Step 1 */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Step 1: Get Your Instant Burner Email Address</h3>
            <p className="text-muted-foreground leading-relaxed">
              Visit Burner Email and your temporary email address is automatically generated. No signup required, no email verification, no personal information needed. You get an instant disposable email ready to use immediately. Choose from multiple premium domains including ProtonMail, Tutanota, and more for maximum credibility and security.
            </p>
          </div>

          {/* Step 2 */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Step 2: Copy Your Email and Use It Anywhere</h3>
            <p className="text-muted-foreground leading-relaxed">
              Copy your burner email address with one click and use it for online signups, service trials, account verification, and privacy-sensitive registrations. Use temporary emails for newsletters, e-commerce sites, social media accounts, or anywhere you want to protect your real email address. Perfect for testing new services without spam concerns or data privacy risks.
            </p>
          </div>

          {/* Step 3 */}
          <div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Step 3: Receive Emails and Stay Private</h3>
            <p className="text-muted-foreground leading-relaxed">
              Incoming emails appear in your inbox instantly as they arrive. View verification codes, password resets, and messages directly on Burner Email. Your real email stays completely protected from spam marketing, data breaches, and unsolicited contact. When done, your temporary email automatically expires and is permanently deleted - no manual cleanup needed.
            </p>
          </div>
        </div>

        {/* Additional Context */}
        <div className="mt-12 p-6 bg-muted/50 rounded-lg border border-border/50">
          <h4 className="font-semibold text-foreground mb-3">Perfect For:</h4>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Online shopping and e-commerce without spam emails</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Software trials and free account testing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Social media account creation and verification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Privacy-sensitive applications and anonymous browsing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Protecting your primary inbox from unwanted marketing</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
