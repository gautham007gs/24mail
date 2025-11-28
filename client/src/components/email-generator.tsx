import { useState, useEffect, useRef, useMemo, memo } from "react";
import { Copy, Check, RefreshCw, RotateCw, Trash2, QrCode, Bell, AtSign, Crown, Download, Smartphone, Mail } from "lucide-react";
import { SiWhatsapp, SiTelegram, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import QRCode from "react-qr-code";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/notification-context";
import { getRandomMessage } from "@/lib/fun-messages";
import { triggerConfetti } from "@/lib/confetti";
import { shareArticleOn, copyArticleLink } from "@/lib/article-utils";
import CacheManager from "@/lib/cache";
import { type Domain } from "@shared/schema";

interface EmailGeneratorProps {
  currentEmail: string;
  domains: Domain[];
  onGenerate: (email: string) => void;
  onDelete?: () => void;
  emailCount?: number;
}

// Premium domains marked with crown icon
const PREMIUM_DOMAINS = new Set(["gmx.com", "mail.com", "protonmail.com", "tutanota.com", "privatemail.com", "zoho.com"]);

const isPremiumDomain = (domain: string): boolean => {
  return PREMIUM_DOMAINS.has(domain.toLowerCase());
};

// Domain icon mapping - returns a single character or icon indicator
const getDomainIcon = (domain: string): string => {
  const lower = domain.toLowerCase();
  if (lower.includes("proton")) return "🔒";
  if (lower.includes("tutanota")) return "🔐";
  if (lower.includes("mail") || lower.includes("gmail")) return "✉️";
  if (lower.includes("zoho")) return "Z";
  if (lower.includes("gmx")) return "G";
  if (lower.includes("privateemail") || lower.includes("privatemail")) return "🔑";
  return "📧";
};

const getDomainColor = (domain: string): string => {
  return isPremiumDomain(domain) ? "text-orange-500 dark:text-orange-400" : "text-accent";
};

export function EmailGenerator({ currentEmail, domains, onGenerate, onDelete, emailCount = 0 }: EmailGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>(() => {
    // Load from cache first
    const cached = CacheManager.get<string>("selected_domain");
    return cached || "";
  });
  const [sessionEmailCount, setSessionEmailCount] = useState(0);
  const [expiryTime, setExpiryTime] = useState<string>("");
  const [isBurning, setIsBurning] = useState(false);
  const expiryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const expiryDateRef = useRef<number | null>(null);
  const copyStatusRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  const { permission, isSupported, requestPermission } = useNotifications();
  const [showNotificationBanner, setShowNotificationBanner] = useState(isSupported && permission === "default");

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+C: Copy email
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && currentEmail && !copied) {
        e.preventDefault();
        handleCopy();
      }
      // Ctrl+G: Generate new email
      if ((e.ctrlKey || e.metaKey) && e.key === 'g' && domains.length > 0) {
        e.preventDefault();
        handleGenerateWithDomain();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentEmail, domains, copied]);

  // Cache domains list (never changes during session)
  const cachedDomains = useMemo(() => {
    if (domains.length > 0) {
      CacheManager.set("domains_list", domains, 24 * 60 * 60 * 1000); // 24 hour TTL
    }
    return domains;
  }, [domains]);

  // Set initial domain and cache it
  useEffect(() => {
    if (cachedDomains.length > 0 && !selectedDomain) {
      const domain = cachedDomains[0];
      setSelectedDomain(domain);
      CacheManager.set("selected_domain", domain);
    }
  }, [cachedDomains, selectedDomain]);

  // Calculate and update expiry time (15 minutes from generation)
  useEffect(() => {
    // Always reset ref when email changes to ensure fresh timer
    expiryDateRef.current = null;

    const storageKey = `burneremail_expiry_${currentEmail}`;
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
    toast({
      title: "Inbox refreshed",
      description: "Checking for new emails...",
    });
  };

  const handleGenerateWithDomain = () => {
    const username = generateRandomUsername();
    const domain = selectedDomain || cachedDomains[0] || "example.com";
    const newEmail = `${username}@${domain}`;

    // Cache the selected domain for next time
    CacheManager.set("selected_domain", domain);

    onGenerate(newEmail);
    setSessionEmailCount(prev => prev + 1);
    toast({
      title: "New email generated",
      description: "Your new temporary email is ready",
    });
  };

  const handleBurn = () => {
    setIsBurning(true);
    setTimeout(() => setIsBurning(false), 500);
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
        link.download = `burneremail-qr-${currentEmail.split('@')[0]}.png`;
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
        <div className="flex items-start gap-4 rounded-lg border border-primary/30 p-5 md:p-6 hover-elevate" data-testid="notification-banner">
          <Bell className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1 space-y-2">
            <p className="text-sm font-bold text-foreground">
              Get notified of new emails
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enable desktop notifications to know instantly when emails arrive
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleEnableNotifications}
              data-testid="button-enable-notifications"
              aria-label="Enable notifications"
            >
              Enable
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNotificationBanner(false)}
              data-testid="button-dismiss-notifications"
              aria-label="Dismiss notification banner"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Main Card with Glassmorphism Effect */}
      <Card className="p-4 sm:p-6 md:p-8 lg:p-10 glassmorphic animate-gradient-bg mx-auto w-full md:max-w-[60vw] shadow-lg shadow-black/10 dark:shadow-black/20" data-testid="email-generator-card">
        {/* Header - Title Only - Minimal & Clean */}
        <h2 className="text-card-title text-foreground text-center">
          Your Temporary Email
        </h2>

        {/* Email Display Box - Minimal & Clean */}
        <div className="card-flame-edge p-4 sm:p-6 mt-4">
          {/* Email with Inline Action Buttons */}
          <div className="flex items-start gap-2.5 sm:gap-3 mb-3">
            {/* Email Address - Large & Clean - JetBrains Mono */}
            <span
              className="text-base sm:text-lg md:text-xl lg:text-[22px] font-semibold text-foreground break-all flex-1"
              style={{ fontFamily: "'JetBrains Mono', monospace", lineHeight: "1.4", wordBreak: "break-all" }}
              data-testid="text-current-email"
            >
              {currentEmail || "Generating..."}
            </span>
            
            {/* Inline Action Icons - QR & Copy */}
            <div className="flex gap-2 sm:gap-2.5 flex-shrink-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowQRCode(true)}
                disabled={!currentEmail}
                data-testid="button-email-qr"
                className="h-9 w-9 sm:h-10 sm:w-10"
                title="Share QR Code"
              >
                <QrCode className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCopy}
                disabled={!currentEmail}
                data-testid="button-email-copy"
                className="h-9 w-9 sm:h-10 sm:w-10"
                title="Copy email"
              >
                {copied ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                ) : (
                  <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Expiry Info - Minimal Text Only */}
          <span className="text-xs sm:text-sm text-muted-foreground">
            Expires in <span className="text-accent font-semibold">{expiryTime}</span>
          </span>
        </div>


        {/* Action Buttons Row - Below Email */}
        <div className="mt-6 sm:mt-8 mb-8">
          {/* Mobile: 2x2 grid, Desktop: Horizontal flex */}
          <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 sm:justify-center sm:items-center sm:flex-wrap">
            <Button
              onClick={handleCopy}
              disabled={!currentEmail}
              data-testid="button-action-copy"
              size="sm"
              className="text-xs sm:text-sm font-semibold"
              aria-label="Copy email"
            >
              <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Copy
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              data-testid="button-action-refresh"
              className="text-xs sm:text-sm font-semibold"
              aria-label="Refresh"
            >
              <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Refresh
            </Button>
            <Button
              onClick={handleGenerateWithDomain}
              disabled={domains.length === 0}
              variant="secondary"
              size="sm"
              data-testid="button-action-new-email"
              className="text-xs sm:text-sm font-semibold"
              aria-label="Change"
            >
              <RotateCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Change
            </Button>
            <Button
              onClick={handleBurn}
              variant="destructive"
              size="sm"
              data-testid="button-action-burn"
              className={`text-xs sm:text-sm font-semibold ${isBurning ? "burn-animation" : ""}`}
              aria-label="Delete"
            >
              <Trash2 className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 ${isBurning ? "burn-icon" : ""}`} />
              Delete
            </Button>
          </div>
        </div>
      </Card>

      {/* QR Code Modal - Premium Design */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="w-[95vw] sm:w-11/12 max-w-md mx-auto p-0 gap-0 border-0 shadow-2xl bg-gradient-to-b from-background to-background/95 dark:from-slate-950 dark:to-slate-900/95 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 dark:from-emerald-900/20 dark:to-emerald-800/20 backdrop-blur-sm px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-emerald-200/20 dark:border-emerald-800/30 flex-shrink-0">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
                Share Your Email
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                Let others reach you instantly
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Main Content - Scrollable */}
          <div className="px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
            {/* QR Code Container - Premium */}
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
              {/* QR Code Background with glow effect */}
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* QR Code Box - Responsive Sizing */}
                <div className="relative bg-white dark:bg-slate-950 p-3 sm:p-4 md:p-6 rounded-2xl shadow-xl border border-emerald-200/30 dark:border-emerald-800/30 flex items-center justify-center">
                  <div className="animate-in fade-in duration-300">
                    <QRCode
                      value={shareUrl}
                      size={
                        typeof window !== 'undefined'
                          ? window.innerWidth < 360
                            ? 200
                            : window.innerWidth < 640
                            ? 240
                            : 280
                          : 280
                      }
                      level="H"
                      data-testid="qr-code-svg"
                      className="drop-shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Scanning Instructions */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/40 dark:bg-muted/20 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-border/50 dark:border-border/30 w-full justify-center">
                <Smartphone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Point your camera to scan</span>
              </div>
            </div>

            {/* Email Display - Premium */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Email Address</p>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-emerald-50/50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/30 p-3 sm:p-4 rounded-xl border border-emerald-200/40 dark:border-emerald-800/40 backdrop-blur-sm">
                  <p className="font-mono text-xs sm:text-sm md:text-base font-semibold text-foreground break-all leading-tight">{currentEmail}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 sm:space-y-3">
              <Button
                onClick={handleCopy}
                disabled={!currentEmail}
                className="w-full font-semibold"
                data-testid="button-copy-email-qr"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Email
              </Button>

              <Button
                onClick={handleDownloadQR}
                variant="secondary"
                className="w-full font-semibold"
                data-testid="button-download-qr"
              >
                <Download className="h-4 w-4 mr-2" />
                Download QR
              </Button>
            </div>

            {/* Social Share Section */}
            <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-border/50 dark:border-border/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">Share</p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => shareArticleOn('whatsapp', {
                    title: 'Check out Burner Email',
                    url: shareUrl,
                    summary: 'Get your free temporary email for instant privacy protection',
                  })}
                  data-testid="button-share-whatsapp-qr"
                  title="Share on WhatsApp"
                >
                  <SiWhatsapp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => shareArticleOn('telegram', {
                    title: 'Check out Burner Email',
                    url: shareUrl,
                    summary: 'Get your free temporary email for instant privacy protection',
                  })}
                  data-testid="button-share-telegram-qr"
                  title="Share on Telegram"
                >
                  <SiTelegram className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => shareArticleOn('twitter', {
                    title: 'Check out Burner Email',
                    url: shareUrl,
                    summary: 'Free temporary email for instant privacy protection',
                  })}
                  data-testid="button-share-twitter-qr"
                  title="Share on X (Twitter)"
                >
                  <SiX className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-muted/30 dark:bg-muted/10 px-4 sm:px-6 py-3 sm:py-4 border-t border-border/50 dark:border-border/30 text-center text-xs text-muted-foreground flex-shrink-0">
            Safe, private, and instant sharing
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