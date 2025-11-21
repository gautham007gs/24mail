import { useState } from "react";
import { Copy, Check, RefreshCw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/notification-context";
import { getRandomMessage } from "@/lib/fun-messages";
import { audioEffects } from "@/lib/audio-effects";
import { type Domain } from "@shared/schema";

interface EmailGeneratorProps {
  currentEmail: string;
  domains: Domain[];
  onGenerate: (email: string) => void;
}

export function EmailGenerator({ currentEmail, domains, onGenerate }: EmailGeneratorProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>(domains[0] || "");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { permission, isSupported, requestPermission } = useNotifications();
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);

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

  const handleGenerate = () => {
    const username = generateRandomUsername();
    const domain = selectedDomain || domains[0];
    onGenerate(`${username}@${domain}`);
    toast({
      title: "New email generated",
      description: "Your new temporary email is ready",
    });
  };

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    const username = currentEmail.split("@")[0];
    onGenerate(`${username}@${domain}`);
  };

  return (
    <Card className="p-8 glass-card hover-lift smooth-transition">
      <div className="space-y-8">
        {/* Notification Permission Banner */}
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

        {permission === "granted" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="h-4 w-4 text-primary" />
            <span>Notifications enabled</span>
          </div>
        )}

        {/* Email Display - Enhanced */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-foreground">
            Broooo, your email is...
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg blur transition-all group-hover:blur-md" />
            <div className="relative bg-background border border-primary/20 rounded-lg p-5 flex gap-3 items-center hover:border-primary/40 transition-colors">
              <span
                className="flex-1 font-mono text-lg md:text-2xl font-bold text-foreground truncate"
                data-testid="text-current-email"
              >
                {currentEmail || "Generating..."}
              </span>
              <Button
                size="lg"
                onClick={handleCopy}
                disabled={!currentEmail}
                data-testid="button-copy-email"
                className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-foreground">
              Domain
            </label>
            <Select
              value={selectedDomain}
              onValueChange={handleDomainChange}
              disabled={domains.length === 0}
            >
              <SelectTrigger data-testid="select-domain" className="bg-background">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    @{domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={domains.length === 0}
            data-testid="button-generate-email"
            className="sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate New Email
          </Button>
        </div>
      </div>
    </Card>
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
