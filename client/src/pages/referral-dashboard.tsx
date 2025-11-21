import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Users, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getReferralData, getReferralShareUrl } from "@/lib/referral-tracking";

export default function ReferralDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const currentEmail = localStorage.getItem("tempmail_current_email");
    if (currentEmail) {
      const data = getReferralData(currentEmail);
      setStats({
        referralCode: data.referralCode,
        totalReferrals: data.referralsUsed,
        bonusEmails: data.bonusEmails,
        shareUrl: getReferralShareUrl(data.referralCode),
      });
    }
  }, []);

  const handleCopyCode = () => {
    if (stats?.shareUrl) {
      navigator.clipboard.writeText(stats.shareUrl);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    }
  };

  const handleShare = () => {
    if (stats?.shareUrl && navigator.share) {
      navigator.share({
        title: "Join TempMail - Get 50 Free Emails!",
        text: "Get an instant temporary email with 50 bonus emails using my referral code!",
        url: stats.shareUrl,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Referral Program - TempMail</title>
        <meta name="description" content="Earn 50 free emails per referral. Share your referral code and grow with TempMail." />
      </Helmet>
      
      <Header />

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4" data-testid="heading-referral-program">Referral Program</h1>
            <p className="text-muted-foreground text-lg">
              Invite friends and earn 50 bonus emails per referral
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  People Referred
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="stat-total-referrals">
                  {stats?.totalReferrals ?? 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Bonus Emails Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="stat-bonus-emails">
                  {stats?.bonusEmails ?? 0}
                </div>
                <p className="text-xs text-muted-foreground mt-2">50 per referral</p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium opacity-90">Your Referral Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-mono font-bold" data-testid="referral-code">
                  {stats?.referralCode || "N/A"}
                </div>
                <p className="text-xs opacity-75 mt-2">Share your code with friends</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Share Your Referral Link</CardTitle>
              <CardDescription>
                Copy your unique link and share it with friends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={handleCopyCode}
                  variant="default"
                  className="gap-2"
                  data-testid="button-copy-referral"
                >
                  <Copy className="w-4 h-4" />
                  Copy Referral Link
                </Button>
                {typeof navigator !== "undefined" && navigator.share && (
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="gap-2"
                    data-testid="button-share-referral"
                  >
                    <Share2 className="w-4 h-4" />
                    Share on Apps
                  </Button>
                )}
              </div>
              {stats?.shareUrl && (
                <div className="bg-secondary/50 p-3 rounded-md break-all">
                  <p className="text-xs text-muted-foreground mb-1">Your referral link:</p>
                  <p className="text-sm font-mono">{stats.shareUrl}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Share Your Referral Link</p>
                    <p className="text-sm text-muted-foreground">Copy the link above and share it with friends via WhatsApp, Email, SMS, etc.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">They Click Your Link</p>
                    <p className="text-sm text-muted-foreground">They click your referral link and get a temporary email with 50 bonus emails</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">You Earn 50 Emails</p>
                    <p className="text-sm text-muted-foreground">Get 50 bonus free emails instantly credited to your account for each referral</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  );
}
