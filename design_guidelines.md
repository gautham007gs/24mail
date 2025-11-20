# Design Guidelines: Temporary Email Service

## Design Approach
**Reference-Based: Apple HIG Inspired**

Following Apple's design philosophy for simplicity, clarity, and accessibility across all age groups. The interface prioritizes immediate functionality with minimal cognitive load - users should instantly understand how to generate an email and access their inbox.

## Core Design Principles
- **Simplicity First**: Single-purpose screens with clear hierarchy
- **Immediate Clarity**: No learning curve, intuitive at first glance
- **Generous Spacing**: Room to breathe, not cramped
- **Functional Beauty**: Every element serves a purpose

## Layout System

**Spacing Units**: Use Tailwind units of 2, 4, 6, and 8 (p-2, p-4, p-6, p-8, etc.)
- Consistent padding: p-6 for cards, p-8 for main containers
- Vertical rhythm: space-y-4 for related items, space-y-8 between sections

**Container Structure**:
- Max width: max-w-4xl for main content area
- Centered layout: mx-auto
- Mobile padding: px-4, Desktop: px-6

## Typography Hierarchy

**Font Stack**: 
- Primary: SF Pro Display alternative (Inter or System UI)
- Monospace: SF Mono alternative for email addresses (Fira Code, Monaco)

**Type Scale**:
- Email Display: text-2xl md:text-3xl, font-medium, monospace
- Section Headers: text-xl, font-semibold
- Email Subject: text-base, font-medium
- Body Text: text-sm, regular weight
- Metadata (timestamps, sender): text-xs, medium weight

## Component Library

### Primary Screen Layout
- Full-screen single-page application
- Fixed header with app title/logo (h-16)
- Main content area with email generator at top
- Scrollable inbox list below
- No traditional hero section - immediate functionality

### Email Generator Card
- Prominent placement at top of page
- Large, centered temporary email address display
- Copy button integrated inline with email address
- "Generate New Email" button below
- Dropdown to select domain (minimal, native select styling)
- Spacing: p-8, rounded-2xl border

### Inbox List
- Clean list view with individual email cards
- Each card shows: sender, subject, timestamp, attachment indicator
- Unread indicator (subtle dot or badge)
- Card spacing: space-y-2
- Card styling: p-4, rounded-xl, border, hover state with subtle elevation

### Email Detail View
- Modal overlay or slide-in panel
- Full email header: from, to, subject, timestamp
- Content area with HTML preview or plain text
- Attachment list if applicable
- Action buttons: Delete, Close
- Max height with scroll for long emails

### Buttons
- Primary (Generate, Copy): px-6 py-3, rounded-lg, font-medium
- Secondary (Delete, Close): px-4 py-2, rounded-lg
- Icon buttons: p-2, rounded-lg for actions
- All buttons: active and hover states with subtle scale/opacity

### Empty States
- Centered message when inbox is empty
- Simple icon + helpful text
- Encouraging micro-copy: "No emails yet. Your temporary address is ready to receive!"

## Interaction Patterns

**Copy to Clipboard**:
- One-click copy with visual feedback (checkmark, "Copied!" tooltip)
- Tooltip duration: 2 seconds

**Auto-Refresh**:
- Polling interval: 10-15 seconds for new emails
- Subtle loading indicator during refresh
- No intrusive spinners

**Email Opening**:
- Click anywhere on email card to open
- Smooth transition to detail view
- Clear close button or back navigation

**Responsive Behavior**:
- Mobile: Full-width cards, stacked layout
- Tablet/Desktop: Maintained max-width container, same card structure
- Touch-friendly tap targets: minimum 44px

## Special Considerations

**Accessibility**:
- Clear focus states on all interactive elements
- Proper heading hierarchy (h1 for app title, h2 for sections)
- Alt text for icons
- Sufficient contrast ratios throughout

**Age-Inclusive Design**:
- Large, readable text sizes
- Generous touch targets
- No time-pressure interactions
- Simple, familiar patterns (no complex gestures)

**Animation Constraints**:
- Minimal animations - only for feedback (copy success, new email arrival)
- Smooth transitions between states (200-300ms)
- No decorative or distracting motion

## Images
No images required. This is a pure utility application focused on functionality. Icons only via Heroicons (outline style for consistency with Apple aesthetic).