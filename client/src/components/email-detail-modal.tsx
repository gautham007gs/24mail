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
      <DialogContent className="w-[95vw] sm:w-11/12 md:max-w-2xl lg:max-w-3xl max-h-[90vh] p-0 glassmorphism flex flex-col overflow-hidden" data-testid="modal-email-detail">
        <DialogDescription className="sr-only">Email details and content</DialogDescription>
        {isLoading ? (
          <LoadingState />
        ) : email ? (
          <div className="flex h-full flex-col overflow-hidden">
            {/* Header */}
            <div className="border-b border-border px-3 sm:px-6 py-4 sm:py-5 flex-shrink-0">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground flex-1 break-words pr-2" data-testid="text-email-subject">
                    {email.subject || "(No subject)"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    data-testid="button-close-modal"
                    className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
                    aria-label="Close email"
                    title="Close email"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Email metadata - Clean and compact */}
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-foreground/70">From</span>
                    <span className="text-foreground break-all" data-testid="text-email-from">
                      {email.from_address}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-foreground/70">To</span>
                    <span className="text-foreground break-all" data-testid="text-email-to">
                      {email.to_address}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-foreground/70">
                    <span className="text-muted-foreground" data-testid="text-email-date">
                      {formatDistanceToNow(email.received_at * 1000, { addSuffix: true })}
                    </span>
                    {email.has_attachments && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Paperclip className="h-4 w-4" />
                        <span className="text-xs">
                          {email.attachment_count || 0} attachment{email.attachment_count !== 1 ? "s" : ""}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Action buttons - Clean and organized */}
                <div className="flex flex-wrap gap-1 pt-2 border-t border-border/50">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyEmail}
                    data-testid="button-copy-email"
                    className="text-xs h-8"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    <span className="hidden sm:inline">Copy</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleShareWhatsApp}
                    data-testid="button-share-whatsapp"
                    className="text-xs h-8"
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-1" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleShareTwitter}
                    data-testid="button-share-twitter"
                    className="text-xs h-8"
                  >
                    <Share2 className="h-3.5 w-3.5 mr-1" />
                    <span className="hidden sm:inline">Tweet</span>
                  </Button>
                  <div className="flex-1"></div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onDelete}
                    disabled={isDeleting}
                    data-testid="button-delete-email"
                    className="text-destructive border-destructive/30 text-xs h-8"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    <span className="hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden min-h-0 bg-muted/30">
              <Tabs defaultValue={email.html_content ? "html" : "text"} className="h-full flex flex-col">
                {email.html_content && email.text_content && (
                  <div className="border-b border-border px-3 sm:px-6 py-3 flex-shrink-0 bg-background">
                    <TabsList className="h-9">
                      <TabsTrigger value="html" data-testid="tab-html" className="text-sm">HTML View</TabsTrigger>
                      <TabsTrigger value="text" data-testid="tab-text" className="text-sm">Text View</TabsTrigger>
                    </TabsList>
                  </div>
                )}
                
                <ScrollArea className="flex-1 min-h-0">
                  {email.html_content && (
                    <TabsContent value="html" className="m-0 h-full">
                      <div className="h-full p-4 sm:p-6 overflow-auto">
                        <div
                          className="prose prose-base max-w-full dark:prose-invert text-base leading-relaxed text-foreground/90"
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
                    <TabsContent value="text" className="m-0 h-full">
                      <div className="h-full p-4 sm:p-6 overflow-auto">
                        <pre 
                          className="font-sans text-base leading-relaxed text-foreground/90 whitespace-pre-wrap break-words bg-transparent" 
                          data-testid="content-text"
                        >
                          {email.text_content || "No content"}
                        </pre>
                      </div>
                    </TabsContent>
                  )}
                  
                  {!email.html_content && !email.text_content && (
                    <div className="h-full flex items-center justify-center p-6">
                      <p className="text-muted-foreground text-center">No email content available</p>
                    </div>
                  )}
                </ScrollArea>
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
