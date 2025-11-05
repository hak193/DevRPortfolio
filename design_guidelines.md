# Design Guidelines for I-DevR Code Portfolio Website

## Design Approach
**Reference-Based Approach** inspired by Linear (clean typography hierarchy), Stripe (restrained color, clarity), and Vercel (modern tech aesthetic, strong contrast).

**Core Principles:**
- Professional credibility through clean, confident design
- Accessibility and clarity above visual tricks
- Trust-building through consistent, polished execution
- Worcester, MA local identity with subtle geographic pride

## Typography
**Font System:**
- Primary & Display: Inter (Google Fonts, weights 400-800)

**Hierarchy:**
- Hero Headlines: `text-4xl md:text-6xl font-extrabold leading-tight`
- Section Headings: `text-3xl md:text-4xl font-bold leading-tight`
- Subsection Headings: `text-xl md:text-2xl font-bold`
- Body Text: `text-base md:text-lg font-normal leading-relaxed`
- UI Labels: `text-sm md:text-base font-medium`
- Small Print: `text-xs md:text-sm`

## Layout System
**Spacing Primitives:** Tailwind units 4, 6, 8, 12, 16, 20, 24

- Component padding: `p-6`, `p-8`
- Section spacing: `py-16 md:py-20 md:py-24`
- Card gaps: `gap-6`, `gap-8`
- Element margins: `mb-4`, `mb-6`, `mb-8`

**Container Strategy:**
- Full sections: `max-w-7xl mx-auto px-6`
- Forms/focused content: `max-w-4xl mx-auto px-6`
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## Component Library

### Navigation
- Sticky header with `backdrop-blur-lg` effect, `h-16` or `h-20`
- Logo left, nav links center-right, CTA button far right
- Mobile: Hamburger menu with smooth slide-down panel
- Active states: indigo-400 text

### Hero Section (Homepage)
**Large Hero Image:** Full-width background featuring Worcester, MA tech workspace or skyline
- Image treatment: Dark overlay `bg-black bg-opacity-50`
- Aspect ratio: 16:9 landscape
- Centered content with 3 CTA buttons in flex row (stack mobile)
- Buttons: `backdrop-blur-md bg-white bg-opacity-90` or `bg-indigo-600 bg-opacity-90`

### AI-Powered App Builder Form
**Layout:** Two-column on desktop (info left, form right), stack on mobile

**Smart Prompting Panel:**
- Sidebar or floating panel: `bg-gray-800 rounded-xl p-6 shadow-2xl`
- AI suggestion cards with icon, title, subtitle layout
- "Refine with AI" buttons throughout form: `w-full bg-indigo-600 hover:bg-indigo-700 rounded-lg p-4`
- Each button shows icon + "Help me with..." + specific context
- AI responses appear in modal overlay with markdown rendering

**Form Structure:**
- Multi-step progress indicator at top
- Input fields: `bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500`
- Labels: `text-gray-300 mb-2 font-medium`
- Textarea: 6 rows minimum
- AI helper buttons placed strategically after each major input group

**AI Modal:**
- Fixed overlay: `bg-black bg-opacity-75`
- Modal: `max-w-2xl bg-gray-900 rounded-xl p-8`
- Close button: top-right X icon
- Generated content: `prose prose-invert` styling

### Template/Snippet Store
**Store Layout:**
- Hero section with search bar: `max-w-3xl mx-auto` centered
- Filter sidebar (desktop) or dropdown (mobile): Categories, Tech Stack, Price Range
- Main grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`

**Template Cards:**
- Structure: Preview thumbnail → Title → Description → Tech stack tags → Price/Download button
- Preview image: `aspect-video rounded-t-xl` with gradient overlay on hover
- Card: `bg-gray-800 rounded-xl shadow-2xl hover:-translate-y-2 transition-transform`
- Tech tags: `bg-gray-700 rounded-full px-3 py-1 text-xs` in flex wrap
- Pricing: Large `text-2xl font-bold` with "Free" or "$XX"
- CTA: `w-full bg-indigo-600 rounded-b-xl p-4` (Download/View/Purchase)

**Categories:**
- React Components
- Node.js APIs  
- Full-Stack Apps
- Code Snippets
- Design Templates
- WordPress Themes

**Template Detail Page:**
- Large preview section with code tabs or live demo iframe
- Sidebar: Download button, tech stack, features list, documentation link
- Installation instructions in code blocks with copy button
- Related templates section at bottom

### Service Cards
- 3-column grid (desktop), stack mobile
- Card: Icon `h-6 w-6` → Title → Description → Details box `bg-gray-800 rounded-lg p-4` → CTA
- Hover: `-translate-y-2 transform`
- Styling: `rounded-xl shadow-2xl`

### Footer
- Two-row layout: Top (newsletter, quick links, social icons), Bottom (copyright, Worcester location)
- Grid: `grid-cols-1 md:grid-cols-3 gap-8`
- Background: `bg-gray-900 border-t border-gray-800`

## Images
**Homepage Hero:** Professional photo of Worcester cityscape or modern tech office workspace, dark overlay for text contrast

**Template Store:** Each template requires preview thumbnail (16:9 aspect), use placeholder images with gradient backgrounds and centered tech stack icons

**Service Cards:** Abstract tech illustrations or icon-based graphics, no photography

## Animations
- Hover: `scale-105` on buttons only
- Cards: `-translate-y-2` vertical lift
- Modals: Fade-in with `opacity-0` to `opacity-100`
- No scroll-triggered animations or parallax

## Accessibility
- Focus states: `ring-2 ring-indigo-500` on all interactive elements
- Button contrast: WCAG AA (white on indigo-600+)
- Form validation: Inline errors `text-red-400 bg-red-900 bg-opacity-20`
- Touch targets: Minimum 44x44px mobile