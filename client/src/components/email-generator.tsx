import { useState, useEffect, useRef, useMemo, memo, lazy, Suspense } from "react";
import { Copy, Check, RefreshCw, RotateCw, Trash2, QrCode, Bell, AtSign, Crown, Download, Smartphone, Mail } from "@/lib/icons";
import { IconWhatsapp, IconTelegram, IconX } from "@/components/icons/social-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/notification-context";
import { getRandomMessage } from "@/lib/fun-messages";
import { shareArticleOn, copyArticleLink } from "@/lib/article-utils";
import CacheManager from "@/lib/cache";
import { deferAnalytics } from "@/lib/performance";
import { type Domain } from "@shared/schema";

const QRCode = lazy(() => import("react-qr-code"));

const triggerConfetti = () => {
  // Defer confetti animation to avoid blocking main thread
  deferAnalytics(() => {
    import("@/lib/confetti").then(m => m.triggerConfetti());
  });
};

interface EmailGeneratorProps {
  currentEmail: string;
  domains: Domain[];
  onGenerate: (email: string) => void;
  onDelete?: () => void;
  emailCount?: number;
}

const PREMIUM_DOMAINS = new Set(["gmx.com", "mail.com", "protonmail.com", "tutanota.com", "privatemail.com", "zoho.com"]);

