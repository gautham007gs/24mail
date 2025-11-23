# Temporary Email Service

## Overview

This is a temporary email service application that allows users to generate disposable email addresses and receive emails without registration. The application provides a simple, privacy-focused interface where users can instantly create temporary email addresses, view incoming messages, and read email content. Built with a modern tech stack, it follows Apple HIG-inspired design principles emphasizing simplicity, clarity, and accessibility with engaging animations and smooth interactions.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred features: Email sharing, animations, mobile-first design, Gen-Z friendly UI.

## Recent Updates

### Latest Features (v2.6 - Accessibility & WCAG AAA):
- **Clear Focus Indicators** - 3px solid outline on all interactive elements (keyboard navigation)
- **Enhanced ARIA Labels** - Comprehensive labels, live regions, roles for screen readers
- **Semantic HTML** - Proper roles (region, article, group) for accessibility tree
- **Screen Reader Support** - aria-live, aria-atomic, aria-expanded, aria-controls
- **Color Contrast** - WCAG AAA compliant (7:1+ contrast ratios throughout)
- **Keyboard Navigation** - Full tab navigation with visible focus states
- **Accessible Forms** - Proper labeling and error announcements for all inputs
- **Dynamic Content Announcements** - aria-live regions for stats counters and carousels

### Previous Features (v2.5 - Trust & Social Proof):
- **Stats Counter** - Animated counters (1M+ emails, 500K+ users, 99.9% uptime, 0.3s response time)
- **Trust Badges** - HTTPS Secure, Privacy Protected, Uptime SLA, Instant Delivery cards
- **Testimonials Carousel** - Auto-rotating testimonials from 5 users (Sarah Chen, Marcus Johnson, Priya Sharma, James Wilson, Lisa Rodriguez)
- **FAQ Accordion** - 6 expandable FAQ items covering legality, safety, duration, uptime, speed, QR code features
- **Section Headings** - Clear category headings with subtext for each trust section
- **Animated Counter** - GPU-optimized animations for stats that update on page load

### Previous Features (v2.4 - Visual Polish):
- **Glassmorphism Effects** - Frosted glass modals with backdrop blur (email detail, QR share)
- **Neumorphism Accents** - Subtle 3D shadow effects on cards (email card, blog cards)
- **Micro-interactions** - Button press animations (scale 0.98), smooth transitions
- **Consistent Spacing** - 4px grid spacing utilities (xs, sm, md, lg, xl, 2xl)
- **Icon Enhancements** - More lucide icons throughout, smooth icon transitions
- **Button Polish** - Smooth transitions on all buttons with button-press class

### Previous Features (v2.3):
- **Loading Skeletons** - Email row skeletons while fetching inbox (smooth UX)
- **Blog Image Skeletons** - Placeholder skeletons before blog images load
- **Smooth Page Transitions** - Fade-in effects for all pages (0.4s ease-out)
- **Progressive Email Loading** - Emails appear one-by-one (100ms stagger) as they arrive
- **Lazy Load Images** - Already implemented, preserved in blog cards
- **Email Loading State** - 5 skeleton rows during inbox fetch

### Previous Features (v2.2):
- **QR Modal Share Buttons** - WhatsApp, Telegram, Twitter direct sharing from QR screen
- **Auto-Generated TOC** - Table of contents sidebar for long articles (desktop view)
- **Article Share Buttons** - Share on Twitter, WhatsApp, Telegram, or copy link
- **Author Bio Section** - Expertise badges and detailed author information at article end
- **Dark Mode Code Blocks** - Optimized syntax highlighting for better readability
- **Article Navigation** - Improved sidebar sticky positioning with smooth scrolling

