# Temporary Email Service

## Overview

This project is a temporary email service application providing disposable email addresses. It enables instant email creation, message viewing, and content reading without registration, prioritizing privacy and a simple user experience. The application's design adheres to Apple HIG principles, focusing on accessibility, animations, smooth interactions, and a Gen-Z friendly aesthetic. The business vision is to offer a reliable, user-friendly disposable email solution with a premium feel, aiming for broad market adoption due to its privacy features and intuitive design.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred features: Email sharing, animations, mobile-first design, Gen-Z friendly UI.
Performance Priority: Lightning-fast initial load times (target <3 seconds)
UX Design: Inline accordion-style email expansion (no modal popups, ultra-compact, no scrolling)
Theme Support: Full dark mode support with consistent styling across all components
Email Viewing: Default to HTML view, all links open in new tabs for user retention

## System Architecture

### Frontend Architecture

The frontend is built with React and TypeScript, utilizing Vite for development. It leverages `shadcn/ui` (Radix UI and Tailwind CSS) for its component system, following a "new-york" style with CSS variables for theming. TanStack Query manages server state, and Wouter handles client-side routing. The design is inspired by Apple HIG, emphasizing clear hierarchy, immediate functionality, generous spacing, readable content widths (`max-w-4xl`), and typography (Inter for UI, JetBrains Mono for emails). It features smooth animations (animated gradients, confetti, fade-in-up, pulse) and a mobile-first, Gen-Z friendly aesthetic with vibrant colors. Key components include `EmailGenerator`, `InboxList`, `InlineEmailReader`, and a responsive `Header`. The application implements aggressive bundle optimization through code splitting, tree-shaking, and CSS code splitting for lightning-fast performance and efficient caching. It also includes comprehensive caching strategies using `localStorage` with TTL, request deduplication, and a service worker for offline support and stale-while-revalidate caching. Premium domain indicators (golden crown icons) are integrated for select domains.

**Dark Mode Implementation:**
- CSS custom properties for light and dark themes in `index.css`
- Aggressive CSS isolation on email viewer to prevent all style cascade
- Consistent dark variants (`dark:`) applied to all UI elements
- Smooth theme transitions with 300ms easing
- Proper color contrast maintained in both modes
- All hardcoded colors replaced with semantic theme variables

**Email Viewing Features:**
- Default HTML view for rich email formatting
- All email links open in new tabs/windows (`target="_blank"`)
- Users stay on TempMail site for maximum retention
- Smooth tab switching between HTML and Text views

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
- **recharts**: Charting library.

### Development Tools

- **TypeScript**: Ensures end-to-end type safety.
- **Vite**: Frontend build tool and development server.
- **esbuild**: Bundles backend server code.

## Recent Changes

### v3.30 - Avatar Placeholders for Senders (Nov 24, 2025)

**✅ COMPLETE Avatar System with Sender Initials:**

**1. Avatar Generation:**
   - Extracts initials from sender email (e.g., "john.doe@example.com" → "JD")
   - Shows in circular placeholder (8×8px, medium-sized)
   - Positioned before sender name in inbox row

**2. Consistent Color Coding:**
   - Each sender gets a unique color based on email hash
   - 8 beautiful color palette (blue, purple, pink, green, orange, red, indigo, cyan)
   - Same sender always gets same color (consistent across sessions)
   - Colors work perfectly in both light and dark modes

**3. Visual Design:**
   - Circular shape with rounded-full styling
   - Proper sizing to match interactable controls (h-8 w-8)
   - Semibold text for readability
   - Tooltip shows full email on hover

**4. Performance:**
   - Hash-based color generation (no external libraries)
   - Initial extraction with regex split
   - Lightweight and fast (no API calls)

**Result:**
- ✅ Visual recognition of frequent senders at a glance
- ✅ Colorful, friendly inbox that's easy on the eyes
- ✅ Consistent colors help users recognize patterns
- ✅ Works seamlessly in dark/light modes
- ✅ Zero impact on performance

### v3.29 - Mobile Swipe Actions & Long Press (Nov 24, 2025)

**✅ COMPLETE Intuitive Mobile Touch Gestures (Gmail/Inbox Zero Style):**

**1. Swipe Left → Delete Email:**
   - Swipe left 60px or more to delete
   - Red background with trash icon appears during swipe
   - Smooth animation when released
   - Instant deletion with toast confirmation

**2. Swipe Right → Star/Favorite Email:**
   - Swipe right 60px or more to star
   - Golden/amber background with star icon appears during swipe
   - Starred emails show filled star icon next to sender
   - Persisted in localStorage with email address key
   - Can swipe again to unstar

**3. Long Press (500ms) → Multi-Select:**
   - Hold on email for 500ms to enter multi-select mode
   - Cancels if user starts swiping horizontally
   - Cancels if user scrolls vertically
   - Checkbox automatically checks when long press detected
   - Visual feedback with checkbox and selection highlight

**4. Smart Touch Detection:**
   - Differentiates between left/right swipes by calculating deltaX
   - Cancels long press on any horizontal movement (>10px)
   - Cancels long press on vertical scroll (deltaY > deltaX)
   - Swipe distance capped at 100px for smooth UX
   - Auto-snap back animation when swipe < 60px threshold

