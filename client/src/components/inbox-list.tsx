import { formatDistanceToNow } from "date-fns";
import { Mail, Inbox, RefreshCw, Trash2, Paperclip, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type EmailSummary } from "@shared/schema";
import { useState, useMemo, useEffect } from "react";

interface InboxListProps {
  emails: EmailSummary[];
  isLoading: boolean;
  currentEmail: string;
  onEmailClick: (emailId: string) => void;
  onRefresh: () => void;
  onDeleteAll: () => void;
  isDeleting: boolean;
}

export function InboxList({
  emails,
  isLoading,
  currentEmail,
  onEmailClick,
  onRefresh,
  onDeleteAll,
  isDeleting,
}: InboxListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Countdown timer for auto-refresh (5 seconds)
  useEffect(() => {
    if (!currentEmail) return;
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 5; // Reset to 5 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentEmail, emails]); // Reset countdown when emails change

  // Filter emails based on search query
  const filteredEmails = useMemo(() => {
    if (!searchQuery.trim()) {
      return emails;
    }

    const query = searchQuery.toLowerCase();
    return emails.filter((email) => {
      const from = email.from_address.toLowerCase();
      const subject = (email.subject || "").toLowerCase();
      const to = email.to_address.toLowerCase();
      
      return (
        from.includes(query) ||
        subject.includes(query) ||
        to.includes(query)
      );
    });
  }, [emails, searchQuery]);

  if (!currentEmail) {
    return null;
  }

  const hasSearchResults = searchQuery.trim() && filteredEmails.length === 0;

  return (
    <div className="mt-8 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-foreground" data-testid="text-inbox-title">Inbox</h2>
          <span className="text-sm text-muted-foreground" data-testid="text-inbox-count">
            ({searchQuery ? filteredEmails.length : emails.length})
          </span>
          {currentEmail && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full" data-testid="refresh-countdown-indicator">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </div>
              <span data-testid="countdown-timer">Refreshing in {countdown}s</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            data-testid="button-refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          {emails.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearDialog(true)}
              disabled={isDeleting}
              data-testid="button-delete-all"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Clear Inbox</span>
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {emails.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by sender or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
            data-testid="input-search-emails"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              data-testid="button-clear-search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Email List */}
      <div className="space-y-2">
        {isLoading ? (
          <LoadingState />
        ) : hasSearchResults ? (
          <NoSearchResults query={searchQuery} />
        ) : filteredEmails.length === 0 ? (
          <EmptyState />
        ) : (
          filteredEmails.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              onClick={() => onEmailClick(email.id)}
            />
          ))
        )}
      </div>

      {/* Clear Inbox Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent data-testid="dialog-clear-inbox">
          <AlertDialogHeader>
            <AlertDialogTitle data-testid="dialog-clear-inbox-title">Clear entire inbox?</AlertDialogTitle>
            <AlertDialogDescription data-testid="dialog-clear-inbox-description">
              This will permanently delete all {emails.length} email{emails.length !== 1 ? 's' : ''} from your inbox. 
              This action cannot be undone. Use this to remove sensitive emails and attachments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-clear-inbox">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDeleteAll();
                setShowClearDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-clear-inbox"
            >
              Clear Inbox
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmailCard({ email, onClick }: { email: EmailSummary; onClick: () => void }) {
  return (
    <Card
      className="p-4 hover-elevate active-elevate-2 cursor-pointer hover-lift smooth-transition"
      onClick={onClick}
      data-testid={`card-email-${email.id}`}
    >
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-foreground truncate" data-testid={`text-from-${email.id}`}>
              {email.from_address}
            </p>
            <span className="shrink-0 text-xs text-muted-foreground" data-testid={`text-time-${email.id}`}>
              {formatDistanceToNow(email.received_at * 1000, { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground/90 truncate" data-testid={`text-subject-${email.id}`}>
            {email.subject || "(No subject)"}
          </p>
          {email.has_attachments && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Paperclip className="h-3 w-3" />
              <span>{email.attachment_count} attachment{email.attachment_count > 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground" data-testid="text-empty-title">No emails yet</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm" data-testid="text-empty-message">
        Your temporary address is ready to receive emails. Share it and check back in a few moments.
      </p>
    </div>
  );
}

function NoSearchResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground" data-testid="text-no-results-title">
        No emails found
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm" data-testid="text-no-results-message">
        No emails match "{query}". Try a different search term.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
