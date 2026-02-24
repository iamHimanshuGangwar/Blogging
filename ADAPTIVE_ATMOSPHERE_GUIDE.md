# Adaptive Atmosphere - Job Portal Design System

## Overview

The "Adaptive Atmosphere" is a sophisticated design system that creates a seamless transition between creative (blog) and professional (hiring) environments. As users scroll through different sections, the UI automatically adapts with:

- **Dynamic background colors** that smoothly transition
- **Glass-morphism cards** for refined elegance
- **Typography changes** (serif for creative, sans-serif for professional)
- **Adaptive accent colors** based on the current section

## Architecture

### 1. **CSS Variables System** (`styles/adaptive-atmosphere.css`)

The foundation uses CSS custom properties (variables) that dynamically switch based on the current section:

```css
:root {
  /* CREATIVE MODE */
  --creative-primary: #9f1239;
  --creative-accent: #ec4899;
  --creative-bg-gradient-start: #fdf2f8;
  
  /* PROFESSIONAL MODE */
  --professional-primary: #1e40af;
  --professional-accent: #3b82f6;
  --professional-bg-gradient-start: #f0f9ff;
  
  /* ACTIVE MODE (switches dynamically) */
  --active-primary: var(--creative-primary);
  --active-accent: var(--creative-accent);
}

body[data-section="professional"] {
  --active-primary: var(--professional-primary);
  --active-accent: var(--professional-accent);
}
```

### 2. **Intersection Observer Hook** (`hooks/useAtmosphereScroll.js`)

Detects when a user scrolls into different sections and updates the `body[data-section]` attribute:

```javascript
useAtmosphereScroll(); // Initialize in component
// Updates: body[data-section="professional"]
```

The hook triggers a custom `section-change` event:
```javascript
window.dispatchEvent(
  new CustomEvent('section-change', { detail: { section: 'professional' } })
);
```

## New Components

### 1. **MatchScoreIndicator** (`components/job-portal/MatchScoreIndicator.jsx`)

Displays a circular percentage gauge showing how well a user's resume matches a job.

```jsx
<MatchScoreIndicator
  score={85}
  skills={['React', 'Node.js']}
  jobRequirements={['React', 'JavaScript']}
/>
```

**Features:**
- Circular progress indicator with color coding (green 80+, blue 60+, yellow 40+, red <40)
- Hover tooltip showing matched and potential skills
- Interactive "Skill Alignment" breakdown

### 2. **TechStackTags** (`components/job-portal/TechStackTags.jsx`)

Displays technology stack with appropriate icons that glow on hover.

```jsx
<TechStackTags technologies={['React', 'Node.js', 'MongoDB']} />
```

**Features:**
- Auto-matches tech names to Lucide icons
- Displays up to 5 technologies, shows "+N more" for additional ones
- Hover effects with scale and glow animations

### 3. **JobDetailDrawer** (`components/job-portal/JobDetailDrawer.jsx`)

Side panel drawer that displays comprehensive job details without navigating away.

```jsx
<JobDetailDrawer
  isOpen={isOpen}
  job={selectedJob}
  onClose={() => setIsOpen(false)}
  onApply={(job) => handleApply(job)}
  isApplied={false}
/>
```

**Includes:**
- Quick facts (job type, salary)
- Full description
- Requirements list
- Tech stack
- Benefits
- Company information
- Call-to-action button

### 4. **CareerMapView** (`components/job-portal/CareerMapView.jsx`)

Visual representation of career progression paths within the platform.

```jsx
<CareerMapView jobs={jobs} />
```

**Features:**
- Multiple career tracks (Developer, Management, Architect)
- Node-based visualization showing progression
- Level-based job filtering
- Interactive path exploration

### 5. **QuickApplyFAB** (`components/job-portal/QuickApplyFAB.jsx`)

Floating Action Button for quick application with standby resume.

```jsx
<QuickApplyFAB
  isVisible={true}
  selectedJob={job}
  userResume={resumeFile}
  isInProfessionalSection={true}
  onApply={(job, resume) => submitApplication(job, resume)}
/>
```

## Key Features Implemented

### 1. **Glass-Morphism Cards**

```html
<div class="card-glass rounded-2xl breathable-padding">
  <!-- Content -->
</div>
```

**Characteristics:**
- Backdrop blur effect
- Semi-transparent white background with border
- Smooth hover transitions with elevation
- Dynamic border color based on section

### 2. **Salary Insights Toggle**

When enabled, displays market salary ranges for each job:

```jsx
{showSalaryInsights && (
  <div className="salary-insight">
    <DollarSign className="w-4 h-4" />
    <div>
      <p className="font-semibold">{job.salary}</p>
      <p className="text-xs opacity-70">Market rate based on location</p>
    </div>
  </div>
)}
```

