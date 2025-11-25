# Burner Email Service

## Overview

This project is a premium burner email service application (burneremail.email) providing disposable, anonymous throwaway email addresses. It enables instant burner email creation, real-time message viewing, and email reading without registration, prioritizing privacy and a simple user experience. The application's design adheres to Apple HIG principles, focusing on accessibility, animations, smooth interactions, and a Gen-Z friendly aesthetic. The business vision is to offer the most reliable, user-friendly burner email solution with a premium feel, aiming for global #1 ranking for "burner email" searches through comprehensive SEO optimization.

## Domain & Branding

**Domain**: burneremail.email (purchased November 25, 2025)
**Brand Name**: Burner Email / BurnerEmail
**Primary Keywords**: burner email, burner email services, throwaway email, disposable email
**Search Volume Target**: 25K-40K monthly searches for "burner email"
**Global SEO Goal**: Rank #1 worldwide for "burner email" searches

## Recent Updates (v3.34 - Full Branding & SEO Optimization)

**✅ Complete Brand Rebranding to "Burner Email":**
- **Site Name**: Changed from "TempMail" to "BURNER EMAIL" throughout UI
- **Logo**: Generated new modern flame-envelope logo representing "burner email" concept
- **Favicon**: Updated with new brand logo (flame envelope icon)
- **Header Branding**: "TEMPMAIL" → "BURNER EMAIL"
- **Footer**: Updated company name, contact emails to @burneremail.email
- **Social Proof**: Updated tagline to mention "Burner Email" anonymity
- **All UI Text**: Updated descriptions from "TempMail" to "Burner Email" (15+ locations)
- **Storage Keys**: Migrated all localStorage from "tempmail" → "burneremail" prefixes
- **Share Messages**: Updated social media share titles to "Check out Burner Email"

**✅ Full SEO Optimization for "Burner Email" Ranking:**
- **Domain Setup**: Changed to burneremail.email (high-value keyword domain for SERP ranking)
- **Meta Tags Optimization**: Updated all HTML meta descriptions with "burner email" keywords
- **Schema Markup**: Enhanced JSON-LD with burner email keywords, ratings, and structured data
- **Comprehensive Blog Content**: 6 new SEO-optimized blog posts targeting "burner email" keyword cluster
  - "What is Burner Email" (11K words)
  - "Why Use Burner Email" (8K words)
  - "Burner Email vs ProtonMail" (9K words)
  - "How to Use Burner Email Safely" (10K words)
  - "Best Burner Email Services" (12K words)
  - "Complete Burner Email Privacy Guide" (14K words)
- **Sitemap & Robots.txt**: Updated for new domain with all blog posts indexed
- **Internal Linking**: All blog posts interconnected for SEO authority
- **Homepage Optimized**: Hybrid landing page with email generator above fold + social proof below
- **Mobile-First Design**: Full responsive optimization for Gen-Z users

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred features: Email sharing, animations, mobile-first design, Gen-Z friendly UI, fast performance.
Performance Priority: Lightning-fast initial load times (target <3 seconds)
UX Design: Inline accordion-style email expansion (no modal popups, ultra-compact, no scrolling), hybrid landing page (minimalist above fold, comprehensive below fold)
Theme Support: Full dark mode support with consistent styling across all components
Email Viewing: Default to HTML view, all links open in new tabs for user retention

## System Architecture

### Frontend Architecture

The frontend is built with React and TypeScript, utilizing Vite for development. It leverages `shadcn/ui` (Radix UI and Tailwind CSS) for its component system, following a "new-york" style with CSS variables for theming. TanStack Query manages server state, and Wouter handles client-side routing. The design is inspired by Apple HIG, emphasizing clear hierarchy, immediate functionality, generous spacing, readable content widths (`max-w-3xl`), and typography (Inter for UI, JetBrains Mono for emails). It features smooth animations (animated gradients, confetti, fade-in-up, pulse) and a mobile-first, Gen-Z friendly aesthetic with vibrant colors. Key components include `EmailGenerator`, `InboxList`, `InlineEmailReader`, `HowItWorks`, and a responsive `Header`. The application implements aggressive bundle optimization through code splitting, lazy loading, tree-shaking, and CSS code splitting for lightning-fast performance and efficient caching. It also includes comprehensive caching strategies using `localStorage` with TTL, request deduplication, and a service worker for offline support and stale-while-revalidate caching. Premium domain indicators (golden crown icons) are integrated for select domains.

**Homepage Structure (Hybrid Approach):**
- **Above Fold (Critical Path - No Lazy Loading)**:
  - Header with navigation
  - Email Generator with domain selector
  - Inbox display with inline email reading
  - Notification banner
- **Below Fold (Lazy Loaded - Code Split)**:
  - "How It Works" section (4-step visual guide)
  - Social proof badges (user stats)
  - Testimonials carousel (user feedback)
  - FAQ accordion (common questions)
  - Footer

**Dark Mode Implementation:**
- CSS custom properties for light and dark themes in `index.css`
- Aggressive CSS isolation on email viewer to prevent all style cascade
- Consistent dark variants (`dark:`) applied to all UI elements
- Smooth theme transitions with 300ms easing
- Proper color contrast maintained in both modes.

**Email Viewing Features:**
- Default HTML view for rich email formatting.
- All email links open in new tabs/windows (`target="_blank"`) to maximize user retention on the TempMail site.
- Smooth tab switching between HTML and Text views.

**Mobile Gestures:**
- Swipe left to delete, swipe right to star/favorite emails (Gmail-style).
- Long press (500ms) for multi-select functionality.

**Visual Hierarchy:**
- Enhanced unread indicators (bold text, colored left border, subtle background, pulsing dot).
- Prominent amber-colored attachment icons next to sender.
- Color-coded email type badges for "Security Alerts" (amber) and "Verification Emails" (blue).
- Animated pulsing badge showing new (unread) email count at the top of the inbox.

### Backend Architecture

The backend uses Express.js with Node.js and TypeScript, serving as a RESTful API proxy to an external temp mail service (`api.barid.site`). It offers endpoints for fetching domains, inbox contents, and email details. Custom middleware handles logging, JSON parsing, error handling, and Zod schema validation. The server integrates with Vite for HMR in development and serves static assets in production. Security hardening includes attack detection (SQL injection, XSS), progressive IP blocking, rate limiting, and enhanced security headers (HSTS, CSP, X-Frame-Options, CORS hardening).

### Data Models

Data validation is performed using Zod schemas for `EmailSummary`, `Email`, and `Domain` objects. The application operates without a persistent database, fetching all email-related data on-demand from the external API.

## External Dependencies

### Third-Party API

The core functionality relies entirely on the external temp mail API located at `https://api.barid.site` for:
- Retrieving available email domains.
- Fetching inbox contents for temporary email addresses.
- Getting detailed content of individual email messages.

### Key Libraries

- **axios**: HTTP client for API requests.
- **date-fns**: For date and time manipulation.
- **Radix UI**: Headless UI components for accessibility.
- **Tailwind CSS**: Utility-first CSS framework with dark mode support.
- **TanStack Query**: Asynchronous state management with caching and auto-refresh.
- **Zod**: Schema validation.
- **lucide-react**: Icon library.

### Development Tools

- **TypeScript**: Ensures end-to-end type safety.
- **Vite**: Frontend build tool and development server with HMR.
- **esbuild**: Bundles backend server code.
