import { formatDistanceToNow } from "date-fns";
import { X, Trash2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0" data-testid="modal-email-detail">
        {isLoading ? (
          <LoadingState />
        ) : email ? (
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border p-6">
              <div className="flex-1 space-y-3">
                <h2 className="text-xl font-semibold text-foreground pr-8" data-testid="text-email-subject">
                  {email.subject || "(No subject)"}
                </h2>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground">From:</span>
                    <span className="text-foreground/80" data-testid="text-email-from">
                      {email.from_address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground">To:</span>
                    <span className="text-foreground/80" data-testid="text-email-to">
                      {email.to_address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground">Date:</span>
                    <span className="text-muted-foreground" data-testid="text-email-date">
                      {formatDistanceToNow(email.received_at * 1000, { addSuffix: true })}
                    </span>
                  </div>
                  {email.has_attachments && (
                    <div className="flex items-center gap-2 text-sm">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {email.attachment_count} attachment{email.attachment_count > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onDelete}
                  disabled={isDeleting}
                  data-testid="button-delete-email"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  data-testid="button-close-modal"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue={email.html_content ? "html" : "text"} className="h-full flex flex-col">
                {email.html_content && email.text_content && (
                  <div className="border-b border-border px-6 pt-4">
                    <TabsList>
                      <TabsTrigger value="html" data-testid="tab-html">HTML</TabsTrigger>
                      <TabsTrigger value="text" data-testid="tab-text">Plain Text</TabsTrigger>
                    </TabsList>
                  </div>
                )}
                
                <ScrollArea className="flex-1">
                  {email.html_content && (
                    <TabsContent value="html" className="m-0 p-6">
                      <div
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: email.html_content }}
                        data-testid="content-html"
                      />
                    </TabsContent>
                  )}
                  
                  <TabsContent value="text" className="m-0 p-6">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-foreground" data-testid="content-text">
                      {email.text_content || "No content"}
                    </pre>
                  </TabsContent>
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
