import { Switch, Route, Redirect } from "wouter";
import { Suspense, lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { NotificationProvider } from "@/contexts/notification-context";
import { SUPPORTED_LANGUAGES, isValidLanguage } from "@/lib/language-utils";
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

function Router() {
  const supportedLangs = Object.keys(SUPPORTED_LANGUAGES).join("|");
  
  return (
    <Switch>
      {/* Redirect root path to /en */}
      <Route path="/">
        {() => <Redirect to="/en" />}
      </Route>

      {/* Language-prefixed routes */}
      <Route path={`/:lang(${supportedLangs})/`} component={Home} />
      <Route path={`/:lang(${supportedLangs})/blog/`}>
        {() => (
          <Suspense fallback={<PageLoader />}>
            <Blog />
          </Suspense>
        )}
      </Route>
      <Route path={`/:lang(${supportedLangs})/blog/:slug/`}>
        {() => (
          <Suspense fallback={<PageLoader />}>
            <BlogPost />
          </Suspense>
        )}
      </Route>
      <Route path={`/:lang(${supportedLangs})/terms/`}>
        {() => (
          <Suspense fallback={<PageLoader />}>
            <TermsConditions />
          </Suspense>
        )}
      </Route>
      <Route path={`/:lang(${supportedLangs})/privacy/`}>
        {() => (
          <Suspense fallback={<PageLoader />}>
            <PrivacyPolicy />
          </Suspense>
        )}
      </Route>
      <Route path={`/:lang(${supportedLangs})/success-stories/`}>
        {() => (
          <Suspense fallback={<PageLoader />}>
            <SuccessStories />
          </Suspense>
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
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="tempmail-theme">
        <LanguageProvider>
          <NotificationProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
