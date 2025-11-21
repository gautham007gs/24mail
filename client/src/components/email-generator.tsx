import { useState } from "react";
import { Copy, Check, RefreshCw, Trash2, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/notification-context";
import { getRandomMessage } from "@/lib/fun-messages";
import { audioEffects } from "@/lib/audio-effects";
import { type Domain } from "@shared/schema";

interface EmailGeneratorProps {
  currentEmail: string;
  domains: Domain[];
  onGenerate: (email: string) => void;
  onDelete?: () => void;
}

export function EmailGenerator({ currentEmail, domains, onGenerate, onDelete }: EmailGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { permission, isSupported, requestPermission } = useNotifications();
  const [showNotificationBanner, setShowNotificationBanner] = useState(isSupported && permission === "default");

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast({
        title: "Notifications enabled",
        description: "You'll be notified when new emails arrive",
      });
      setShowNotificationBanner(false);
    } else {
      toast({
        title: "Notifications blocked",
        description: "Please enable notifications in your browser settings",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!currentEmail) return;
    
    try {
      await navigator.clipboard.writeText(currentEmail);
      setCopied(true);
      audioEffects.playPop();
      const copiedMessage = getRandomMessage("copied");
      toast({
        title: copiedMessage,
        description: "Email address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    // Just refresh the inbox - don't change the email
    audioEffects.playWhip();
    toast({
      title: "Inbox refreshed",
      description: "Checking for new emails...",
    });
  };

  const handleChange = () => {
    // Generate a completely new email address
    const username = generateRandomUsername();
    const domain = domains[0] || "example.com";
    onGenerate(`${username}@${domain}`);
    audioEffects.playPop();
    toast({
      title: "New email generated",
      description: "Your new temporary email is ready",
    });
  };

  const handleDelete = () => {
    // Delete the current email and generate a new one
    audioEffects.playWhip();
    const username = generateRandomUsername();
    const domain = domains[0] || "example.com";
    onGenerate(`${username}@${domain}`);
    toast({
      title: "Address deleted",
      description: "New temporary email has been generated",
    });
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Permission Banner - Only show if not granted */}
      {isSupported && permission === "default" && showNotificationBanner && (
        <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
          <Bell className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <p className="text-sm font-medium text-foreground">
              Get notified of new emails
            </p>
            <p className="text-xs text-muted-foreground">
              Enable desktop notifications to know instantly when emails arrive
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleEnableNotifications}
              data-testid="button-enable-notifications"
            >
              Enable
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNotificationBanner(false)}
              data-testid="button-dismiss-notifications"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Main Card */}
      <Card className="p-8 md:p-10 space-y-8">
        {/* Section Title */}
        <div className="text-center space-y-2">
          <h2 className="text-lg md:text-xl font-semibold text-foreground/80">
            Your Temporary Email Address
          </h2>
        </div>

        {/* Email Display Box */}
        <div className="space-y-4">
          <div className="bg-muted/40 border border-border/50 rounded-lg p-6 md:p-8">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <span
                className="font-mono text-sm md:text-lg font-semibold text-foreground break-all"
                data-testid="text-current-email"
              >
                {currentEmail || "Generating..."}
              </span>
              <Button
                size="icon"
                onClick={handleCopy}
                disabled={!currentEmail}
                data-testid="button-copy-email"
                className="h-10 w-10 bg-emerald-500 hover:bg-emerald-600 text-white shrink-0"
              >
                {copied ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-center text-sm text-muted-foreground/80 max-w-2xl mx-auto">
          <p>
            Forget about spam, advertising mailings, hacking and attacking robots. Keep your real mailbox clean and secure. TempMail provides temporary, secure, anonymous, free disposable email address.
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!currentEmail}
            data-testid="button-action-copy"
            className="h-12 md:h-11 text-sm md:text-base"
          >
            <Copy className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Copy</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleRefresh}
            data-testid="button-action-refresh"
            className="h-12 md:h-11 text-sm md:text-base"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleChange}
            disabled={domains.length === 0}
            data-testid="button-action-change"
            className="h-12 md:h-11 text-sm md:text-base"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Change</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleDelete}
            data-testid="button-action-delete"
            className="h-12 md:h-11 text-sm md:text-base text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

function generateRandomUsername(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let username = "";
  for (let i = 0; i < 10; i++) {
    username += chars[Math.floor(Math.random() * chars.length)];
  }
  return username;
}
