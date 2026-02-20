# Legacy Portfolio Design System & Angular Migration Guide

 This document contains the "scraped" design system from the `legacy-react` project, prepared for migration to Angular.

## 1. Core Design Tokens

### Color Palette

| Token Name | Hex Value | Usage |
| :--- | :--- | :--- |
| `bg` | `#050510` | Main background (Very dark blue/black) |
| `primary` | `#6c5ce7` | Primary brand color (Purple) |
| `secondary` | `#00cec9` | Secondary brand color (Teal) |
| `accent` | `#fd79a8` | Accent color (Pink) |
| `text-main` | `#e0e0e0` | Main body text |
| `text-muted` | `#a0a0b0` | Secondary/description text |

**Glassmorphism Tokens:**
- **Background**: `rgba(255, 255, 255, 0.05)` (White 5%)
- **Border**: `rgba(255, 255, 255, 0.1)` (White 10%)
- **Blur**: `backdrop-blur-md`

### Typography

- **Heading Font**: `Outfit`, sans-serif
- **Body Font**: `Inter`, sans-serif

### CSS Variables (Root)
These were found in [src/index.css](file:///c:/Users/elonw/Desktop/projects/PortfolioV2/legacy-react/src/index.css) and should be added to your Angular `styles.scss`:

```css
:root {
  --bg-color: #050510;
  --text-color: #e0e0e0;
  --primary-color: #6c5ce7;
  --secondary-color: #00cec9;
  --accent-color: #fd79a8;
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --spacing-md: 2rem;
  --spacing-lg: 4rem;
  --shadow-glow: 0px 5px 15px rgba(108, 92, 231, 0.4);
}
```

## 2. Reusable UI Components

The following classes were extracted from `@layer components` in Tailwind or identified as repeated patterns.

### Buttons (`.btn`)
Base styles:
`inline-block px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0`

**Variants:**
1.  **Primary**: `.btn-primary`
    - `bg-gradient-to-r from-primary to-secondary`
    - `text-white hover:shadow-glow`
2.  **Secondary**: `.btn-secondary`
    - `bg-white/10 border border-white/10 backdrop-blur-sm`
    - `text-white hover:bg-white/20`

### Cards / Panels (`.glass-panel`)
Used for project cards and containers.
- **Styles**: `bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl`
- **Interactive State**: `hover:border-primary` (seen in Projects section)

### Tags / Chips
Used in project technology lists.
- **Styles**: `px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-secondary`

## 3. Global Layout & Structural Styles

- **Body**: `bg-bg text-[#e0e0e0] font-body overflow-x-hidden`
- **Container**: `container mx-auto px-8`
- **Section Spacing**: `py-24` (Commonly used for section padding)

## 4. Angular Migration Implementation Plan

### Step 1: Tailwind Configuration
Copy this configuration into your Angular project's [tailwind.config.js](file:///c:/Users/elonw/Desktop/projects/PortfolioV2/legacy-react/tailwind.config.js):

```javascript
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: "#050510",
        primary: "#6c5ce7",
        secondary: "#00cec9",
        accent: "#fd79a8",
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
      },
    },
  },
  plugins: [],
}
```

### Step 2: Animations Strategy

The React app uses `framer-motion` (simple fade-ins and slide-ups).
**Angular Equivalent**: Use `@angular/animations`.

**Example "Fade Up" Animation Trigger:**
```typescript
trigger('fadeUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('0.8s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
])
```

**Custom CSS Animations:**
Add this to your specific component CSS or global styles for the "Bouncing Dot" (chatbot):
```css
.typing-dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: white;
  border-radius: 9999px;
  opacity: 0.6;
  animation: bounce 1.4s infinite ease-in-out both;
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
```

### Step 3: Assets & Fonts
- **Fonts**: Ensure `Outfit` and `Inter` are loaded (likely via Google Fonts in [index.html](file:///c:/Users/elonw/Desktop/projects/PortfolioV2/legacy-react/index.html)).
- **Backgrounds**: The [App.tsx](file:///c:/Users/elonw/Desktop/projects/PortfolioV2/legacy-react/src/App.tsx) has a fixed background element:
    ```html
    <div class="fixed inset-0 bg-[#050510] -z-10"></div>
    <div class="fixed inset-0 bg-[radial-gradient(circle_at_center,rgba(108,92,231,0.1)_0%,transparent_70%)] -z-10"></div>
    ```
    *Add this to your `app.component.html`.*

## 5. Component Logic Mapping

| Legacy Component | Angular Strategy |
| :--- | :--- |
| [Hero.tsx](file:///c:/Users/elonw/Desktop/projects/PortfolioV2/legacy-react/src/components/Hero.tsx) | Create `HeroComponent`. Use `@angular/animations` for the entry motion. |
| [Projects.tsx](file:///c:/Users/elonw/Desktop/projects/PortfolioV2/legacy-react/src/components/Projects.tsx) | Create `ProjectsComponent`. Define a [Project](file:///c:/Users/elonw/Desktop/projects/PortfolioV2/legacy-react/src/components/Projects.tsx#21-57) interface. Use `*ngFor` for the list. |
| [Chatbot.tsx](file:///c:/Users/elonw/Desktop/projects/PortfolioV2/legacy-react/src/components/Chatbot.tsx) | Create `ChatbotComponent`. Manage state (`messages`) with Signals or behavior subjects. |
