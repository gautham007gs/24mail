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
      <DialogContent className="w-[95vw] sm:w-11/12 md:max-w-3xl lg:max-w-4xl h-[95vh] sm:h-[90vh] p-0 gap-0 glassmorphism flex flex-col overflow-hidden" data-testid="modal-email-detail">
        <DialogDescription className="sr-only">Email details and content</DialogDescription>
        {isLoading ? (
          <LoadingState />
        ) : email ? (
          <div className="flex h-full w-full flex-col overflow-hidden bg-background">
            {/* Header - Minimal one-liner */}
            <div className="border-b border-border px-2 sm:px-3 py-1 flex-shrink-0 bg-background">
              {/* Subject */}
              <h2 className="text-xs sm:text-sm font-semibold text-foreground break-words line-clamp-1 mb-0.5" data-testid="text-email-subject">
                {email.subject || "(No subject)"}
              </h2>
              
              {/* Metadata in one compact row */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-0.5 min-w-0">
                  <span className="font-medium text-foreground/60">From:</span>
                  <span className="text-foreground truncate" data-testid="text-email-from">{email.from_address}</span>
                </div>
                <span className="text-muted-foreground text-xs flex-shrink-0">•</span>
                <span className="text-muted-foreground text-xs flex-shrink-0" data-testid="text-email-date">
                  {formatDistanceToNow(email.received_at * 1000, { addSuffix: true })}
                </span>
                {email.has_attachments && (
                  <>
                    <span className="text-muted-foreground text-xs flex-shrink-0">•</span>
                    <span className="flex items-center gap-0.5 text-muted-foreground text-xs flex-shrink-0">
                      <Paperclip className="h-2.5 w-2.5" />
                      {email.attachment_count}
                    </span>
                  </>
                )}
              </div>

              {/* Action buttons - Single row, ultra-compact */}
              <div className="flex flex-nowrap gap-0.5 pt-0.5 overflow-x-auto">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyEmail}
                  data-testid="button-copy-email"
                  className="text-xs h-5 px-1.5 flex-shrink-0"
                >
                  <Copy className="h-2.5 w-2.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleShareWhatsApp}
                  data-testid="button-share-whatsapp"
                  className="text-xs h-5 px-1.5 flex-shrink-0"
                >
                  <MessageCircle className="h-2.5 w-2.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleShareTwitter}
                  data-testid="button-share-twitter"
                  className="text-xs h-5 px-1.5 flex-shrink-0"
                >
                  <Share2 className="h-2.5 w-2.5" />
                </Button>
                <div className="flex-1"></div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onDelete}
                  disabled={isDeleting}
                  data-testid="button-delete-email"
                  className="text-destructive border-destructive/30 text-xs h-5 px-1.5 flex-shrink-0"
                >
                  <Trash2 className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden min-h-0">
              <Tabs defaultValue={email.html_content ? "html" : "text"} className="h-full flex flex-col">
                {email.html_content && email.text_content && (
                  <div className="border-b border-border px-2 sm:px-3 py-0 flex-shrink-0 bg-background">
                    <TabsList className="h-5 bg-transparent gap-0">
                      <TabsTrigger value="html" data-testid="tab-html" className="text-xs px-1.5 data-[state=active]:bg-muted/50">HTML</TabsTrigger>
                      <TabsTrigger value="text" data-testid="tab-text" className="text-xs px-1.5 data-[state=active]:bg-muted/50">Text</TabsTrigger>
                    </TabsList>
                  </div>
                )}
                
                <div className="flex-1 overflow-hidden min-h-0">
                  {email.html_content && (
                    <TabsContent value="html" className="m-0 h-full overflow-auto bg-background p-2 sm:p-2.5">
                      <div
                        className="prose prose-xs max-w-full dark:prose-invert text-xs leading-tight text-foreground/90"
                        dangerouslySetInnerHTML={{ __html: email.html_content }}
                        data-testid="content-html"
                        style={{
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          wordBreak: 'break-word'
                        }}
                      />
                    </TabsContent>
                  )}
                  
                  {email.text_content && (
                    <TabsContent value="text" className="m-0 h-full overflow-auto bg-background p-2 sm:p-2.5">
                      <pre 
                        className="font-sans text-xs leading-tight text-foreground/90 whitespace-pre-wrap break-words" 
                        data-testid="content-text"
                      >
                        {email.text_content || "No content"}
                      </pre>
                    </TabsContent>
                  )}
                  
                  {!email.html_content && !email.text_content && (
                    <div className="h-full flex items-center justify-center p-2 bg-background">
                      <p className="text-muted-foreground text-center text-xs">No email content available</p>
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
