import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { blogPosts } from "@/lib/blog-data";
import { Footer } from "@/components/footer";
import { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet";

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return blogPosts;
    
    const query = searchQuery.toLowerCase();
    return blogPosts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.keywords.some(k => k.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <>
      <Helmet>
        <title>TempMail Blog - Guides on Temporary Email & Privacy Protection</title>
        <meta name="description" content="Read expert guides on temporary email addresses, privacy protection, spam prevention, and email security. Learn best practices for online privacy." />
        <meta name="keywords" content="temporary email blog, disposable email guide, privacy tips, email security, spam prevention" />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
            <Link href="/">
              <a className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </a>
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
        <main className="mx-auto max-w-6xl px-4 md:px-6 py-12">
          {/* Search Bar */}
          <div className="mb-8">
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
            </div>
          </div>

          {/* Articles Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <a className="group h-full no-underline">
                    <Card className="h-full overflow-hidden hover-elevate active-elevate-2 transition-all">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden bg-muted">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col h-[calc(100%-192px)]">
                        {/* Meta */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                            {post.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{post.readTime} min</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-foreground mb-2 line-clamp-3 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                          {post.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{post.date}</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No articles found matching your search. Try different keywords.
              </p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
