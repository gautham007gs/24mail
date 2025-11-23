import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { getRandomMessage } from "@/lib/fun-messages";
import { audioEffects } from "@/lib/audio-effects";
import { type EmailSummary, type Email, type Domain } from "@shared/schema";
import { EmailGenerator } from "@/components/email-generator";
import { InboxList } from "@/components/inbox-list";
import { EmailDetailModal } from "@/components/email-detail-modal";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/notification-context";
import { Helmet } from "react-helmet";

export default function Home() {
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
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const { toast } = useToast();
  const { showNotification } = useNotifications();
  const previousEmailCount = useRef<number>(-1); // -1 means uninitialized

  // Fetch available domains
  const { data: domains = [] } = useQuery<Domain[]>({
    queryKey: ["/api/domains"],
  });

  // Fetch inbox for current email with custom handling for 404
  const { data: emails = [], isLoading: isLoadingInbox, refetch: refetchInbox, error: inboxError } = useQuery<EmailSummary[]>({
    queryKey: ["/api/inbox", currentEmail],
    enabled: !!currentEmail,
    queryFn: async () => {
      const response = await fetch(`/api/inbox/${encodeURIComponent(currentEmail)}`, {
        credentials: "include",
      });
      
      // 404 means no emails yet - return empty array without throwing
      if (response.status === 404) {
        return [];
      }
      
      // For other non-OK statuses, throw to trigger error state
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status}: ${text}`);
      }
      
      return await response.json();
    },
    refetchInterval: currentEmail ? 5000 : false, // Auto-refresh every 5 seconds
    staleTime: 0, // Always fetch fresh data
  });

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

  // Fetch selected email details
  const { data: selectedEmail, isLoading: isLoadingEmail } = useQuery<Email>({
    queryKey: ["/api/email", selectedEmailId],
    enabled: !!selectedEmailId,
  });

  // Delete email mutation
  const deleteEmailMutation = useMutation({
    mutationFn: async (emailId: string) => {
      await apiRequest("DELETE", `/api/email/${emailId}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Email deleted",
        description: "The email has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inbox", currentEmail] });
      setSelectedEmailId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete email. Please try again.",
        variant: "destructive",
      });
    },
  });

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
      
      // Play celebration sound
      audioEffects.playDing();
      
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
    setSelectedEmailId(null);
  };

  const handleEmailClick = (emailId: string) => {
    setSelectedEmailId(emailId);
  };

  const handleCloseModal = () => {
    setSelectedEmailId(null);
  };

  const handleDeleteEmail = () => {
    if (selectedEmailId) {
      deleteEmailMutation.mutate(selectedEmailId);
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
      <Helmet>
        <title>TempMail - Free Temporary Email Address | Disposable Email Service</title>
        <meta name="description" content="Get instant free temporary email addresses. Protect your privacy with disposable email. No registration required. Anonymous email service." />
        <meta name="keywords" content="temporary email, disposable email, temp mail, free email, anonymous email, throwaway email, burner email, privacy protection" />
      </Helmet>
      <Header />
      
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
          <div className="mt-12">
            <InboxList
              emails={emails}
              isLoading={isLoadingInbox}
              currentEmail={currentEmail}
              onEmailClick={handleEmailClick}
              onRefresh={handleRefresh}
              onDeleteAll={handleDeleteAllEmails}
              isDeleting={deleteAllEmailsMutation.isPending}
            />
          </div>
        </div>
      </main>

      <EmailDetailModal
        email={selectedEmail || null}
        isOpen={!!selectedEmailId}
        isLoading={isLoadingEmail}
        onClose={handleCloseModal}
        onDelete={handleDeleteEmail}
        isDeleting={deleteEmailMutation.isPending}
      />

      {/* Footer */}
      <Footer />
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
