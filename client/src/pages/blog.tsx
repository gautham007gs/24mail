import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Search, BookOpen, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { blogPosts } from "@/lib/blog-data";
import { Footer } from "@/components/footer";
import { BlogImageSkeleton } from "@/lib/loading-skeletons";
import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageLoad = (postId: string) => {
    setLoadedImages(prev => [...prev, postId]);
  };

  const categories = useMemo(() => Array.from(new Set(blogPosts.map(p => p.category))), []);

  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.keywords.some(k => k.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchQuery, selectedCategory]);

  return (
    <>
      <Helmet>
        <title>Burner Email Blog - Expert Guides on Temp Mail, Disposable Email & Privacy</title>
        <meta name="description" content="Read expert guides on burner email, temp mail, temporary email, and disposable email. Learn privacy protection, spam prevention, and email security best practices." />
        <meta name="keywords" content="burner email blog, temp mail guide, temporary email guide, disposable email guide, privacy tips, email security, spam prevention, email privacy, secure email" />
        <link rel="canonical" href="https://burneremail.email/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://burneremail.email/blog" />
        <meta property="og:title" content="Burner Email Blog - Expert Guides on Burner Email & Privacy" />
        <meta property="og:description" content="Expert guides on burner email, disposable email, privacy protection, spam prevention, and email security best practices." />
        <meta property="og:image" content="https://burneremail.email/logo-256.png" />
        <meta property="og:image:width" content="256" />
        <meta property="og:image:height" content="256" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Burner Email Blog - Privacy Protection Guides" />
        <meta name="twitter:description" content="Learn about burner email, disposable email, privacy protection, and email security from our expert guides." />
      </Helmet>
      <div className="min-h-screen bg-background fade-in">
        {/* Header */}
        <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Blog & Guides
            </h1>
            <p className="text-lg text-muted-foreground">
              Expert guides on temporary email, privacy protection, and email security best practices
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="mx-auto max-w-6xl px-4 md:px-6 py-8 md:py-12">
          {/* Search & Filter Bar */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles by topic, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
                data-testid="input-blog-search"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  aria-label="Clear search"
                  data-testid="button-clear-search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="active-elevate-2"
                data-testid="button-category-all"
              >
                All Articles
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="active-elevate-2"
                  data-testid={`button-category-${category}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mb-12 p-6 md:p-8 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-200/50 dark:border-emerald-800/50 rounded-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Ready to protect your privacy?</h2>
                <p className="text-sm md:text-base text-muted-foreground">Get your free temporary email address instantly. No signup required.</p>
              </div>
              <Link href="/" className="flex-shrink-0">
                <Button className="bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-800 text-white dark:text-emerald-50 font-semibold px-6 py-2.5 h-auto min-h-10" data-testid="button-get-email-cta">
                  Get Free Email
                </Button>
              </Link>
            </div>
          </div>

          {/* Articles Grid */}
          {filteredPosts.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`}
                    className="group h-full no-underline block"
                    data-testid={`card-blog-post-${post.id}`}
                  >
                    <Card className="h-full overflow-hidden hover-elevate active-elevate-2 transition-all flex flex-col">
                      {/* Image with Skeleton */}
                      <div className="relative h-48 overflow-hidden bg-muted flex-shrink-0">
                        {!loadedImages.includes(post.id) && <BlogImageSkeleton />}
                        <img
                          src={post.image}
                          alt={post.title}
                          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
                            loadedImages.includes(post.id) ? 'opacity-100' : 'opacity-0'
                          }`}
                          loading="lazy"
                          onLoad={() => handleImageLoad(post.id)}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        {/* Meta */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                            {post.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{post.readTime} min read</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                          {post.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                          {post.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/30">
                          <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">
                {selectedCategory ? `No articles in ${selectedCategory}` : 'No articles found'}
              </p>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? 'Try adjusting your search or filters' : 'Check back soon for new content'}
              </p>
              {searchQuery || selectedCategory ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                  data-testid="button-reset-filters"
                >
                  Reset Filters
                </Button>
              ) : null}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
