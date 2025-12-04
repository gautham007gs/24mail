import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { Suspense, lazy, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
// Removed unused imports: Toaster, TooltipProvider, LanguageProvider, NotificationProvider, ErrorBoundary
// Removed unused imports: SUPPORTED_LANGUAGES, isValidLanguage, detectBrowserLanguage
// Removed unused imports: Home, Blog, BlogPost, TermsConditions, PrivacyPolicy, SuccessStories, NotFound

// Lazy load secondary pages for better initial load time
// const Blog = lazy(() => import("@/pages/blog")); // Replaced with lazy loaded BlogPage
// const BlogPost = lazy(() => import("@/pages/blog-post")); // Replaced with lazy loaded BlogPostPage
// const TermsConditions = lazy(() => import("@/pages/terms-conditions")); // Replaced with lazy loaded TermsConditionsPage
// const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy")); // Replaced with lazy loaded PrivacyPolicyPage
// const SuccessStories = lazy(() => import("@/pages/success-stories")); // Replaced with lazy loaded SuccessStoriesPage

// Lazy load providers
const TooltipProvider = lazy(() => import("@/components/ui/tooltip").then(m => ({ default: m.TooltipProvider })));
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const NotificationProvider = lazy(() => import("@/contexts/notification-context").then(m => ({ default: m.NotificationProvider })));
const LanguageProvider = lazy(() => import("@/contexts/language-context").then(m => ({ default: m.LanguageProvider })));

// Lazy load pages
const HomePage = lazy(() => import("@/pages/home"));
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

// Error Boundary component (assuming it's defined elsewhere and imported)
import { ErrorBoundary } from "@/components/error-boundary";
import { SUPPORTED_LANGUAGES, isValidLanguage, detectBrowserLanguage } from "@/lib/language-utils";


function AppRoutes() {
  const supportedLangs = Object.keys(SUPPORTED_LANGUAGES).join("|");

  return (
    <Switch>
      {/* Redirect root path to user's browser language or /en default */}
      <Route path="/">
        {() => {
          const browserLang = detectBrowserLanguage();
          return <Redirect to={`/${browserLang}`} />;
        }}
      </Route>

      {/* Language-prefixed routes */}
      <Route path={`/:lang(${supportedLangs})/`} component={HomePage} />
      <Route path={`/:lang(${supportedLangs})/blog/`}>
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <BlogPage />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>
      <Route path={`/:lang(${supportedLangs})/blog/:slug/`}>
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <BlogPostPage />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>
      <Route path={`/:lang(${supportedLangs})/terms/`}>
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <TermsConditionsPage />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>
      <Route path={`/:lang(${supportedLangs})/privacy/`}>
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicyPage />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>
      <Route path={`/:lang(${supportedLangs})/success-stories/`}>
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <SuccessStoriesPage />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>

      {/* Fallback for invalid language codes */}
      <Route path={`/:lang/*`}>
        {() => <Redirect to="/en" />}
      </Route>

      {/* 404 */}
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="animate-pulse space-y-4 w-full max-w-2xl px-4">
                <div className="h-12 bg-muted rounded-xl w-3/4 mx-auto"></div>
                <div className="h-64 bg-muted rounded-2xl"></div>
              </div>
            </div>
          }>
            <NotificationProvider>
              <LanguageProvider>
                <TooltipProvider delayDuration={0}>
                  <Switch>
                    {/* Routes are now handled within AppRoutes */}
                  </Switch>
                  <Toaster />
                </TooltipProvider>
              </LanguageProvider>
            </NotificationProvider>
          </Suspense>
        </ErrorBoundary>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;