const isPremiumDomain = (domain: string): boolean => {
  return PREMIUM_DOMAINS.has(domain.toLowerCase());
};

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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && currentEmail && !copied) {
        e.preventDefault();
        handleCopy();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'g' && domains.length > 0) {
        e.preventDefault();
        handleGenerateWithDomain();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentEmail, domains, copied]);

  const cachedDomains = useMemo(() => {
    if (domains.length > 0) {
      CacheManager.set("domains_list", domains, 24 * 60 * 60 * 1000);
    }
    return domains;
  }, [domains]);

  useEffect(() => {
    if (cachedDomains.length > 0 && !selectedDomain) {
      const domain = cachedDomains[0];
      setSelectedDomain(domain);
      CacheManager.set("selected_domain", domain);
    }
  }, [cachedDomains, selectedDomain]);

  useEffect(() => {
    expiryDateRef.current = null;

    const storageKey = `burneremail_expiry_${currentEmail}`;
    const stored = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;

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
    <div className="space-y-8">
      {/* Notification Permission Banner */}
      {isSupported && permission === "default" && showNotificationBanner && (
        <div
          className="flex items-start gap-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 md:p-7 shadow-[0_0_30px_rgba(16,185,129,0.2)] min-h-[140px]"
          data-testid="notification-banner"
        >
          <Bell className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5 drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]" aria-hidden="true" />
          <div className="flex-1 space-y-2">
            <p className="text-base font-bold text-foreground">
              Get notified of new emails
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enable desktop notifications to know instantly when emails arrive
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button
              onClick={handleEnableNotifications}
              data-testid="button-enable-notifications"
              aria-label="Enable notifications"
            >
              Enable
            </Button>
            <Button
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

      {/* Main Card - Clean black background */}
      <div className="relative -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-16">
        <Card className="p-6 sm:p-10 md:p-12 mx-auto w-full bg-card border-0 dark:border dark:border-[#1b1b1b]" data-testid="email-generator-card">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Your Temporary Email
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Instant, secure, privacy-first burner emails.
          </p>
        </div>

        {/* Email Display Box - White background with dark text */}
        <div 
          className="px-7 sm:px-8 py-6 sm:py-7 rounded-xl shadow-lg"
          style={{ backgroundColor: '#ffffff' }}
        >
          {/* Email with Inline Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2 overflow-hidden">
            {/* Email Address - Single line, bold */}
            <span
              className="text-lg sm:text-xl md:text-2xl font-bold truncate flex-1"
              style={{ 
                fontFamily: "'Inter', system-ui, sans-serif", 
                lineHeight: "1.3", 
                letterSpacing: "-0.02em",
                color: '#1a1a1a'
              }}
              data-testid="text-current-email"
              title={currentEmail}
            >
              {currentEmail || "Generating..."}
            </span>

            {/* Inline Action Icons - QR & Copy */}
            <div className="flex gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={() => setShowQRCode(true)}
                disabled={!currentEmail}
                data-testid="button-email-qr"
                className="h-9 w-9 sm:h-10 sm:w-10 p-2 rounded-lg transition-colors"
                style={{ color: '#666666' }}
                title="Share QR Code"
                aria-label="Show QR code for email"
              >
                <QrCode className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={handleCopy}
                disabled={!currentEmail}
                data-testid="button-email-copy"
                className="h-9 w-9 sm:h-10 sm:w-10 p-2 rounded-lg transition-colors"
                style={{ color: copied ? '#16a34a' : '#666666' }}
                title="Copy email"
                aria-label="Copy email address to clipboard"
              >
                {copied ? (
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Copy className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Expiry Info */}
          <span 
            className="text-sm sm:text-base font-medium"
            style={{ color: '#666666' }}
          >
            Expires in <span style={{ color: '#FFA31A', fontWeight: 700 }}>{expiryTime}</span>
          </span>
        </div>


        {/* Action Buttons Row - Increased Size */}
        <div className="mt-10 sm:mt-12">
          {/* Mobile: 2x2 grid, Desktop: Horizontal flex */}
          <div className="grid grid-cols-2 sm:flex gap-4 sm:gap-4 sm:justify-center sm:items-center sm:flex-wrap">
            <Button
              onClick={handleCopy}
              disabled={!currentEmail}
              data-testid="button-action-copy"
              className="text-sm sm:text-base font-bold py-3 px-4 sm:px-5 hover:shadow-[0_0_18px_rgba(255,106,0,0.3)] transition-all duration-200"
              aria-label="Copy email address to clipboard"
            >
              <Copy className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Copy
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              data-testid="button-action-refresh"
              className="text-sm sm:text-base font-semibold py-3 px-4 sm:px-5 hover:shadow-[0_0_18px_rgba(255,106,0,0.3)] transition-all duration-200"
              aria-label="Refresh inbox"
            >
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={handleGenerateWithDomain}
              disabled={domains.length === 0}
              variant="secondary"
              data-testid="button-action-new-email"
              className="text-sm sm:text-base font-semibold py-3 px-4 sm:px-5 hover:shadow-[0_0_18px_rgba(255,106,0,0.2)] transition-all duration-200"
              aria-label="Generate a new email address"
            >
              <RotateCw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Change
            </Button>
            <Button
              onClick={handleBurn}
              variant="outline"
              data-testid="button-action-burn"
              className={`text-sm sm:text-base font-semibold py-3 px-4 sm:px-5 border-orange-500/40 text-orange-400 hover:bg-orange-500/10 hover:shadow-[0_0_18px_rgba(255,106,0,0.3)] transition-all duration-200 ${isBurning ? "burn-animation" : ""}`}
              aria-label="Delete current email address"
            >
              <Trash2 className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${isBurning ? "burn-icon" : ""}`} />
              Delete
            </Button>
          </div>
        </div>
        </Card>
      </div>

      {/* QR Code Modal */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="w-[95vw] sm:w-11/12 max-w-md mx-auto p-0 gap-0 border-0 shadow-2xl bg-gradient-to-b from-background to-background/95 dark:from-slate-950 dark:to-slate-900/95 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col">
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

          <div className="px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white dark:bg-slate-950 p-3 sm:p-4 md:p-6 rounded-2xl shadow-xl border border-emerald-200/30 dark:border-emerald-800/30 flex items-center justify-center">
                  <Suspense fallback={<Skeleton className="w-[240px] h-[240px] sm:w-[280px] sm:h-[280px]" />}>
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
                  </Suspense>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/40 dark:bg-muted/20 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-border/50 dark:border-border/30 w-full justify-center">
                <Smartphone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Point your camera to scan</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Email Address</p>
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-emerald-50/50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/30 p-3 sm:p-4 rounded-xl border border-emerald-200/40 dark:border-emerald-800/40 backdrop-blur-sm">
                  <p className="font-mono text-xs sm:text-sm md:text-base font-semibold text-foreground break-all leading-tight">{currentEmail}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <Button
                onClick={handleCopy}
                disabled={!currentEmail}
                className="w-full font-semibold"
                data-testid="button-copy-email-qr"
                aria-label="Copy email address to clipboard"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Email
              </Button>

              <Button
                onClick={handleDownloadQR}
                variant="secondary"
                className="w-full font-semibold"
                data-testid="button-download-qr"
                aria-label="Download QR code for email"
              >
                <Download className="h-4 w-4 mr-2" />
                Download QR
              </Button>
            </div>

            <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-border/50 dark:border-border/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">Share</p>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
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
                  aria-label="Share email via WhatsApp"
                  className="min-h-[44px] min-w-[44px] p-3"
                >
                  <IconWhatsapp className="h-5 w-5" />
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
                  aria-label="Share email via Telegram"
                  className="min-h-[44px] min-w-[44px] p-3"
                >
                  <IconTelegram className="h-5 w-5" />
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
                  aria-label="Share email via X (Twitter)"
                  className="min-h-[44px] min-w-[44px] p-3"
                >
                  <IconX className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

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