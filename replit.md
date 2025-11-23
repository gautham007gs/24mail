# Temporary Email Service

## Overview

This project is a temporary email service application designed to provide users with disposable email addresses. It allows instant creation of temporary emails, viewing of incoming messages, and reading email content without requiring registration. The application prioritizes privacy and a simple, intuitive user experience, adhering to Apple HIG-inspired design principles with a focus on accessibility, animations, and smooth interactions.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred features: Email sharing, animations, mobile-first design, Gen-Z friendly UI.

## Recent Updates

### v3.3 - Security Hardening & Attack Prevention (Nov 23, 2025)

**✅ Completed:**
- Attack detection: SQL injection, XSS, code injection patterns blocked
- Progressive IP blocking: 1 min → 5 min → 30 min automatic escalation
- Rate limiting: 100 req/min per IP with attack logging
- Funny error messages: 9 random humorous responses for attackers (Hindi/English mix)
- Enhanced security headers: HSTS preload, strict CSP, X-Frame-Options
- CORS hardening: Same-origin only (localhost, tempmail.org, replit.dev)
- Security documentation: SECURITY.md and ENCRYPTION_AND_SECURITY.md created

**📋 Important Notes on Encryption:**
- Emails transported via HTTPS/TLS (encrypted in transit) ✅
- Emails NOT encrypted at rest (external storage) ⚠️
- Auto-delete after 15 minutes (privacy through deletion) ✅
- If you need encryption: use PGP/GPG for sensitive data

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