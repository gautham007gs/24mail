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

## Recent Updates (Turn 3 - Final)

### UI/UX Enhancements
- **Color-coded buttons for intuitive UX**: Copy (green), Refresh (blue), Delete (red) with `!important` flags for consistent appearance
- **Button hover animations**: 0.2s scale(1.02) on hover, scale(0.95) on press with smooth transitions
- **Fixed duplicate checkmarks** in hero badges (removed text "✔" to avoid duplication with SVG icon)
- **Updated hero text** for professionalism: "Instant Burner Email Addresses" with refined subtitle
- **Dark mode auto-switch**: System preference detection with localStorage persistence
  - Smooth 0.25s transitions between themes
  - 3-state toggle: light → dark → system
  - Respects `prefers-color-scheme: dark` CSS media query
  - Theme toggle button in top-right header

### Trust Building Components
- **"Is My Data Private?" section** (6 FAQs with icons: Eye, Lock, Database, Trash, Shield, Zap)
- **Enhanced footer** with Product, Legal, Contact sections and feature badges
- **Professional trust narrative flow**: Hero → Generator → Inbox → Trust → Use Cases → How It Works → Data & Privacy → Social Proof → Testimonials → FAQs

### CSS/Styling
- **Color utility classes**: `.btn-success` (emerald), `.btn-info` (blue), `.btn-danger` (red)
- **Hover animation**: `.btn-hover-scale` with 200ms transition
- **Theme transition**: `.theme-transitioning` applies 0.25s fade across all color properties

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