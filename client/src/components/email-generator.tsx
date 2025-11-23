import { useState, useEffect, useRef } from "react";
import { Copy, Check, RefreshCw, RotateCw, Trash2, QrCode, Bell, Inbox, Share2, Sparkles } from "lucide-react";
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
    const calculateExpiry = () => {
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + 15);
      
      const now = new Date();
      const diff = expiryDate.getTime() - now.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      if (minutes > 0 || seconds > 0) {
        setExpiryTime(`${minutes}m ${seconds}s`);
      } else {
        setExpiryTime("Expired");
      }
    };

    calculateExpiry();
    expiryTimerRef.current = setInterval(calculateExpiry, 1000);

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
    onGenerate(`${username}@${domain}`);
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
              <Sparkles className="h-4 w-4 text-emerald-500" />
              Generated: {sessionEmailCount}
            </p>
          </Card>
        </div>
      )}

      {/* Main Card with Animated Background */}
      <Card className="p-4 md:p-8 lg:p-10 space-y-6 md:space-y-8 animate-gradient-bg">
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
                  className="font-mono text-xs md:text-base lg:text-lg font-semibold text-foreground break-all block"
                  data-testid="text-current-email"
                >
                  {currentEmail || "Generating..."}
                </span>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 pulse-soft" />
                  Expires in: <span className="font-semibold">{expiryTime}</span>
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowQRCode(true)}
                  data-testid="button-qr-code"
                  className="h-10 w-10"
                  aria-label="Generate QR code to share email"
                >
                  <QrCode className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  onClick={handleCopy}
                  disabled={!currentEmail}
                  data-testid="button-copy-email"
                  className="h-10 w-10 bg-emerald-500 hover:bg-emerald-600 text-white shrink-0 transition-all"
                  aria-label={copied ? "Email copied to clipboard" : "Copy email to clipboard"}
                >
                  {copied ? (
                    <Check className="h-5 w-5 animate-bounce" />
                  ) : (
                    <Copy className="h-5 w-5" />
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

        {/* Domain Selector */}
        <div className="space-y-2">
          <label htmlFor="domain-select" className="text-sm font-medium text-foreground/70">
            Choose Domain
          </label>
          <div className="flex gap-2">
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger id="domain-select" className="flex-1" data-testid="select-domain">
                <SelectValue placeholder="Select a domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((domain) => (
                  <SelectItem key={domain} value={domain} data-testid={`domain-option-${domain}`}>
                    @{domain}
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

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!currentEmail}
            data-testid="button-action-copy"
            className="h-10 md:h-11 text-xs md:text-sm lg:text-base"
            aria-label="Copy email address to clipboard"
          >
            <Copy className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Copy</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleRefresh}
            data-testid="button-action-refresh"
            className="h-10 md:h-11 text-xs md:text-sm lg:text-base"
            aria-label="Refresh inbox to check for new emails"
          >
            <RefreshCw className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleGenerateWithDomain}
            disabled={domains.length === 0}
            data-testid="button-action-change"
            className="h-10 md:h-11 text-xs md:text-sm lg:text-base"
            aria-label="Generate new email address"
          >
            <RotateCw className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">New</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleDelete}
            data-testid="button-action-delete"
            className="h-10 md:h-11 text-xs md:text-sm lg:text-base text-destructive hover:text-destructive"
            aria-label="Delete current email address"
          >
            <Trash2 className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      </Card>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Inbox Card */}
        <Card className="p-4 hover-elevate active-elevate-2 transition-all cursor-pointer" data-testid="card-quick-inbox">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Inbox className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Inbox</p>
              <p className="text-2xl font-bold text-foreground">{emailCount}</p>
              <p className="text-xs text-muted-foreground mt-1">email{emailCount !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </Card>

        {/* QR Code Card */}
        <Card 
          className="p-4 hover-elevate active-elevate-2 transition-all cursor-pointer" 
          onClick={() => setShowQRCode(true)}
          data-testid="card-quick-qr"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <QrCode className="h-5 w-5 text-purple-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Share</p>
              <p className="text-sm font-bold text-foreground">QR Code</p>
              <p className="text-xs text-muted-foreground mt-1">Easy share</p>
            </div>
          </div>
        </Card>

        {/* Share Card */}
        <Card 
          className="p-4 hover-elevate active-elevate-2 transition-all cursor-pointer" 
          onClick={handleCopy}
          data-testid="card-quick-share"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-pink-500/10 rounded-lg">
              <Share2 className="h-5 w-5 text-pink-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Share</p>
              <p className="text-sm font-bold text-foreground">Email</p>
              <p className="text-xs text-muted-foreground mt-1">Copy link</p>
            </div>
          </div>
        </Card>

        {/* Generate New Card */}
        <Card 
          className="p-4 hover-elevate active-elevate-2 transition-all cursor-pointer" 
          onClick={handleGenerateWithDomain}
          data-testid="card-quick-generate"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Sparkles className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Create</p>
              <p className="text-sm font-bold text-foreground">New Email</p>
              <p className="text-xs text-muted-foreground mt-1">Fresh address</p>
            </div>
          </div>
        </Card>
      </div>

      {/* QR Code Modal */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Share Your Email</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4 py-4 bg-white p-4 rounded-lg">
            <QRCode
              value={shareUrl}
              size={256}
              level="H"
              data-testid="qr-code-svg"
            />
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code to share your email. Anyone scanning will get your email on their device.
            </p>
            
            {/* Email Display in Modal */}
            <div className="w-full p-3 bg-muted/40 border border-border/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Your Email:</p>
              <p className="font-mono text-sm font-semibold text-foreground break-all">{currentEmail}</p>
            </div>
            
            <div className="w-full space-y-2">
              <Button
                onClick={handleCopy}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                data-testid="button-copy-email-qr"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Email
              </Button>
              <Button
                onClick={handleDownloadQR}
                className="w-full"
                data-testid="button-download-qr"
              >
                Download QR Code
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast({
                    title: "Link copied",
                    description: "Share link copied to clipboard",
                  });
                }}
                className="w-full"
                data-testid="button-copy-link-qr"
              >
                Copy Share Link
              </Button>
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
