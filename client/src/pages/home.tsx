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
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/notification-context";

export default function Home() {
  const [currentEmail, setCurrentEmail] = useState<string>(() => {
    // Load email from localStorage on initial mount
    if (typeof window !== "undefined") {
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Left Ad Space - Desktop Only */}
        <aside className="hidden lg:flex lg:w-48 px-4 pt-8">
          <div 
            className="w-full bg-gradient-to-b from-muted/30 to-muted/10 rounded-lg border border-border/50 p-4 flex items-center justify-center text-xs text-muted-foreground min-h-96"
            data-testid="ad-space-left"
          >
            {/* Ad space placeholder */}
            <div className="text-center space-y-2">
              <div className="text-lg font-semibold">Ad Space</div>
              <div>Sidebar (Left)</div>
              <div className="text-xs">300x400</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 mx-auto px-4 py-8 md:px-6 md:py-12 w-full">
          <EmailGenerator
            currentEmail={currentEmail}
            domains={domains}
            onGenerate={handleGenerateEmail}
          />

          <InboxList
            emails={emails}
            isLoading={isLoadingInbox}
            currentEmail={currentEmail}
            onEmailClick={handleEmailClick}
            onRefresh={handleRefresh}
            onDeleteAll={handleDeleteAllEmails}
            isDeleting={deleteAllEmailsMutation.isPending}
          />

          {/* Banner Ad - Below Content - Mobile & Desktop */}
          <div 
            className="mt-8 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-border/50 p-6 flex items-center justify-center text-xs text-muted-foreground"
            data-testid="ad-space-banner"
          >
            {/* Ad space placeholder */}
            <div className="text-center space-y-1">
              <div className="text-lg font-semibold">Banner Ad</div>
              <div className="text-xs">Responsive (728x90, 468x60, 320x50)</div>
            </div>
          </div>
        </main>

        {/* Right Ad Space - Desktop Only */}
        <aside className="hidden lg:flex lg:w-48 px-4 pt-8">
          <div 
            className="w-full bg-gradient-to-b from-muted/30 to-muted/10 rounded-lg border border-border/50 p-4 flex items-center justify-center text-xs text-muted-foreground min-h-96"
            data-testid="ad-space-right"
          >
            {/* Ad space placeholder */}
            <div className="text-center space-y-2">
              <div className="text-lg font-semibold">Ad Space</div>
              <div>Sidebar (Right)</div>
              <div className="text-xs">300x400</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Banner Ad */}
      <div 
        className="lg:hidden bg-gradient-to-r from-muted/30 to-muted/10 border-t border-border/50 p-4 flex items-center justify-center text-xs text-muted-foreground"
        data-testid="ad-space-mobile-bottom"
      >
        {/* Ad space placeholder */}
        <div className="text-center space-y-1">
          <div className="text-base font-semibold">Mobile Ad</div>
          <div className="text-xs">320x50</div>
        </div>
      </div>

      <EmailDetailModal
        email={selectedEmail || null}
        isOpen={!!selectedEmailId}
        isLoading={isLoadingEmail}
        onClose={handleCloseModal}
        onDelete={handleDeleteEmail}
        isDeleting={deleteEmailMutation.isPending}
      />
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
