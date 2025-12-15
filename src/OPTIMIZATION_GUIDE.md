# UI Optimization Guide - Production Grade Standards

## 8pt Grid System

All spacing, sizing, and layout dimensions follow an 8pt grid system for visual consistency.

### Base Unit
- **1 unit = 8px**
- All spacing should be multiples of 8px (or 4px for micro-adjustments)

### Spacing Tokens

```css
--spacing-0: 0px      /* No spacing */
--spacing-1: 4px      /* 0.5 units - Micro spacing */
--spacing-2: 8px      /* 1 unit - Tight spacing */
--spacing-3: 12px     /* 1.5 units - Compact */
--spacing-4: 16px     /* 2 units - Default gap */
--spacing-6: 24px     /* 3 units - Section spacing */
--spacing-8: 32px     /* 4 units - Large gap */
--spacing-12: 48px    /* 6 units - Extra large */
--spacing-16: 64px    /* 8 units - Page sections */
```

### Component Spacing Standards

```css
--page-padding: 24px      /* Padding around page content */
--section-gap: 24px       /* Gap between major sections */
--card-padding: 24px      /* Card internal padding */
--table-padding-y: 12px   /* Table cell vertical */
--table-padding-x: 16px   /* Table cell horizontal */
```

---

## Typography System

### Page Titles
```tsx
// Large pages (Dashboard, Analytics)
fontSize: 'var(--text-display-l)'  // 40px
fontWeight: 'var(--font-weight-bold)'
lineHeight: 'var(--line-height-tight)'

// Medium pages (Most pages)
fontSize: 'var(--text-display-m)'  // 32px

// Small pages (Modals, Subpages)
fontSize: 'var(--text-display-s)'  // 24px
```

### Section Headers
```tsx
fontSize: 'var(--text-headline-m)'  // 24px
fontWeight: 'var(--font-weight-semibold)'
lineHeight: 'var(--line-height-tight)'
```

### Card Titles
```tsx
fontSize: 'var(--text-subtitle-s)'  // 16px
fontWeight: 'var(--font-weight-semibold)'
lineHeight: 'var(--line-height-normal)'
```

### Body Text
```tsx
// Default body
fontSize: 'var(--text-body-m)'  // 14px
lineHeight: 'var(--line-height-normal)'

// Large body
fontSize: 'var(--text-body-l)'  // 16px

// Small/Caption
fontSize: 'var(--text-caption)'  // 12px
```

### KPI Values
```tsx
fontSize: 'var(--text-headline-l)'  // 30px
fontWeight: 'var(--font-weight-bold)'
lineHeight: 'var(--line-height-tight)'
```

---

## Icon Sizes

### Standard Sizes (8pt aligned)

```tsx
// Extra small (rare use)
--icon-xs: 12px

// Small (table icons, inline icons)
--icon-sm: 16px
<Icon className="h-4 w-4" />

// Medium (default buttons, sidebar)
--icon-md: 20px
<Icon className="h-5 w-5" />

// Large (KPI cards, featured)
--icon-lg: 24px
<Icon className="h-6 w-6" />

// Extra large (empty states, hero)
--icon-xl: 32px
<Icon className="h-8 w-8" />
```

### Usage Guidelines

**Buttons:**
- Small buttons: `h-4 w-4` (16px)
- Default buttons: `h-4 w-4` (16px)
- Large buttons: `h-5 w-5` (20px)

**Sidebar:**
- Menu icons: `h-5 w-5` (20px)

**Tables:**
- Action icons: `h-4 w-4` (16px)

**KPI Cards:**
- Main icon: `h-6 w-6` (24px)

**Empty States:**
- Hero icon: `h-8 w-8` or larger (32px+)

---

## Layout Standards

### Page Structure

