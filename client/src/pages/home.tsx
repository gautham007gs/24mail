import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
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
    }
  }, [domains, currentEmail]);

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
      showNotification(
        newEmailCount === 1 ? "New email received" : `${newEmailCount} new emails received`,
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
        title: newEmailCount === 1 ? "New email" : `${newEmailCount} new emails`,
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
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
      </main>

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