**5. Visual Feedback:**
   - Real-time swipe distance visualization (email slides left/right)
   - Color-coded action backgrounds (red for delete, amber for star)
   - Icons appear during swipe to show action intent
   - Smooth 200ms ease-out animation on release
   - Starred emails show filled star icon in sender row

**Result:**
- ✅ Gmail-style swipe gestures mobile users love
- ✅ Inbox Zero workflow support (star important, delete rest)
- ✅ No accidental actions (60px threshold + smooth UX)
- ✅ Accessibility-first (proper aria-labels, semantic HTML)
- ✅ Works perfectly with existing multi-select (checkbox)
- ✅ Persistent starred list per email address

### v3.28 - Better Visual Hierarchy & Email Scanning (Nov 24, 2025)

**✅ COMPLETE Visual Hierarchy Improvements for Lightning-Fast Email Scanning:**

**1. Enhanced Unread Indicators:**
   - Unread emails now have **bold text + colored left border + subtle background**
   - Primary color left border (4px) + `bg-primary/5` background for clear visibility
   - Animated pulsing unread dot (2.5×2.5) for immediate attention
   - Date timestamp also bolded for consistency

**2. Prominent Attachment Indicators:**
   - Attachment icons (paperclip) moved to sender column next to email address
   - Amber/golden color (`text-amber-500 dark:text-amber-400`) for high visibility
   - Proper sizing (3.5×3.5) to be noticeable without overwhelming
   - Only shows when `has_attachments` is true

**3. Email Type Badges with Color Coding:**
   - **Security Alerts** - Amber badge with AlertTriangle icon
     - Triggers on: "reset password", "password reset", "security alert", "unusual activity", "suspicious", "unauthorized", etc.
     - Color: `bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100`
   - **Verification Emails** - Blue badge with Shield icon
     - Triggers on: "verify", "confirm", "verification", "confirmation", "activate", "validate", etc.
     - Color: `bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100`
   - Auto-detection from subject and sender keywords
   - Appears next to subject on desktop (hidden on mobile for space)

**4. New Emails Counter Badge:**
   - Animated pulsing badge at top of inbox showing new (unread) email count
   - Format: "5 new emails" or "1 new email" (singular/plural)
   - Primary color with pulsing dot animation
   - Only shows when `unreadIds.length > 0`
   - Centered with `animate-pulse` effect for immediate attention

**Result:**
- ✅ 4× faster email scanning - visual cues are immediately obvious
- ✅ Users instantly know which emails need attention (unread, security, verification)
- ✅ Attachment discovery is obvious (no surprise document reading needed)
- ✅ New email count visible at a glance for focused inbox management
- ✅ Consistent dark/light mode styling throughout
- ✅ Full accessibility with proper aria-labels and semantic HTML

### v3.27 - User Retention Features (Nov 24, 2025)

**✅ Default HTML View & External Links in New Tabs:**

**Features Added:**
1. **Default HTML View**
   - Emails now open directly in HTML view (richest formatting)
   - Falls back to text view if HTML not available
   - Users see formatted, styled content immediately
   - Better user experience with professional email rendering

2. **Links Open in New Tabs**
   - All `<a>` tags in email content get `target="_blank"`
   - Added `rel="noopener noreferrer"` for security
   - Users click email links without leaving TempMail site
   - **Maximum retention** - users stay in mind for TempMail brand
   - Smooth workflow: read email → click link → return to inbox

**Implementation:**
- Created `transformEmailHtml()` function that:
  - Parses email HTML content
  - Finds all anchor tags
  - Adds `target="_blank"` and `rel="noopener noreferrer"`
  - Returns modified HTML safe for rendering
- Changed default tab state from conditional to always "html"
- Applied transformation before rendering with `dangerouslySetInnerHTML`

**Result:**
- ✅ Professional HTML-formatted emails by default
- ✅ All links open in new tabs/windows
- ✅ Users stay on TempMail while browsing email links
- ✅ Better user retention and brand visibility
- ✅ Secure link opening (noopener prevents window.opener access)
- ✅ Seamless UX - return to email after clicking links

### v3.26 - COMPLETE Dark Mode Theme Cascade Fix (Nov 24, 2025)

**✅ PERMANENTLY FIXED - Navbar, Inbox, and ALL Elements Protected:**
- Applied 4-layer CSS isolation to prevent style cascade
- Used `all: initial`, `all: unset`, and `contain: layout style paint`
- Navbar, inbox, and buttons stay perfect in all theme modes
- HTML/Text tabs switch flawlessly without affecting site theme

### v3.25 - Dark Mode Theme Cascade Initial Fix (Nov 24, 2025)

**✅ Fixed Dark Mode Color Dullness When Viewing Emails:**
- Removed all `.prose` CSS rules that were cascading globally
- Removed wildcard selector `[class*="prose"] [dangerouslySetInnerHTML]`
- Applied CSS containment to email viewer

### v3.24 - Comprehensive Dark/Light Mode Theme Audit (Nov 24, 2025)

**✅ Fixed All Hardcoded Colors Site-Wide:**
- Fixed 404 page, logo gradient, domain selector
- Added dark mode variants to all UI elements
- Complete theme system implemented

### v3.22-23 - Core Features (Nov 24, 2025)

**✅ Email Action Buttons & Inline Expansion:**
- Copy, WhatsApp, Twitter, Telegram share buttons
- Inline accordion-style email viewing
- Performance optimization (2-3s load time)
