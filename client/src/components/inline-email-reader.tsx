import { formatDistanceToNow } from "@/lib/relative-time";
import { Trash2, Paperclip, ChevronUp, Copy, Share2, MessageCircle, Link as LinkIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { shareToWhatsApp, shareToTwitter, shareToTelegram, copyToClipboard, copyEmailShareLink, downloadEmailAsPDF } from "@/lib/email-share";
import { type Email } from "@shared/schema";
import { useState } from "react";

interface InlineEmailReaderProps {
  email: Email | null;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

// Sanitize and transform HTML to prevent style injection and open links in new tabs
function transformEmailHtml(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Remove all style tags to prevent CSS injection
  const styleTags = div.querySelectorAll('style');
  styleTags.forEach(tag => tag.remove());
  
  // Remove script tags for security
  const scriptTags = div.querySelectorAll('script');
  scriptTags.forEach(tag => tag.remove());
  
  // Remove all inline style attributes to prevent style override
  const allElements = div.querySelectorAll('*');
  allElements.forEach(el => {
    el.removeAttribute('style');
  });
  
  // Find all anchor tags and add target="_blank" and rel="noopener noreferrer"
  const links = div.querySelectorAll('a');
  links.forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
  
  // Constrain images to max-width 100% for responsiveness
  const images = div.querySelectorAll('img');
  images.forEach(img => {
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.style.display = 'block';
  });
  
  return div.innerHTML;
}

// Convert timestamp to milliseconds (handle both seconds and milliseconds)
function getTimestampInMs(timestamp: number): number {
  // If timestamp is more than 10 billion, it's likely already in milliseconds
  // (10 billion seconds is year 2286)
  if (timestamp > 10000000000) {
    return timestamp;
  }
  // Otherwise, convert from seconds to milliseconds
  return timestamp * 1000;
}

export function InlineEmailReader({
  email,
  isLoading,
  onClose,
  onDelete,
  isDeleting,
}: InlineEmailReaderProps) {
  // Default to Text view to prevent style injection issues
  const [tabValue, setTabValue] = useState("text");
  const { toast } = useToast();
  
  // Transform email HTML to open links in new tabs and remove style tags
  const processedHtmlContent = email?.html_content ? transformEmailHtml(email.html_content) : null;

  const handleCopyEmail = async () => {
    if (!email) return;
    const result = await copyToClipboard({
      from: email.from_address,
      to: email.to_address,
      subject: email.subject || "(No subject)",
      content: email.text_content || email.html_content || "No content",
      receivedAt: getTimestampInMs(email.received_at),
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
      receivedAt: getTimestampInMs(email.received_at),
    });
  };

  const handleShareTwitter = () => {
    if (!email) return;
    shareToTwitter({
      from: email.from_address,
      to: email.to_address,
      subject: email.subject || "(No subject)",
      content: email.text_content || email.html_content || "No content",
      receivedAt: getTimestampInMs(email.received_at),
    });
  };

  const handleShareTelegram = () => {
    if (!email) return;
    shareToTelegram({
      from: email.from_address,
      to: email.to_address,
      subject: email.subject || "(No subject)",
      content: email.text_content || email.html_content || "No content",
      receivedAt: getTimestampInMs(email.received_at),
    });
  };

  const handleShareEmailLink = async () => {
    if (!email) return;
    const result = await copyEmailShareLink(email.to_address, email.subject || "(No subject)");
    toast({ 
      title: result.success ? "Link Copied" : "Failed", 
      description: result.message 
    });
  };

  const handleDownloadPDF = () => {
    if (!email) return;
    const result = downloadEmailAsPDF({
      from: email.from_address,
      to: email.to_address,
      subject: email.subject || "(No subject)",
      content: email.text_content || email.html_content || "No content",
      receivedAt: getTimestampInMs(email.received_at),
    });
    toast({ 
      title: result.success ? "Downloaded" : "Failed", 
      description: result.message 
    });
  };

  if (isLoading) {
    return (
      <div className="col-span-full bg-background border-t border-border/50 px-3 sm:px-4 py-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-full" />
      </div>
    );
  }

  if (!email) {
    return null;
  }

  const timestampMs = getTimestampInMs(email.received_at);

  return (
    <div className="inline-email-reader-container col-span-full bg-background border-t border-border/30 flex flex-col max-h-[600px]">
      {/* Email header - Better layout */}
      <div className="px-3 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 border-b border-border/30 flex-shrink-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-semibold text-foreground break-words line-clamp-2 mb-1.5" data-testid="text-inline-email-subject">
            {email.subject || "(No subject)"}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
            <span className="font-medium text-foreground/70 break-all">From: {email.from_address}</span>
            <span className="flex-shrink-0">•</span>
            <span className="flex-shrink-0" data-testid="text-inline-email-date">
              {formatDistanceToNow(timestampMs, { addSuffix: false })} ago
            </span>
            {email.has_attachments && (
              <>
                <span className="flex-shrink-0">•</span>
                <span className="flex items-center gap-1 flex-shrink-0">
                  <Paperclip className="h-3 w-3" />
                  {email.attachment_count}
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Action buttons - Responsive row */}
        <div className="flex gap-1 flex-shrink-0 flex-wrap justify-start sm:justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyEmail}
            data-testid="button-inline-copy"
            className="h-8 w-8 p-0"
            title="Copy email"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShareEmailLink}
            data-testid="button-inline-share-link"
            className="h-8 w-8 p-0"
            title="Share link"
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownloadPDF}
            data-testid="button-inline-download"
            className="h-8 w-8 p-0"
            title="Download"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShareWhatsApp}
            data-testid="button-inline-share-whatsapp"
            className="h-8 w-8 p-0"
            title="WhatsApp"
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShareTwitter}
            data-testid="button-inline-share-twitter"
            className="h-8 w-8 p-0"
            title="Twitter"
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
            disabled={isDeleting}
            data-testid="button-inline-burn"
            className="text-destructive border-destructive/30 h-8 w-8 p-0"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            data-testid="button-inline-collapse"
            className="h-8 w-8 p-0"
            title="Collapse"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content - Scrollable with proper colors */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={tabValue} onValueChange={setTabValue} className="inline-email-reader-tabs flex flex-col h-full">
          {email.html_content && email.text_content && (
            <div className="border-b border-border/30 px-3 sm:px-5 py-0 bg-background flex-shrink-0">
              <TabsList className="h-9 bg-transparent gap-4 px-0">
                <TabsTrigger value="html" data-testid="tab-inline-html" className="text-xs sm:text-sm px-0 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">
                  HTML
                </TabsTrigger>
                <TabsTrigger value="text" data-testid="tab-inline-text" className="text-xs sm:text-sm px-0 py-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none">
                  Text
                </TabsTrigger>
              </TabsList>
            </div>
          )}

          {email.html_content && (
            <TabsContent value="html" className="m-0 bg-background px-3 sm:px-5 py-3 sm:py-4 overflow-y-auto flex-1">
              <div
                className="inline-email-html max-w-full text-xs sm:text-sm leading-relaxed text-foreground"
                dangerouslySetInnerHTML={{ __html: processedHtmlContent || email.html_content }}
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
            <TabsContent value="text" className="m-0 bg-background px-3 sm:px-5 py-3 sm:py-4 overflow-y-auto flex-1">
              <pre
                className="inline-email-html font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words m-0 text-foreground"
                data-testid="content-inline-text"
              >
                {email.text_content || "No content"}
              </pre>
            </TabsContent>
          )}

          {!email.html_content && !email.text_content && (
            <div className="px-3 sm:px-5 py-4 bg-background">
              <p className="text-muted-foreground text-sm">No email content available</p>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