### Previous Features (v2.1):
- **Unread Badge System** - Visual dot indicator for unread emails with bold sender name
- **Email Preview Tooltip** - Hover on subject to see first 100 characters
- **Swipe to Delete (Mobile)** - Swipe left on email row to select and delete
- **Bulk Actions** - Multi-select with checkboxes, bulk delete dialog
- **Conversation Threading** - Emails grouped by sender
- **Dark Mode Email Rendering** - Enhanced contrast with `dark:prose-invert`
- **Search & Filter** - Filter by sender, subject with real-time results
- **Unread Tracking** - Persisted in localStorage per email address

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component System**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS for styling. The design system follows the "new-york" style variant with a neutral base color scheme and CSS variables for theming.

**State Management**: TanStack Query (React Query) for server state management with custom query functions. The application uses React hooks for local state management.

**Routing**: Wouter for lightweight client-side routing. The application is primarily a single-page application with minimal routing needs.

**Design Philosophy**: Apple HIG-inspired design with emphasis on:
- Single-purpose screens with clear hierarchy
- Immediate functionality without learning curve
- Generous spacing using Tailwind's spacing units (2, 4, 6, 8)
- Maximum content width of `max-w-4xl` for readability
- Typography using Inter for UI and JetBrains Mono for email addresses
- Smooth animations: animated gradient backgrounds, confetti on copy, fade-in-up effects, pulse animations
- Mobile-first responsive design with optimized touch targets
- Gen-Z friendly aesthetics with vibrant color scheme (emerald, blue, purple, pink)

**Key Frontend Components**:
- `EmailGenerator`: Displays current temporary email with animated background gradient, copy functionality, domain selector dropdown, expiry timer (15 minutes), session email counter, quick action cards (Inbox count, QR Code, Share, Generate New), and confetti animation on copy
- `InboxList`: Shows list of received emails with refresh and delete capabilities
- `EmailDetailModal`: Modal dialog for viewing full email content with HTML/text tabs, and email sharing options
- `Header`: Responsive mobile-first navigation with sticky positioning, hamburger menu for mobile, theme toggle
- `confetti.ts`: Utility for triggering colorful confetti animation on copy action

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**API Design**: RESTful API acting as a proxy layer to the external temp mail service (api.barid.site). The backend provides three main endpoints:
- `GET /api/domains` - Fetches available email domains
- `GET /api/inbox/:email` - Retrieves emails for a specific temporary address
- `GET /api/inbox/:email/:id` - Fetches details of a specific email message

**Request Handling**: Custom middleware for request logging, JSON parsing with raw body capture, and error handling. The server validates incoming requests using Zod schemas before forwarding to the external API.

**Validation**: Zod schemas defined in shared code for runtime type validation of email addresses, email IDs, and API responses.

**Development vs Production**: Vite middleware integration in development mode for HMR and asset serving. In production, static assets are served from the built `dist/public` directory.

### Data Models

The application uses Zod schemas for data validation without a traditional database:

**EmailSummary**: List view representation with id, from/to addresses, subject, timestamp, and attachment flags.

**Email**: Full email object including HTML and text content in addition to summary fields.

**Domain**: String representing available email domains for temporary address generation.

**User Schema**: Defined but not actively used - includes id, username, and password fields for potential future authentication.

### External Dependencies

**Third-Party API**: The application relies entirely on the external temp mail API at `https://api.barid.site` for:
- Retrieving available email domains
- Fetching inbox contents for temporary email addresses
- Getting detailed email content

**No Database**: The application does not use a persistent database. Email data is fetched on-demand from the external API. A minimal in-memory storage class exists for potential user management but is not currently utilized.

**Key Libraries**:
- **axios**: HTTP client for making requests to the external temp mail API
- **date-fns**: Date formatting and manipulation for email timestamps
- **Radix UI**: Headless UI component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **TanStack Query**: Asynchronous state management with caching and auto-refresh (15-second interval for inbox)

**Development Tools**:
- **Drizzle ORM**: Configured for PostgreSQL but not actively used in current implementation
- **Vite plugins**: Runtime error modal, cartographer, and dev banner for Replit environment
- **TypeScript**: End-to-end type safety across client and server

**Build Process**: Vite builds the frontend, esbuild bundles the backend server code, with separate output directories for production deployment.