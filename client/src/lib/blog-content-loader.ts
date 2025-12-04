const contentCache = new Map<string, string>();
const loadingPromises = new Map<string, Promise<string | null>>();

export async function loadBlogContent(slug: string): Promise<string | null> {
  if (contentCache.has(slug)) {
    return contentCache.get(slug) || null;
  }
  
  if (loadingPromises.has(slug)) {
    return loadingPromises.get(slug)!;
  }
  
  const loadPromise = (async () => {
    try {
      const module = await import('./blog-data');
      const post = module.blogPosts.find((p: { slug: string }) => p.slug === slug);
      if (post?.content) {
        contentCache.set(slug, post.content);
        loadingPromises.delete(slug);
        return post.content;
      }
      loadingPromises.delete(slug);
      return null;
    } catch (error) {
      console.error('Failed to load blog content:', error);
      loadingPromises.delete(slug);
      return null;
    }
  })();
  
  loadingPromises.set(slug, loadPromise);
  return loadPromise;
}

let preloadTimeout: ReturnType<typeof setTimeout> | null = null;

export function preloadBlogContent(slug: string): void {
  if (contentCache.has(slug) || loadingPromises.has(slug)) {
    return;
  }
  
  if (preloadTimeout) {
    clearTimeout(preloadTimeout);
  }
  
  preloadTimeout = setTimeout(() => {
    loadBlogContent(slug);
  }, 150);
}
