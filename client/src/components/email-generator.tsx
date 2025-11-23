import { useState, useEffect, useRef } from "react";
import { Copy, Check, RefreshCw, RotateCw, Trash2, QrCode, Bell, MessageCircle, Send, Share2, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import QRCode from "react-qr-code";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/notification-context";
import { getRandomMessage } from "@/lib/fun-messages";
import { audioEffects } from "@/lib/audio-effects";
import { triggerConfetti } from "@/lib/confetti";
import { shareArticleOn, copyArticleLink } from "@/lib/article-utils";
import { type Domain } from "@shared/schema";

interface EmailGeneratorProps {
  currentEmail: string;
  domains: Domain[];
  onGenerate: (email: string) => void;
  onDelete?: () => void;
  emailCount?: number;
}

export function EmailGenerator({ currentEmail, domains, onGenerate, onDelete, emailCount = 0 }: EmailGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [sessionEmailCount, setSessionEmailCount] = useState(0);
  const [expiryTime, setExpiryTime] = useState<string>("");
  const expiryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const expiryDateRef = useRef<number | null>(null);

  const { toast } = useToast();
  const { permission, isSupported, requestPermission } = useNotifications();
  const [showNotificationBanner, setShowNotificationBanner] = useState(isSupported && permission === "default");

  // Set initial domain
  useEffect(() => {
    if (domains.length > 0 && !selectedDomain) {
      setSelectedDomain(domains[0]);
    }
  }, [domains, selectedDomain]);

  // Calculate and update expiry time (15 minutes from generation)
  useEffect(() => {
    // Always reset ref when email changes to ensure fresh timer
    expiryDateRef.current = null;
    
    const storageKey = `tempmail_expiry_${currentEmail}`;
    const stored = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    
    // Create new timestamp - either load existing or create fresh one
    const expiryTimestamp = stored ? parseInt(stored, 10) : Date.now() + 15 * 60 * 1000;
    expiryDateRef.current = expiryTimestamp;
    
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, expiryTimestamp.toString());
    }

    const updateExpiry = () => {
      if (!expiryDateRef.current) return;
      
      const now = Date.now();
      const diff = expiryDateRef.current - now;
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      if (diff > 0) {
        setExpiryTime(`${minutes}m ${seconds}s`);
      } else {
        setExpiryTime("Expired");
        if (expiryTimerRef.current) {
          clearInterval(expiryTimerRef.current);
        }
        // Auto-generate new email when current one expires
        handleGenerateWithDomain();
      }
    };

    updateExpiry();
    expiryTimerRef.current = setInterval(updateExpiry, 1000);

    return () => {
      if (expiryTimerRef.current) {
        clearInterval(expiryTimerRef.current);
      }
    };
  }, [currentEmail]);

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
      triggerConfetti();
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
    audioEffects.playWhip();
    toast({
      title: "Inbox refreshed",
      description: "Checking for new emails...",
    });
  };

  const handleGenerateWithDomain = () => {
    const username = generateRandomUsername();
    const domain = selectedDomain || domains[0] || "example.com";
    const newEmail = `${username}@${domain}`;
    
    onGenerate(newEmail);
    setSessionEmailCount(prev => prev + 1);
    audioEffects.playPop();
    toast({
      title: "New email generated",
      description: "Your new temporary email is ready",
    });
  };

  const handleDelete = () => {
    audioEffects.playWhip();
    handleGenerateWithDomain();
    if (onDelete) {
      onDelete();
    }
  };

  const handleDownloadQR = () => {
    const svg = document.querySelector('[data-testid="qr-code-svg"]') as SVGElement;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `tempmail-qr-${currentEmail.split('@')[0]}.png`;
        link.click();
        toast({
          title: "QR Code downloaded",
          description: "Check your downloads folder",
        });
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const shareUrl = typeof window !== "undefined" 
    ? `${window.location.origin}?email=${encodeURIComponent(currentEmail)}`
    : currentEmail;

  return (
    <div className="space-y-6">
      {/* Notification Permission Banner */}
      {isSupported && permission === "default" && showNotificationBanner && (
        <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 animate fade-in-up">
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

      {/* Floating Email Counter */}
      {sessionEmailCount > 0 && (
        <div className="fixed top-20 right-4 md:right-6 z-40 slide-in">
          <Card className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-200/50 dark:border-emerald-800/50">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              📧 Generated: {sessionEmailCount}
            </p>
          </Card>
        </div>
      )}

      {/* Main Card with Animated Background */}
      <Card className="p-4 md:p-8 lg:p-10 space-y-6 md:space-y-8 animate-gradient-bg neomorphic">
        {/* Section Title */}
        <div className="text-center space-y-2">
          <h2 className="text-base md:text-lg lg:text-xl font-semibold text-foreground/80">
            Your Temporary Email Address
          </h2>
        </div>

        {/* Email Display Box with Timer */}
        <div className="space-y-4">
          <div className="bg-muted/40 border border-border/50 rounded-lg p-3 md:p-6 lg:p-8">
            <div className="flex items-center justify-between gap-3 md:gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <span
                  className="font-mono text-sm md:text-lg lg:text-xl font-semibold text-foreground break-all block"
                  data-testid="text-current-email"
                >
                  {currentEmail || "Generating..."}
                </span>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 pulse-soft" />
                  Expires in: <span className="font-semibold">{expiryTime}</span>
                </p>
              </div>
              <div className="flex gap-2 shrink-0 items-center">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowQRCode(true)}
                  data-testid="button-qr-code"
                  aria-label="Generate QR code to share email"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={handleCopy}
                  disabled={!currentEmail}
                  data-testid="button-copy-email"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 transition-all active-elevate-2"
                  aria-label={copied ? "Email copied to clipboard" : "Copy email to clipboard"}
                >
                  {copied ? (
                    <Check className="h-4 w-4 animate-bounce" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-center text-xs md:text-sm text-muted-foreground/80 max-w-2xl mx-auto">
          <p>
            Keep your real mailbox clean and secure. TempMail provides temporary, anonymous, free disposable email addresses.
          </p>
        </div>

        {/* Domain Selector - Desktop Only */}
        <div className="hidden md:block space-y-3">
          <label htmlFor="domain-select" className="text-sm font-semibold text-foreground flex items-center gap-2">
            <AtSign className="h-4 w-4 text-emerald-500" />
            Email Domain
          </label>
          <div className="flex gap-2">
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger id="domain-select" className="flex-1 border-emerald-200/50 dark:border-emerald-800/50" data-testid="select-domain">
                <SelectValue placeholder="Select a domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((domain) => (
                  <SelectItem key={domain} value={domain} data-testid={`domain-option-${domain}`}>
                    <span className="flex items-center gap-2">
                      <AtSign className="h-3 w-3 text-emerald-500" />
                      {domain}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerateWithDomain}
              disabled={domains.length === 0}
              data-testid="button-generate-selected-domain"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Generate
            </Button>
          </div>
        </div>

        {/* Action Buttons - Mobile Optimized */}
        {/* Mobile: 2 large buttons (Copy primary, New secondary) */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          <Button
            onClick={handleCopy}
            disabled={!currentEmail}
            data-testid="button-action-copy"
            className="h-13 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold active-elevate-2"
            aria-label="Copy email address to clipboard"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>

          <Button
            onClick={handleGenerateWithDomain}
            disabled={domains.length === 0}
            data-testid="button-action-change"
            className="h-13 text-sm font-semibold active-elevate-2"
            aria-label="Generate new email address"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>

        {/* Mobile: Icon-only quick actions (Refresh, QR, Delete) */}
        <div className="md:hidden flex gap-2 justify-center">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleRefresh}
            data-testid="button-action-refresh"
            className="active-elevate-2"
            aria-label="Refresh inbox to check for new emails"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowQRCode(true)}
            data-testid="button-qr-quick"
            className="active-elevate-2"
            aria-label="Show QR code to share email"
          >
            <QrCode className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={handleDelete}
            data-testid="button-action-delete"
            className="text-destructive hover:text-destructive active-elevate-2"
            aria-label="Delete current email address"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop: 4-column button grid */}
        <div className="hidden md:grid grid-cols-4 gap-3">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!currentEmail}
            data-testid="button-action-copy"
            className="min-h-9 active-elevate-2"
            aria-label="Copy email address to clipboard"
          >
            <Copy className="h-4 w-4 mr-2" />
            <span>Copy</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleRefresh}
            data-testid="button-action-refresh"
            className="min-h-9 active-elevate-2"
            aria-label="Refresh inbox to check for new emails"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleGenerateWithDomain}
            disabled={domains.length === 0}
            data-testid="button-action-change"
            className="min-h-9 active-elevate-2"
            aria-label="Generate new email address"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            <span>New</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleDelete}
            data-testid="button-action-delete"
            className="min-h-9 text-destructive hover:text-destructive active-elevate-2"
            aria-label="Delete current email address"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>Delete</span>
          </Button>
        </div>
      </Card>

      {/* QR Code Modal */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="w-11/12 max-w-xs sm:max-w-sm mx-auto glassmorphism">
          <DialogHeader>
            <DialogTitle className="text-lg">Share Your Email</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-3 py-2 bg-white p-3 sm:p-4 rounded-lg">
            <QRCode
              value={shareUrl}
              size={180}
              level="H"
              data-testid="qr-code-svg"
            />
            <p className="text-xs sm:text-sm text-muted-foreground text-center leading-tight">
              Scan to share your email
            </p>
            
            {/* Email Display in Modal */}
            <div className="w-full p-2 sm:p-3 bg-muted/40 border border-border/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Your Email:</p>
              <p className="font-mono text-xs sm:text-sm font-semibold text-foreground break-all">{currentEmail}</p>
            </div>
            
            {/* Share Buttons */}
            <div className="w-full space-y-1.5">
              <Button
                onClick={handleCopy}
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white button-press smooth-transition text-xs sm:text-sm"
                data-testid="button-copy-email-qr"
              >
                <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Copy Email</span>
                <span className="sm:hidden">Copy</span>
              </Button>
              <Button
                onClick={handleDownloadQR}
                size="sm"
                className="w-full button-press smooth-transition text-xs sm:text-sm"
                data-testid="button-download-qr"
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Download QR</span>
                <span className="sm:hidden">Download</span>
              </Button>
            </div>

            {/* Social Share Buttons */}
            <div className="w-full space-y-1">
              <p className="text-xs text-muted-foreground text-center">Share:</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareArticleOn('whatsapp', {
                    title: 'Check out TempMail',
                    url: shareUrl,
                    summary: 'Get your free temporary email for instant privacy protection',
                  })}
                  data-testid="button-share-whatsapp-qr"
                  className="text-xs"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareArticleOn('telegram', {
                    title: 'Check out TempMail',
                    url: shareUrl,
                    summary: 'Get your free temporary email for instant privacy protection',
                  })}
                  data-testid="button-share-telegram-qr"
                  className="text-xs"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareArticleOn('twitter', {
                    title: 'Check out TempMail',
                    url: shareUrl,
                    summary: 'Free temporary email for instant privacy protection',
                  })}
                  data-testid="button-share-twitter-qr"
                  className="text-xs"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
