import { Switch, Route } from "wouter";
import { Suspense, lazy } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/contexts/notification-context";
import { Helmet } from "react-helmet";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

// Lazy load secondary pages for better initial load time
const Blog = lazy(() => import("@/pages/blog"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const TermsConditions = lazy(() => import("@/pages/terms-conditions"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const SuccessStories = lazy(() => import("@/pages/success-stories"));
const BrowserExtension = lazy(() => import("@/pages/browser-extension"));
const ReferralDashboard = lazy(() => import("@/pages/referral-dashboard"));

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
      <Route path="/browser-extension">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <BrowserExtension />
          </Suspense>
        )}
      </Route>
      <Route path="/referral">
        {() => (
          <Suspense fallback={<PageLoader />}>
            <ReferralDashboard />
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
            <Helmet defaultTitle="TempMail - Free Disposable Email Address">
              <meta charSet="utf-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="theme-color" content="#0ea5e9" />
              <link rel="canonical" href="https://tempmail.org" />
              <meta name="description" content="TempMail - Get instant temporary email addresses. Protect your privacy with free disposable email. No registration required. Receive emails instantly." />
              <meta name="keywords" content="temporary email, disposable email, temp mail, fake email, anonymous email, throwaway email, burner email" />
              <meta name="author" content="TempMail" />
              <meta property="og:type" content="website" />
              <meta property="og:url" content="https://tempmail.org" />
              <meta property="og:title" content="TempMail - Free Temporary Email Address" />
              <meta property="og:description" content="Get instant temporary email addresses to protect your privacy" />
              <meta property="og:site_name" content="TempMail" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="TempMail - Free Temporary Email Address" />
              <meta name="twitter:description" content="Get instant temporary email addresses to protect your privacy" />
            </Helmet>
            <Toaster />
            <Router />
          </TooltipProvider>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