```tsx
<div className="space-y-6">  {/* 24px between all sections */}
  {/* Page Header */}
  <PageHeader 
    title="Page Title"
    description="Page description"
    actions={<>...</>}
  />
  
  {/* KPI Section */}
  <div className="grid grid-cols-4 gap-6">
    <KPICard {...} />
  </div>
  
  {/* Filters */}
  <PageFilters>
    <FilterField>...</FilterField>
  </PageFilters>
  
  {/* Main Content */}
  <Card>...</Card>
</div>
```

### Grid Layouts

**KPI Cards:**
```tsx
<div className="grid grid-cols-4 gap-6">
  {/* 4 columns, 24px gap */}
</div>
```

**Filters:**
```tsx
<div className="grid grid-cols-4 gap-4">
  {/* 4 columns, 16px gap */}
</div>
```

**Form Fields:**
```tsx
<div className="grid grid-cols-2 gap-4">
  {/* 2 columns, 16px gap */}
</div>
```

### Card Spacing

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content with built-in 24px padding */}
  </CardContent>
</Card>
```

---

## Table Optimization

### Standard Table Layout

```tsx
<div className="border rounded-lg">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Column</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Content</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>
```

### Table Cell Spacing

**Vertical Padding:** 12px (spacing-3)
**Horizontal Padding:** 16px (spacing-4)

```tsx
/* In table.tsx component */
td, th {
  padding: 0.75rem 1rem;  /* 12px 16px */
}
```

### Table Typography

**Header:**
```tsx
fontSize: 'var(--text-body-m)'  // 14px
fontWeight: 'var(--font-weight-semibold)'
```

**Body:**
```tsx
fontSize: 'var(--text-body-m)'  // 14px
fontWeight: 'var(--font-weight-regular)'
lineHeight: 'var(--line-height-normal)'
```

**Metadata (dates, secondary info):**
```tsx
fontSize: 'var(--text-body-s)'  // 13px
color: 'var(--color-muted-foreground)'
```

---

## Color System

### Semantic Colors

```tsx
// Success (green)
--success-light: #10b981
Use for: Positive trends, confirmations, success states

// Warning (orange)
--warning-light: #f59e0b
Use for: Warnings, pending states, attention needed

// Danger (red)
--danger-light: #ef4444
Use for: Errors, negative trends, destructive actions

// Info (blue)
--info-light: #3b82f6
Use for: Informational messages, neutral highlights
```

### Usage in Components

```tsx
// KPI Card - Positive
<div className="text-[#10b981]">
  <TrendingUp className="h-3 w-3" />
  <span>+12.5%</span>
</div>

// KPI Card - Negative
<div className="text-[#ef4444]">
  <TrendingDown className="h-3 w-3" />
  <span>-5.2%</span>
</div>

// Badge - Status
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Inactive</Badge>
<Badge variant="outline">Draft</Badge>
```

---

## Component Standards

### Page Header Component

```tsx
import { PageHeader } from '@/components/layout/PageHeader';

<PageHeader
  title="Dashboard"
  description="Overview of your business performance"
  actions={
    <>
      <Button variant="outline">Export</Button>
      <Button>Create New</Button>
    </>
  }
/>
```

### KPI Card Component

```tsx
import { KPICard } from '@/components/ui/kpi-card';
import { DollarSign } from 'lucide-react';

<KPICard
  label="Total Revenue"
  value="₹45,230"
  icon={DollarSign}
  iconColor="var(--color-primary)"
  iconBgColor="var(--color-primary)"
  trend={{
    value: "+12.5%",
    direction: "up",
    color: "#10b981"
  }}
/>
```

### Page Filters Component

```tsx
import { PageFilters, FilterField } from '@/components/ui/page-filters';

<PageFilters>
  <FilterField>
    <Label>Status</Label>
    <Select>...</Select>
  </FilterField>
  <FilterField>
    <Label>Date Range</Label>
    <Input type="date" />
  </FilterField>
  <FilterField>
    <Label>Search</Label>
    <Input placeholder="Search..." />
  </FilterField>
