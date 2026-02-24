# Enhanced Job Sidebar - Technical Specifications

## Component Dimensions

### Desktop
- **Sidebar Width**: 384px (lg:w-96)
- **Sidebar Height**: Full viewport height (h-screen)
- **Header Height**: 72px (p-6 top + bottom)
- **Tabs Bar Height**: 56px (p-3 padding)
- **Content Padding**: 24px (p-6)

### Mobile
- **Width**: 100% (w-full)
- **Height**: 100vh (h-screen) with overlay
- **Overlay Color**: rgba(0, 0, 0, 0.5) (bg-black/50)
- **Overlay Z-index**: 40

### Search Input Container
- **Padding**: 12px 16px
- **Border Width**: 2px
- **Border Radius**: 12px (rounded-xl)
- **Min Height**: 44px (touch target)

### AI Badge
- **Size**: 32x32px
- **Border Radius**: 8px
- **Font Size**: 12px
- **Font Weight**: 700
- **Position**: Absolute, top-right of header

## Animation Timings

### Search Bar Pulse
```
@keyframes pulse-border
Duration: 2 seconds
Easing: ease-in-out
Iteration: infinite

Key frames:
- 0%: box-shadow: 0 0 20px rgba(168, 85, 247, 0.5), inset 0 0 10px rgba(168, 85, 247, 0.1)
- 50%: box-shadow: 0 0 30px rgba(168, 85, 247, 0.8), inset 0 0 15px rgba(168, 85, 247, 0.2)
- 100%: Same as 0%
```

### Shimmer Movement
```
@keyframes shimmer-move
Duration: 3 seconds
Easing: linear
Iteration: infinite

Key frames:
- 0%: left: -100%
- 50%: left: 100%
- 100%: left: 100%
```

### Shimmer Glow
```
@keyframes shimmer-glow
Duration: 3 seconds
Easing: ease-in-out
Iteration: infinite

Key frames:
- 0%: text-shadow: 0 0 4px rgba(255, 255, 255, 0.5)
- 50%: text-shadow: 0 0 12px rgba(255, 255, 255, 0.9), 0 0 20px rgba(236, 72, 153, 0.6)
- 100%: Same as 0%
```

### Section Fade-In
```
@keyframes section-fade-in
Duration: 600ms
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
Iteration: Once per section

Key frames:
- from: opacity: 0; transform: translateY(16px)
- to: opacity: 1; transform: translateY(0)
```

### Section Staggered Delays
```
Section 1 (Search):  0ms delay
Section 2 (Location): 150ms delay
Section 3 (JobType): 200ms delay
Section 4 (Salary):  250ms delay
Section 5 (Industry): 300ms delay
Section 6 (Buttons): 350ms delay
```

### Sidebar Mobile Open/Close
```
Duration: 300ms
Easing: duration-300 (standard cubic)

States:
- Closed: -translate-x-full (translateX: -100%)
- Open: translate-x-0 (translateX: 0)
```

## Color Values

### RGB/Hex Reference
```
Purple Primary:     #a855f7 rgb(168, 85, 247)
Pink Accent:        #ec4899 rgb(236, 72, 153)
Green (Salary):     #10b981 rgb(16, 185, 129)
Amber (Industry):   #f59e0b rgb(245, 158, 11)
White:              #ffffff rgb(255, 255, 255)
Black (Dark):       #111827 rgb(17, 24, 39)
Gray (Light):       #e5e7eb rgb(229, 231, 235)
Gray (Dark):        #374151 rgb(55, 65, 81)
```

### Gradient Definitions
```
Button Gradient: linear-gradient(135deg, #a855f7 0%, #ec4899 100%)
Background Fade: linear-gradient(to-b, white, rgba(168, 85, 247, 0.1))
Shimmer Overlay: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)
```

### Shadow Values
```
Badge Glow:
- Layer 1: 0 4px 15px rgba(168, 85, 247, 0.4)
- Layer 2: 0 0 20px rgba(236, 72, 153, 0.3)

Search Bar Pulse (min):
- 0 0 20px rgba(168, 85, 247, 0.5)
- inset 0 0 10px rgba(168, 85, 247, 0.1)

Search Bar Pulse (max):
- 0 0 30px rgba(168, 85, 247, 0.8)
- inset 0 0 15px rgba(168, 85, 247, 0.2)

Button Hover:
- 0 12px 24px rgba(168, 85, 247, 0.4)
```

## Typography

### Headers
- **Sidebar Title**: 
  - Font: Tailwind `text-xl font-bold`
  - Size: 20px
  - Weight: 700
  - Color: #111827 (dark), #f3f4f6 (light)

- **Section Headers**:
  - Font: `font-bold`
  - Size: 16px
  - Weight: 700
  - Color: #111827 (dark), #f3f4f6 (light)

- **Tab Labels**:
  - Font: `font-semibold text-sm`
  - Size: 14px
  - Weight: 600
  - Color: Variable based on state

### Body Text
- **Input Placeholder**:
  - Size: 14px
  - Color: #9ca3af (light), #6b7280 (dark)
  
- **Labels**:
  - Font: `text-xs font-semibold`
  - Size: 12px
  - Weight: 600

## Z-Index Stack

```
Mobile Overlay:         40
Sidebar Container:      50 (lg:0, relative)
Sticky Header:          40
Sticky Tabs:            30
Dropdown Content:       50
```

## Responsive Breakpoints

```
sm: 640px
md: 768px
lg: 1024px (sidebar transition point)
xl: 1280px
2xl: 1536px
```

## Filter Section Accents

```
Search Section:    Purple (#a855f7) - Main brand color
Location Section:  Purple (#a855f7) - Geography related
JobType Section:   Pink (#ec4899) - Employment emphasis
Salary Section:    Green (#10b981) - Money/growth
Industry Section:  Amber (#f59e0b) - Knowledge/diversity
```

## Accessibility Values

### Touch Targets
- Minimum: 44px × 44px
- Buttons: 32-44px height
- Radio/Checkbox: 16px with 12px padding

### Focus States
- Focus Ring: ring-2 (2px width)
- Focus Color: #a855f7 (purple)
- Outline: 2px solid followed by 2px offset

### Color Contrast
- Text to Background: 4.5:1 minimum (WCAG AA)
- Borders to Background: 3:1 minimum
- Interactive Elements: 3:1 minimum

## Performance Metrics

### CSS Animation Performance
```
- FPS Target: 60fps
- GPU Acceleration: transform, opacity only
- Will-change: Applied to sections
- Reduced Motion: All animations disabled
```

### Build Size Impact
```
CSS File: ~6KB (EnhancedJobSidebar.css)
Component: ~12KB (EnhancedJobSidebar.jsx)
Total Addition: ~18KB (uncompressed)
```

## Browser Compatibility

### Supported Features
- CSS Grid: IE 11+
- Flexbox: IE 11+
- Transform: IE 10+
- Backdrop-filter: Safari 9.1+, Chrome 76+
- CSS Animations: IE 10+
- Gradients: IE 10+

### Fallbacks
- Transform: Cached/GPU accelerated where possible
- Backdrop-filter: Optional (blurring not critical)
- CSS variables: Not used (Tailwind classes only)

## Dark Mode Implementation

### Color Adjustments
```
Light Mode Background: #ffffff
Dark Mode Background:  #1f2937

Light Mode Text: #111827
Dark Mode Text:  #f3f4f6

Light Mode Border: #e5e7eb
Dark Mode Border:  #374151
```

All dark mode colors use Tailwind `dark:` prefixes for automatic switching.

---

**Last Updated**: February 24, 2026  
**Version**: 1.0  
**Status**: Complete
