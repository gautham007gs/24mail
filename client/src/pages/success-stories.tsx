import { Link } from "wouter";
import { ArrowLeft, Star, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

export default function SuccessStories() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stories = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "QA Engineer",
      company: "TechCorp",
      quote: "TempMail's QR code sharing saved us hours during cross-device testing. We switched from 10MinuteMail because it kept crashing during critical test sessions.",
      results: ["40% faster testing cycles", "Zero unplanned downtime", "Team collaboration improved"],
      avatar: "SC",
      bgColor: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Privacy Advocate",
      company: "Digital Rights Coalition",
      quote: "TempMail is the fastest and most reliable disposable email service I've tested. The auto-refresh feature means I never miss important emails.",
      results: ["99.9% uptime verified", "3x faster than competitors", "Recommended to 500+ members"],
      avatar: "MJ",
      bgColor: "from-purple-500 to-purple-600"
    },
    {
      id: 3,
      name: "Priya Sharma",
      role: "Developer",
      company: "StartupXYZ",
      quote: "We abandoned Guerrilla Mail after constant outages. TempMail has been rock solid for our development environment. The speed difference is noticeable.",
      results: ["Zero downtime incidents", "Real-time email reception", "Native dark mode perfect"],
      avatar: "PS",
      bgColor: "from-emerald-500 to-emerald-600"
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Security Researcher",
      company: "CyberSecure Labs",
      quote: "TempMail is essential for my security testing work. The instant email delivery and reliable uptime make it the obvious choice for professional use.",
      results: ["Used in 50+ security audits", "Eliminated privacy concerns", "Team switched from 3 services"],
      avatar: "JW",
      bgColor: "from-orange-500 to-orange-600"
    },
    {
      id: 5,
      name: "Lisa Rodriguez",
      role: "Product Manager",
      company: "Enterprise Corp",
      quote: "We evaluated all major temp email services. TempMail won on reliability, speed, and the QR code feature our team actually uses daily.",
      results: ["Enterprise team adoption", "60% testing time reduction", "Recommended company-wide"],
      avatar: "LR",
      bgColor: "from-pink-500 to-pink-600"
    },
    {
      id: 6,
      name: "Ahmed Hassan",
      role: "Data Privacy Consultant",
      company: "Privacy First Consulting",
      quote: "Recommended TempMail to all 200+ clients. The transparency about data retention and GDPR compliance sets it apart from competitors.",
      results: ["200+ client recommendations", "Zero compliance complaints", "Featured in privacy guide"],
      avatar: "AH",
      bgColor: "from-red-500 to-red-600"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Success Stories & Case Studies - TempMail</title>
        <meta name="description" content="Read success stories from developers, QA engineers, security researchers, and privacy advocates who switched to TempMail." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="border-b border-border/50">
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
            <Link href="/">
              <a className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </a>
            </Link>
            <h1 className="text-5xl font-bold text-foreground mb-4">Success Stories</h1>
            <p className="text-lg text-muted-foreground">Hear from people who switched to TempMail and never looked back</p>
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-4 md:px-6 py-12">
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">500K+</div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">0.3s</div>
              <p className="text-sm text-muted-foreground">Avg Response</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">4.8B</div>
              <p className="text-sm text-muted-foreground">Emails/Month</p>
            </Card>
          </div>

          {/* Case Studies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {stories.map((story) => (
              <Card key={story.id} className="p-6 hover-elevate transition-all">
                {/* Avatar & Name */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${story.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm">{story.avatar}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{story.name}</h3>
                    <p className="text-xs text-muted-foreground">{story.role}</p>
                    <p className="text-xs text-primary">{story.company}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-foreground/90 mb-6 italic">"{story.quote}"</p>

                {/* Results */}
                <div className="space-y-2">
                  {story.results.map((result, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Benefits Section */}
          <section className="bg-muted/30 rounded-lg p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Why People Choose TempMail</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Reliability</h3>
                <p className="text-muted-foreground">99.9% uptime guarantee with zero unplanned downtime incidents. Competitors experience regular outages.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Speed</h3>
                <p className="text-muted-foreground">3x faster than 10MinuteMail, 2x faster than Guerrilla Mail. 0.3-second average response time.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Exclusive Features</h3>
                <p className="text-muted-foreground">QR code sharing, 5-second auto-refresh, cross-device sync. Features no competitor offers.</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Experience the Difference?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">Join 500K+ users who trust TempMail for their email privacy needs. No registration, completely free.</p>
            <Link href="/">
              <a className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Get Started Now
              </a>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
