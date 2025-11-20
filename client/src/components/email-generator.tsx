import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
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

  const handleCopy = async () => {
    if (!currentEmail) return;
    
    try {
      await navigator.clipboard.writeText(currentEmail);
      setCopied(true);
      toast({
        title: "Copied!",
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
    <Card className="p-8">
      <div className="space-y-8">
        {/* Email Display */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Your Temporary Email
          </label>
          <div className="flex gap-2">
            <div className="flex flex-1 items-center gap-4 rounded-lg border border-border bg-muted/30 px-5 py-4">
              <span
                className="flex-1 font-mono text-lg md:text-xl font-medium text-foreground break-all"
                data-testid="text-current-email"
              >
                {currentEmail || "Generating..."}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCopy}
                disabled={!currentEmail}
                data-testid="button-copy-email"
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-primary" />
                ) : (
                  <Copy className="h-5 w-5" />
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
