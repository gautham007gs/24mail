import { useState, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import CacheManager from "@/lib/cache";
import { getRandomMessage } from "@/lib/fun-messages";
import { type EmailSummary, type Domain } from "@shared/schema";
import { Header } from "@/components/header";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/notification-context";
import { Helmet } from "react-helmet";
import { EmailGenerator } from "@/components/email-generator";
import { InboxList } from "@/components/inbox-list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Trash2, Shield, Clock, Globe, QrCode, Zap, Lock, CheckCircle } from "lucide-react";

// Lazy load below-fold sections for faster initial render
// Import functions return promises - delay import until after initial paint
const lazyWithDelay = (importFunc: () => Promise<any>) => {
  return lazy(() => {
    return new Promise((resolve) => {
      // Delay import until after browser is idle
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => resolve(importFunc()));
      } else {
        setTimeout(() => resolve(importFunc()), 100);
      }
    });
  });
};

const HowItWorks = lazyWithDelay(() => import("@/components/how-it-works").then(m => ({ default: m.HowItWorks })));
const TrustSection = lazyWithDelay(() => import("@/components/trust-section").then(m => ({ default: m.TrustSection })));
const UnifiedSocialProof = lazyWithDelay(() => import("@/components/unified-social-proof").then(m => ({ default: m.UnifiedSocialProof })));
const FAQAccordion = lazyWithDelay(() => import("@/components/faq-accordion").then(m => ({ default: m.FAQAccordion })));
const Footer = lazyWithDelay(() => import("@/components/footer").then(m => ({ default: m.Footer })));

// Helper function to generate a random username
function generateRandomUsername(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let username = "";
  for (let i = 0; i < 10; i++) {
    username += chars[Math.floor(Math.random() * chars.length)];
  }
  return username;
}

