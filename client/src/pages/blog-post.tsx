import { useRoute, Link, useLocation } from "wouter";
import { ArrowLeft, ArrowUp, Calendar, Clock, User, ChevronRight, Share2, MessageCircle, Copy, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/footer";
import { getPostBySlug, getRelatedPosts, faqItems } from "@/lib/blog-data";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { generateTableOfContents, shareArticleOn, copyArticleLink, authorBios, parseContentBlocks } from "@/lib/article-utils";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { useLocalizedLink } from "@/hooks/use-localized-link";
import { generateHreflangs, getAllLanguageVersions } from "@/lib/seo-utils";

export default function BlogPost() {
  const [, params] = useRoute("/:lang/blog/:slug");
  const [location] = useLocation();
  const { language } = useLanguage();
  const getLocalizedLink = useLocalizedLink();
  const slug = params?.slug as string;
  const { toast } = useToast();
  
  const post = getPostBySlug(slug);
  const relatedPosts = post ? getRelatedPosts(slug) : [];
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [toc, setToc] = useState<ReturnType<typeof generateTableOfContents>>([]);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [contentBlocks, setContentBlocks] = useState<ReturnType<typeof parseContentBlocks>>([]);
  const [readProgress, setReadProgress] = useState(0);
  
  const hreflangs = generateHreflangs(location, language);
  const languageVersions = getAllLanguageVersions(slug ? `/blog/${slug}` : `/blog`);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (post) {
      const tableOfContents = generateTableOfContents(post.content);
      setToc(tableOfContents);
      const blocks = parseContentBlocks(post.content);
      setContentBlocks(blocks);
    }
  }, [post]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
      setReadProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Article not found</h1>
          <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
          <Link href={getLocalizedLink("/blog")}>
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
        <title>{post.title} | Burner Email Blog - Temporary Email Guide</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={keywordString} />
        <meta name="author" content={post.author} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="language" content={language} />
        <link rel="canonical" href={`https://burneremail.email${languageVersions[language]}`} />
        {hreflangs.map((link) => (
          <link key={link.hrefLang} rel={link.rel} hrefLang={link.hrefLang} href={link.href} />
        ))}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://burneremail.email${languageVersions[language]}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={post.image} />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.date} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content={post.image} />
        <meta property="og:site_name" content="Burner Email" />
        <meta name="article:published_time" content={post.date} />
        <meta name="article:author" content={post.author} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-border/30 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        {/* Desktop TOC Sidebar */}
        {toc.length > 0 && (
          <aside className="hidden lg:block lg:w-64 border-r border-border/50 bg-background/50 sticky top-0 h-screen overflow-y-auto">
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">Contents</h3>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm transition-colors no-underline hover-elevate px-2 py-1.5 rounded ${
                      item.level === 2
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground ml-3'
                    }`}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Mobile TOC Toggle Button */}
        {toc.length > 0 && (
          <div className="lg:hidden fixed bottom-6 right-6 z-40">
            <Button
              size="icon"
              className="rounded-full shadow-lg h-12 w-12 bg-primary hover:bg-primary/90 text-white"
              onClick={() => setIsTocOpen(!isTocOpen)}
              aria-label={isTocOpen ? "Close table of contents" : "Open table of contents"}
              data-testid="button-mobile-toc-toggle"
            >
              {isTocOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        )}

        {/* Mobile TOC Overlay */}
        {toc.length > 0 && isTocOpen && (
          <div className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm">
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-background border-r border-border/50 overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">Contents</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsTocOpen(false)}
                    className="h-8 w-8"
                    data-testid="button-close-toc"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <nav className="space-y-2">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm transition-colors no-underline px-2 py-1.5 rounded ${
                        item.level === 2
                          ? 'text-foreground font-medium hover:bg-muted'
                          : 'text-muted-foreground ml-3 hover:text-foreground'
                      }`}
                      onClick={() => setIsTocOpen(false)}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1">
          <div className="border-b border-border/50">
            <div className="mx-auto max-w-4xl px-4 md:px-6 py-6">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Link href={getLocalizedLink("/")} className="hover:text-foreground transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link href={getLocalizedLink("/blog")} className="hover:text-foreground transition-colors">
                  Blog
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium truncate">{post.title}</span>
              </div>

              <Link href={getLocalizedLink("/blog")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </div>
          </div>

        {/* CTA Banner */}
        <div className="border-b border-border/50 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="mx-auto max-w-4xl px-4 md:px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm md:text-base font-semibold text-foreground">Try Burner Email Now</p>
                <p className="text-xs md:text-sm text-muted-foreground">Get your free temporary email instantly</p>
              </div>
              <Link href={getLocalizedLink("/")} className="flex-shrink-0 w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 h-auto min-h-10" data-testid="button-email-banner-cta">
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

          <div className="prose prose-invert max-w-none mb-12">
            {contentBlocks.map((block, idx) => {
              switch (block.type) {
                case 'h2':
                  return (
                    <h2
                      key={idx}
                      id={block.id}
                      className="text-2xl md:text-3xl font-bold text-foreground mt-12 mb-6 pt-4 scroll-mt-20"
                      data-testid={`heading-${block.id}`}
                    >
                      {block.content}
                    </h2>
                  );
                case 'h3':
                  return (
                    <h3
                      key={idx}
                      id={block.id}
                      className="text-xl md:text-2xl font-semibold text-foreground mt-8 mb-4 pt-3 scroll-mt-20"
                    >
                      {block.content}
                    </h3>
                  );
                case 'list':
                  return block.content === 'ordered' ? (
                    <ol key={idx} className="space-y-2 ml-6 my-6">
                      {block.items?.map((item, i) => (
                        <li key={i} className="text-base md:text-lg text-foreground/80 leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ul key={idx} className="space-y-2 ml-6 my-6 list-disc">
                      {block.items?.map((item, i) => (
                        <li key={i} className="text-base md:text-lg text-foreground/80 leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                case 'p':
                default:
                  return (
                    <p key={idx} className="text-base md:text-lg text-foreground/80 leading-relaxed my-4">
                      {block.content}
                    </p>
                  );
              }
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

          {/* Keywords - Now Clickable */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.keywords.map((keyword) => (
              <Link
                key={keyword}
                href={`/blog?search=${encodeURIComponent(keyword)}`}
                className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors no-underline"
                data-testid={`keyword-link-${keyword}`}
              >
                #{keyword}
              </Link>
            ))}
          </div>

          {/* Back to Top Button */}
          <div className="flex justify-end mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              data-testid="button-back-to-top"
              title="Back to top of page"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Back to Top
            </Button>
          </div>

          {/* Share Article Section - Consolidated */}
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
                Twitter
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
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const url = `${window.location.origin}/blog/${post.slug}`;
                  const success = await copyArticleLink(url);
                  toast({
                    title: success ? "Copied!" : "Failed to copy",
                    description: success ? `${url}` : "Could not copy link",
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
