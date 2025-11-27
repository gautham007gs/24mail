import { useState, useEffect, useRef, useMemo, memo } from "react";
import { Copy, Check, RefreshCw, RotateCw, Trash2, QrCode, Bell, AtSign, Crown, Download, Smartphone } from "lucide-react";
import { SiWhatsapp, SiTelegram, SiX } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export function EmailGenerator({ currentEmail, domains, onGenerate, onDelete, emailCount = 0 }: EmailGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>(() => {
    // Load from cache first
    const cached = CacheManager.get<string>("selected_domain");
    return cached || "";
  });
  const [sessionEmailCount, setSessionEmailCount] = useState(0);
  const [expiryTime, setExpiryTime] = useState<string>("");
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
        <div className="flex items-start gap-4 rounded-lg border border-primary/30 bg-primary/5 p-5 md:p-6 hover-elevate shadow-sm" data-testid="notification-banner">
          <Bell className="h-5 w-5 text-primary shrink-0 mt-0.5 font-bold" aria-hidden="true" />
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

      {/* Floating Email Counter - Premium Badge with Flame */}
      {sessionEmailCount > 0 && (
        <div className="fixed top-20 right-4 md:right-6 z-40 slide-in">
          <div className="badge-premium">
            <span className="loader-flame text-lg">🔥</span>
            <span>Generated: <span className="highlight-number">{sessionEmailCount}</span></span>
          </div>
        </div>
      )}

      {/* Main Card with Glassmorphism Effect */}
      <Card className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 glassmorphic border border-white/20 dark:border-white/10 animate-gradient-bg max-w-2xl mx-auto shadow-md w-full sm:w-auto" data-testid="email-generator-card">
        {/* Section Title - with Flame Emoji */}
        <div className="text-center space-y-3">
          <h2 className="text-heading text-foreground font-black">
            🔥 Your Temporary Email Address
          </h2>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Instant • Secure • No Signup Required
          </p>
        </div>

        {/* Email Display Box with Premium Gradient */}
        <div className="space-y-4">
          <div className="relative group">
            
            <div className="card-flame-edge p-3 sm:p-4 md:p-7 lg:p-8 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs sm:text-caption text-muted-foreground">Active</span>
                  </div>
                  <span
                    className="font-mono text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-foreground break-all block leading-relaxed"
                    data-testid="text-current-email"
                  >
                    {currentEmail || "Generating..."}
                  </span>
                  <p className="text-body-sm text-muted-foreground mt-3 flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                    Expires in: <span className="highlight-number">{expiryTime}</span>
                  </p>
                </div>
                <div className="flex gap-1.5 sm:gap-2 shrink-0 items-center">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowQRCode(true)}
                    data-testid="button-qr-code"
                    aria-label="Generate QR code to share email"
                    className="hover-elevate h-9 w-9 sm:h-10 sm:w-10"
                  >
                    <QrCode className="h-4 sm:h-5 w-4 sm:w-5" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={handleCopy}
                    disabled={!currentEmail}
                    data-testid="button-copy-email"
                    className="bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white shrink-0 transition-all active-elevate-2 shadow-md h-9 w-9 sm:h-10 sm:w-10"
                    aria-label={copied ? "Email copied to clipboard" : "Copy email to clipboard"}
                  >
                    {copied ? (
                      <Check className="h-3.5 sm:h-4 w-3.5 sm:w-4 animate-bounce" />
                    ) : (
                      <Copy className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="text-center text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          <p>
            Keep your real inbox clean and secure from spam. Copy your email and start receiving messages instantly.
          </p>
        </div>

        {/* Domain Selector - Mobile & Desktop */}
        <div className="space-y-2 sm:space-y-3">
          <label htmlFor="domain-select" className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-2">
            <AtSign className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-accent" />
            Email Domain
          </label>
          <div className="flex gap-1.5 sm:gap-2">
            <Select
              value={selectedDomain}
              onValueChange={(domain) => {
                setSelectedDomain(domain);
                CacheManager.set("selected_domain", domain); // Cache on change
              }}
            >
              <SelectTrigger id="domain-select" className="flex-1 text-xs sm:text-sm" data-testid="select-domain">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {cachedDomains.map((domain) => {
                  const isPremium = isPremiumDomain(domain);
                  return (
                    <SelectItem key={domain} value={domain} data-testid={`domain-option-${domain}`}>
                      <span className="flex items-center gap-2">
                        <AtSign className="h-3 w-3 text-accent" />
                        {domain}
                        {isPremium && (
                          <Crown className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" data-testid={`premium-badge-${domain}`} />
                        )}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerateWithDomain}
              disabled={domains.length === 0}
              data-testid="button-generate-selected-domain"
              className="bg-accent/20 hover:bg-accent/30 text-accent dark:text-accent active-elevate-2"
            >
              Generate
            </Button>
          </div>
        </div>

        {/* Action Buttons - Mobile Optimized */}
        {/* Mobile: 2 large buttons (Copy primary, New secondary) */}
        <div className="md:hidden grid grid-cols-2 gap-2 sm:gap-3">
          <Button
            onClick={handleCopy}
            disabled={!currentEmail}
            data-testid="button-action-copy"
            className="min-h-10 sm:min-h-12 btn-success text-xs sm:text-sm font-semibold btn-hover-scale active-elevate-2 px-3 sm:px-4"
            aria-label="Copy email address to clipboard (Ctrl+C)"
            title="Copy email (Ctrl+C)"
          >
            <Copy className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2" />
            <span className="hidden xs:inline">Copy</span>
            <span className="inline xs:hidden">Copy</span>
          </Button>

          <Button
            onClick={handleGenerateWithDomain}
            disabled={domains.length === 0}
            data-testid="button-action-change"
            className="min-h-10 sm:min-h-12 btn-info text-xs sm:text-sm font-semibold btn-hover-scale active-elevate-2 px-3 sm:px-4"
            aria-label="Generate new email address (Ctrl+G)"
            title="Generate new email (Ctrl+G)"
          >
            <RotateCw className="h-3.5 sm:h-4 w-3.5 sm:w-4 mr-1.5 sm:mr-2" />
            New
          </Button>
        </div>

        {/* Mobile: Icon-only quick actions (Refresh, QR, Burn) */}
        <div className="md:hidden flex gap-1.5 sm:gap-2 justify-center">
          <Button
            size="icon"
            onClick={handleRefresh}
            data-testid="button-action-refresh"
            className="btn-info btn-hover-scale active-elevate-2 h-9 sm:h-10 w-9 sm:w-10"
            aria-label="Refresh inbox to check for new emails"
          >
            <RefreshCw className="h-4 sm:h-5 w-4 sm:w-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowQRCode(true)}
            data-testid="button-qr-quick"
            className="btn-hover-scale active-elevate-2 h-9 sm:h-10 w-9 sm:w-10"
            aria-label="Show QR code to share email"
          >
            <QrCode className="h-4 sm:h-5 w-4 sm:w-5" />
          </Button>

          <Button
            size="icon"
            onClick={handleBurn}
            data-testid="button-action-burn"
            className="btn-danger btn-hover-scale active-elevate-2 h-9 sm:h-10 w-9 sm:w-10"
            aria-label="Burn current email address"
          >
            <Trash2 className="h-4 sm:h-5 w-4 sm:w-5" />
          </Button>
        </div>

        {/* Desktop: 4-column button grid */}
        <div className="hidden md:grid grid-cols-4 gap-3">
          <Button
            onClick={handleCopy}
            disabled={!currentEmail}
            data-testid="button-action-copy"
            className="min-h-9 btn-success btn-hover-scale active-elevate-2"
            aria-label="Copy email address to clipboard"
          >
            <Copy className="h-4 w-4 mr-2" />
            <span>Copy</span>
          </Button>

          <Button
            onClick={handleRefresh}
            data-testid="button-action-refresh"
            className="min-h-9 btn-info btn-hover-scale active-elevate-2"
            aria-label="Refresh inbox to check for new emails"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Refresh</span>
          </Button>

          <Button
            onClick={handleGenerateWithDomain}
            disabled={domains.length === 0}
            data-testid="button-action-change"
            className="min-h-9 btn-info btn-hover-scale active-elevate-2"
            aria-label="Generate new email address"
          >
            <RotateCw className="h-4 w-4 mr-2" />
            <span>New</span>
          </Button>

          <Button
            onClick={handleBurn}
            data-testid="button-action-burn"
            className="min-h-9 btn-danger btn-hover-scale active-elevate-2"
            aria-label="Burn current email address"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span>Burn</span>
          </Button>
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
                <Smartphone className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
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
              {/* Primary: Copy Button */}
              <Button
                onClick={handleCopy}
                disabled={!currentEmail}
                className="w-full h-10 sm:h-11 md:h-12 btn-success font-semibold text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl"
                data-testid="button-copy-email-qr"
              >
                <Copy className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Copy Email Address</span>
                <span className="sm:hidden">Copy Email</span>
              </Button>

              {/* Secondary: Download QR */}
              <Button
                onClick={handleDownloadQR}
                variant="outline"
                className="w-full h-10 sm:h-11 md:h-12 border-2 border-emerald-200/50 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 font-semibold text-xs sm:text-sm md:text-base transition-all duration-200 active-elevate-2"
                data-testid="button-download-qr"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Download QR Code</span>
                <span className="sm:hidden">Download</span>
              </Button>
            </div>

            {/* Social Share Section */}
            <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-border/50 dark:border-border/30">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">Share On</p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => shareArticleOn('whatsapp', {
                    title: 'Check out Burner Email',
                    url: shareUrl,
                    summary: 'Get your free temporary email for instant privacy protection',
                  })}
                  data-testid="button-share-whatsapp-qr"
                  className="h-10 sm:h-12 border-2 border-green-200/50 dark:border-green-800/50 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50/50 dark:hover:bg-green-950/30 transition-all duration-200 active-elevate-2"
                  title="Share on WhatsApp"
                >
                  <SiWhatsapp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => shareArticleOn('telegram', {
                    title: 'Check out Burner Email',
                    url: shareUrl,
                    summary: 'Get your free temporary email for instant privacy protection',
                  })}
                  data-testid="button-share-telegram-qr"
                  className="h-10 sm:h-12 border-2 border-blue-200/50 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all duration-200 active-elevate-2"
                  title="Share on Telegram"
                >
                  <SiTelegram className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => shareArticleOn('twitter', {
                    title: 'Check out Burner Email',
                    url: shareUrl,
                    summary: 'Free temporary email for instant privacy protection',
                  })}
                  data-testid="button-share-twitter-qr"
                  className="h-10 sm:h-12 border-2 border-sky-200/50 dark:border-sky-800/50 hover:border-sky-300 dark:hover:border-sky-700 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all duration-200 active-elevate-2"
                  title="Share on X (Twitter)"
                >
                  <SiX className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600 dark:text-sky-400" />
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