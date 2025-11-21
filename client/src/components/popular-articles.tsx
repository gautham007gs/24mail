import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getFeaturedPosts } from "@/lib/blog-data";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: string;
  readTime: number;
}

export function PopularArticles() {
  const featured = getFeaturedPosts();

  return (
    <section className="py-12 md:py-24 px-4 md:px-6 bg-background" aria-labelledby="popular-articles-heading">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <h2 id="popular-articles-heading" className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-4">
            Popular Articles
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-2xl">
            Learn how to protect your privacy, prevent spam, and make the most of temporary email addresses
          </p>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((post) => (
            <DesktopArticleCard key={post.id} post={post} />
          ))}
        </div>

        {/* Mobile: Vertical List */}
        <div className="md:hidden">
          <div className="space-y-3">
            {featured.map((post) => (
              <MobileArticleCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-10 md:mt-12">
          <Link href="/blog">
            <a data-testid="link-view-more-articles" aria-label="Read all articles on blog page">
              <Button size="lg" variant="outline">
                Read More Articles
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}

function DesktopArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <a 
        className="group h-full no-underline"
        data-testid={`card-article-${post.id}`}
        aria-label={`Read article: ${post.title}`}
      >
        <Card 
          className="h-full overflow-hidden hover-elevate active-elevate-2 transition-all duration-300"
          role="article"
        >
          {/* Image */}
          <div className="relative h-40 overflow-hidden bg-muted">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
              width="300"
              height="160"
            />
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {/* Category Badge */}
            <span 
              className="inline-block w-fit text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2"
              aria-label={`Article category: ${post.category}`}
            >
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
              <span aria-label={`${post.readTime} minute read`}>{post.readTime}m</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </div>
          </div>
        </Card>
      </a>
    </Link>
  );
}

function MobileArticleCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <a 
        className="group no-underline block"
        data-testid={`card-mobile-article-${post.id}`}
        aria-label={`Read article: ${post.title}`}
      >
        <Card 
          className="overflow-hidden hover-elevate active-elevate-2 transition-all p-3 flex gap-3"
          role="article"
        >
          {/* Image Thumbnail */}
          <div className="relative w-24 h-20 flex-shrink-0 rounded overflow-hidden bg-muted">
            <img
              src={post.image}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              loading="lazy"
              decoding="async"
              width="96"
              height="80"
            />
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between min-w-0">
            {/* Category & Title */}
            <div>
              <span 
                className="inline-block text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded mb-1"
                aria-label={`Article category: ${post.category}`}
              >
                {post.category}
              </span>
              <h3 className="font-bold text-xs leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
            </div>

            {/* Meta */}
            <div className="text-xs text-muted-foreground mt-1" aria-label={`${post.readTime} minute read`}>
              {post.readTime}m read
            </div>
          </div>
        </Card>
      </a>
    </Link>
  );
}