export default function Home() {

  // Structured data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Burner Email",
    "alternateName": ["burner email", "temp mail", "temporary email", "disposable email", "private email", "secure email", "anonymous email", "throwaway email"],
    "description": "Free burner email and temp mail service providing instant, anonymous disposable email addresses. Create temporary mail for maximum privacy protection, spam prevention, and secure private communication. Get instant burner email without signup.",
    "url": "https://burneremail.email",
    "applicationCategory": "UtilityApplication",
    "applicationSubCategory": "Privacy Tool, Email Service, Temporary Email",
    "keywords": "burner email, temp mail, temporary email, disposable email, private email, secure email, anonymous email, throwaway email, free email, spam prevention, email privacy",
    "inLanguage": "EN",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "5000",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "Burner Email"
    }
  };

  // State for the current email address
  const [currentEmail, setCurrentEmail] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const emailFromUrl = params.get("email");

      if (emailFromUrl) {
        localStorage.setItem("burneremail_current_email", emailFromUrl);
        window.history.replaceState({}, document.title, window.location.pathname);
        return emailFromUrl;
      }
      return localStorage.getItem("burneremail_current_email") || "";
    }
    return "";
  });
  const { toast } = useToast();
  const { showNotification } = useNotifications();
  const previousEmailCount = useRef<number>(-1); // -1 means uninitialized

  // Fetch available domains with caching
  const { data: domainsData = [] } = useQuery<Domain[]>({
    queryKey: ["/api/domains"],
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // Keep in cache for 24 hours
  });

  // Cache domains and memoize
  const domains = useMemo(() => {
    if (domainsData.length > 0) {
      CacheManager.set("domains_cache", domainsData, 24 * 60 * 60 * 1000);
    } else {
      const cached = CacheManager.get<Domain[]>("domains_cache");
      return cached || domainsData;
    }
    return domainsData;
  }, [domainsData]);

  // Fetch inbox for current email with smart caching
  const { data: emails = [], isLoading: isLoadingInbox, refetch: refetchInbox, error: inboxError } = useQuery<EmailSummary[]>({
    queryKey: ["/api/inbox", currentEmail],
    enabled: !!currentEmail,
    queryFn: async () => {
      const cacheKey = `inbox_${currentEmail}`;
      const cached = CacheManager.get<EmailSummary[]>(cacheKey);

      const response = await fetch(`/api/inbox/${encodeURIComponent(currentEmail)}`, {
        credentials: "include",
      });

      if (response.status === 404) {
        CacheManager.set(cacheKey, [], 30 * 1000);
        return cached || [];
      }

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }

      const data = await response.json();
      CacheManager.set(cacheKey, data, 10 * 1000);
      return data;
    },
    refetchInterval: currentEmail ? 5000 : false,
    staleTime: 8000,
  });

  // Progressive email loading
  // Show error toast if inbox fetch fails
  useEffect(() => {
    if (inboxError) {
      toast({
        title: "Error loading inbox",
        description: "Unable to fetch emails. Please try again later.",
        variant: "destructive",
      });
    }
  }, [inboxError, toast]);

  // Delete all emails mutation
  const deleteAllEmailsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/inbox/${encodeURIComponent(currentEmail)}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Inbox cleared",
        description: "All emails have been deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inbox", currentEmail] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear inbox. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete selected emails mutation
  const deleteSelectedMutation = useMutation({
    mutationFn: async (emailIds: string[]) => {
      await Promise.all(emailIds.map(id => apiRequest("DELETE", `/api/email/${id}`, {})));
    },
    onSuccess: (_, emailIds) => {
      toast({
        title: "Emails deleted",
        description: `${emailIds.length} email${emailIds.length !== 1 ? 's' : ''} have been deleted.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inbox", currentEmail] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete selected emails. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate initial email on mount if domains are available
  useEffect(() => {
    if (domains.length > 0 && !currentEmail) {
      const randomUsername = generateRandomUsername();
      const newEmail = `${randomUsername}@${domains[0]}`;
      setCurrentEmail(newEmail);
      if (typeof window !== "undefined") {
        localStorage.setItem("tempmail_current_email", newEmail);
      }
      const welcomeMessage = getRandomMessage("welcome");
      toast({
        title: welcomeMessage,
        description: "Share this email and start receiving!",
      });
    }
  }, [domains, currentEmail, toast]);

  // Track email count and notify on new emails
  useEffect(() => {
    if (previousEmailCount.current === -1) {
      previousEmailCount.current = emails.length;
      return;
    }

    if (emails.length > previousEmailCount.current) {
      const newEmailCount = emails.length - previousEmailCount.current;
      const latestEmail = emails[0];

      const arrivedMessage = getRandomMessage("emailArrived");
      showNotification(
        arrivedMessage,
        {
          body: newEmailCount === 1
            ? `From: ${latestEmail.from_address}\nSubject: ${latestEmail.subject || "(No subject)"}`
            : `You have ${newEmailCount} new emails`,
          tag: "new-email",
          requireInteraction: false,
        }
      );

      toast({
        title: arrivedMessage,
        description: newEmailCount === 1
          ? `From ${latestEmail.from_address}`
          : `You have ${newEmailCount} new emails`,
      });
    }

    previousEmailCount.current = emails.length;
  }, [emails, showNotification, toast]);

  const handleGenerateEmail = (email: string) => {
    setCurrentEmail(email);
    if (typeof window !== "undefined") {
      localStorage.setItem("tempmail_current_email", email);
    }
  };

  const handleDeleteAllEmails = () => {
    deleteAllEmailsMutation.mutate();
  };

  const handleRefresh = () => {
    refetchInbox();
  };

  return (
    <>
      <Helmet>
        <title>Burner Email - #1 Free Temporary Email & Temp Mail | Instant Private Email</title>
        <meta name="description" content="Create free burner email and temp mail instantly - no signup required. 150K+ users trust our secure disposable email service. 99.9% uptime, 1M+ emails monthly. Best temporary email for privacy protection, spam prevention, and anonymous communication." />
        <meta name="keywords" content="burner email, temp mail, temporary email, disposable email, private email, secure email, anonymous email, throwaway email, free email, email privacy, spam prevention, temporary mail, 10 minute mail, guerrilla mail alternative" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://burneremail.email/" />
        {/* hreflang tags for multilingual SEO */}
        <link rel="alternate" hrefLang="en" href="https://burneremail.email/" />
        <link rel="alternate" hrefLang="es" href="https://burneremail.email/?lang=es" />
        <link rel="alternate" hrefLang="pt" href="https://burneremail.email/?lang=pt" />
        <link rel="alternate" hrefLang="fr" href="https://burneremail.email/?lang=fr" />
        <link rel="alternate" hrefLang="de" href="https://burneremail.email/?lang=de" />
        <link rel="alternate" hrefLang="hi" href="https://burneremail.email/?lang=hi" />
        <link rel="alternate" hrefLang="x-default" href="https://burneremail.email/" />
        {/* Open Graph Meta Tags - 1200x630 for optimal sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://burneremail.email/" />
        <meta property="og:site_name" content="Burner Email" />
        <meta property="og:title" content="Burner Email - #1 Free Temporary Email & Temp Mail Service" />
        <meta property="og:description" content="Create instant burner email and temp mail. 150K+ users, 99.9% uptime, 1M+ emails monthly. Best disposable email for privacy protection. No signup needed." />
        <meta property="og:image" content="https://burneremail.email/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Burner Email - Free Temporary Email Service" />
        <meta property="og:locale" content="en_US" />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@burneremail" />
        <meta name="twitter:title" content="Burner Email - #1 Free Temporary Email & Temp Mail" />
        <meta name="twitter:description" content="Create instant burner email and temp mail. 150K+ users, 99.9% uptime. Best disposable email for privacy." />
        <meta name="twitter:image" content="https://burneremail.email/og-image.png" />
        <meta name="twitter:image:alt" content="Burner Email - Free Temporary Email Service" />
        {/* Structured Data (JSON-LD) */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Header
          domains={domains}
          selectedDomain={currentEmail.split('@')[1] || ''}
          onDomainChange={(domain) => {
            const username = currentEmail.split('@')[0];
            handleGenerateEmail(`${username}@${domain}`);
          }}
        />

        <main id="main-content" className="flex-1 px-3 sm:px-4 py-6 sm:py-8 md:px-6 md:py-12 w-full" aria-label="Main content area for Burner Email services">
        <div className="mx-auto max-w-3xl w-full">
          {/* Aria-live region for new email notifications */}
          <div
            ref={(el) => {
              if (el) (el as any).__ariaLiveRef = el;
            }}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            data-testid="aria-live-inbox"
          >
            {/* Content here will be announced by screen readers */}
          </div>

          {/* Email Generator Card */}
          <EmailGenerator
            currentEmail={currentEmail}
            domains={domains}
            onGenerate={handleGenerateEmail}
            emailCount={emails.length}
          />

          {/* Inbox Section */}
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 pb-8 fade-in border-t border-border/40">
            <div className="mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground">Inbox</h2>
            </div>
          </div>
        </div>

        {/* Three-Column Layout Below Inbox - Full Width */}
        <div className="mx-auto max-w-7xl w-full px-3 sm:px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Panel - Quick Actions & Status */}
            <aside className="hidden lg:block lg:col-span-3 space-y-4">
              <Card className="p-4 rounded-xl border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(currentEmail);
                      toast({ title: "Email copied!", description: "Ready to paste" });
                    }}
                  >
                    <Copy className="h-3.5 w-3.5 mr-2" />
                    Copy Email
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-2" />
                    Refresh Inbox
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-destructive"
                    onClick={handleDeleteAllEmails}
                    disabled={emails.length === 0}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Clear Inbox
                  </Button>
                </div>
              </Card>

              {/* Active Domain */}
              <Card className="p-4 rounded-xl border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Domain
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-mono">{currentEmail.split('@')[1] || 'Loading...'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    MX records active
                  </p>
                </div>
              </Card>

              {/* Help Tip */}
              <Card className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Tip:</strong> Share this email for signups, newsletters, or any service you don't fully trust.
                </p>
              </Card>
            </aside>

            {/* Center - Main Inbox */}
            <div className="lg:col-span-6">
              <InboxList
                emails={emails}
                isLoading={isLoadingInbox}
                currentEmail={currentEmail}
                onRefresh={handleRefresh}
                onDeleteAll={handleDeleteAllEmails}
                isDeleting={deleteAllEmailsMutation.isPending}
                onDeleteSelected={(emailIds) => deleteSelectedMutation.mutate(emailIds)}
              />
            </div>

            {/* Right Panel - Security & Privacy */}
            <aside className="hidden lg:block lg:col-span-3 space-y-4">
              <Card className="p-4 rounded-xl border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Privacy Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-xs text-muted-foreground">No IP logging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-xs text-muted-foreground">Encrypted storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-xs text-muted-foreground">Auto-delete enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-xs text-muted-foreground">DKIM/SPF verified</span>
                  </div>
                </div>
              </Card>

              {/* Email Stats */}
              <Card className="p-4 rounded-xl border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Session Info
                </h3>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Emails received</span>
                    <span className="font-medium text-foreground">{emails.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto-refresh</span>
                    <span className="font-medium text-foreground">5s</span>
                  </div>
                </div>
              </Card>

              {/* QR Code Preview */}
              <Card className="p-4 rounded-xl border border-border/50">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-primary" />
                  Mobile Access
                </h3>
                <p className="text-xs text-muted-foreground">
                  Click the QR icon in your email card to scan and access on mobile.
                </p>
              </Card>
            </aside>
          </div>
        </div>

        {/* Below-fold sections */}
        <div className="mx-auto max-w-3xl w-full px-3 sm:px-4 md:px-6">
          <Suspense fallback={<div className="h-32 bg-transparent" />}>
            {/* Trust Section - Why You Can Trust Us */}
            <TrustSection />

            {/* How It Works Section */}
            <div className="mt-14 md:mt-18 fade-in">
              <HowItWorks />
            </div>

            {/* Social Proof Section */}
            <div className="mt-14 md:mt-18 pt-10 md:pt-14 border-t border-border/30 fade-in">
              <UnifiedSocialProof />
            </div>
          </Suspense>
        </div>
      </main>

      {/* FAQ Section - Full Width */}
      <Suspense fallback={<div className="h-32 bg-transparent" />}>
        <div className="mt-14 md:mt-18 pt-12 md:pt-16 border-t border-border/30 fade-in">
          <FAQAccordion />
        </div>
      </Suspense>

      {/* Footer - Lazy loaded */}
      <Suspense fallback={<div className="h-32 bg-transparent" />}>
        <Footer />
      </Suspense>
    </div>
    </>
  );
}