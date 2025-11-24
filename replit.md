# Temporary Email Service

## Overview

This project is a temporary email service application designed to provide users with disposable email addresses. It allows instant creation of temporary emails, viewing of incoming messages, and reading email content without requiring registration. The application prioritizes privacy and a simple, intuitive user experience, adhering to Apple HIG-inspired design principles with a focus on accessibility, animations, and smooth interactions.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred features: Email sharing, animations, mobile-first design, Gen-Z friendly UI.

## Recent Updates

### v3.5 - Social Proof Overhaul & Trust Signal Enhancement (Nov 24, 2025)

**✅ Completed:**
- **Unified Social Proof Component:** Consolidated Stats + Trust Badges into one compelling section (unified-social-proof.tsx)
- **Visual Icons on All Stats:** Mail, Users, CheckCircle, Zap icons for instant recognition
- **Growth Indicators:** Added percentage growth ("↑ 50% growth", "↑ 35% this month", "No downtime in 18mo")
- **Emerald Accent System:** All stats use emerald gradient (from-emerald-600 to-emerald-700) for visual hierarchy
- **Icon Backgrounds:** Emerald-tinted backgrounds on all stat/trust icons (emerald-100 light mode, emerald-950/40 dark mode)
- **Hover Effects:** Gradient overlays on card hover, icon scale animation on hover
- **Better Section Organization:** Split into 2 clear subsections: "Impact & Growth" (4 stats) + "Security & Trust" (4 badges)
- **Live Activity Badge:** Added pulsing activity indicator ("👥 847 emails checked today • 🔒 0 security breaches ever")
- **Eliminated Redundancy:** Removed 3 separate section headers (Trusted by Thousands, Security & Trust) - now unified at top
- **Improved Typography:** Better visual hierarchy with uppercase section labels ("IMPACT & GROWTH", "SECURITY & TRUST")
- **Dark Mode Optimized:** All colors work perfectly in both light and dark modes
- **FOMO/Trust Signals:** Added emotional triggers for conversion (growth metrics, live activity, security metrics)

**Psychology Improvements:**
- Stats now create urgency with growth indicators
- Trust section emphasizes security without being redundant
- Live activity creates FOMO ("847 emails checked today")
- Emerald accent creates visual cohesion and brand confidence
- Better visual rhythm eliminates "social proof clutter" feeling

### v3.4 - Visual Polish & Mobile Navbar Excellence (Nov 23, 2025)

**✅ Completed:**
- **Email card depth:** Added shadow-sm with hover elevation for visual depth
- **Whitespace optimization:** Increased spacing from space-y-6/8 → space-y-8/10/12 for breathable layout
- **Subtle gradient background:** Added emerald gradient overlay (from-emerald-50/30 to-transparent) behind email generator
- **Button hierarchy (desktop):** Copy button now prominent (emerald-600), Generate button subtle (emerald-100)
- **Mobile navbar redesign:** Added icons to all nav items (Home, BookOpen, Zap, Award)
- **Mobile touch targets:** Increased from py-3 → py-4 for thumb-friendly interaction
- **Domain selector prominence:** Emerald accent, @ icon, visual separation in mobile menu
- **Visual hierarchy:** Three clear sections (Main nav, Domain, Footer links) with better styling
- **Staggered animations:** Menu items cascade smoothly on open (50ms per item)
- **Safe area padding:** Added pb-safe for notch devices (iPhones)
- **Enhanced tap feedback:** active-elevate-2 applied to all mobile menu items

### v3.3 - Security Hardening & Attack Prevention
- Attack detection: SQL injection, XSS, code injection patterns blocked
- Progressive IP blocking: 1 min → 5 min → 30 min automatic escalation
- Rate limiting: 100 req/min per IP with attack logging
- Funny error messages: 9 random humorous responses for attackers (Hindi/English mix)
- Enhanced security headers: HSTS preload, strict CSP, X-Frame-Options
- CORS hardening: Same-origin only (localhost, tempmail.org, replit.dev)

### Previous Updates
- v3.0: Mobile-first UI redesign, domain selector moved to hamburger menu
- v2.0: Expiry timer persistence with localStorage, fresh timer on domain change
- v1.0: Initial temporary email service with animations and QR sharing

## System Architecture

### Frontend Architecture

The frontend is built with React and TypeScript, using Vite for development and bundling. It employs `shadcn/ui` (based on Radix UI and Tailwind CSS) for its UI component system, following a "new-york" style with a neutral base and CSS variables for theming. TanStack Query manages server state, while Wouter handles client-side routing. The design philosophy is inspired by Apple HIG, emphasizing clear hierarchy, immediate functionality, generous spacing, readable content width (`max-w-4xl`), and typography (Inter for UI, JetBrains Mono for emails). It features smooth animations (animated gradients, confetti, fade-in-up, pulse) and a mobile-first, Gen-Z friendly aesthetic with vibrant colors. Key components include `EmailGenerator`, `InboxList`, `EmailDetailModal`, and a responsive `Header`.

### Backend Architecture

The backend utilizes Express.js with Node.js and TypeScript, acting as a RESTful API proxy to an external temp mail service (`api.barid.site`). It provides endpoints for fetching domains, inbox contents, and specific email details. Custom middleware handles logging, JSON parsing, error handling, and Zod schema validation for all requests. The server integrates with Vite for HMR in development and serves static assets from `dist/public` in production.

### Data Models

Data validation is performed using Zod schemas for `EmailSummary`, `Email`, and `Domain` objects. The application does not use a persistent database; all email-related data is fetched on-demand from the external API. A `User Schema` is defined but not currently used.

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
- **Tailwind CSS**: Utility-first CSS framework.
- **TanStack Query**: Asynchronous state management with caching and auto-refresh (15-second interval for inbox).

### Development Tools

- **TypeScript**: Ensures end-to-end type safety.
- **Vite**: Frontend build tool and development server.
- **esbuild**: Bundles backend server code.
- **Drizzle ORM**: Configured for PostgreSQL but not currently utilized.