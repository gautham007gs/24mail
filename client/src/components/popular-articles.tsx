import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getFeaturedPosts } from "@/lib/blog-data";

export function PopularArticles() {
  const featured = getFeaturedPosts();

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-background">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular Articles
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn how to protect your privacy, prevent spam, and make the most of temporary email addresses
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              {({ navigate }) => (
                <div 
                  className="group h-full cursor-pointer"
                  onClick={navigate}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate();
                    }
                  }}
                >
                  <Card className="h-full overflow-hidden hover-elevate active-elevate-2 transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden bg-muted">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col h-[calc(100%-160px)]">
                      {/* Category Badge */}
                      <span className="inline-block w-fit text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-2">
                        {post.category}
                      </span>

                      {/* Title */}
                      <h3 className="font-bold text-sm leading-snug text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {post.description}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.readTime} min read</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <Link href="/blog">
            {({ navigate }) => (
              <Button size="lg" variant="outline" onClick={navigate}>
                Read More Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </Link>
        </div>
      </div>
    </section>
  );
}
