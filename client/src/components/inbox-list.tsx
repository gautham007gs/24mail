import { formatDistanceToNow } from "date-fns";
import { Mail, Inbox, RefreshCw, Trash2, Paperclip, Search, X, AlertCircle, Zap, ChevronDown, Shield, AlertTriangle, Star, Trash } from "lucide-react";
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

// Generate avatar initials and consistent color from email address
function getAvatarData(email: string): { initials: string; bgColor: string; textColor: string } {
  // Extract initials from email (e.g., "john.doe@example.com" -> "JD")
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/);
  const initials = parts.slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('').slice(0, 2);

  // Generate consistent color based on email hash
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = ((hash << 5) - hash) + email.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  const colors = [
    { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-900 dark:text-white' },
    { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-900 dark:text-white' },
    { bg: 'bg-pink-100 dark:bg-pink-900', text: 'text-pink-900 dark:text-white' },
    { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-900 dark:text-white' },
    { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-900 dark:text-white' },
    { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-900 dark:text-white' },
    { bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-900 dark:text-white' },
    { bg: 'bg-cyan-100 dark:bg-cyan-900', text: 'text-cyan-900 dark:text-white' },
  ];

  const selectedColor = colors[Math.abs(hash) % colors.length];
  return {
    initials: initials || '?',
    bgColor: selectedColor.bg,
    textColor: selectedColor.text,
  };
}

// Detect email type for color coding and badges
function getEmailType(email: EmailSummary): { type: 'verification' | 'security' | 'normal'; label: string; color: string } {
  const subject = (email.subject || "").toLowerCase();
  const sender = email.from_address.toLowerCase();

  // Security/verification keywords
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

  // Fetch expanded email details
  const { data: expandedEmail, isLoading: isLoadingExpandedEmail } = useQuery<Email>({
    queryKey: ["/api/email", expandedEmailId],
    enabled: !!expandedEmailId,
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

  // Countdown timer for auto-refresh (5 seconds)
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

  // Mark email as read when clicked
  const markAsRead = useCallback((emailId: string) => {
    setUnreadIds(prev => {
      const updated = prev.filter(id => id !== emailId);
      if (typeof window !== "undefined") {
        localStorage.setItem(`unread_${currentEmail}`, JSON.stringify(updated));
      }
      return updated;
    });
  }, [currentEmail]);

  // Toggle email selection
  const toggleSelect = useCallback((emailId: string) => {
    setSelectedIds(prev => {
      if (prev.includes(emailId)) {
        return prev.filter(id => id !== emailId);
      } else {
        return [...prev, emailId];
      }
    });
  }, []);

  // Select all visible emails
  const toggleSelectAll = useCallback(() => {
    if (selectedIds.length === filteredEmails.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEmails.map(e => e.id));
    }
  }, [filteredEmails, selectedIds]);

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (onDeleteSelected && selectedIds.length > 0) {
      onDeleteSelected(selectedIds);
      setSelectedIds([]);
      setShowBulkDialog(false);
    }
  };

  // Group emails by sender (threading)
  const groupedEmails = useMemo(() => {
    const groups = new Map<string, EmailSummary[]>();
    filteredEmails.forEach(email => {
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

  // Count new (unread) emails
  const newEmailCount = unreadIds.length;

  return (
    <div className="space-y-5 md:space-y-6 shadow-sm">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground" data-testid="text-inbox-title">Inbox</h2>
          <span className="text-base font-semibold text-foreground bg-accent/10 px-2.5 py-1 rounded-full" data-testid="text-inbox-count">
            {searchQuery ? filteredEmails.length : emails.length}
          </span>
          {hasSelected && (
            <span className="ml-4 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
              {selectedIds.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasSelected && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBulkDialog(true)}
              disabled={isDeleting}
              data-testid="button-delete-selected"
              className="text-destructive border-destructive/30 hover:bg-destructive/10 active-elevate-2"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete {selectedIds.length}
            </Button>
          )}
          {emails.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearDialog(true)}
              disabled={isDeleting}
              data-testid="button-delete-all"
              className="text-destructive border-destructive/30 hover:bg-destructive/10 active-elevate-2"
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
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
            data-testid="button-refresh"
            aria-label="Refresh inbox to check for new emails"
            title="Refresh inbox"
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
            data-testid="input-search-emails"
            aria-label="Search emails by sender, subject, or recipient"
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
              aria-label="Clear search query"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Table Layout */}
      <div className="border border-border/80 rounded-lg overflow-hidden bg-background">
        {/* Table Header */}
        {(filteredEmails.length > 0 || (searchQuery && !hasSearchResults)) && (
          <div className="bg-muted/50 grid grid-cols-12 gap-3 px-3 sm:px-6 py-3 border-b border-border/80">
            <div className="hidden sm:block col-span-1 text-xs font-semibold text-foreground"></div>
            <div className="col-span-5 sm:col-span-3 text-xs font-semibold text-foreground">SENDER</div>
            <div className="hidden md:block col-span-5 text-xs font-semibold text-foreground">SUBJECT</div>
            <div className="col-span-4 sm:col-span-2 text-xs font-semibold text-foreground text-right">DATE</div>
            <div className="col-span-3 sm:col-span-1 text-xs font-semibold text-foreground text-right"></div>
          </div>
        )}

        {/* Table Body */}
        <div className="divide-y divide-border/80">
          {isLoading ? (
            <LoadingState />
          ) : hasSearchResults ? (
            <NoSearchResults query={searchQuery} />
          ) : filteredEmails.length === 0 ? (
            <EmptyState emptyMessage={emptyMessage} />
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

    // Start long press timer (500ms)
    longPressTimerRef.current = setTimeout(() => {
      onSelect(email.id);
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!longPressTimerRef.current) return; // Long press already triggered

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = touchStartRef.current.x - currentX;
    const deltaY = touchStartRef.current.y - currentY;

    // If vertical scroll is more than horizontal, cancel
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
      return;
    }

    // Cancel long press on horizontal movement
    if (longPressTimerRef.current && (Math.abs(deltaX) > 10)) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Detect swipe direction
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
    // Cancel long press timer if still active
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Handle swipe actions
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

  // Get email type for color coding
  const emailInfo = getEmailType(email);

  // Desktop table view
  return (
    <div className="relative">
      {/* Swipe action backgrounds */}
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

      {/* Email row */}
      <div
        className={`grid grid-cols-12 gap-3 px-3 sm:px-6 py-3 sm:py-4 min-h-14 hover:bg-muted/30 cursor-pointer transition-all items-center border-l-4 swipe-row ${
          isSelected ? "bg-accent/5 border-accent" : isExpanded ? "bg-muted/20 border-accent" : isUnread ? "border-accent bg-accent/5" : "border-transparent"
        }`}
        onClick={handleRowClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        data-testid={`row-email-${email.id}`}
        style={{ 
          transform: `translateX(${swipeDirection === 'left' ? -swipeDistance : swipeDistance}px)`,
          transition: swipeDistance === 0 ? 'transform 0.2s ease-out' : 'none',
        }}
      >
      {/* Checkbox */}
      <div
        className="hidden sm:flex col-span-1 items-center"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(email.id);
        }}
      >
        <CheckboxComponent checked={isSelected} data-testid={`checkbox-email-${email.id}`} />
      </div>

      {/* Sender with Avatar, Unread Badge and Icons */}
      <div className="col-span-5 sm:col-span-3 text-xs sm:text-sm truncate flex items-center gap-2" data-testid={`text-from-${email.id}`}>
        {isUnread && <span className="h-2.5 w-2.5 rounded-full bg-accent shrink-0 animate-pulse" data-testid={`unread-badge-${email.id}`} />}

        {/* Avatar with initials */}
        <AvatarPlaceholder email={email.from_address} emailId={email.id} />

        <span className={`truncate ${isUnread ? "font-bold text-foreground" : "text-foreground/80"}`}>{email.from_address}</span>
        {email.has_attachments && (
          <Paperclip className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 shrink-0" data-testid={`attachment-icon-${email.id}`} aria-label="Has attachment" />
        )}
        {isStarred && (
          <Star className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 shrink-0 fill-current" data-testid={`star-icon-${email.id}`} aria-label="Starred email" />
        )}
      </div>

      {/* Subject with Email Type Badge */}
      <div className="hidden md:flex col-span-5 text-xs sm:text-sm truncate flex items-center gap-2" data-testid={`text-subject-${email.id}`}>
        <span className={`truncate ${isUnread ? "font-semibold text-foreground" : "text-foreground/80"}`}>
          {email.subject || "(No subject)"}
        </span>
        {emailInfo.type !== 'normal' && (
          <span className={`inline-flex items-center shrink-0 text-xs px-2 py-0.5 rounded-md ${emailInfo.color}`} data-testid={`badge-${emailInfo.type}-${email.id}`}>
            {emailInfo.type === 'verification' && <Shield className="h-3 w-3 mr-1" />}
            {emailInfo.type === 'security' && <AlertTriangle className="h-3 w-3 mr-1" />}
            {emailInfo.label}
          </span>
        )}
      </div>

      {/* Timestamp */}
      <div className={`col-span-4 sm:col-span-2 text-xs text-right ${isUnread ? "font-semibold text-foreground" : "text-muted-foreground"}`} data-testid={`text-date-${email.id}`}>
        {formatDistanceToNow(email.received_at * 1000, { addSuffix: false })}
      </div>

      {/* Expand Button */}
      <div className="col-span-3 sm:col-span-1 flex justify-end">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            handleRowClick();
          }}
          data-testid={`button-expand-email-${email.id}`}
        >
          <span className="hidden sm:inline text-xs">{isExpanded ? "Close" : "View"}</span>
          <ChevronDown className={`sm:hidden h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </Button>
      </div>
      </div>
    </div>
  );
}

function AvatarPlaceholder({ email, emailId }: { email: string; emailId: string }) {
  const avatarData = getAvatarData(email);
  return (
    <div
      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 font-semibold text-xs ${avatarData.bgColor} ${avatarData.textColor}`}
      data-testid={`avatar-${emailId}`}
      title={email}
    >
      {avatarData.initials}
    </div>
  );
}

function EmptyState({ emptyMessage }: { emptyMessage: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="relative mb-6">
        {/* Soft gradient background shape */}
        <div className="absolute inset-0 h-32 w-32 rounded-full bg-gradient-to-br from-accent/15 to-accent/5 blur-2xl" />
        {/* Icon */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 shadow-sm">
          <Inbox className="h-10 w-10 text-accent/60" />
        </div>
      </div>
      <h3 className="text-title font-semibold text-foreground mt-6" data-testid="text-empty-title">
        {emptyMessage}
      </h3>
      <p className="text-body-small text-muted-foreground mt-3 max-w-xs" data-testid="text-empty-message">
        Share your email address to start receiving messages
      </p>
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span>Email will refresh automatically every 5 seconds</span>
      </div>
    </div>
  );
}

function NoSearchResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/40">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-title font-semibold text-foreground mt-4" data-testid="text-no-results-title">
        No emails found
      </h3>
      <p className="text-body-small text-muted-foreground max-w-sm mt-2" data-testid="text-no-results-message">
        No emails match <span className="font-mono font-semibold text-foreground/70">"{query}"</span>
      </p>
    </div>
  );
}

function LoadingState() {
  return <InboxLoadingSkeleton count={5} />;
}