### 3. **AI Resume Tailor**

Suggests resume bullet points based on job requirements:

```jsx
getAIResumeSuggestions(job)
// Returns: 
// ['Contributed to X industry projects...', 
//  'Implemented features aligned with...', 
//  'Enhanced performance and scalability...']
```

Shows as a toast notification with specific recommendations.

### 4. **Career Map View**

Toggle to see career progression paths:

```jsx
<button onClick={() => setCareerMapView(!careerMapView)}>
  Career Map
</button>
```

Displays:
- Developer → Mid-Level → Senior → Lead → Principal
- Management → Engineering Manager → Senior Manager
- Architecture → Principal Architect → Chief Architect

### 5. **Adaptive Typography**

```css
/* Creative Mode - Serif headers, larger line-height */
body[data-section="creative"] h1 {
  font-family: 'Georgia', serif;
  line-height: 1.7;
  letter-spacing: -0.5px;
}

/* Professional Mode - Sans-serif, tighter line-height */
body[data-section="professional"] h1 {
  font-family: 'Outfit', sans-serif;
  line-height: 1.4;
  letter-spacing: 0.5px;
}
```

## Animations & Transitions

All transitions use smooth cubic-bezier timing:
```css
--transition-duration: 800ms;
--transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
```

### Shimmer Effect (Verified Badge)
```css
@keyframes shimmer {
  0% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); }
  100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
}
```

### Match Score Pulse
Match score indicator scales up on hover with enhanced shadow.

## State Management

The JobSearch component manages:

```javascript
const [showSalaryInsights, setShowSalaryInsights] = useState(false);
const [careerMapView, setCareerMapView] = useState(false);
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
const [inProfessionalSection, setInProfessionalSection] = useState(false);
const [standbyResume, setStandbyResume] = useState(null);
```

Listens to `section-change` events to detect when users enter the professional section.

## Usage in JobSearch.jsx

### Basic Setup

```jsx
import useAtmosphereScroll from "../hooks/useAtmosphereScroll";
import MatchScoreIndicator from "../components/job-portal/MatchScoreIndicator";
import JobDetailDrawer from "../components/job-portal/JobDetailDrawer";
import CareerMapView from "../components/job-portal/CareerMapView";
import TechStackTags from "../components/job-portal/TechStackTags";
import QuickApplyFAB from "../components/job-portal/QuickApplyFAB";

const JobSearchPage = () => {
  useAtmosphereScroll(); // Initialize at root
  
  // ... rest of component
};
```

### Marking Section Boundaries

```jsx
<section data-section="professional">
  {/* Content will trigger atmosphere changes */}
</section>
```

## Customization

### Change Colors

Edit `styles/adaptive-atmosphere.css`:

```css
:root {
  --professional-primary: #your-color;
  --professional-accent: #your-color;
}
```

### Adjust Transition Speed

```css
--transition-duration: 1200ms; /* increase for slower transitions */
```

### Card Styling

```css
.card-glass {
  background: rgba(255, 255, 255, 0.8); /* adjust opacity */
  backdrop-filter: blur(15px); /* adjust blur amount */
}
```

## Browser Support

- Modern browsers with CSS custom properties support
- Intersection Observer API
- CSS backdrop-filter (all modern browsers)
- Conic gradient for match score (all modern browsers)

## Performance Considerations

1. **Intersection Observer**: One-time setup, minimal performance impact
2. **CSS Variables**: GPU-accelerated transitions
3. **Backdrop Filter**: Hardware accelerated on most devices
4. **Debounced**: Section changes only trigger refreshes

## Future Enhancements

1. **AI Integration**: Connect to actual resume analysis API
2. **Real Salary Data**: Integrate with salary databases
3. **User Preferences**: Remember atmosphere preference
4. **Mobile Optimization**: Responsive drawer design
5. **Analytics**: Track which features users interact with
6. **Accessibility**: Enhanced ARIA labels for screen readers

## Files Modified/Created

```
client/src/
├── styles/
│   └── adaptive-atmosphere.css (NEW)
├── hooks/
│   └── useAtmosphereScroll.js (NEW)
├── components/job-portal/
│   ├── MatchScoreIndicator.jsx (NEW)
│   ├── TechStackTags.jsx (NEW)
│   ├── JobDetailDrawer.jsx (NEW)
│   ├── CareerMapView.jsx (NEW)
│   └── QuickApplyFAB.jsx (NEW)
├── Pages/
│   └── JobSearch.jsx (REFACTORED)
└── index.css (UPDATED)
```

---

**Last Updated**: February 23, 2026
