import { useRoute, Link } from "wouter";
import { ArrowLeft, Calendar, Clock, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPostBySlug, getRelatedPosts, faqItems } from "@/lib/blog-data";
import { Helmet } from "react-helmet";
import { useState } from "react";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug as string;
  
  const post = getPostBySlug(slug);
  const relatedPosts = post ? getRelatedPosts(slug) : [];
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Article not found</h1>
          <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <a>
              <Button>Back to Blog</Button>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const keywordString = post.keywords.join(", ");

  // Render blog content based on slug
  const renderContent = () => {
    switch(slug) {
      case "what-is-temporary-email-complete-guide":
        return <BlogContent1 />;
      case "protect-privacy-spam-disposable-email":
        return <BlogContent2 />;
      case "temporary-email-safe-online-shopping":
        return <BlogContent3 />;
      case "best-temporary-email-services-2024":
        return <BlogContent4 />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | TempMail Blog - Email Privacy Guide</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={keywordString} />
        <meta name="author" content={post.author} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content={post.image} />
        <meta name="article:published_time" content={post.date} />
        <meta name="article:author" content={post.author} />
        <link rel="canonical" href={`https://tempmail.org/blog/${slug}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50">
          <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
            <Link href="/blog">
              <a className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </a>
            </Link>
          </div>
        </div>

        {/* Article */}
        <article className="mx-auto max-w-4xl px-4 md:px-6 py-12">
          {/* Hero Image */}
          <div className="rounded-lg overflow-hidden mb-8 h-96">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full h-fit">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
            {post.title}
          </h1>

          {/* Main Content */}
          <div className="prose prose-invert max-w-none mb-12 space-y-6">
            {renderContent()}
          </div>

          {/* FAQ Section */}
          <section className="my-16 py-12 border-y border-border/50">
            <h2 className="text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqItems.map((item, idx) => (
                <div key={idx} className="border border-border/50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                  >
                    <span className="font-semibold text-foreground">{item.question}</span>
                    <ChevronRight className={`h-5 w-5 text-primary transition-transform ${expandedFAQ === idx ? 'rotate-90' : ''}`} />
                  </button>
                  {expandedFAQ === idx && (
                    <div className="px-6 py-4 bg-muted/30 border-t border-border/50">
                      <p className="text-foreground/80 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2 mb-12">
            {post.keywords.map((keyword) => (
              <span key={keyword} className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                #{keyword}
              </span>
            ))}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="pt-12 border-t border-border/50">
              <h3 className="text-2xl font-bold text-foreground mb-6">Read Next</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <a className="group no-underline">
                      <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all h-full">
                        <div className="relative h-40 overflow-hidden bg-muted">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                            {relatedPost.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {relatedPost.description}
                          </p>
                        </div>
                      </Card>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </>
  );
}

// Blog Post Components with Google-style formatting
function BlogContent1() {
  return (
    <>
      <p className="text-lg text-foreground/90 leading-relaxed">In today's digital landscape, protecting your personal information has become more critical than ever. One powerful tool that's gaining traction among privacy-conscious users is <strong>temporary email addresses</strong>, also known as disposable or throwaway emails. Let's explore what they are and why you might want to use one.</p>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Understanding Temporary Email Addresses</h2>
      <p className="text-foreground/80 leading-relaxed">A temporary email address is a unique email that exists for a limited time and is not tied to your real identity. Think of it as a <em>one-time password for email</em>. Instead of providing your personal email address when signing up for services, you can use a temporary address that will eventually disappear.</p>

      <div className="bg-primary/10 border-l-4 border-primary p-6 my-6 rounded">
        <p className="font-semibold text-foreground mb-2">💡 Quick Fact:</p>
        <p className="text-foreground/80">Over 45 million people used temporary email services in 2023, and that number continues to grow as privacy awareness increases.</p>
      </div>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">How Do Temporary Email Services Work?</h2>
      <p className="text-foreground/80 leading-relaxed">The mechanics are surprisingly simple but effective:</p>
      
      <ol className="space-y-3 my-6 pl-6 text-foreground/80">
        <li className="list-decimal"><strong>Instant Generation:</strong> You visit a temporary email service and instantly receive a unique email address</li>
        <li className="list-decimal"><strong>Email Reception:</strong> You use this address to sign up for services, newsletters, or accounts</li>
        <li className="list-decimal"><strong>Access Your Inbox:</strong> All incoming emails appear in your temporary inbox</li>
        <li className="list-decimal"><strong>Auto-Deletion:</strong> After the time expires (usually 10 minutes to several hours), the address and all emails are permanently deleted</li>
      </ol>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Key Advantages You Should Know</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div className="p-6 bg-muted/50 rounded-lg">
          <h4 className="font-bold text-foreground mb-3">🛡️ Enhanced Privacy</h4>
          <p className="text-foreground/80 text-sm">Your real email remains completely hidden from businesses and marketers who might otherwise sell your information.</p>
        </div>
        <div className="p-6 bg-muted/50 rounded-lg">
          <h4 className="font-bold text-foreground mb-3">📧 Spam Prevention</h4>
          <p className="text-foreground/80 text-sm">Unwanted marketing emails never reach your real inbox, keeping it clean and organized.</p>
        </div>
        <div className="p-6 bg-muted/50 rounded-lg">
          <h4 className="font-bold text-foreground mb-3">🔒 Security</h4>
          <p className="text-foreground/80 text-sm">If a service gets hacked, your actual email address remains safe from unauthorized access.</p>
        </div>
        <div className="p-6 bg-muted/50 rounded-lg">
          <h4 className="font-bold text-foreground mb-3">⚡ Convenience</h4>
          <p className="text-foreground/80 text-sm">No registration required—get started in seconds with zero personal information needed.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Perfect Use Cases for Temporary Email</h2>
      
      <ul className="space-y-3 my-6 pl-6 text-foreground/80">
        <li className="list-disc"><strong>Online Shopping:</strong> Test checkout processes or use for one-time purchases where you don't want marketing emails</li>
        <li className="list-disc"><strong>Newsletter Subscriptions:</strong> Subscribe to newsletters without cluttering your main inbox</li>
        <li className="list-disc"><strong>Free Trial Services:</strong> Sign up for free trials without committing your primary email</li>
        <li className="list-disc"><strong>Forum Registrations:</strong> Participate in online forums while maintaining anonymity</li>
        <li className="list-disc"><strong>Beta Testing:</strong> Test new software and apps without giving up personal information</li>
        <li className="list-disc"><strong>API Testing:</strong> Developers use temp emails to test email verification systems</li>
      </ul>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Is It Legal and Safe?</h2>
      <p className="text-foreground/80 leading-relaxed">Absolutely. Using temporary email is <strong>completely legal</strong> and used by legitimate organizations worldwide. Major software companies, universities, and developers use temporary email for testing purposes. The privacy they provide is a fundamental right in the digital age.</p>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">The Bottom Line</h2>
      <p className="text-foreground/80 leading-relaxed">Temporary email addresses represent a practical and effective way to maintain your privacy in an increasingly connected world. By understanding how they work and using them strategically, you can protect your personal information while enjoying the convenience of online services.</p>
    </>
  );
}

function BlogContent2() {
  return (
    <>
      <p className="text-lg text-foreground/90 leading-relaxed">Email spam has become an epidemic. Studies show that over <strong>85% of emails</strong> received globally are spam. Beyond being annoying, spam poses serious security risks and wastes valuable time. The good news? <strong>Disposable email addresses</strong> offer a powerful solution that most people don't know about.</p>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Understanding the Spam Problem</h2>
      <p className="text-foreground/80 leading-relaxed">Spam isn't just marketing emails. It includes phishing attempts, malware delivery systems, and identity theft schemes. When you provide your real email to multiple services, you're essentially painting a target on yourself.</p>

      <div className="bg-primary/10 border-l-4 border-primary p-6 my-6 rounded">
        <p className="font-semibold text-foreground mb-2">⚠️ Important:</p>
        <p className="text-foreground/80">One major data breach can expose your email to millions of spammers. Your address then gets sold, traded, and used on countless spam lists.</p>
      </div>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">How Temporary Email Stops Spam Before It Starts</h2>
      
      <p className="text-foreground/80 leading-relaxed mb-6">The strategy is elegant in its simplicity:</p>

      <div className="space-y-4 my-8">
        <div className="p-5 border-l-4 border-primary bg-muted/30 rounded">
          <h4 className="font-bold text-foreground mb-2">1. Compartmentalization</h4>
          <p className="text-foreground/80">Create separate temporary emails for different services. If one gets compromised, only that single address is affected.</p>
        </div>
        <div className="p-5 border-l-4 border-primary bg-muted/30 rounded">
          <h4 className="font-bold text-foreground mb-2">2. Automatic Deletion</h4>
          <p className="text-foreground/80">Temporary addresses auto-delete after a set period. All spam disappears with them—no manual cleanup needed.</p>
        </div>
        <div className="p-5 border-l-4 border-primary bg-muted/30 rounded">
          <h4 className="font-bold text-foreground mb-2">3. Real Email Protection</h4>
          <p className="text-foreground/80">Your primary email stays clean because untrusted services never have access to it in the first place.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Best Practices for Maximum Privacy</h2>

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">✓ DO: Use Temporary Email For</h3>
      <ul className="space-y-2 pl-6 text-foreground/80 mb-6">
        <li className="list-disc">Websites you've never heard of</li>
        <li className="list-disc">Services that don't need to contact you long-term</li>
        <li className="list-disc">Downloadable content that requires email verification</li>
        <li className="list-disc">Free trials and limited-time offers</li>
        <li className="list-disc">Testing and development purposes</li>
      </ul>

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">✗ DON'T: Use Temporary Email For</h3>
      <ul className="space-y-2 pl-6 text-foreground/80 mb-6">
        <li className="list-disc">Banking and financial accounts</li>
        <li className="list-disc">Email provider accounts themselves</li>
        <li className="list-disc">Accounts with payment information</li>
        <li className="list-disc">Services offering password recovery via email</li>
        <li className="list-disc">Long-term professional accounts</li>
      </ul>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Real-World Benefits: A Comparison</h2>

      <div className="overflow-x-auto my-8">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-foreground">Aspect</th>
              <th className="px-4 py-3 text-left font-bold text-foreground">Real Email Only</th>
              <th className="px-4 py-3 text-left font-bold text-foreground">With Temporary Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            <tr>
              <td className="px-4 py-3 font-semibold text-foreground">Spam Received</td>
              <td className="px-4 py-3 text-foreground/80">50-100+ daily</td>
              <td className="px-4 py-3 text-foreground/80">Minimal</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-foreground">Data Breach Risk</td>
              <td className="px-4 py-3 text-foreground/80">High</td>
              <td className="px-4 py-3 text-foreground/80">Very Low</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-foreground">Time Managing Email</td>
              <td className="px-4 py-3 text-foreground/80">Hours weekly</td>
              <td className="px-4 py-3 text-foreground/80">Minimal</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-foreground">Privacy Level</td>
              <td className="px-4 py-3 text-foreground/80">Compromised</td>
              <td className="px-4 py-3 text-foreground/80">Protected</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">The Long-Term Impact</h2>
      <p className="text-foreground/80 leading-relaxed">Over time, regular use of temporary emails dramatically reduces spam. Your real inbox becomes a sacred space—only for important communications. You regain control of your digital life, spend less time managing email, and significantly reduce your attack surface for hackers and scammers.</p>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Taking Action Today</h2>
      <p className="text-foreground/80 leading-relaxed">Start small. Next time you encounter an unfamiliar website requesting your email, use a temporary address instead. You'll immediately notice the difference. Your inbox will thank you.</p>
    </>
  );
}

function BlogContent3() {
  return (
    <>
      <p className="text-lg text-foreground/90 leading-relaxed">Online shopping has revolutionized retail, but it comes with privacy concerns. When you checkout on an e-commerce site, you're trusting them with sensitive personal and financial information. <strong>Is it safe to use a temporary email for shopping?</strong> The answer is nuanced, and we're diving deep into it.</p>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">The Security Landscape of Online Shopping</h2>
      <p className="text-foreground/80 leading-relaxed">Online retailers collect massive amounts of customer data: email addresses, names, phone numbers, and shipping addresses. This data becomes a prime target for hackers. Major retailers have experienced breaches exposing millions of customer records.</p>

      <div className="bg-primary/10 border-l-4 border-primary p-6 my-6 rounded">
        <p className="font-semibold text-foreground mb-2">📊 Data Point:</p>
        <p className="text-foreground/80">The average retail data breach exposes personal information of over 200,000 people. Your shopping history often includes your email address.</p>
      </div>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">When to Use Temporary Email for Shopping</h2>

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">✓ Safe for One-Time Purchases</h3>
      <p className="text-foreground/80 leading-relaxed mb-4">Temporary email is <strong>perfectly safe</strong> for:</p>
      <ul className="space-y-2 pl-6 text-foreground/80 mb-6">
        <li className="list-disc">One-time purchases from reputable retailers</li>
        <li className="list-disc">Bulk/wholesale sites you'll never use again</li>
        <li className="list-disc">Marketplace purchases with third-party sellers</li>
        <li className="list-disc">International retailers with unfamiliar payment systems</li>
        <li className="list-disc">Sites offering special discounts requiring email</li>
      </ul>

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">✗ Not Suitable For Account-Based Shopping</h3>
      <p className="text-foreground/80 leading-relaxed mb-4">Don't use temporary email for:</p>
      <ul className="space-y-2 pl-6 text-foreground/80 mb-6">
        <li className="list-disc">Subscription boxes and recurring purchases</li>
        <li className="list-disc">Sites where you'll need password recovery</li>
        <li className="list-disc">Customer loyalty programs</li>
        <li className="list-disc">Accounts with saved payment methods</li>
        <li className="list-disc">Retailers you frequent regularly</li>
      </ul>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Security Advantages Explained</h2>

      <div className="space-y-6 my-8">
        <div>
          <h4 className="font-bold text-foreground mb-3">🔐 Email Address Isolation</h4>
          <p className="text-foreground/80 leading-relaxed">When a retailer's database is breached, only your temporary email is exposed—not your real one. Your actual identity remains protected.</p>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-3">📬 No Spam Trail</h4>
          <p className="text-foreground/80 leading-relaxed">Your real inbox doesn't get inundated with promotional emails from the retailer. The temporary address handles all marketing automatically deleted afterward.</p>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-3">🎯 Phishing Prevention</h4>
          <p className="text-foreground/80 leading-relaxed">Scammers can't use your temporary email for targeted phishing attacks since it doesn't exist anymore. Your real email is never at risk.</p>
        </div>
        <div>
          <h4 className="font-bold text-foreground mb-3">🛑 Data Aggregation Prevention</h4>
          <p className="text-foreground/80 leading-relaxed">Marketers can't build comprehensive profiles of your shopping habits using temporary emails, protecting your consumer privacy.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Best Practices for Secure Online Shopping</h2>

      <div className="bg-muted/30 p-8 rounded-lg my-8">
        <h4 className="font-bold text-foreground mb-5">Strategic Approach to Temporary Email Shopping</h4>
        <ol className="space-y-4 text-foreground/80">
          <li className="flex gap-4">
            <span className="font-bold text-primary">1.</span>
            <span><strong>Assess the retailer:</strong> Is it a known brand? What's their security reputation?</span>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-primary">2.</span>
            <span><strong>Check SSL certificate:</strong> Look for "https://" and a padlock icon in your browser</span>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-primary">3.</span>
            <span><strong>Use temp email for:</strong> One-off purchases, new sites, unknown sellers</span>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-primary">4.</span>
            <span><strong>Use real email for:</strong> Trusted stores where you have an account and order history</span>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-primary">5.</span>
            <span><strong>Always use payment security:</strong> Credit cards offer more fraud protection than debit</span>
          </li>
        </ol>
      </div>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">The Verdict</h2>
      <p className="text-foreground/80 leading-relaxed">Temporary email is <strong>absolutely safe for online shopping</strong>—when used strategically. For one-time or infrequent purchases, it's an excellent privacy-protective measure. Just remember to use your real email for accounts you'll maintain long-term, and always prioritize verified secure payment methods.</p>
    </>
  );
}

function BlogContent4() {
  return (
    <>
      <p className="text-lg text-foreground/90 leading-relaxed">With dozens of temporary email services available in 2024, choosing the right one can be overwhelming. Each service offers different features, security levels, and user experiences. In this comprehensive guide, we break down the best options and help you find the perfect solution for your privacy needs.</p>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">What Makes a Great Temporary Email Service?</h2>
      <p className="text-foreground/80 leading-relaxed mb-6">Before we compare specific services, let's understand the key factors that matter:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div className="p-5 bg-muted/50 rounded-lg">
          <h4 className="font-bold text-foreground mb-2">⚡ Speed & Reliability</h4>
          <p className="text-foreground/80 text-sm">Instant email generation and consistent inbox loading performance.</p>
        </div>
        <div className="p-5 bg-muted/50 rounded-lg">
          <h4 className="font-bold text-foreground mb-2">🔒 Security & Privacy</h4>
          <p className="text-foreground/80 text-sm">End-to-end encryption, no data logging, and automatic email deletion.</p>
        </div>
        <div className="p-5 bg-muted/50 rounded-lg">
          <h4 className="font-bold text-foreground mb-2">📱 Accessibility</h4>
          <p className="text-foreground/80 text-sm">Works seamlessly across browsers, mobile apps, and devices.</p>
        </div>
        <div className="p-5 bg-muted/50 rounded-lg">
          <h4 className="font-bold text-foreground mb-2">✨ User Experience</h4>
          <p className="text-foreground/80 text-sm">Intuitive interface, easy email copying, and clear design.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Top Temporary Email Services Comparison</h2>

      <div className="space-y-8 my-10">
        <div className="border border-border/50 rounded-lg p-6 hover:bg-muted/20 transition-colors">
          <h3 className="text-xl font-bold text-foreground mb-3">🏆 TempMail – Best Overall</h3>
          <p className="text-foreground/80 mb-4">TempMail stands out as the most complete temporary email solution, combining simplicity with powerful features.</p>
          <div className="space-y-2 text-sm text-foreground/80 mb-4">
            <p><strong className="text-foreground">✓ Pros:</strong> Instant generation, 5-second auto-refresh, QR code sharing for cross-device access, multiple domain options, clean interface</p>
            <p><strong className="text-foreground">✓ Best For:</strong> Users who want straightforward, reliable temporary emails with modern features</p>
            <p><strong className="text-foreground">✓ Pricing:</strong> 100% Free</p>
          </div>
        </div>

        <div className="border border-border/50 rounded-lg p-6 hover:bg-muted/20 transition-colors">
          <h3 className="text-xl font-bold text-foreground mb-3">📊 10 Minute Mail – Classic Choice</h3>
          <p className="text-foreground/80 mb-4">One of the original temporary email services, known for no-frills simplicity and reliability.</p>
          <div className="space-y-2 text-sm text-foreground/80 mb-4">
            <p><strong className="text-foreground">✓ Pros:</strong> 10-minute default timer, works everywhere, minimal interface, no JavaScript required</p>
            <p><strong className="text-foreground">✓ Best For:</strong> Users preferring classic, lightweight solutions</p>
            <p><strong className="text-foreground">✓ Pricing:</strong> Free with optional premium</p>
          </div>
        </div>

        <div className="border border-border/50 rounded-lg p-6 hover:bg-muted/20 transition-colors">
          <h3 className="text-xl font-bold text-foreground mb-3">🔒 Guerrilla Mail – Security Focused</h3>
          <p className="text-foreground/80 mb-4">Emphasizes privacy and security with advanced encryption features.</p>
          <div className="space-y-2 text-sm text-foreground/80 mb-4">
            <p><strong className="text-foreground">✓ Pros:</strong> GPG encryption support, ForwardEmail integration, email forwarding capabilities</p>
            <p><strong className="text-foreground">✓ Best For:</strong> Privacy enthusiasts needing advanced encryption</p>
            <p><strong className="text-foreground">✓ Pricing:</strong> Free with premium options</p>
          </div>
        </div>

        <div className="border border-border/50 rounded-lg p-6 hover:bg-muted/20 transition-colors">
          <h3 className="text-xl font-bold text-foreground mb-3">📱 Temp Mail Apps – Mobile Priority</h3>
          <p className="text-foreground/80 mb-4">Dedicated mobile applications for iOS and Android with push notifications.</p>
          <div className="space-y-2 text-sm text-foreground/80 mb-4">
            <p><strong className="text-foreground">✓ Pros:</strong> Native app experience, instant notifications, offline access</p>
            <p><strong className="text-foreground">✓ Best For:</strong> Smartphone-first users who want app integration</p>
            <p><strong className="text-foreground">✓ Pricing:</strong> Free apps with optional premium features</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Feature Comparison Table</h2>

      <div className="overflow-x-auto my-8 border border-border/50 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-foreground">Feature</th>
              <th className="px-4 py-3 text-center font-bold text-foreground">TempMail</th>
              <th className="px-4 py-3 text-center font-bold text-foreground">10 Min Mail</th>
              <th className="px-4 py-3 text-center font-bold text-foreground">Guerrilla Mail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            <tr>
              <td className="px-4 py-3 font-semibold text-foreground">Instant Generation</td>
              <td className="px-4 py-3 text-center">✓</td>
              <td className="px-4 py-3 text-center">✓</td>
              <td className="px-4 py-3 text-center">✓</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-foreground">Auto-Refresh</td>
              <td className="px-4 py-3 text-center">✓ (5s)</td>
              <td className="px-4 py-3 text-center">✗</td>
              <td className="px-4 py-3 text-center">✗</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-foreground">Mobile App</td>
              <td className="px-4 py-3 text-center">✓</td>
              <td className="px-4 py-3 text-center">✓</td>
              <td className="px-4 py-3 text-center">✓</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-foreground">GPG Encryption</td>
              <td className="px-4 py-3 text-center">✗</td>
              <td className="px-4 py-3 text-center">✗</td>
              <td className="px-4 py-3 text-center">✓</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-foreground">Email Forwarding</td>
              <td className="px-4 py-3 text-center">✗</td>
              <td className="px-4 py-3 text-center">✗</td>
              <td className="px-4 py-3 text-center">✓</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-foreground">QR Code Sharing</td>
              <td className="px-4 py-3 text-center">✓</td>
              <td className="px-4 py-3 text-center">✗</td>
              <td className="px-4 py-3 text-center">✗</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Choosing the Right Service for You</h2>

      <div className="space-y-4 my-8">
        <div className="p-5 bg-primary/10 rounded-lg">
          <h4 className="font-bold text-foreground mb-2">🎯 For Most Users</h4>
          <p className="text-foreground/80">We recommend <strong>TempMail</strong>. It offers the best balance of simplicity, reliability, and modern features. The auto-refresh and QR code sharing are game-changers for convenience.</p>
        </div>
        <div className="p-5 bg-primary/10 rounded-lg">
          <h4 className="font-bold text-foreground mb-2">🔐 For Security Enthusiasts</h4>
          <p className="text-foreground/80">Choose <strong>Guerrilla Mail</strong> if you need advanced encryption and forwarding capabilities for sensitive communications.</p>
        </div>
        <div className="p-5 bg-primary/10 rounded-lg">
          <h4 className="font-bold text-foreground mb-2">📦 For Minimalists</h4>
          <p className="text-foreground/80">Go with <strong>10 Minute Mail</strong> for the most straightforward, lightweight experience with no unnecessary features.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Final Thoughts</h2>
      <p className="text-foreground/80 leading-relaxed">The best temporary email service is the one you'll actually use. Start with TempMail for its modern features and ease of use. If your needs evolve, explore the alternatives. The important thing is that you're taking control of your digital privacy.</p>
    </>
  );
}
