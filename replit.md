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

## Color Palette Guidelines (Updated December 2024)

**Primary Brand Colors - Orange Harmony System:**
- **Primary Orange** (#FF6A00, HSL: 25 100% 50%) - Main CTAs, highlights, primary actions
- **Secondary Orange** (#FF8C32, HSL: 20 100% 55%) - Hover states, secondary actions
- **Tertiary Orange** (#F77228, HSL: 18 100% 52%) - Warm accents, muted contexts
- **Light Orange** (HSL: 22 100% 68%) - Subtle backgrounds
- **Dark Orange** (HSL: 22 95% 40%) - Text emphasis on light backgrounds

**Dark Mode Orange Tones:**
- **Bright Orange** (#FFA31A, HSL: 38 100% 55%) - Primary on dark backgrounds
- **Medium Orange** (HSL: 36 100% 58%) - Hover and secondary on dark
- **Warm Orange** (HSL: 32 100% 52%) - Tertiary on dark
- **Light Orange** (HSL: 38 100% 70%) - Subtle dark mode backgrounds
- **Dark Orange** (HSL: 38 100% 48%) - Emphasis on dark

**Accent Colors:**
- **Teal/Green** - Success notifications ONLY, use sparingly
- **NO Blue/Purple** - Design philosophy: Burner + dark = orange + greyscale only

**Color Usage Rules:**
- Primary orange for main CTAs and high-priority interactions
- Secondary orange for hover states and medium-priority actions
- Tertiary orange for subtle accents and supporting elements
- Multi-tone palette ensures harmony across light and dark backgrounds
- Maintain 4.5:1 contrast ratio minimum for WCAG AA compliance
- Test all orange tones on both light (white #FFF) and dark (black #000) backgrounds

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

### Responsive Design System (December 2024 Update)

**Mobile-First Breakpoints:**
- **Mobile (320px - 639px)**: Optimized for small screens with 44px minimum touch targets
- **Tablet (640px - 1023px)**: Comfortable 2-column layouts for medium screens
- **Desktop (1024px+)**: Full 3-column layouts and expanded content areas

**Responsive Principles:**
- All buttons and interactive elements minimum 44x44px for mobile accessibility
- Font sizes use `clamp()` for smooth scaling across all device sizes
- Flexible grid system that adapts from 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Padding and spacing adjust based on viewport width
- Section containers responsive: px-3 (mobile), px-6 (tablet), px-8 (desktop)
- Email generator card radius: 12px on mobile, scales appropriately on larger screens

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

## Recent Updates (December 2024)

### Color System Enhancement
- Implemented multi-tone orange palette with 5 primary variants per theme (light/dark)
- Color variables now use CSS custom properties for easy maintenance
- All colors are HSL-based for better theme switching
- Updated typography colors to use new palette for better contrast

### Responsive Design Improvements
- Added comprehensive mobile-first breakpoint system (320px, 640px, 1024px)
- Implemented 44px minimum touch target for all interactive elements (WCAG compliance)
- Font sizes now use `clamp()` for smooth scaling across devices
- Responsive grid utilities support 1-column (mobile), 2-column (tablet), 3-column (desktop) layouts
- Section padding adjusts: px-3 (mobile), px-6 (tablet), px-8 (desktop)

## Improvement Suggestions & Next Steps

### Performance Enhancements
1. **Image Optimization**: Implement WebP with PNG fallback for all images; use responsive `srcset` for different screen sizes
2. **Code Splitting**: Consider route-based code splitting in addition to below-fold lazy loading
3. **Service Worker**: Add offline support and background sync for email checking
4. **HTTP/2 Server Push**: Push critical assets to reduce round trips

### Mobile UX Improvements
1. **Gesture Support**: Implement swipe-to-delete and long-press for email actions (already mentioned, but enhance with haptic feedback)
2. **Keyboard Shortcuts**: Add visual hints/overlay showing available keyboard shortcuts (Cmd+C to copy, Cmd+G to generate, etc.)
3. **Native Share API**: Use native share sheets on mobile for better UX than custom share dialog
4. **Pull-to-Refresh**: Add pull-to-refresh gesture for inbox updates on mobile

### Feature Suggestions
1. **Email Categories**: Auto-categorize emails (receipts, alerts, marketing) with filtering options
2. **Email Expiry Customization**: Allow users to set custom expiry times (5min, 30min, 1hr, 24hrs)
3. **Bulk Actions**: Select multiple emails for batch operations (delete, archive)
4. **Email Labels/Tags**: User-created tags for organizing temporary emails
5. **API Key Support**: Allow developers to generate API keys for programmatic access
6. **Browser Extension**: Create a companion extension for auto-filling burner emails in signup forms

### Design & Brand
1. **Microinteractions**: Add celebratory animations when email is copied or email received (already using confetti)
2. **Loading States**: Enhance skeleton loaders with animated placeholders
3. **Error Handling**: Improve error messages with helpful recovery suggestions
4. **Toast Notifications**: Add stacking/dismissal animations for better visual feedback
5. **Accessibility**: Implement ARIA live regions for email notifications

### Analytics & Engagement
1. **Usage Metrics**: Track popular domains, peak usage times, user retention
2. **Onboarding**: Add interactive tutorial for first-time users
3. **Referral Program**: Implement referral tracking if monetizing later
4. **Social Proof**: Display real-time user stats ("X emails created today")

### Backend & Scalability
1. **Email Webhooks**: Support custom webhooks for email events
2. **Rate Limiting**: Implement per-IP rate limiting to prevent abuse
3. **Analytics API**: Expose analytics endpoint for admin dashboard
4. **Content Delivery**: CDN integration for static assets and API responses

### SEO & Marketing
1. **Rich Snippets**: Add JSON-LD schema for email service
2. **Meta Tags**: Dynamic OpenGraph tags for shared emails
3. **Blog Content**: Expand blog with SEO-optimized guides ("How to protect privacy online", etc.)
4. **FAQ Schema**: Implement FAQ schema markup for structured data
5. **Sitemap**: Add dynamic XML sitemap generation

### Testing & Quality
1. **End-to-End Tests**: Add Playwright tests for critical user flows
2. **Performance Budgets**: Set and enforce bundle size limits
3. **Accessibility Audits**: Regular WCAG AA compliance checks
4. **Cross-Browser Testing**: Test on Safari, Firefox, Edge for compatibility
