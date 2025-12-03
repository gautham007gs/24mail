import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { Suspense, lazy, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/language-context";
import { NotificationProvider } from "@/contexts/notification-context";
import { ErrorBoundary } from "@/components/error-boundary";
import { SUPPORTED_LANGUAGES, isValidLanguage, detectBrowserLanguage } from "@/lib/language-utils";
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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
    </div>
  );
}

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
      <Route path={`/:lang(${supportedLangs})/`} component={Home} />
      <Route path={`/:lang(${supportedLangs})/blog/`}>
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Blog />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>
      <Route path={`/:lang(${supportedLangs})/blog/:slug/`}>
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <BlogPost />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>
      <Route path={`/:lang(${supportedLangs})/terms/`}>
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <TermsConditions />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>
      <Route path={`/:lang(${supportedLangs})/privacy/`}>
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicy />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>
      <Route path={`/:lang(${supportedLangs})/success-stories/`}>
        {() => (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <SuccessStories />
            </Suspense>
          </ErrorBoundary>
        )}
      </Route>

      {/* Fallback for invalid language codes */}
      <Route path={`/:lang/*`}>
        {() => <Redirect to="/en" />}
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
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
        <LanguageProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <AppRoutes />
            </TooltipProvider>
          </NotificationProvider>
        </LanguageProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