</PageFilters>
```

---

## Border Radius Standards

```tsx
// Buttons, inputs, badges
--radius-md: 8px

// Cards, modals
--radius-lg: 12px

// Avatar, circular icons
--radius-full: 9999px
```

---

## Alignment Rules

### Text Alignment

**Page Title:**
- Left aligned
- Vertical alignment: `items-start`

**KPI Values:**
- Left aligned
- Numbers can be right-aligned in financial contexts

**Table Headers:**
- Text: Left aligned
- Numbers/Amounts: Right aligned (`text-right`)

**Table Cells:**
- Text: Left aligned
- Numbers/Amounts: Right aligned (`text-right`)
- Actions: Right aligned

### Icon Alignment

**With Text:**
```tsx
<div className="flex items-center gap-2">
  <Icon className="h-4 w-4" />
  <span>Label</span>
</div>
```

**In Cards:**
```tsx
<div className="flex items-center justify-between">
  <div>Content</div>
  <Icon className="h-6 w-6" />
</div>
```

---

## Modal/Dialog Standards

### Modal Spacing

```tsx
<DialogContent className="max-w-2xl">
  <DialogHeader>
    <DialogTitle>Modal Title</DialogTitle>
    <DialogDescription>Description</DialogDescription>
  </DialogHeader>
  
  {/* Content with space-y-4 (16px gaps) */}
  <div className="space-y-4 py-4">
    <div className="grid grid-cols-2 gap-4">
      {/* Form fields */}
    </div>
  </div>
  
  <DialogFooter>
    <Button variant="outline">Cancel</Button>
    <Button>Submit</Button>
  </DialogFooter>
</DialogContent>
```

### Form Field Spacing

```tsx
<div className="space-y-2">  {/* 8px gap */}
  <Label>Field Label</Label>
  <Input />
</div>
```

---

## Responsive Breakpoints

```tsx
// Mobile first approach
sm: 640px   // Small tablets
md: 768px   // Tablets
lg: 1024px  // Small laptops
xl: 1280px  // Desktop
2xl: 1536px // Large desktop
```

### Grid Responsiveness

```tsx
// 4 columns on desktop, 2 on tablet, 1 on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

---

## Button Standards

### Button Sizes

```tsx
// Small
<Button size="sm">Label</Button>
height: 32px, padding: 8px 12px

// Default
<Button>Label</Button>
height: 40px, padding: 10px 16px

// Large
<Button size="lg">Label</Button>
height: 48px, padding: 12px 24px
```

### Button with Icons

```tsx
// Icon left
<Button>
  <Plus className="h-4 w-4 mr-2" />
  Add New
</Button>

// Icon right
<Button>
  Export
  <Download className="h-4 w-4 ml-2" />
</Button>

// Icon only
<Button size="icon">
  <Settings className="h-4 w-4" />
</Button>
```

---

## Naming Conventions

### File Names
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Pages: `PascalCasePage.tsx`

### Component Names
```tsx
// Good
export const DashboardPage: React.FC = () => {}
export const UserTable: React.FC = () => {}
export const KPICard: React.FC = () => {}

// Avoid
export const Dashboard: React.FC = () => {}  // Not specific
export const Component1: React.FC = () => {}  // Not descriptive
```

### CSS Class Names
- Use Tailwind utilities
- Avoid custom classes unless necessary
- If custom, use kebab-case: `custom-component-name`

---

## Accessibility Standards

### Semantic HTML
```tsx
// Use semantic elements
<nav>, <header>, <main>, <article>, <section>, <aside>, <footer>

// Not just divs everywhere
<div className="nav">  // ❌
<nav>                  // ✅
```

### ARIA Labels
```tsx
<Button aria-label="Close dialog">
  <X className="h-4 w-4" />
</Button>

<Input 
  type="search" 
  placeholder="Search..."
  aria-label="Search items"
/>
```

### Focus States
All interactive elements must have visible focus states (handled by design system)

---

## Performance Optimization

