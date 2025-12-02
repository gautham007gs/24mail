import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import CacheManager from "@/lib/cache";
import { getRandomMessage } from "@/lib/fun-messages";
import { type EmailSummary, type Domain } from "@shared/schema";
import { Header } from "@/components/header";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/notification-context";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/contexts/language-context";
import { Helmet } from "react-helmet";
import { EmailGenerator } from "@/components/email-generator";
import { InboxList } from "@/components/inbox-list";
import { HowItWorks } from "@/components/how-it-works";
import { Footer } from "@/components/footer";
import { TrustSection } from "@/components/trust-section";
import { UnifiedSocialProof } from "@/components/unified-social-proof";
import { FAQAccordion } from "@/components/faq-accordion";

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
  const { t } = useTranslation();
  const { language } = useLanguage();

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
    "inLanguage": language.toUpperCase(),
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
  const [displayedEmails, setDisplayedEmails] = useState<EmailSummary[]>([]);
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
  useEffect(() => {
    if (emails.length > displayedEmails.length) {
      const newEmails = emails.slice(displayedEmails.length);
      let index = 0;
      const interval = setInterval(() => {
        if (index < newEmails.length) {
          setDisplayedEmails(prev => [newEmails[index], ...prev]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    } else if (emails.length < displayedEmails.length) {
      setDisplayedEmails(emails);
    }
  }, [emails]);

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
        <title>Burner Email - Free Temporary Email & Temp Mail | Secure Private Email Service</title>
        <meta name="description" content="Get free burner email, temp mail, and disposable email instantly - no signup required. Protect your privacy with Burner Email's secure private mail service. Spam prevention, anonymous communication, and email privacy in one platform." />
        <meta name="keywords" content="burner email, temp mail, temporary email, disposable email, private email, secure email, anonymous email, throwaway email, free email, email privacy, spam prevention, temporary mail" />
        <link rel="canonical" href="https://burneremail.email/" />
        {/* hreflang tags for multilingual SEO */}
        <link rel="alternate" hrefLang="en" href="https://burneremail.email/" />
        <link rel="alternate" hrefLang="es" href="https://burneremail.email/?lang=es" />
        <link rel="alternate" hrefLang="pt" href="https://burneremail.email/?lang=pt" />
        <link rel="alternate" hrefLang="fr" href="https://burneremail.email/?lang=fr" />
        <link rel="alternate" hrefLang="de" href="https://burneremail.email/?lang=de" />
        <link rel="alternate" hrefLang="hi" href="https://burneremail.email/?lang=hi" />
        <link rel="alternate" hrefLang="x-default" href="https://burneremail.email/" />
        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://burneremail.email/" />
        <meta property="og:title" content="Burner Email - Free Temporary Email & Temp Mail" />
        <meta property="og:description" content="Get free burner email and temp mail instantly. Create disposable email for privacy protection. No signup needed." />
        <meta property="og:image" content="https://burneremail.email/logo-256.png" />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Burner Email - Free Temporary Email & Temp Mail" />
        <meta name="twitter:description" content="Get instant burner email and temp mail. Disposable email for spam prevention and privacy protection." />
        <meta name="twitter:image" content="https://burneremail.email/logo-256.png" /> {/* Added twitter:image for completeness */}
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

        <main role="main" id="main-content" className="flex-1 px-3 sm:px-4 py-6 sm:py-8 md:px-6 md:py-12 w-full" aria-label="Main content area for Burner Email services">
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
          {/* Hero Section - Above the Fold */}
          <div className="text-center mb-8 md:mb-12 space-y-5">
            <h1 className="text-display text-foreground">
              {t("hero.title")}
            </h1>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto px-4">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col items-center gap-4 pt-3">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4">
                <span className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold shadow-md hover-elevate" data-testid="badge-free">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t("hero.badge.free")}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold shadow-md hover-elevate" data-testid="badge-anonymous">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t("hero.badge.anonymous")}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold shadow-md hover-elevate" data-testid="badge-instant">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t("hero.badge.instant")}
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-accent px-4 py-2 rounded-full bg-accent/10 inline-block shadow-sm" data-testid="text-user-count">{t("hero.trusted")}</p>
              </div>
            </div>
          </div>

          {/* Email Generator Card */}
          <EmailGenerator
            currentEmail={currentEmail}
            domains={domains}
            onGenerate={handleGenerateEmail}
            emailCount={emails.length}
          />

          {/* Inbox Section */}
          <div className="mt-24 md:mt-32 pt-16 md:pt-20 pb-12 border-t border-border/30 fade-in">
            <InboxList
              emails={displayedEmails}
              isLoading={isLoadingInbox}
              currentEmail={currentEmail}
              onRefresh={handleRefresh}
              onDeleteAll={handleDeleteAllEmails}
              isDeleting={deleteAllEmailsMutation.isPending}
              onDeleteSelected={(emailIds) => deleteSelectedMutation.mutate(emailIds)}
            />
          </div>

          {/* Trust Section - Why You Can Trust Us */}
          <TrustSection />

          {/* How It Works Section */}
          <div className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-border/30 fade-in">
            <HowItWorks />
          </div>

          {/* Social Proof Section */}
          <div className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-border/30 fade-in">
            <UnifiedSocialProof />
          </div>

        </div>
      </main>

      {/* FAQ Section - Full Width */}
      <div className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-border/30 fade-in">
        <FAQAccordion />
      </div>

      {/* Footer */}
      <Footer />
    </div>
    </>
  );
}