import { Link } from "wouter";
import { ArrowLeft, Download, Zap, Shield, Copy, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

export default function BrowserExtension() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Browser Extension - TempMail</title>
        <meta name="description" content="Install TempMail browser extension for Chrome and Firefox. Generate temporary emails instantly from any website." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
            <Link href="/">
              <a className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </a>
            </Link>
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-4 md:px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
              TempMail Browser Extension
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Generate temporary email addresses instantly from any website. One-click email generation. Auto-fill forms. Never miss an email. Available for Chrome and Firefox.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="https://chromewebstore.google.com/detail/tempmail-temporary-email/lkhkkbmpldaojfklpjlkhkflojmpjfla" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full md:w-auto">
                  <Download className="h-5 w-5 mr-2" />
                  Install for Chrome
                </Button>
              </a>
              <a href="https://addons.mozilla.org/en-US/firefox/addon/tempmail/" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="w-full md:w-auto">
                  <Download className="h-5 w-5 mr-2" />
                  Install for Firefox
                </Button>
              </a>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6">
              <Zap className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">One-Click Generation</h3>
              <p className="text-muted-foreground">Click the extension icon to generate a new temporary email instantly. Copy with one more click.</p>
            </Card>
            <Card className="p-6">
              <Copy className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">Auto-Fill Forms</h3>
              <p className="text-muted-foreground">Automatically fill email fields in forms with your temporary address. Supports all major websites.</p>
            </Card>
            <Card className="p-6">
              <Shield className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">Privacy Protection</h3>
              <p className="text-muted-foreground">Your real email stays private. Receive confirmation emails without exposing your identity.</p>
            </Card>
          </div>

          {/* How to Use Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">How to Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "Install Extension",
                  description: "Add TempMail to your Chrome or Firefox browser"
                },
                {
                  step: "2",
                  title: "Click Icon",
                  description: "Click the TempMail icon whenever you need an email"
                },
                {
                  step: "3",
                  title: "Copy Email",
                  description: "Copy the generated temporary email address"
                },
                {
                  step: "4",
                  title: "Receive Emails",
                  description: "Emails appear instantly in your TempMail inbox"
                }
              ].map((item) => (
                <Card key={item.step} className="p-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Key Features Section */}
          <section className="bg-muted/30 rounded-lg p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Powerful Features</h2>
            <div className="space-y-4">
              {[
                "✓ Generate unlimited temporary email addresses",
                "✓ One-click copying to clipboard",
                "✓ Smart auto-fill - works on 1000+ websites",
                "✓ Real-time notifications for new emails",
                "✓ View & reply to emails from extension popup",
                "✓ Dark mode support matching your browser",
                "✓ Lightning-fast performance (< 0.1 seconds)",
                "✓ Cross-platform sync (Cloud backup)",
                "✓ Zero data collection - Privacy first",
                "✓ QR code generation for mobile sharing",
                "✓ Works offline - stores locally until synced",
                "✓ Keyboard shortcuts (Alt+T to activate)"
              ].map((feature, idx) => (
                <div key={idx} className="text-foreground/80 text-lg">
                  {feature}
                </div>
              ))}
            </div>
          </section>

          {/* Supported Websites */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Works With Your Favorite Sites</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Gmail",
                "Reddit",
                "GitHub",
                "Twitter",
                "LinkedIn",
                "Amazon",
                "Medium",
                "Discord",
                "Spotify",
                "Netflix",
                "Slack",
                "HackerNews"
              ].map((site) => (
                <Card key={site} className="p-4 text-center">
                  <p className="font-semibold text-foreground">{site}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Installation Instructions */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Installation Instructions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Chrome Instructions */}
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Globe className="h-6 w-6" />
                  Chrome Installation
                </h3>
                <ol className="space-y-4 list-decimal list-inside text-foreground/80">
                  <li>Click the link: <a href="https://chromewebstore.google.com/detail/tempmail-temporary-email/lkhkkbmpldaojfklpjlkhkflojmpjfla" className="text-primary underline">TempMail on Chrome Web Store</a></li>
                  <li>Click the blue "Add to Chrome" button</li>
                  <li>Confirm the permissions popup</li>
                  <li>Extension appears in your toolbar (top-right)</li>
                  <li>Click the TempMail icon to generate an email</li>
                  <li>Start using instantly - no setup needed!</li>
                </ol>
              </Card>

              {/* Firefox Instructions */}
              <Card className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Globe className="h-6 w-6" />
                  Firefox Installation
                </h3>
                <ol className="space-y-4 list-decimal list-inside text-foreground/80">
                  <li>Click the link: <a href="https://addons.mozilla.org/en-US/firefox/addon/tempmail/" className="text-primary underline">TempMail on Firefox Add-ons</a></li>
                  <li>Click the blue "Add to Firefox" button</li>
                  <li>Confirm the permissions and installation</li>
                  <li>Extension appears in your toolbar (top-right)</li>
                  <li>Click the TempMail icon to generate an email</li>
                  <li>Start using instantly - no setup needed!</li>
                </ol>
              </Card>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Is the extension free?",
                  a: "Yes! TempMail browser extension is completely free, just like the web version. No premium features, no ads, no hidden costs."
                },
                {
                  q: "Does it work offline?",
                  a: "The extension can generate emails offline, but you'll need internet to receive emails in your inbox. Email sync happens automatically when online."
                },
                {
                  q: "Is my data private?",
                  a: "Absolutely. The extension doesn't collect any personal data. We only sync email addresses you explicitly generate. No tracking, no analytics, complete privacy."
                },
                {
                  q: "Can I use multiple devices?",
                  a: "Yes! Install the extension on multiple devices and use the same temporary email across all of them. Use QR code sharing for instant cross-device access."
                },
                {
                  q: "Does it work with password managers?",
                  a: "Yes! The extension works seamlessly with 1Password, LastPass, Bitwarden, and other password managers."
                },
                {
                  q: "What permissions does it need?",
                  a: "The extension only needs access to read/write form fields on websites you visit. This allows auto-filling email addresses. No other permissions are requested."
                }
              ].map((faq, idx) => (
                <Card key={idx} className="p-6">
                  <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <div className="text-center py-12 bg-muted/30 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Protect Your Privacy?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Install the TempMail browser extension now and never expose your real email address again.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="https://chromewebstore.google.com/detail/tempmail-temporary-email/lkhkkbmpldaojfklpjlkhkflojmpjfla" target="_blank" rel="noopener noreferrer">
                <Button size="lg">
                  <Download className="h-5 w-5 mr-2" />
                  Get for Chrome
                </Button>
              </a>
              <a href="https://addons.mozilla.org/en-US/firefox/addon/tempmail/" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline">
                  <Download className="h-5 w-5 mr-2" />
                  Get for Firefox
                </Button>
              </a>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
