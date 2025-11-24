import { formatDistanceToNow } from "date-fns";
import { X, Trash2, Paperclip, Share2, MessageCircle, Mail, Copy, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { shareEmail, shareToWhatsApp, shareToTwitter, shareToTelegram, copyToClipboard } from "@/lib/email-share";
import { type Email } from "@shared/schema";

interface EmailDetailModalProps {
  email: Email | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function EmailDetailModal({
  email,
  isOpen,
  isLoading,
  onClose,
  onDelete,
  isDeleting,
}: EmailDetailModalProps) {
  const { toast } = useToast();

  const handleShare = async () => {
    if (!email) return;
    const result = await shareEmail({
      from: email.from_address,
      to: email.to_address,
      subject: email.subject || "(No subject)",
      content: email.text_content || email.html_content || "No content",
      receivedAt: email.received_at * 1000,
    });
    if (result?.success) {
      toast({ title: "Shared", description: result.message });
    }
  };

  const handleShareWhatsApp = () => {
    if (!email) return;
    shareToWhatsApp({
      from: email.from_address,
      to: email.to_address,
      subject: email.subject || "(No subject)",
      content: email.text_content || email.html_content || "No content",
      receivedAt: email.received_at * 1000,
    });
  };

  const handleShareTwitter = () => {
    if (!email) return;
    shareToTwitter({
      from: email.from_address,
      to: email.to_address,
      subject: email.subject || "(No subject)",
      content: email.text_content || email.html_content || "No content",
      receivedAt: email.received_at * 1000,
    });
  };

  const handleShareTelegram = () => {
    if (!email) return;
    shareToTelegram({
      from: email.from_address,
      to: email.to_address,
      subject: email.subject || "(No subject)",
      content: email.text_content || email.html_content || "No content",
      receivedAt: email.received_at * 1000,
    });
  };

  const handleCopyEmail = async () => {
    if (!email) return;
    const result = await copyToClipboard({
      from: email.from_address,
      to: email.to_address,
      subject: email.subject || "(No subject)",
      content: email.text_content || email.html_content || "No content",
      receivedAt: email.received_at * 1000,
    });
    toast({ title: result?.success ? "Copied" : "Failed", description: result?.message });
  };

  const handleDownloadAttachment = async (attachmentId: string, filename: string) => {
    try {
      const response = await fetch(`/api/attachment/${email?.id}/${attachmentId}`);
      
      if (!response.ok) {
        toast({
          title: "Download failed",
          description: "Could not download attachment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Downloaded",
        description: `${filename} downloaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download attachment",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-11/12 md:max-w-3xl lg:max-w-4xl h-[95vh] sm:h-[90vh] p-0 glassmorphism flex flex-col overflow-hidden" data-testid="modal-email-detail">
        <DialogDescription className="sr-only">Email details and content</DialogDescription>
        {isLoading ? (
          <LoadingState />
        ) : email ? (
          <div className="flex h-full w-full flex-col overflow-hidden">
            {/* Header - Compact */}
            <div className="border-b border-border px-3 sm:px-4 py-2 sm:py-3 flex-shrink-0 bg-background">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-base sm:text-lg font-semibold text-foreground flex-1 break-words line-clamp-2" data-testid="text-email-subject">
                    {email.subject || "(No subject)"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    data-testid="button-close-modal"
                    className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0"
                    aria-label="Close email"
                    title="Close email"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Email metadata - Minimal and compact */}
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-foreground/70">From:</span>
                    <span className="text-foreground break-all text-right" data-testid="text-email-from">
                      {email.from_address}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground" data-testid="text-email-date">
                      {formatDistanceToNow(email.received_at * 1000, { addSuffix: true })}
                    </span>
                    {email.has_attachments && (
                      <span className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Paperclip className="h-3 w-3" />
                        {email.attachment_count || 0}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons - Compact row */}
                <div className="flex flex-wrap gap-1 pt-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyEmail}
                    data-testid="button-copy-email"
                    className="text-xs h-7"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleShareWhatsApp}
                    data-testid="button-share-whatsapp"
                    className="text-xs h-7"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleShareTwitter}
                    data-testid="button-share-twitter"
                    className="text-xs h-7"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Tweet
                  </Button>
                  <div className="flex-1"></div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onDelete}
                    disabled={isDeleting}
                    data-testid="button-delete-email"
                    className="text-destructive border-destructive/30 text-xs h-7"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden min-h-0 bg-background">
              <Tabs defaultValue={email.html_content ? "html" : "text"} className="h-full flex flex-col">
                {email.html_content && email.text_content && (
                  <div className="border-b border-border px-3 sm:px-4 py-1 flex-shrink-0 bg-background/50">
                    <TabsList className="h-8 bg-transparent">
                      <TabsTrigger value="html" data-testid="tab-html" className="text-xs sm:text-sm">HTML</TabsTrigger>
                      <TabsTrigger value="text" data-testid="tab-text" className="text-xs sm:text-sm">Text</TabsTrigger>
                    </TabsList>
                  </div>
                )}
                
                <div className="flex-1 overflow-hidden min-h-0">
                  {email.html_content && (
                    <TabsContent value="html" className="m-0 h-full overflow-hidden">
                      <div className="h-full overflow-y-auto p-3 sm:p-4">
                        <div
                          className="prose prose-sm max-w-full dark:prose-invert text-sm leading-relaxed text-foreground/90"
                          dangerouslySetInnerHTML={{ __html: email.html_content }}
                          data-testid="content-html"
                          style={{
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word'
                          }}
                        />
                      </div>
                    </TabsContent>
                  )}
                  
                  {email.text_content && (
                    <TabsContent value="text" className="m-0 h-full overflow-hidden">
                      <div className="h-full overflow-y-auto p-3 sm:p-4">
                        <pre 
                          className="font-sans text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap break-words bg-transparent" 
                          data-testid="content-text"
                        >
                          {email.text_content || "No content"}
                        </pre>
                      </div>
                    </TabsContent>
                  )}
                  
                  {!email.html_content && !email.text_content && (
                    <div className="h-full flex items-center justify-center p-4">
                      <p className="text-muted-foreground text-center text-sm">No email content available</p>
                    </div>
                  )}
                </div>
              </Tabs>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function LoadingState() {
  return (
    <div className="p-6 space-y-4">
      <div className="space-y-3">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Separator />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
