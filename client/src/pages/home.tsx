import { useState, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import CacheManager from "@/lib/cache";
import { getRandomMessage } from "@/lib/fun-messages";
import { type EmailSummary, type Domain } from "@shared/schema";
import { EmailGenerator } from "@/components/email-generator";
import { InboxList } from "@/components/inbox-list";
import { Header } from "@/components/header";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/notification-context";

// Lazy load below-the-fold components for faster initial load
const HowItWorks = lazy(() => import("@/components/how-it-works").then(m => ({ default: m.HowItWorks })));
const Footer = lazy(() => import("@/components/footer").then(m => ({ default: m.Footer })));
const UnifiedSocialProof = lazy(() => import("@/components/unified-social-proof").then(m => ({ default: m.UnifiedSocialProof })));
const TestimonialsCarousel = lazy(() => import("@/components/testimonials-carousel").then(m => ({ default: m.TestimonialsCarousel })));
const FAQAccordion = lazy(() => import("@/components/faq-accordion").then(m => ({ default: m.FAQAccordion })));

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TempMail",
    "description": "Free temporary email service providing instant, anonymous disposable email addresses for privacy protection",
    "url": "https://tempmail.org",
    "applicationCategory": "UtilityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const [currentEmail, setCurrentEmail] = useState<string>(() => {
    if (typeof window !== "undefined") {
      // Check for email in URL query params first (from QR code share)
      const params = new URLSearchParams(window.location.search);
      const emailFromUrl = params.get("email");
      
      if (emailFromUrl) {
        // Save to localStorage and update URL
        localStorage.setItem("tempmail_current_email", emailFromUrl);
        // Clean up URL by removing query params
        window.history.replaceState({}, document.title, window.location.pathname);
        return emailFromUrl;
      }
      
      // Otherwise load from localStorage
      return localStorage.getItem("tempmail_current_email") || "";
    }
    return "";
  });
  const [displayedEmails, setDisplayedEmails] = useState<EmailSummary[]>([]);
  const { toast } = useToast();
  const { showNotification } = useNotifications();
  const previousEmailCount = useRef<number>(-1); // -1 means uninitialized

  // Fetch available domains with caching (24 hour TTL) - defer until needed
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
      // Try to get from cache if API call fails
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
      // Check cache first for instant response
      const cacheKey = `inbox_${currentEmail}`;
      const cached = CacheManager.get<EmailSummary[]>(cacheKey);
      
      const response = await fetch(`/api/inbox/${encodeURIComponent(currentEmail)}`, {
        credentials: "include",
      });
      
      // 404 means no emails yet - return empty array without throwing
      if (response.status === 404) {
        CacheManager.set(cacheKey, [], 30 * 1000); // Cache empty result for 30s
        return cached || [];
      }
      
      // For other non-OK statuses, throw to trigger error state
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }
      
      const data = await response.json();
      // Cache for 10 seconds (shorter since emails arrive frequently)
      CacheManager.set(cacheKey, data, 10 * 1000);
      return data;
    },
    refetchInterval: currentEmail ? 5000 : false, // Auto-refresh every 5 seconds
    staleTime: 8000, // Reuse data for 8 seconds
  });

  // Progressive email loading - add new emails gradually
  useEffect(() => {
    if (emails.length > displayedEmails.length) {
      // New emails arrived - add them one by one with a small delay
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
      // Emails were deleted - update immediately
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
      // Persist to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("tempmail_current_email", newEmail);
      }
      // Show welcome message
      const welcomeMessage = getRandomMessage("welcome");
      toast({
        title: welcomeMessage,
        description: "Share this email and start receiving!",
      });
    }
  }, [domains, currentEmail, toast]);

  // Track email count and notify on new emails
  useEffect(() => {
    // Initialize on first load - don't notify for existing emails
    if (previousEmailCount.current === -1) {
      previousEmailCount.current = emails.length;
      return;
    }

    // Detect new emails
    if (emails.length > previousEmailCount.current) {
      const newEmailCount = emails.length - previousEmailCount.current;
      const latestEmail = emails[0]; // Newest email is first
      
      // Show browser notification
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

      // Show in-app toast notification
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
    // Persist email to localStorage
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
    <div className="min-h-screen flex flex-col bg-background">
        <Header 
          domains={domains}
          selectedDomain={currentEmail.split('@')[1] || ''}
          onDomainChange={(domain) => {
            const username = currentEmail.split('@')[0];
            handleGenerateEmail(`${username}@${domain}`);
          }}
        />
        
        <main className="flex-1 px-4 py-8 md:px-6 md:py-12 w-full">
        <div className="mx-auto max-w-3xl">
          {/* Email Generator Card */}
          <EmailGenerator
            currentEmail={currentEmail}
            domains={domains}
            onGenerate={handleGenerateEmail}
            emailCount={emails.length}
          />

          {/* Inbox Section */}
          <div className="mt-12 pt-8 md:pt-12 border-t border-border/30 fade-in">
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

          {/* How It Works Section - Lazy loaded for faster initial render */}
          <div className="mt-20 pt-8 md:pt-12 border-t border-border/30 fade-in">
            <Suspense fallback={<div className="h-96 bg-muted/30 rounded-lg animate-pulse" />}>
              <HowItWorks />
            </Suspense>
          </div>

          {/* Social Proof & Trust Section - Lazy loaded for faster initial render */}
          <div className="mt-20 space-y-20 fade-in">
            {/* Unified Social Proof */}
            <Suspense fallback={<div className="h-32 bg-muted/30 rounded-lg animate-pulse" />}>
              <section>
                <UnifiedSocialProof />
              </section>
            </Suspense>

            {/* Testimonials */}
            <Suspense fallback={<div className="h-96 bg-muted/30 rounded-lg animate-pulse" />}>
              <section className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">What Users Say</h2>
                  <p className="text-muted-foreground">Loved by teams at leading organizations worldwide</p>
                </div>
                <TestimonialsCarousel />
              </section>
            </Suspense>

            {/* FAQ Section */}
            <Suspense fallback={<div className="h-96 bg-muted/30 rounded-lg animate-pulse" />}>
              <section className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground">Everything you need to know about TempMail</p>
                </div>
                <FAQAccordion />
              </section>
            </Suspense>
          </div>
        </div>
      </main>

      {/* Footer - Lazy loaded */}
      <Suspense fallback={<div className="h-40 bg-muted/20" />}>
        <Footer />
      </Suspense>
    </div>
  );
}

function generateRandomUsername(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let username = "";
  for (let i = 0; i < 10; i++) {
    username += chars[Math.floor(Math.random() * chars.length)];
  }
  return username;
}
