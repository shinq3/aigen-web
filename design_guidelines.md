# Design Guidelines for D'acuhy.Studio

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern tech product showcases like Notion, Linear, and Vercel, focusing on clean aesthetics with strategic use of orange theming and smooth animations.

## Core Design Elements

### A. Color Palette
**Primary Colors (Orange Theme)**
- Primary Orange: 25 85% 60% (vibrant orange for CTAs and highlights)
- Orange Accent: 20 75% 55% (warmer orange for secondary elements)
- Background Dark: 220 15% 8% (deep blue-gray for dark mode)
- Background Light: 0 0% 98% (near white for light mode)
- Text Primary: 220 15% 95% (light text on dark) / 220 15% 15% (dark text on light)
- Text Secondary: 220 10% 70% (muted text)

**Gradients**: Orange-to-amber gradients (25 85% 60% to 35 80% 65%) for hero backgrounds and CTA buttons. Subtle dark-to-orange gradients for section backgrounds.

### B. Typography
**Font Stack**: Inter (primary) via Google Fonts for clean readability, with Noto Sans JP for Japanese characters
- Headings: 600-700 weight, generous line height (1.2-1.3)
- Body: 400-500 weight, comfortable reading size (16px base)
- UI Elements: 500 weight for buttons and navigation

### C. Layout System
**Spacing**: Tailwind units of 2, 4, 6, 8, 12, 16, 24 for consistent rhythm
- Component padding: p-6, p-8
- Section spacing: my-12, my-16, my-24
- Grid gaps: gap-4, gap-6, gap-8

### D. Component Library

**Hero Section**
- Full viewport height with orange gradient overlay
- Large typography with fade-in animations
- Dual CTA buttons (primary orange, secondary outline with blur background)
- Subtle particle or geometric background animation

**Product Cards**
- Clean white/dark cards with subtle shadows
- Orange accent borders on hover
- Product status badges (beta, released, coming soon)
- Smooth scale transform on hover (1.02x)

**Navigation**
- Sticky header with backdrop blur
- Orange active states for navigation links
- Mobile-first hamburger menu with slide transitions

**News Cards**
- Thumbnail with orange overlay on hover
- Source attribution and timestamp
- Clean typography hierarchy
- External link indicators

**Forms**
- Orange focus states for inputs
- Smooth validation feedback
- Modern input styling with floating labels

### E. Animations
**Transitions**: Use sparingly with purpose
- Page transitions: Smooth fade-ins (300ms ease-out)
- Hover states: Scale and color transitions (200ms)
- Scroll reveals: Subtle slide-up animations for sections
- Loading states: Orange progress indicators

**Motion Library**: Framer Motion for complex animations, CSS transitions for simple states

## Images
**Hero Background**: Abstract geometric patterns or tech-inspired imagery with orange gradient overlay. Not a large photographic hero, but rather graphic/abstract elements.

**Product Thumbnails**: Clean mockups or interface screenshots for each AI product (LingaLink, EduMate, OfficeBrain, Bayd-System).

**Section Graphics**: Modern illustrations or icons representing AI/technology concepts in monochrome with orange accents.

## Special Considerations
- **Japanese Support**: Ensure proper font rendering for Japanese characters
- **Responsive Design**: Mobile-first approach with careful attention to touch targets
- **Accessibility**: High contrast ratios, focus indicators, semantic HTML structure
- **Performance**: Optimize animations for 60fps, lazy load images
- **Future Expansion**: Design system should accommodate new products and English localization

The overall aesthetic should feel cutting-edge and professional while maintaining warmth through the strategic use of orange accents and smooth, purposeful animations.