# Burner Email Service

## Overview

This project is a premium burner email service (burneremail.email) designed to provide disposable, anonymous email addresses. It prioritizes instant email creation, real-time message viewing without registration, and a strong focus on user privacy and experience. The service aims to be the most reliable and user-friendly burner email solution, with a strategic goal of achieving global #1 SEO ranking for "burner email" searches.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred features: Email sharing, animations, mobile-first design, Gen-Z friendly UI, fast performance.
Performance Priority: Lightning-fast initial load times (target <3 seconds)
UX Design: Inline accordion-style email expansion (no modal popups, ultra-compact, no scrolling), hybrid landing page (minimalist above fold, comprehensive below fold)
Theme Support: Full dark mode support with consistent styling across all components
Email Viewing: Default to HTML view, all links open in new tabs for user retention
Design Philosophy: Extreme minimalism - Aggressive iterative simplification focused on core user flow (arrive → copy email → leave)

## Multilingual & SEO Implementation

### Language Routing (6 Languages)
- **URL Structure**: `/:lang(en|es|pt|fr|de|hi)/*` - all pages language-prefixed
- **Language Context**: React context with useState tracking current language from URL
- **Navigation**: Footer language selector updates URL + auto-scrolls to top (smooth scroll behavior)
- **Translations**: 760+ translation keys for full UI coverage (header, footer, hero, blog, etc.)

### International SEO Strategy
- **hreflang Tags**: All pages (home, blog, blog posts) generate hreflang alternates + x-default for all 6 languages
- **Canonical URLs**: Language-specific canonical URLs prevent duplicate content issues
- **Meta Language Attribute**: `<meta name="language">` on all pages
- **Blog Infrastructure**: 
  - Blogs are multilingual-ready (English content, can add translations per language)
  - Blog pages include full hreflang + canonical setup for international ranking
  - SEO utility (`seo-utils.ts`) generates proper alternate links for all language versions

## System Architecture

### Frontend Architecture

The frontend is built with React and TypeScript, utilizing Vite for development and `shadcn/ui` (Radix UI and Tailwind CSS) for components. Design principles adhere to Apple HIG, emphasizing accessibility, animations, smooth interactions, and a Gen-Z aesthetic. TanStack Query manages server state, and Wouter handles client-side routing, including URL-based language routing (e.g., `/:lang/`). Key features include an `EmailGenerator`, `InboxList`, and `InlineEmailReader`. The application employs aggressive bundle optimization (code splitting, lazy loading, tree-shaking) and comprehensive caching strategies. A hybrid homepage loads critical elements instantly. Full dark mode support with auto-switch based on system preference and a 3-state theme toggle. Email viewing defaults to HTML, with all links opening in new tabs. Mobile gestures include swipe actions and long-press for multi-select. Typography is managed by a premium system with defined classes for display, headings, body, and captions, with adaptive sizing for mobile.

### Backend Architecture

The backend uses Express.js with Node.js and TypeScript, serving as a RESTful API proxy to an external temp mail service. It provides endpoints for domains, inbox contents, and email details. Middleware handles logging, JSON parsing, error handling, and Zod schema validation. Security features include attack detection, progressive IP blocking, rate limiting, and enhanced security headers.

### Data Models

Data validation is performed using Zod schemas for `EmailSummary`, `Email`, and `Domain` objects. The system operates without a persistent database, fetching all email-related data on-demand from the external API.

### UI/UX Decisions

The design prioritizes extreme minimalism, with an aggressive iterative simplification of the core user flow. This includes removing testimonials, optimizing mobile layouts for extreme compactness, and implementing subtle section background variations and visual separators. The button color system is harmonious and soft, with consistent hover effects and shadows. Accessibility is a core focus, including keyboard shortcuts, screen reader support, a skip-to-main link, and reduced motion support. Trust-building components include a "Is My Data Private?" section, an enhanced footer, and a "Proven at Scale" section, all designed to reinforce a professional trust narrative.

## External Dependencies

### Third-Party API

- **api.barid.site**: Provides core temp mail functionality for retrieving domains, inbox contents, and email details.

### Key Libraries

- **axios**: HTTP client for API requests.
- **date-fns**: For date and time manipulation.
- **Radix UI**: Headless UI components used via `shadcn/ui`.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **TanStack Query**: For asynchronous state management and caching.
- **Zod**: For schema validation of data models.
- **lucide-react**: Icon library.
- **wouter**: For client-side routing.

### Development Tools

- **TypeScript**: Ensures type safety throughout the codebase.
- **Vite**: Frontend build tool and development server.
- **esbuild**: Used for bundling backend server code.