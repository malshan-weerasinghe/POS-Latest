# App Shell – Main Layout

## Overview
Modern Minimalist POS Application Layout for Electron Desktop (1920×1080)

## Layout Specifications

### Resolution
- **Target**: 1920 × 1080 pixels (Full HD Desktop)
- **Platform**: Electron Desktop Application

### Layout Dimensions
- **Sidebar Width**: 240px (fixed, left-aligned)
- **Topbar Height**: 64px (fixed, top-aligned)
- **Content Area**: 1680px wide × (1080px - 64px) height

### Structure
```
┌─────────────────────────────────────────────────────┐
│  Sidebar (240px)  │   Topbar (64px)                 │
│                   ├─────────────────────────────────┤
│                   │                                 │
│  - Logo/Brand     │                                 │
│  - Navigation     │      Content Area               │
│    Menu (9 items) │      (Scrollable)               │
│                   │      1680px × Variable          │
│  - Version Info   │                                 │
│                   │                                 │
└─────────────────────────────────────────────────────┘
```

## Components

### Sidebar (`/components/layout/Sidebar.tsx`)
- **Fixed Position**: Left side, full height
- **Components**:
  - Logo/Brand section (64px height to match topbar)
  - Navigation menu with 9 items
  - Version information footer
- **Navigation Items**:
  1. Dashboard (with LayoutDashboard icon)
  2. Sales & Billing (with ShoppingCart icon)
  3. Items & Inventory (with Package icon)
  4. Suppliers & GRN (with Truck icon)
  5. Customers (with Users icon)
  6. Reports & Analytics (with BarChart3 icon)
  7. User Management (with UserCog icon)
  8. Settings (with Settings icon)
  9. Sync Status (with RefreshCw icon)

### Topbar (`/components/layout/Topbar.tsx`)
- **Fixed Position**: Top, offset by sidebar width (240px)
- **Height**: 64px
- **Components** (left to right):
  - Page Title (dynamic based on active menu item)
  - Global Search Bar (max-width: 600px, centered)
  - Theme Toggle Button (Light/Dark mode)
  - Notification Icon (with badge indicator)
  - User Avatar with name and role

### App Shell (`/components/layout/AppShell.tsx`)
- Main layout wrapper component
- Manages theme state
- Handles navigation state
- Renders appropriate content based on active menu

### Content States
1. **Dashboard Demo** (`/components/pages/DashboardDemo.tsx`): Sample dashboard with KPI cards
2. **Empty Content State** (`/components/layout/EmptyContentState.tsx`): Placeholder for unimplemented pages
3. **Custom Children**: Accepts any React component as content

## Design System Integration

### Color Tokens Used
- `bg-sidebar` - Sidebar background
- `bg-surface` - Topbar and card backgrounds
- `bg-background` - Main content area background
- `bg-primary` - Active menu item, brand icon
- `border-sidebar-border` - Sidebar dividers
- `border-border` - General borders

### Typography Tokens
- **Headline M**: Page titles in topbar
- **Subtitle S**: Brand name in sidebar
- **Body M**: Menu item labels, search placeholder
- **Caption**: User role, version info
- **Overline**: Resolution indicator

### Spacing Tokens
- **spacing-6 (24px)**: Standard padding
- **spacing-3 (12px)**: Component gaps
- **spacing-2 (8px)**: Tight spacing
- **radius-md (8px)**: Menu items, buttons
- **radius-lg (12px)**: Cards, brand icon

## Features

### Theme Support
- ✅ Light mode (default)
- ✅ Dark mode
- ✅ Seamless theme switching
- ✅ All components respect theme tokens

### Responsiveness
- Fixed sidebar and topbar layout
- Scrollable content area
- Auto-layout principles applied
- Optimized for 1920×1080 desktop viewport

### Navigation
- Active state tracking
- Smooth transitions
- Hover states on all interactive elements
- Keyboard accessible

### Interactive Elements
- Search bar (functional input)
- Theme toggle button
- Notification indicator
- User profile dropdown trigger
- All menu items clickable

## File Structure
```
/components
  /layout
    - AppShell.tsx          (Main layout wrapper)
    - Sidebar.tsx           (Left navigation)
    - Topbar.tsx            (Top header)
    - EmptyContentState.tsx (Placeholder page)
    - LayoutSpecs.tsx       (Documentation view)
  /pages
    - DashboardDemo.tsx     (Sample dashboard)
```

## Usage

### Basic Usage
```tsx
import { AppShell } from './components/layout/AppShell';

function App() {
  return <AppShell />;
}
```

### With Custom Content
```tsx
import { AppShell } from './components/layout/AppShell';
import { MyCustomPage } from './pages/MyCustomPage';

function App() {
  return (
    <AppShell>
      <MyCustomPage />
    </AppShell>
  );
}
```

## Next Steps

To build out individual pages:

1. Create page components in `/components/pages/`
2. Import and use in AppShell
3. Add routing logic if needed
4. Each page will automatically:
   - Have access to theme state
   - Be properly positioned in content area
   - Be scrollable if content exceeds viewport
   - Use design system tokens

## Design Credits

Built using the Modern Minimalist Design System:
- Clean typography with Inter font family
- Teal accent colors (#0d9488 light, #14b8a6 dark)
- Neutral gray palette (50-950)
- Consistent spacing scale (4px base)
- Modern border radius (6-16px range)
