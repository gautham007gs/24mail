import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Users, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ReferralDashboard() {
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/referral/stats"],
    queryFn: () => fetch("/api/referral/stats").then((res) => res.json()),
    staleTime: 30000,
  });

  const handleCopyCode = () => {
    if (stats?.referralCode) {
      const url = `${window.location.origin}?ref=${stats.referralCode}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    }
  };

  const handleShare = () => {
    if (stats?.referralCode && navigator.share) {
      const url = `${window.location.origin}?ref=${stats.referralCode}`;
      navigator.share({
        title: "TempMail Referral",
        text: "Get 50 free emails per referral on TempMail!",
        url,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Referral Program - TempMail</title>
        <meta name="description" content="Earn 50 free emails per referral. Share your referral code and grow with TempMail." />
      </Helmet>

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
                  Total Referrals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="stat-total-referrals">
                  {isLoading ? "..." : stats?.totalReferrals || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  Bonus Emails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="stat-bonus-emails">
                  {isLoading ? "..." : stats?.bonusEmails || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium opacity-90">Your Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-mono font-bold" data-testid="referral-code">
                  {isLoading ? "..." : stats?.referralCode || "N/A"}
                </div>
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
                  Copy Link
                </Button>
                {navigator.share && (
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="gap-2"
                    data-testid="button-share-referral"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {stats?.referralCode ? `Your referral link: ${window.location.origin}?ref=${stats.referralCode}` : "Loading..."}
              </p>
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
                    <p className="font-medium">Share Your Code</p>
                    <p className="text-sm text-muted-foreground">Copy and share your referral link with friends</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Friend Signs Up</p>
                    <p className="text-sm text-muted-foreground">They click your link and create an account</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">You Earn 50 Emails</p>
                    <p className="text-sm text-muted-foreground">Get 50 bonus free emails per successful referral</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
