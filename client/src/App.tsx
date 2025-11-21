import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/contexts/notification-context";
import { Helmet } from "react-helmet";
import Home from "@/pages/home";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import TermsConditions from "@/pages/terms-conditions";
import PrivacyPolicy from "@/pages/privacy-policy";
import SuccessStories from "@/pages/success-stories";
import BrowserExtension from "@/pages/browser-extension";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/terms" component={TermsConditions} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/success-stories" component={SuccessStories} />
      <Route path="/browser-extension" component={BrowserExtension} />
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
