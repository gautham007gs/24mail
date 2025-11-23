import { Skeleton } from "@/components/ui/skeleton";

/**
 * Email row skeleton loader
 */
export function EmailRowSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-l-4 border-transparent">
      <div className="col-span-1">
        <Skeleton className="h-4 w-4 rounded animate-pulse-gentle" />
      </div>
      <div className="col-span-3 space-y-1">
        <Skeleton className="h-3 w-24 animate-pulse-gentle" />
      </div>
      <div className="col-span-5">
        <Skeleton className="h-3 w-full animate-pulse-gentle" />
      </div>
      <div className="col-span-2">
        <Skeleton className="h-3 w-16 animate-pulse-gentle" />
      </div>
      <div className="col-span-1">
        <Skeleton className="h-8 w-12 animate-pulse-gentle" />
      </div>
    </div>
  );
}

/**
 * Inbox loading state with multiple skeleton rows
 */
export function InboxLoadingSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="animate-pulse-gentle">
          <EmailRowSkeleton />
        </div>
      ))}
    </div>
  );
}

/**
 * Blog image skeleton placeholder
 */
export function BlogImageSkeleton() {
  return (
    <div className="relative h-48 overflow-hidden bg-muted">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

/**
 * Blog card skeleton
 */
export function BlogCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-48 w-full" />
      <div className="space-y-2 p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

/**
 * Blog post skeleton for detail page
 */
export function BlogPostSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-96 w-full rounded-lg" />
      <Skeleton className="h-12 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
