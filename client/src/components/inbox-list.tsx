import { formatDistanceToNow } from "date-fns";
import { Mail, Inbox, RefreshCw, Trash2, Paperclip, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { getRandomMessage } from "@/lib/fun-messages";
import { audioEffects } from "@/lib/audio-effects";
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
  const [emptyMessage] = useState(() => getRandomMessage("emptyInbox"));
  const [loadingMessage] = useState(() => getRandomMessage("loading"));

  // Countdown timer for auto-refresh (5 seconds)
  useEffect(() => {
    if (!currentEmail) return;
    
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          audioEffects.playWhip();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentEmail, emails]);

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
    <div className="mt-12 space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground" data-testid="text-inbox-title">Inbox</h2>
          <span className="text-sm text-muted-foreground" data-testid="text-inbox-count">
            ({searchQuery ? filteredEmails.length : emails.length})
          </span>
        </div>
        <div className="flex items-center gap-2">
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
          {currentEmail && (
            <div 
              className="flex items-center gap-1.5 text-sm font-medium text-foreground/60 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/5 to-primary/10 smooth-transition" 
              data-testid="refresh-countdown-indicator"
              aria-label={`Auto-refresh in ${countdown} seconds`}
            >
              <span data-testid="countdown-timer" className="font-semibold">{countdown}s</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            data-testid="button-refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
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

      {/* Table Layout */}
      <div className="border border-border/50 rounded-lg overflow-hidden bg-background">
        {/* Table Header */}
        {(filteredEmails.length > 0 || (searchQuery && !hasSearchResults)) && (
          <div className="bg-foreground/10 grid grid-cols-12 gap-4 px-6 py-3 border-b border-border/50">
            <div className="col-span-4 text-sm font-semibold text-foreground">SENDER</div>
            <div className="col-span-6 text-sm font-semibold text-foreground">SUBJECT</div>
            <div className="col-span-2 text-sm font-semibold text-foreground text-right">VIEW</div>
          </div>
        )}

        {/* Table Body */}
        <div className="divide-y divide-border/50">
          {isLoading ? (
            <LoadingState />
          ) : hasSearchResults ? (
            <NoSearchResults query={searchQuery} />
          ) : filteredEmails.length === 0 ? (
            <EmptyState emptyMessage={emptyMessage} />
          ) : (
            filteredEmails.map((email) => (
              <EmailTableRow
                key={email.id}
                email={email}
                onClick={() => onEmailClick(email.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Clear Inbox Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent data-testid="dialog-clear-inbox">
          <AlertDialogHeader>
            <AlertDialogTitle data-testid="dialog-clear-inbox-title">Clear entire inbox?</AlertDialogTitle>
            <AlertDialogDescription data-testid="dialog-clear-inbox-description">
              This will permanently delete all {emails.length} email{emails.length !== 1 ? 's' : ''} from your inbox. 
              This action cannot be undone.
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

function EmailTableRow({ email, onClick }: { email: EmailSummary; onClick: () => void }) {
  return (
    <div
      className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-muted/30 cursor-pointer transition-colors items-center"
      onClick={onClick}
      data-testid={`row-email-${email.id}`}
    >
      {/* Sender */}
      <div className="col-span-4 text-sm truncate" data-testid={`text-from-${email.id}`}>
        {email.from_address}
      </div>

      {/* Subject */}
      <div className="col-span-6 text-sm truncate text-foreground/80" data-testid={`text-subject-${email.id}`}>
        {email.subject || "(No subject)"}
      </div>

      {/* View Button */}
      <div className="col-span-2 flex justify-end">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          data-testid={`button-view-email-${email.id}`}
        >
          View
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ emptyMessage }: { emptyMessage: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground" data-testid="text-empty-title">
        {emptyMessage}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground" data-testid="text-empty-message">
        Waiting for incoming emails
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
  const loadingMessage = getRandomMessage("loading");
  
  return (
    <div className="space-y-0">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground font-medium">{loadingMessage}</p>
      </div>
    </div>
  );
}
