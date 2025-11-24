import { Switch, Route } from "wouter";
import { Suspense, lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/contexts/notification-context";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

// Lazy load secondary pages for better initial load time
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const TermsConditions = lazy(() => import("@/pages/terms-conditions"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const SuccessStories = lazy(() => import("@/pages/success-stories"));

// Fallback component for lazy-loaded pages
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <Blog />
          </Suspense>
        )}
      </Route>
      <Route path="/blog/:slug">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <BlogPost />
          </Suspense>
        )}
      </Route>
      <Route path="/terms">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <TermsConditions />
          </Suspense>
        )}
      </Route>
      <Route path="/privacy">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <PrivacyPolicy />
          </Suspense>
        )}
      </Route>
      <Route path="/success-stories">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <SuccessStories />
          </Suspense>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="tempmail-theme">
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
