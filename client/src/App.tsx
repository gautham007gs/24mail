import { Switch, Route, Router as WouterRouter } from "wouter";
import { Suspense, lazy, useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { initPerformanceTracking, logPerformanceSummary } from "@/lib/web-vitals";

// Load critical providers and HomePage eagerly to prevent blank screen
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/contexts/notification-context";
import HomeOptimized from "@/pages/home-optimized";

// Lazy load secondary pages only
const BlogPage = lazy(() => import("@/pages/blog"));
const BlogPostPage = lazy(() => import("@/pages/blog-post"));
const TermsConditionsPage = lazy(() => import("@/pages/terms-conditions"));
const PrivacyPolicyPage = lazy(() => import("@/pages/privacy-policy"));
const SuccessStoriesPage = lazy(() => import("@/pages/success-stories"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));

// Fallback component for lazy-loaded pages
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
    </div>
  );
}

// Error Boundary component
import { ErrorBoundary } from "@/components/error-boundary";

function AppRoutes() {
  return (
    <Switch>
      {/* Home page */}
      <Route path="/">
        {() => (
          <ErrorBoundary>
            <HomeOptimized />
          </ErrorBoundary>
        )}
      </Route>

      {/* Blog routes */}
      <Route path="/blog/">
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <BlogPage />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>
      <Route path="/blog/:slug/">
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <BlogPostPage />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>

      {/* Legal pages */}
      <Route path="/terms/">
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <TermsConditionsPage />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>
      <Route path="/privacy/">
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicyPage />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>
      <Route path="/success-stories/">
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <SuccessStoriesPage />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>

      {/* 404 */}
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Ensure page theme class is set early
    document.documentElement.classList.add("dark");

    // Initialize performance tracking
    initPerformanceTracking();
    // Log performance summary
    logPerformanceSummary();

    // Mark that the app has mounted. React will update the UI and
    // remove the static init loader as part of the normal render cycle.
    setMounted(true);
  }, []);

  const hasInitLoader = typeof document !== 'undefined' && !!document.getElementById('init-loader');

  // If there's a static `#init-loader` present (the build-time skeleton),
  // render the same markup on the first render so React can attach
  // without replacing the DOM. After mount the real app UI is rendered.
  if (!mounted && hasInitLoader) {
    return (
      <div className="init-skeleton" id="init-loader">
        <div className="init-skeleton-text" />
        <div className="init-skeleton-card" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter>
        <ErrorBoundary>
          <NotificationProvider>
            <TooltipProvider delayDuration={0}>
              <AppRoutes />
              <Toaster />
            </TooltipProvider>
          </NotificationProvider>
        </ErrorBoundary>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;