import { formatDistanceToNow } from "date-fns";
import { Trash2, Paperclip, Share2, MessageCircle, Copy, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { shareToWhatsApp, shareToTwitter, shareToTelegram, copyToClipboard } from "@/lib/email-share";
import { type Email } from "@shared/schema";

interface InlineEmailReaderProps {
  email: Email | null;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function InlineEmailReader({
  email,
  isLoading,
  onClose,
  onDelete,
  isDeleting,
}: InlineEmailReaderProps) {
  const { toast } = useToast();

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

  if (isLoading) {
    return (
      <div className="col-span-full bg-background border border-border/50 p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    );
  }

  if (!email) {
    return null;
  }

  return (
    <div className="col-span-full bg-background border border-border/50 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border/50 px-3 sm:px-4 py-2 flex-shrink-0">
        {/* Subject */}
        <h3 className="text-sm sm:text-base font-semibold text-foreground break-words line-clamp-1 mb-1" data-testid="text-inline-email-subject">
          {email.subject || "(No subject)"}
        </h3>

        {/* Metadata in one line */}
        <div className="flex items-center gap-2 text-xs mb-2">
          <div className="flex items-center gap-0.5 min-w-0">
            <span className="font-medium text-foreground/60">From:</span>
            <span className="text-foreground truncate" data-testid="text-inline-email-from">
              {email.from_address}
            </span>
          </div>
          <span className="text-muted-foreground text-xs flex-shrink-0">•</span>
          <span className="text-muted-foreground text-xs flex-shrink-0" data-testid="text-inline-email-date">
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

        {/* Action buttons */}
        <div className="flex flex-nowrap gap-0.5 overflow-x-auto">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyEmail}
            data-testid="button-inline-copy"
            className="text-xs h-5 px-1.5 flex-shrink-0"
            title="Copy email"
          >
            <Copy className="h-2.5 w-2.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShareWhatsApp}
            data-testid="button-inline-share-whatsapp"
            className="text-xs h-5 px-1.5 flex-shrink-0"
            title="Share on WhatsApp"
          >
            <MessageCircle className="h-2.5 w-2.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShareTwitter}
            data-testid="button-inline-share-twitter"
            className="text-xs h-5 px-1.5 flex-shrink-0"
            title="Share on Twitter"
          >
            <Share2 className="h-2.5 w-2.5" />
          </Button>
          <div className="flex-1"></div>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            disabled={isDeleting}
            data-testid="button-inline-delete"
            className="text-destructive border-destructive/30 text-xs h-5 px-1.5 flex-shrink-0"
            title="Delete email"
          >
            <Trash2 className="h-2.5 w-2.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            data-testid="button-inline-collapse"
            className="text-xs h-5 px-1.5 flex-shrink-0"
            title="Collapse email"
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-hidden">
        <Tabs defaultValue={email.html_content ? "html" : "text"} className="flex flex-col">
          {email.html_content && email.text_content && (
            <div className="border-b border-border/50 px-3 sm:px-4 py-1 bg-background">
              <TabsList className="h-5 bg-transparent gap-0">
                <TabsTrigger value="html" data-testid="tab-inline-html" className="text-xs px-1.5 data-[state=active]:bg-muted/50">
                  HTML
                </TabsTrigger>
                <TabsTrigger value="text" data-testid="tab-inline-text" className="text-xs px-1.5 data-[state=active]:bg-muted/50">
                  Text
                </TabsTrigger>
              </TabsList>
            </div>
          )}

          {email.html_content && (
            <TabsContent value="html" className="m-0 overflow-auto max-h-96 bg-background p-2 sm:p-3">
              <div
                className="prose prose-xs max-w-full dark:prose-invert text-xs leading-tight text-foreground/90"
                dangerouslySetInnerHTML={{ __html: email.html_content }}
                data-testid="content-inline-html"
                style={{
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word'
                }}
              />
            </TabsContent>
          )}

          {email.text_content && (
            <TabsContent value="text" className="m-0 overflow-auto max-h-96 bg-background p-2 sm:p-3">
              <pre
                className="font-sans text-xs leading-tight text-foreground/90 whitespace-pre-wrap break-words"
                data-testid="content-inline-text"
              >
                {email.text_content || "No content"}
              </pre>
            </TabsContent>
          )}

          {!email.html_content && !email.text_content && (
            <div className="p-3 bg-background text-center">
              <p className="text-muted-foreground text-xs">No email content available</p>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