### Code Splitting
```tsx
// Lazy load heavy components
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
```

### Memoization
```tsx
// Expensive calculations
const totalValue = useMemo(() => {
  return items.reduce((sum, item) => sum + item.value, 0);
}, [items]);

// Callback functions
const handleClick = useCallback(() => {
  // handler logic
}, [dependencies]);
```

---

## Checklist for Each Page

- [ ] Uses `PageHeader` component
- [ ] Spacing follows 8pt grid (space-y-6 for sections)
- [ ] Icons are consistent size (h-4 w-4 or h-5 w-5)
- [ ] Typography uses design tokens (no hardcoded sizes)
- [ ] KPI cards use standard component
- [ ] Filters use `PageFilters` component
- [ ] Tables have proper borders and spacing
- [ ] Colors use theme tokens (no hardcoded colors)
- [ ] All text is readable in both light/dark mode
- [ ] Buttons follow size/spacing standards
- [ ] Form fields have consistent spacing
- [ ] Modals use standard structure
- [ ] No inline styles (use design tokens)
- [ ] Responsive layout tested
- [ ] All interactive elements have focus states

---

## Migration Guide

### Converting Existing Pages

**Before:**
```tsx
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 700 }}>
        Dashboard
      </h1>
      <p className="text-gray-500 text-sm mt-2">
        Overview
      </p>
    </div>
    <button>Action</button>
  </div>
</div>
```

**After:**
```tsx
<div className="space-y-6">
  <PageHeader
    title="Dashboard"
    description="Overview"
    actions={<Button>Action</Button>}
  />
</div>
```

### Converting KPI Tiles

**Before:**
```tsx
<Card>
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-sm text-gray-500">Total Sales</p>
        <p className="text-3xl font-bold">₹45,230</p>
        <p className="text-xs text-green-600">+12.5%</p>
      </div>
      <DollarSign className="h-10 w-10 text-teal-600" />
    </div>
  </CardContent>
</Card>
```

**After:**
```tsx
<KPICard
  label="Total Sales"
  value="₹45,230"
  icon={DollarSign}
  iconColor="var(--color-primary)"
  iconBgColor="var(--color-primary)"
  trend={{
    value: "+12.5%",
    direction: "up",
    color: "#10b981"
  }}
/>
```

---

## Production Deployment Checklist

- [ ] All pages use consistent spacing (8pt grid)
- [ ] Typography tokens applied everywhere
- [ ] Icon sizes standardized
- [ ] Color system using theme tokens
- [ ] Dark mode tested on all pages
- [ ] Responsive design verified
- [ ] No console errors or warnings
- [ ] Accessibility tested (keyboard navigation, screen readers)
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Empty states designed
- [ ] Performance optimized (lazy loading, memoization)
- [ ] Code formatted and linted
- [ ] Components documented
- [ ] Design system exported

---

## Resources

### Design Tokens
- Location: `/styles/globals.css`
- Documentation: This file

### Standard Components
- `PageHeader`: `/components/layout/PageHeader.tsx`
- `KPICard`: `/components/ui/kpi-card.tsx`
- `PageFilters`: `/components/ui/page-filters.tsx`

### Example Pages (Optimized)
- Dashboard
- Sales & Billing
- Items List
- Supplier Ledger

### Tools
- Spacing inspector: Browser DevTools
- Color contrast checker: WCAG AA/AAA compliance
- Grid overlay: 8pt grid Chrome extension

---

## Summary

Production-grade UI requires:
1. **Consistency** - Same spacing, typography, colors everywhere
2. **System** - Design tokens, not magic numbers
3. **Accessibility** - Semantic HTML, ARIA labels, focus states
4. **Performance** - Optimized rendering, lazy loading
5. **Maintainability** - Reusable components, clear naming
6. **Responsive** - Works on all screen sizes
7. **Themeable** - Light/dark mode support
8. **Documentation** - Clear guidelines for developers

Follow this guide to ensure every page meets production standards.
