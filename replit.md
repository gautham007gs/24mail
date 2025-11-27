# Burner Email Service

## Overview

This project is a premium burner email service (burneremail.email) providing disposable, anonymous email addresses. It focuses on instant email creation, real-time message viewing, and email reading without registration, prioritizing privacy and user experience. The application aims to be the most reliable and user-friendly burner email solution, striving for global #1 SEO ranking for "burner email" searches.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred features: Email sharing, animations, mobile-first design, Gen-Z friendly UI, fast performance.
Performance Priority: Lightning-fast initial load times (target <3 seconds)
UX Design: Inline accordion-style email expansion (no modal popups, ultra-compact, no scrolling), hybrid landing page (minimalist above fold, comprehensive below fold)
Theme Support: Full dark mode support with consistent styling across all components
Email Viewing: Default to HTML view, all links open in new tabs for user retention

## System Architecture

### Frontend Architecture

The frontend is built with React and TypeScript, using Vite for development and `shadcn/ui` (Radix UI and Tailwind CSS) for components. Design adheres to Apple HIG principles, emphasizing accessibility, animations, smooth interactions, and a Gen-Z friendly aesthetic. TanStack Query manages server state, and Wouter handles client-side routing. Key features include an `EmailGenerator`, `InboxList`, and `InlineEmailReader`. The application employs aggressive bundle optimization (code splitting, lazy loading, tree-shaking) and comprehensive caching strategies (`localStorage` with TTL, request deduplication, service worker) for performance. A hybrid homepage loads critical elements above the fold instantly, with other sections lazy-loaded. **Full dark mode support with auto-switch based on system preference** - uses `prefers-color-scheme: dark` CSS media query with smooth 0.25s transitions. Theme toggle in header (3-state: light → dark → system). Email viewing defaults to HTML, with all links opening in new tabs. Mobile gestures include swipe actions and long-press for multi-select. Visual hierarchy is enhanced with unread indicators, prominent attachment icons, and color-coded email type badges.

### Backend Architecture

The backend uses Express.js with Node.js and TypeScript, acting as a RESTful API proxy to an external temp mail service (`api.barid.site`). It provides endpoints for domains, inbox contents, and email details. Middleware handles logging, JSON parsing, error handling, and Zod schema validation. Security features include attack detection, progressive IP blocking, rate limiting, and enhanced security headers.

### Data Models

Data validation is performed using Zod schemas for `EmailSummary`, `Email`, and `Domain` objects. The system operates without a persistent database, fetching all email-related data on-demand from the external API.

## Recent Updates (Turn 11 - Mobile View Cleanup & Badge Integration)

### What Was Done
**Mobile View Complete Cleanup** - Clean, beautiful, zero overlap issues
**"Generated: 1" Badge Repositioned** - Integrated into header instead of floating (fixed overlap)
**Email Display Section Restructured** - Proper responsive layout for all screen sizes
**Responsive Typography & Spacing** - Mobile-first design with smooth breakpoints

Complete mobile view overhaul: removed fixed-position "Generated: 1" badge that was overlapping content and integrated it cleanly into the header with proper flex layout. Email display section completely restructured for clean mobile experience with zero layout shifts.

### Mobile View Enhancements (New - Turn 11)
- **"Generated: 1" Badge Integration**: Moved from fixed floating element to header component
  - No more layout overlap issues on mobile
  - Proper flex layout with header title
  - Badge scales responsively (text-xs on mobile → text-sm on desktop)
  - Flame icon properly sized: `h-4 w-4`
- **Email Display Section Restructured**:
  - Status indicator, email, and expiry info in clean vertical stack on mobile
  - Expires info + QR/Copy buttons responsive flex (column on mobile → row on desktop)
  - Buttons smaller on mobile (h-8 w-8) → larger on desktop (sm:h-9 sm:w-9)
  - Proper padding: `p-3 sm:p-4 md:p-6 lg:p-8`
- **Clean Responsive Typography**:
  - Email text: `text-sm` mobile → `text-lg lg:text-xl` desktop
  - Expires text: `text-xs` mobile → `text-body-sm` desktop
  - Labels: `text-xs sm:text-sm` with proper icon sizing
- **Touch-Friendly Spacing**: `gap-2.5 sm:gap-3` prevents button crowding
- **Domain Selector Mobile Optimization**: Shortened label, compact select trigger

