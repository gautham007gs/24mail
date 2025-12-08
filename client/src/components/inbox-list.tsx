import { formatDistanceToNow } from "@/lib/relative-time";
import { Mail, Inbox, RefreshCw, Trash2, Paperclip, Search, X, AlertCircle, Zap, ChevronDown, Shield, AlertTriangle, Star, Trash, Ghost, Mailbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Checkbox as CheckboxComponent } from "@/components/ui/checkbox";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InlineEmailReader } from "@/components/inline-email-reader";
import { getRandomMessage } from "@/lib/fun-messages";
import { InboxLoadingSkeleton } from "@/lib/loading-skeletons";
import { type EmailSummary, type Email } from "@shared/schema";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

function getAvatarData(email: string): { initials: string; bgColor: string; textColor: string } {
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/);
  const initials = parts.slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('').slice(0, 2);

  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i);
    hash = hash & hash;
  }

  const colors = [
    { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-900 dark:text-white' },
    { bg: 'bg-teal-100 dark:bg-teal-900', text: 'text-teal-900 dark:text-white' },
    { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-900 dark:text-white' },
    { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-900 dark:text-white' },
  ];

  const selectedColor = colors[Math.abs(hash) % colors.length];
  return {
    initials: initials || '?',
    bgColor: selectedColor.bg,
    textColor: selectedColor.text,
  };
}

function getEmailType(email: EmailSummary): { type: 'verification' | 'security' | 'normal'; label: string; color: string } {
  const subject = (email.subject || "").toLowerCase();
  const sender = email.from_address.toLowerCase();

  const verificationKeywords = ['verify', 'confirm', 'verification', 'confirmation', 'activate', 'validate', 'check', 'urgent verify', 'urgent action'];
  const securityKeywords = ['reset password', 'password reset', 'reset your', 'verify identity', 'confirm identity', 'security alert', 'unusual activity', 'suspicious', 'unauthorized'];

  const text = `${subject} ${sender}`;

  if (securityKeywords.some(keyword => text.includes(keyword))) {
    return { type: 'security', label: 'Security', color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100' };
  }

  if (verificationKeywords.some(keyword => text.includes(keyword))) {
    return { type: 'verification', label: 'Verification', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100' };
  }

  return { type: 'normal', label: '', color: '' };
}

interface InboxListProps {
  emails: EmailSummary[];
  isLoading: boolean;
  currentEmail: string;
  onRefresh: () => void;
  onDeleteAll: () => void;
  isDeleting: boolean;
  onDeleteSelected?: (emailIds: string[]) => void;
}

let previousEmailCount = 0;

function EmptyStateIllustration() {
  return (
    <div 
      className="flex flex-col items-center justify-center py-16 px-4"
      role="status"
      aria-live="polite"
      aria-label="Your inbox is empty. Share your temporary email address and emails will appear here automatically."
    >
      {/* Simplified Mailbox Illustration - reduced animations for accessibility */}
      <div className="relative mb-8">
        {/* Subtle glow effect - no animation */}
        <div className="absolute inset-0 bg-emerald-500/15 rounded-full blur-2xl" style={{ width: '180px', height: '180px', left: '-40px', top: '-40px' }} />
        
        {/* Mailbox */}
        <div className="relative">
          <div className="w-32 h-24 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 rounded-2xl border-2 border-emerald-500/30 flex items-center justify-center relative overflow-hidden">
            {/* Mailbox flag */}
            <div className="absolute -right-1 top-3 w-3 h-8 bg-orange-500/80 rounded-sm transform rotate-12" aria-hidden="true" />
            
            {/* Static mailbox icon */}
            <Mailbox className="h-12 w-12 text-emerald-400/70" aria-hidden="true" />
          </div>
          
          {/* Mailbox post */}
          <div className="w-4 h-12 bg-gradient-to-b from-muted to-muted/50 rounded-b-lg mx-auto" aria-hidden="true" />
        </div>

        {/* Static envelope decorations - removed floating animations */}
        <div className="absolute -top-4 -left-6" aria-hidden="true">
          <Mail className="h-6 w-6 text-emerald-400/40" />
        </div>
        <div className="absolute -top-2 -right-8" aria-hidden="true">
          <Mail className="h-5 w-5 text-orange-400/40" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">Waiting for new emails</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        No messages yet. Share your temporary email address and new emails will appear here.
      </p>
      
      {/* Static decorative dots - removed pulse animation */}
      <div className="flex items-center gap-2" aria-hidden="true">
        <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/35" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
      </div>
    </div>
  );
}

function SkeletonEmailRow() {
  return (
    <div className="grid grid-cols-12 gap-3 px-4 sm:px-5 py-4 items-center" aria-hidden="true">
      <div className="hidden sm:block col-span-1">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="col-span-5 sm:col-span-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="hidden md:block col-span-5 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="col-span-4 sm:col-span-2 flex justify-end">
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="col-span-3 sm:col-span-1 flex justify-end">
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div 
      className="space-y-1"
      role="status"
      aria-live="polite"
      aria-label="Loading emails, please wait..."
    >
      <span className="sr-only">Loading emails...</span>
      <SkeletonEmailRow />
      <SkeletonEmailRow />
      <SkeletonEmailRow />
      <SkeletonEmailRow />
    </div>
  );
}

function NoSearchResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
      <p className="text-sm text-muted-foreground">
        No emails match "<span className="font-medium">{query}</span>"
      </p>
    </div>
  );
}

export function InboxList({
  emails,
  isLoading,
  currentEmail,
  onRefresh,
  onDeleteAll,
  isDeleting,
  onDeleteSelected,
}: InboxListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [emptyMessage] = useState(() => getRandomMessage("emptyInbox"));
  const [loadingMessage] = useState(() => getRandomMessage("loading"));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [expandedEmailId, setExpandedEmailId] = useState<string | null>(null);
  const { toast } = useToast();
  const [unreadIds, setUnreadIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`unread_${currentEmail}`);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [starredIds, setStarredIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(`starred_${currentEmail}`);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const ariaLiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (emails.length > previousEmailCount && ariaLiveRef.current) {
      const newCount = emails.length - previousEmailCount;
      const message = newCount === 1 ? "1 new email received" : `${newCount} new emails received`;
      ariaLiveRef.current.textContent = message;
    }
    previousEmailCount = emails.length;
  }, [emails.length]);

  const { data: expandedEmail, isLoading: isLoadingExpandedEmail } = useQuery<Email>({
    queryKey: ["/api/email", expandedEmailId],
    enabled: !!expandedEmailId,
  });

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
      setExpandedEmailId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete email. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!currentEmail) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentEmail, emails]);

  const filteredEmails = useMemo(() => {
    if (!searchQuery.trim()) {
      return emails.filter(email => email != null);
    }

    const query = searchQuery.toLowerCase();
    return emails.filter((email) => {
      if (!email) return false;
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

  const markAsRead = useCallback((emailId: string) => {
    setUnreadIds(prev => {
      const updated = prev.filter(id => id !== emailId);
      if (typeof window !== "undefined") {
        localStorage.setItem(`unread_${currentEmail}`, JSON.stringify(updated));
      }
      return updated;
    });
  }, [currentEmail]);

  const toggleSelect = useCallback((emailId: string) => {
    setSelectedIds(prev => {
      if (prev.includes(emailId)) {
        return prev.filter(id => id !== emailId);
      } else {
        return [...prev, emailId];
      }
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.length === filteredEmails.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEmails.map(e => e.id));
    }
  }, [filteredEmails, selectedIds]);

  const handleBulkDelete = () => {
    if (onDeleteSelected && selectedIds.length > 0) {
      onDeleteSelected(selectedIds);
      setSelectedIds([]);
      setShowBulkDialog(false);
    }
  };

  const groupedEmails = useMemo(() => {
    const groups = new Map<string, EmailSummary[]>();
    filteredEmails.filter(email => email != null).forEach(email => {
      const sender = email.from_address;
      if (!groups.has(sender)) {
        groups.set(sender, []);
      }
      groups.get(sender)!.push(email);
    });
    return Array.from(groups.entries());
  }, [filteredEmails]);

  if (!currentEmail) {
    return null;
  }

  const hasSearchResults = searchQuery.trim() && filteredEmails.length === 0;
  const hasSelected = selectedIds.length > 0;

  const newEmailCount = unreadIds.length;

  return (
    <div className="space-y-6">
      {/* Header with Actions - Mobile responsive layout */}
      <div className="flex flex-col gap-4">
        {/* Title and Count */}
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-inbox-title">Inbox</h2>
          <span className="text-sm font-semibold text-accent bg-accent/10 px-3 py-1.5 rounded-full min-h-8 flex items-center" data-testid="text-inbox-count">
            {searchQuery ? filteredEmails.length : emails.length}
          </span>
          {hasSelected && (
            <span className="text-sm px-3 py-1.5 bg-accent/10 text-accent rounded-full font-medium min-h-8 flex items-center">
              {selectedIds.length} selected
            </span>
          )}
        </div>

        {/* Action Buttons - Right aligned on mobile */}
        <div className="flex items-center gap-2 flex-wrap justify-start sm:justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {hasSelected && (
              <Button
                size="sm"
                onClick={() => setShowBulkDialog(true)}
                disabled={isDeleting}
                data-testid="button-burn-selected"
                className="btn-danger btn-hover-scale active-elevate-2"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Burn {selectedIds.length}
              </Button>
            )}
            {emails.length > 0 && (
              <Button
                size="sm"
                onClick={() => setShowClearDialog(true)}
                disabled={isDeleting}
                data-testid="button-destroy-inbox"
                className="btn-danger btn-hover-scale active-elevate-2"
              >
                <Trash2 className="h-4 w-4 mr-1.5" aria-hidden="true" />
                <span className="hidden sm:inline">Destroy Inbox</span>
              </Button>
            )}
          </div>

          {/* Refresh and Timer - Right side on mobile */}
          <div className="flex items-center gap-2 ml-auto">
            {currentEmail && (
              <div 
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground/70 px-3 py-1.5 rounded-full bg-muted/50" 
                data-testid="refresh-countdown-indicator"
                aria-label={`Auto-refresh in ${countdown} seconds`}
              >
                <RefreshCw className="h-3 w-3 opacity-50" />
                <span data-testid="countdown-timer">{countdown}s</span>
              </div>
            )}
            <Button
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              data-testid="button-refresh"
              aria-label="Refresh inbox"
              title="Refresh inbox"
              className={`min-h-[44px] min-w-[44px] ${isLoading ? "bg-blue-100 dark:bg-blue-900/30" : ""}`}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-blue-600 dark:text-blue-400" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {emails.length > 0 && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            data-testid="input-search-emails"
            aria-label="Search emails"
            placeholder="Search emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 py-2.5 text-sm"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px]"
              data-testid="button-clear-search"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Table Layout */}
      <div className="rounded-xl overflow-hidden border border-border/50 bg-background shadow-lg">
        {/* Table Header */}
        {(filteredEmails.length > 0 || (searchQuery && !hasSearchResults)) && (
          <div className="bg-foreground/90 dark:bg-foreground/10 grid grid-cols-12 gap-3 px-4 sm:px-5 py-3 sm:py-3.5 border-b border-border/50">
            <div className="hidden sm:block col-span-1"></div>
            <div className="col-span-5 sm:col-span-3 text-xs font-bold text-foreground/70 dark:text-foreground/80 uppercase tracking-wider">Sender</div>
            <div className="hidden md:block col-span-5 text-xs font-bold text-foreground/70 dark:text-foreground/80 uppercase tracking-wider">Subject</div>
            <div className="col-span-4 sm:col-span-2 text-xs font-bold text-foreground/70 dark:text-foreground/80 uppercase tracking-wider text-right">Date</div>
            <div className="col-span-3 sm:col-span-1 text-right text-xs font-bold text-foreground/70 dark:text-foreground/80 uppercase tracking-wider">View</div>
          </div>
        )}

        {/* Table Body */}
        <div className="divide-y divide-border/30">
          {isLoading ? (
            <LoadingState />
          ) : hasSearchResults ? (
            <NoSearchResults query={searchQuery} />
          ) : filteredEmails.length === 0 ? (
            <EmptyStateIllustration />
          ) : (
            filteredEmails.map((email) => (
              <div key={email.id}>
                <EmailTableRow
                  email={email}
                  isSelected={selectedIds.includes(email.id)}
                  onSelect={toggleSelect}
                  isUnread={unreadIds.includes(email.id)}
                  onMarkRead={markAsRead}
                  isExpanded={expandedEmailId === email.id}
                  onToggleExpand={(id) => {
                    if (expandedEmailId === id) {
                      setExpandedEmailId(null);
                    } else {
                      setExpandedEmailId(id);
                    }
                  }}
                  isStarred={starredIds.includes(email.id)}
                  onToggleStar={(id) => {
                    setStarredIds(prev => {
                      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
                      if (typeof window !== "undefined") {
                        localStorage.setItem(`starred_${currentEmail}`, JSON.stringify(updated));
                      }
                      return updated;
                    });
                  }}
                  onDelete={(id) => {
                    deleteEmailMutation.mutate(id);
                  }}
                />
                {expandedEmailId === email.id && (
                  <div className="col-span-full border-t border-border/50">
                    <InlineEmailReader
                      email={expandedEmail || null}
                      isLoading={isLoadingExpandedEmail}
                      onClose={() => setExpandedEmailId(null)}
                      onDelete={() => deleteEmailMutation.mutate(email.id)}
                      isDeleting={deleteEmailMutation.isPending}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <AlertDialogContent data-testid="dialog-bulk-delete">
          <AlertDialogHeader>
            <AlertDialogTitle data-testid="dialog-bulk-delete-title">Delete {selectedIds.length} email{selectedIds.length !== 1 ? 's' : ''}?</AlertDialogTitle>
            <AlertDialogDescription data-testid="dialog-bulk-delete-description">
              This will permanently delete the selected email{selectedIds.length !== 1 ? 's' : ''}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-bulk-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-bulk-delete"
            >
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Destroy Inbox Dialog - 2-step confirmation */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent data-testid="dialog-destroy-inbox">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-destructive/15">
                <AlertTriangle className="h-5 w-5 text-destructive" aria-hidden="true" />
              </div>
              <AlertDialogTitle data-testid="dialog-destroy-inbox-title" className="text-lg font-bold">
                Destroy Inbox?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription data-testid="dialog-destroy-inbox-description" className="text-sm text-muted-foreground">
              This will <strong className="text-destructive">permanently destroy</strong> all {emails.length} email{emails.length !== 1 ? 's' : ''} in your inbox. 
              This action is irreversible and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel data-testid="button-cancel-destroy-inbox" className="min-h-10">
              Keep Emails
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDeleteAll();
                setShowClearDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 min-h-10"
              data-testid="button-confirm-destroy-inbox"
            >
              <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
              Destroy Inbox
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmailTableRow({
  email,
  isSelected,
  onSelect,
  isUnread,
  onMarkRead,
  isExpanded,
  onToggleExpand,
  isStarred,
  onToggleStar,
  onDelete,
}: {
  email: EmailSummary;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isUnread: boolean;
  onMarkRead: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  isStarred: boolean;
  onToggleStar: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const touchStartRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };

    longPressTimerRef.current = setTimeout(() => {
      onSelect(email.id);
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!longPressTimerRef.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = touchStartRef.current.x - currentX;
    const deltaY = touchStartRef.current.y - currentY;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      return;
    }

    if (longPressTimerRef.current && (Math.abs(deltaX) > 10)) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (Math.abs(deltaX) > 5) {
      if (deltaX > 0) {
        setSwipeDirection('left');
      } else {
        setSwipeDirection('right');
      }
    }

    const distance = Math.abs(deltaX);
    setSwipeDistance(Math.min(distance, 100));
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (swipeDistance > 60) {
      if (swipeDirection === 'left') {
        onDelete(email.id);
      } else if (swipeDirection === 'right') {
        onToggleStar(email.id);
      }
    }

    setSwipeDistance(0);
    setSwipeDirection(null);
  };

  const handleRowClick = () => {
    onMarkRead(email.id);
    onToggleExpand(email.id);
  };

  const emailInfo = getEmailType(email);
  const avatar = getAvatarData(email.from_address);

  return (
    <div className="relative">
      {swipeDirection === 'left' && swipeDistance > 0 && (
        <div className="absolute inset-0 bg-destructive/90 flex items-center justify-end pr-6 rounded-lg pointer-events-none">
          <Trash className="h-5 w-5 text-destructive-foreground" />
        </div>
      )}
      {swipeDirection === 'right' && swipeDistance > 0 && (
        <div className="absolute inset-0 bg-amber-500 dark:bg-amber-600 flex items-center justify-start pl-6 rounded-lg pointer-events-none">
          <Star className="h-5 w-5 text-white" />
        </div>
      )}

      <div
        className={`grid grid-cols-12 gap-3 px-4 sm:px-5 py-3 sm:py-4 min-h-16 hover:bg-muted/20 cursor-pointer transition-all items-center border-l-4 swipe-row ${
          isSelected ? "bg-accent/8 border-accent" : isExpanded ? "bg-muted/15 border-accent" : isUnread ? "border-accent bg-accent/6" : "border-transparent hover:border-border/30"
        }`}
        onClick={handleRowClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: swipeDistance > 0 ? `translateX(${swipeDirection === 'left' ? -swipeDistance : swipeDistance}px)` : 'none',
        }}
        data-testid={`email-row-${email.id}`}
      >
        {/* Avatar */}
        <div className="hidden sm:flex col-span-1 items-center justify-center">
          <div className={`h-10 w-10 rounded-full ${avatar.bgColor} ${avatar.textColor} flex items-center justify-center font-bold text-sm`}>
            {avatar.initials}
          </div>
        </div>

        {/* Sender */}
        <div className="col-span-5 sm:col-span-3 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {isStarred && <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
            <span className={`truncate ${isUnread ? "font-bold text-foreground" : "text-foreground/80"}`}>{email.from_address}</span>
            {email.has_attachments && (
              <Paperclip className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            )}
          </div>
          {emailInfo.label && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${emailInfo.color} font-medium`}>
              {emailInfo.label}
            </span>
          )}
        </div>

        {/* Subject */}
        <div className="hidden md:block col-span-5 min-w-0">
          <p className={`truncate ${isUnread ? "font-semibold text-foreground" : "text-foreground/70"}`}>
            {email.subject || "(No subject)"}
          </p>
        </div>

        {/* Date */}
        <div className="col-span-4 sm:col-span-2 text-right">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}
          </span>
        </div>

        {/* View Button */}
        <div className="col-span-3 sm:col-span-1 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(email.id);
            }}
            data-testid={`button-view-email-${email.id}`}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4 rotate-180" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
