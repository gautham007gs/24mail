import { useRoute, Link } from "wouter";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPostBySlug, getRelatedPosts } from "@/lib/blog-data";
import { Helmet } from "react-helmet";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug as string;
  
  const post = getPostBySlug(slug);
  const relatedPosts = post ? getRelatedPosts(slug) : [];

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Article not found</h1>
          <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
          <Link href="/blog">
            {({ navigate }) => (
              <Button onClick={navigate}>Back to Blog</Button>
            )}
          </Link>
        </div>
      </div>
    );
  }

  const keywordString = post.keywords.join(", ");

  return (
    <>
      <Helmet>
        <title>{post.title} | TempMail Blog</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={keywordString} />
        <meta name="author" content={post.author} />
        <meta name="og:title" content={post.title} />
        <meta name="og:description" content={post.description} />
        <meta name="og:image" content={post.image} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content={post.image} />
        <meta name="article:published_time" content={post.date} />
        <meta name="article:author" content={post.author} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50">
          <div className="mx-auto max-w-4xl px-4 md:px-6 py-8">
            <Link href="/blog">
              {({ navigate }) => (
                <button 
                  onClick={navigate}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </button>
              )}
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
          <div className="flex flex-wrap gap-4 md:gap-6 text-sm text-muted-foreground mb-6">
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

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            {post.title}
          </h1>

          {/* Content */}
          <div className="prose prose-invert max-w-none mb-12">
            {post.content.split('\n').map((paragraph, idx) => {
              if (paragraph.startsWith('# ')) {
                return <h2 key={idx} className="text-3xl font-bold mt-8 mb-4 text-foreground">{paragraph.slice(2)}</h2>;
              }
              if (paragraph.startsWith('## ')) {
                return <h3 key={idx} className="text-2xl font-bold mt-6 mb-3 text-foreground">{paragraph.slice(3)}</h3>;
              }
              if (paragraph.startsWith('### ')) {
                return <h4 key={idx} className="text-xl font-bold mt-4 mb-2 text-foreground">{paragraph.slice(4)}</h4>;
              }
              if (paragraph.startsWith('- ')) {
                return <li key={idx} className="text-foreground/80 ml-6 mb-2">{paragraph.slice(2)}</li>;
              }
              if (paragraph.trim()) {
                return <p key={idx} className="text-foreground/80 mb-4 leading-relaxed">{paragraph}</p>;
              }
              return null;
            })}
          </div>

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
              <h3 className="text-2xl font-bold text-foreground mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    {({ navigate }) => (
                      <div 
                        className="group cursor-pointer"
                        onClick={navigate}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            navigate();
                          }
                        }}
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
                      </div>
                    )}
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
