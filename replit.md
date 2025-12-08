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

## Language Support

The application is **English-only**. All multi-language features have been removed:
- No language selector in header or footer
- No translation hooks (useTranslation, useLanguage)
- No language-prefixed URLs
- All UI text is hardcoded in English directly in components
- Simple URL routing: `/`, `/blog`, `/blog/:slug`, etc.

## System Architecture

### Frontend Architecture

The frontend is built with React and TypeScript, utilizing Vite for development and `shadcn/ui` (Radix UI and Tailwind CSS) for components. Design principles adhere to Apple HIG, emphasizing accessibility, animations, smooth interactions, and a Gen-Z aesthetic. TanStack Query manages server state, and Wouter handles client-side routing. Key features include an `EmailGenerator`, `InboxList`, and `InlineEmailReader`. The application employs aggressive bundle optimization (code splitting, lazy loading, tree-shaking) and comprehensive caching strategies. A hybrid homepage loads critical elements instantly. Full dark mode support with auto-switch based on system preference and a 3-state theme toggle. Email viewing defaults to HTML, with all links opening in new tabs. Mobile gestures include swipe actions and long-press for multi-select. Typography is managed by a premium system with defined classes for display, headings, body, and captions, with adaptive sizing for mobile.

### Performance Optimizations

Key performance optimizations implemented for sub-second loading:
- **Inline Skeleton Loading**: Critical CSS and HTML skeleton in index.html for instant first paint before JavaScript loads
- **Font Loading**: Preconnect, preload, and font-display swap for non-blocking font loading
- **Layout Shift Prevention**: Fixed min-height on email-generator Card (280px mobile, 320px desktop) and action button containers
- **Bundle Optimization**: Production build is ~145KB gzipped total JS with proper tree-shaking
- **Lazy Loading**: QR code, confetti, and below-fold sections loaded on demand
- **Relative Time Utility**: Custom `relative-time.ts` using native Intl.RelativeTimeFormat instead of date-fns (saves ~178KB)
- **API Preloading**: Preconnect to api.barid.site and preload /api/domains for faster data fetching
- **Init Loader Cleanup**: Skeleton removed on React hydration in main.tsx

#### Blog Content Optimization (Recent)
- **Metadata Separation**: Split `blog-data.ts` (~3000 lines) into lightweight `blog-metadata.ts` for listing pages
- **Lazy Content Loading**: `blog-content-loader.ts` loads full blog content on-demand only when viewing posts
- **Content Preloading on Hover**: Blog post cards preload content when user hovers for instant loading
- **Code Splitting**: Vite configured to split blog content into separate chunks (`blog-content`, `blog-translations`)

#### Server-Side Optimizations
- **API Response Caching**: Domains API cached for 1 hour with `Cache-Control` headers
- **Build Optimization**: Terser compression with console.log removal, 2-pass compression

#### Lighthouse Audit Results (December 2024 - Development Mode)
**Desktop:**
- Performance: 47 | Accessibility: 92 | Best Practices: 100 | SEO: 100
- FCP: 2.6s | LCP: 4.6s | TBT: 320ms | CLS: 0.011

**Mobile:**
- Performance: 27 | Accessibility: 92 | Best Practices: 100 | SEO: 100
- FCP: 14.1s | LCP: 26.0s | TBT: 2,370ms | CLS: 0.008

**Note:** Scores are from development mode. Production build with minification, compression, and CDN would significantly improve performance metrics.

**Cleanup Performed:**
- Removed unused `cache-utils.ts` (duplicate of `cache.ts`)
- Removed unused `performance.ts` (no imports found)

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