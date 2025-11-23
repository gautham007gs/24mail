import { useRoute, Link } from "wouter";
import { ArrowLeft, Calendar, Clock, User, ChevronRight, Share2, MessageCircle, Send, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import { getPostBySlug, getRelatedPosts, faqItems } from "@/lib/blog-data";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { generateTableOfContents, shareArticleOn, copyArticleLink, authorBios } from "@/lib/article-utils";
import { useToast } from "@/hooks/use-toast";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug as string;
  const { toast } = useToast();
  
  const post = getPostBySlug(slug);
  const relatedPosts = post ? getRelatedPosts(slug) : [];
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [toc, setToc] = useState<ReturnType<typeof generateTableOfContents>>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (post) {
      const tableOfContents = generateTableOfContents(post.content);
      setToc(tableOfContents);
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Article not found</h1>
          <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const keywordString = post.keywords.join(", ");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.metaDescription,
    "image": post.image,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "datePublished": post.date,
    "dateModified": post.date,
    "articleBody": post.title,
    "keywords": post.keywords.join(", "),
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | TempMail Blog - Temporary Email Guide</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={keywordString} />
        <meta name="author" content={post.author} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.image} />
        <meta property="og:site_name" content="TempMail" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content={post.image} />
        <meta name="article:published_time" content={post.date} />
        <meta name="article:author" content={post.author} />
        <link rel="canonical" href={`https://tempmail.com/blog/${post.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        {/* TOC Sidebar */}
        {toc.length > 0 && (
          <aside className="hidden lg:block lg:w-64 border-r border-border/50 bg-background/50 sticky top-0 h-screen overflow-y-auto">
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-foreground text-sm">Table of Contents</h3>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm transition-colors no-underline ${
                      item.level === 2
                        ? 'text-foreground hover:text-primary'
                        : 'text-muted-foreground hover:text-foreground ml-4'
                    }`}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}

        <div className="flex-1">
          <div className="border-b border-border/50">
            <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </div>
          </div>

        {/* CTA Banner */}
        <div className="border-b border-border/50 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10">
          <div className="mx-auto max-w-4xl px-4 md:px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm md:text-base font-semibold text-foreground">Try TempMail Now</p>
                <p className="text-xs md:text-sm text-muted-foreground">Get your free temporary email instantly</p>
              </div>
              <Link href="/" className="flex-shrink-0 w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 h-auto min-h-10" data-testid="button-email-banner-cta">
                  Generate Email
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <article className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-12">
          <div className="rounded-lg overflow-hidden mb-8 h-64 md:h-96">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-muted-foreground mb-6 pb-8 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time>{new Date(post.date).toLocaleDateString()}</time>
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

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="prose prose-invert max-w-none mb-12 space-y-6 text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('## ')) {
                return <h2 key={idx} className="text-2xl md:text-3xl font-bold text-foreground mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
              }
              if (paragraph.startsWith('**') && paragraph.includes(':')) {
                return <p key={idx} className="text-base md:text-lg"><strong>{paragraph.split(':')[0].replace(/\*\*/g, '')}:</strong> {paragraph.split(':').slice(1).join(':').replace(/\*\*/g, '')}</p>;
              }
              if (paragraph.match(/^\d+\./)) {
                return <p key={idx} className="text-base md:text-lg ml-4 mb-2">{paragraph}</p>;
              }
              if (paragraph.startsWith('-')) {
                return <li key={idx} className="text-base md:text-lg ml-6 mb-2">{paragraph.replace('- ', '')}</li>;
              }
              return <p key={idx} className="text-base md:text-lg">{paragraph}</p>;
            })}
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
                    aria-expanded={expandedFAQ === idx}
                    aria-label={`${item.question} - ${expandedFAQ === idx ? 'collapse' : 'expand'} FAQ item`}
                    data-testid={`button-faq-${idx}`}
                  >
                    <span className="font-semibold text-foreground">{item.question}</span>
                    <ChevronRight className={`h-5 w-5 text-primary transition-transform ${expandedFAQ === idx ? 'rotate-90' : ''}`} aria-hidden="true" />
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
          <div className="flex flex-wrap gap-2 mb-8">
            {post.keywords.map((keyword) => (
              <span key={keyword} className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                #{keyword}
              </span>
            ))}
          </div>

          {/* Share Article Section */}
          <div className="py-8 border-y border-border/50 mb-12">
            <h3 className="text-lg font-bold text-foreground mb-4">Share This Article</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const url = `${window.location.origin}/blog/${post.slug}`;
                  shareArticleOn('twitter', {
                    title: post.title,
                    url,
                    summary: post.metaDescription,
                  });
                }}
                data-testid="button-share-twitter-article"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share on Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const url = `${window.location.origin}/blog/${post.slug}`;
                  shareArticleOn('whatsapp', {
                    title: post.title,
                    url,
                    summary: post.metaDescription,
                  });
                }}
                data-testid="button-share-whatsapp-article"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Share on WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const url = `${window.location.origin}/blog/${post.slug}`;
                  shareArticleOn('telegram', {
                    title: post.title,
                    url,
                    summary: post.metaDescription,
                  });
                }}
                data-testid="button-share-telegram-article"
              >
                <Send className="h-4 w-4 mr-2" />
                Share on Telegram
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const url = `${window.location.origin}/blog/${post.slug}`;
                  const success = await copyArticleLink(url);
                  toast({
                    title: success ? "Copied!" : "Failed to copy",
                    description: success ? "Article link copied to clipboard" : "Could not copy link",
                  });
                }}
                data-testid="button-copy-article-link"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Author Bio */}
          {authorBios[post.author] && (
            <div className="mb-12 p-6 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg">
              <div className="flex gap-4 items-start">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0 flex-shrink-0">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-lg mb-1">About the Author</h3>
                  <p className="font-semibold text-foreground mb-2">{authorBios[post.author].name}</p>
                  <p className="text-sm text-foreground/80 mb-3">{authorBios[post.author].bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {authorBios[post.author].expertise.map((skill) => (
                      <span key={skill} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="pt-12 border-t border-border/50">
              <h3 className="text-2xl font-bold text-foreground mb-6">Read Next</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    key={relatedPost.id} 
                    href={`/blog/${relatedPost.slug}`}
                    className="group no-underline block"
                    data-testid={`card-related-post-${relatedPost.id}`}
                  >
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
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        <Footer />
        </div>
      </div>
    </>
  );
}
