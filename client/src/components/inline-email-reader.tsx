import { formatDistanceToNow } from "date-fns";
import { Trash2, Paperclip, ChevronUp, Copy, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { shareToWhatsApp, shareToTwitter, shareToTelegram, copyToClipboard } from "@/lib/email-share";
import { type Email } from "@shared/schema";
import { useState } from "react";

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
  const [tabValue, setTabValue] = useState(email?.html_content ? "html" : "text");
  const { toast } = useToast();

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

  if (isLoading) {
    return (
      <div className="col-span-full bg-background border-t border-border/50 px-3 sm:px-4 py-1 space-y-1">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-2.5 w-1/2" />
        <Skeleton className="h-2.5 w-full" />
      </div>
    );
  }

  if (!email) {
    return null;
  }

  return (
    <div className="col-span-full bg-background border-t border-border/50">
      {/* Compact header - subject and buttons only */}
      <div className="px-3 sm:px-4 py-1 flex items-center justify-between gap-2 border-b border-border/50">
        <div className="min-w-0 flex-1">
          <h3 className="text-xs font-semibold text-foreground break-words line-clamp-1" data-testid="text-inline-email-subject">
            {email.subject || "(No subject)"}
          </h3>
          <div className="flex items-center gap-1 text-xs mt-0.5">
            <span className="font-medium text-foreground/60 truncate">From: {email.from_address}</span>
            <span className="text-muted-foreground flex-shrink-0">•</span>
            <span className="text-muted-foreground text-xs flex-shrink-0" data-testid="text-inline-email-date">
              {formatDistanceToNow(email.received_at * 1000, { addSuffix: false })}
            </span>
            {email.has_attachments && (
              <>
                <span className="text-muted-foreground flex-shrink-0">•</span>
                <span className="flex items-center gap-0.5 text-muted-foreground text-xs flex-shrink-0">
                  <Paperclip className="h-2 w-2" />
                  {email.attachment_count}
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Action buttons - copy, share, delete, close */}
        <div className="flex gap-0.5 flex-shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyEmail}
            data-testid="button-inline-copy"
            className="text-xs h-5 px-1.5"
            title="Copy email"
          >
            <Copy className="h-2.5 w-2.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShareWhatsApp}
            data-testid="button-inline-share-whatsapp"
            className="text-xs h-5 px-1.5"
            title="Share on WhatsApp"
          >
            <MessageCircle className="h-2.5 w-2.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShareTwitter}
            data-testid="button-inline-share-twitter"
            className="text-xs h-5 px-1.5"
            title="Share on Twitter"
          >
            <Share2 className="h-2.5 w-2.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            disabled={isDeleting}
            data-testid="button-inline-delete"
            className="text-destructive border-destructive/30 text-xs h-5 px-1.5"
            title="Delete email"
          >
            <Trash2 className="h-2.5 w-2.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            data-testid="button-inline-collapse"
            className="text-xs h-5 px-1.5"
            title="Collapse email"
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content - ultra-compact, no scrolling */}
      <div className="overflow-visible">
        <Tabs value={tabValue} onValueChange={setTabValue} className="flex flex-col">
          {email.html_content && email.text_content && (
            <div className="border-b border-border/50 px-3 sm:px-4 py-0 bg-background">
              <TabsList className="h-4 bg-transparent gap-0">
                <TabsTrigger value="html" data-testid="tab-inline-html" className="text-xs px-1 py-0 data-[state=active]:bg-muted/50">
                  HTML
                </TabsTrigger>
                <TabsTrigger value="text" data-testid="tab-inline-text" className="text-xs px-1 py-0 data-[state=active]:bg-muted/50">
                  Text
                </TabsTrigger>
              </TabsList>
            </div>
          )}

          {email.html_content && (
            <TabsContent value="html" className="m-0 bg-background px-3 sm:px-4 py-1 overflow-visible">
              <div
                className="max-w-full text-xs leading-tight text-foreground/90 [&>*]:my-0 [&>p]:my-0.5 [&>h1]:text-sm [&>h2]:text-sm [&>h3]:text-xs [&>h4]:text-xs [&>a]:text-primary [&>a]:underline [&>code]:bg-muted [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>pre]:bg-muted [&>pre]:p-2 [&>pre]:overflow-x-auto"
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
            <TabsContent value="text" className="m-0 bg-background px-3 sm:px-4 py-1 overflow-visible">
              <pre
                className="font-sans text-xs leading-tight text-foreground/90 whitespace-pre-wrap break-words m-0"
                data-testid="content-inline-text"
              >
                {email.text_content || "No content"}
              </pre>
            </TabsContent>
          )}

          {!email.html_content && !email.text_content && (
            <div className="px-3 sm:px-4 py-1 bg-background">
              <p className="text-muted-foreground text-xs">No email content available</p>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