### UI/UX Enhancements (Previous - Turn 10)
- **Harmonious button color system**: Soft, muted palette that's easy on the eyes
  - **Copy button**: Soft teal-600 (gentle, professional)
  - **Refresh button**: Soft sky-600 (calming, intuitive)
  - **Burn button**: Warm orange-600 (matches brand, approachable)
  - All buttons use 90% opacity base + hover effects for visual depth
  - Consistent shadows and transitions across all states
  - Works beautifully in both light and dark modes

### Premium Typography System (New)
- **Display** (Heroes): `text-display` - 1.2 line-height, -0.025em letter-spacing, font-black for maximum impact
- **Headings Large** (Sections): `text-heading-lg` - 1.3 line-height, -0.015em letter-spacing, bold
- **Headings** (Subsections): `text-heading` - 1.35 line-height, -0.012em letter-spacing, bold
- **Headings Small** (Minor): `text-heading-sm` - 1.4 line-height, -0.008em letter-spacing, semibold
- **Body Large** (Key info): `text-body-lg` - 1.65 line-height for premium reading comfort
- **Body** (Default): `text-body` - 1.7 line-height for optimal readability
- **Body Small** (Secondary): `text-body-sm` - 1.6 line-height, no letter-spacing
- **Caption** (Labels): `text-caption` - 1.4 line-height, +0.04em letter-spacing for elegance
- **Consistent Font Weights**: Hierarchy from 600 (semibold) to 900 (black)
- **Professional Spacing**: All headings and text have consistent margin relationships
- **User Delight**: Premium feel achieved through careful typographic proportion and breathing room

### Mobile Responsiveness (Complete - 70% User Focus)
- **Typography optimization for mobile**: 
  - Headlines scaled down for small screens: `text-display` now `text-2xl` on mobile → `text-5xl` on desktop
  - All heading sizes adjusted for mobile readability
- **Button sizing**: Touch-friendly sizes with `min-h-10` on mobile, proper scaling on larger screens
- **Card padding**: Reduced from `p-6` to `p-4` on mobile (16px vs 24px)
- **Email display**: Font reduced to `text-sm` on mobile, scales to `text-2xl` on desktop
- **Icon sizing**: Adaptive sizing from `h-3.5` on mobile to `h-5` on desktop
- **Domain selector**: Now available on mobile (was desktop-only)
- **Gap/spacing**: Mobile-optimized `gap-1.5 sm:gap-2` pattern for better fit
- **Main content**: Tighter padding on mobile (`px-3 py-6`) for maximum screen real estate
- **Button groups**: Responsive gap reduction for small screens

### Accessibility Enhancements (Complete)
- **Keyboard shortcuts**: Ctrl+C (copy email), Ctrl+G (generate new email) with documented titles
- **Screen reader support**: Aria-live regions announce new emails to screen readers
- **Skip-to-main link**: Keyboard users can jump directly to main content
- **Reduced motion support**: `@media (prefers-reduce-motion: reduce)` disables animations for users with motion sensitivity
- **WCAG-compliant**: All interactive elements have proper aria-labels and data-testid attributes

### Trust Building Components
- **"Is My Data Private?" section** (6 FAQs with icons: Eye, Lock, Database, Trash, Shield, Zap)
- **Enhanced footer** with Product, Legal, Contact sections and feature badges
- **Use Cases section** with professional icons instead of confusing checkboxes
- **Professional trust narrative flow**: Hero → Generator → Inbox → Trust → Use Cases → How It Works → Data & Privacy → Social Proof → Testimonials → FAQs

### CSS/Styling
- **Color utility classes**: `.btn-success` (emerald), `.btn-info` (blue), `.btn-danger` (red)
- **Hover animation**: `.btn-hover-scale` with 200ms transition
- **Theme transition**: `.theme-transitioning` applies 0.25s fade across all color properties
- **Reduced motion CSS**: Respects OS accessibility settings for users with motion sensitivity

## External Dependencies

### Third-Party API

- **api.barid.site**: Provides core temp mail functionality for retrieving domains, inbox contents, and email details.

### Key Libraries

- **axios**: HTTP client.
- **date-fns**: Date and time manipulation.
- **Radix UI**: Headless UI components.
- **Tailwind CSS**: Utility-first CSS framework.
- **TanStack Query**: Asynchronous state management.
- **Zod**: Schema validation.
- **lucide-react**: Icon library.

### Development Tools

- **TypeScript**: Type safety.
- **Vite**: Frontend build tool and development server.
- **esbuild**: Bundles backend server code.