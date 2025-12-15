# 🎯 Quick Reference Card - Design Tokens & Standards

> **Print this page or keep it open while coding for instant reference**

---

## 📏 Spacing Scale (8pt Grid)

```
┌─────────────────────────────────────────────────┐
│ 0px  ─                                          │
│ 4px  ─  spacing-1  (micro adjustments)         │
│ 8px  ─  spacing-2  (tight spacing)    ★ BASE   │
│ 12px ─  spacing-3  (compact)                   │
│ 16px ─  spacing-4  (default gap)               │
│ 24px ─  spacing-6  (section gap)      ★ MAIN   │
│ 32px ─  spacing-8  (large gap)                 │
│ 48px ─  spacing-12 (extra large)               │
│ 64px ─  spacing-16 (page sections)             │
└─────────────────────────────────────────────────┘
```

### Common Usage:
```tsx
<div className="space-y-6">     /* 24px - Between sections */
<div className="gap-6">         /* 24px - KPI grids */
<div className="gap-4">         /* 16px - Filter grids */
<div className="space-y-4">     /* 16px - Form rows */
<div className="space-y-2">     /* 8px - Label to input */
<div className="p-6">           /* 24px - Card padding */
```

---

## 🔤 Typography

```
┌──────────────────────────────────────────────────────────┐
│ Display L   40px  Bold      Large dashboard titles       │
│ Display M   32px  Bold      Medium page titles           │
│ Display S   24px  Bold      Small page titles   ★ MAIN   │
│ Headline M  24px  Semibold  Section headers              │
│ Subtitle S  16px  Semibold  Card titles                  │
│ Body M      14px  Regular   Body text           ★ MAIN   │
│ Caption     12px  Regular   Metadata, hints              │
└──────────────────────────────────────────────────────────┘
```

### Tokens:
```tsx
/* Page Title */
fontSize: 'var(--text-display-s)'
fontWeight: 'var(--font-weight-bold)'
lineHeight: 'var(--line-height-tight)'

/* Section Header */
fontSize: 'var(--text-headline-m)'
fontWeight: 'var(--font-weight-semibold)'

/* Card Title */
fontSize: 'var(--text-subtitle-s)'
fontWeight: 'var(--font-weight-semibold)'

/* Body Text */
fontSize: 'var(--text-body-m)'
lineHeight: 'var(--line-height-normal)'

/* Caption/Meta */
fontSize: 'var(--text-caption)'
```

---

## 🎨 Icon Sizes

```
┌─────────────────────────────────────────┐
│ 12px  icon-xs   Rare use                │
│ 16px  icon-sm   Buttons, inline  ★      │
│ 20px  icon-md   Sidebar menu            │
│ 24px  icon-lg   KPI cards        ★      │
│ 32px  icon-xl   Empty states            │
│ 40px  icon-2xl  Hero sections           │
└─────────────────────────────────────────┘
```

### Tailwind Classes:
```tsx
<Icon className="h-4 w-4" />   /* 16px - Buttons */
<Icon className="h-5 w-5" />   /* 20px - Sidebar */
<Icon className="h-6 w-6" />   /* 24px - KPI cards */
<Icon className="h-8 w-8" />   /* 32px - Empty states */
```

### CSS Custom Properties:
```tsx
style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }}
style={{ width: 'var(--icon-md)', height: 'var(--icon-md)' }}
style={{ width: 'var(--icon-lg)', height: 'var(--icon-lg)' }}
```

---

## 🎨 Colors

### Semantic Colors (Always use these hex values):
```tsx
SUCCESS:  #10b981  /* Green - Positive, up trends */
WARNING:  #f59e0b  /* Orange - Attention, pending */
DANGER:   #ef4444  /* Red - Negative, errors */
INFO:     #3b82f6  /* Blue - Informational */
```

### Theme Tokens (Use var() for theme-aware):
```tsx
var(--color-primary)                /* Teal - Primary actions */
var(--color-foreground)             /* Text primary */
var(--color-muted-foreground)       /* Text secondary */
var(--color-background)             /* Page background */
var(--color-card)                   /* Card background */
var(--color-border)                 /* Borders */
```

### Tailwind Utilities:
```tsx
text-primary             /* Primary color */
text-foreground          /* Main text */
text-muted-foreground    /* Secondary text */
bg-background            /* Page background */
bg-card                  /* Card background */
border-border            /* Border color */
```

---

## 📐 Border Radius

```tsx
rounded-md   /* 8px - Buttons, inputs */
rounded-lg   /* 12px - Cards, modals */
rounded-full /* Circle - Avatars */
```

---

## 📦 Standard Components

### PageHeader
```tsx
import { PageHeader } from '@/components/layout/PageHeader';

<PageHeader
  title="Page Title"
  description="Optional description"
  actions={<Button>Action</Button>}
/>
```

### KPICard
```tsx
import { KPICard } from '@/components/ui/kpi-card';

<KPICard
  label="Metric Name"
  value="₹12,345"
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

### PageFilters
```tsx
import { PageFilters, FilterField } from '@/components/ui/page-filters';

<PageFilters>
  <FilterField>
    <Label>Filter Name</Label>
    <Select>...</Select>
  </FilterField>
</PageFilters>
```

### DataTable
```tsx
import { DataTable } from '@/components/ui/data-table';

<DataTable
  title="Table Title"
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'amount', label: 'Amount', align: 'right' },
  ]}
  data={items}
  pagination={{...}}
/>
```

---

## 📱 Layout Patterns

### Page Structure
```tsx
<div className="space-y-6">              /* 24px gaps */
  <PageHeader ... />
  
  <div className="grid grid-cols-4 gap-6">  /* KPIs */
    <KPICard ... />
  </div>
  
  <PageFilters>...</PageFilters>
  
  <Card>...</Card>                       /* Main content */
</div>
```

### Form Layout
```tsx
<div className="space-y-4 py-4">        /* Modal content */
  <div className="grid grid-cols-2 gap-4">  /* 2-column form */
    <div className="space-y-2">         /* Field wrapper */
      <Label>Field Name</Label>
      <Input />
    </div>
  </div>
</div>
```

### Table Layout
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="border rounded-lg">  /* Wrapped table */
      <Table>...</Table>
    </div>
    <div className="mt-4">              /* Pagination */
      ...
    </div>
  </CardContent>
</Card>
```

---

## ✅ Quick Checklist

Before pushing code, verify:

- [ ] Main container uses `space-y-6` (24px)
- [ ] KPI grids use `gap-6` (24px)
- [ ] Filter grids use `gap-4` (16px)
- [ ] Icons are `h-4 w-4` (buttons) or `h-6 w-6` (KPIs)
- [ ] Typography uses `var(--text-*)` tokens
- [ ] Colors use `var(--color-*)` or semantic hex (#10b981)
- [ ] Tables have `border rounded-lg` wrapper
- [ ] Numbers are `text-right` aligned
- [ ] PageHeader component used for page title
- [ ] Tested in both light and dark mode

---

## 🔍 Common Patterns

### Button with Icon
```tsx
<Button>
  <Plus className="h-4 w-4 mr-2" />
  Add Item
</Button>
```

### Search Input
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
  <Input className="pl-10" placeholder="Search..." />
</div>
```

### Status Badge
```tsx
<Badge variant="default">Active</Badge>
<Badge variant="secondary">Pending</Badge>
<Badge variant="destructive">Inactive</Badge>
<Badge variant="outline">Draft</Badge>
```

### KPI Trend
```tsx
<div className="flex items-center gap-1 text-[#10b981]">
  <TrendingUp className="h-3 w-3" />
  <span style={{ fontSize: 'var(--text-body-s)' }}>+12.5%</span>
</div>
```

### Modal Structure
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-4">
      {/* Content */}
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Submit</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 🎯 Golden Rules

1. **Spacing:** Always use 8pt multiples (8px, 16px, 24px)
2. **Icons:** 16px in buttons, 24px in cards
3. **Typography:** Use design tokens, not hardcoded sizes
4. **Colors:** Use theme tokens for light/dark support
5. **Alignment:** Text left, numbers right
6. **Components:** Use standard components (PageHeader, KPICard)
7. **Testing:** Always test in both themes

---

## 📚 Documentation Links

- **Complete Guide:** `/OPTIMIZATION_GUIDE.md`
- **Example Code:** `/OPTIMIZATION_EXAMPLE.tsx`
- **Full Checklist:** `/OPTIMIZATION_CHECKLIST.md`
- **Design Tokens:** `/styles/globals.css`

---

## 💡 Pro Tips

### Find & Replace Quick Wins:
```
space-y-4  →  space-y-6   (section spacing)
gap-4      →  gap-6       (KPI grids only)
h-5 w-5    →  h-4 w-4     (button icons)
text-gray-500 → text-muted-foreground
```

### Copy-Paste Snippets:

**Page Container:**
```tsx
<div className="space-y-6">
```

**KPI Grid:**
```tsx
<div className="grid grid-cols-4 gap-6">
```

**Filter Grid:**
```tsx
<div className="grid grid-cols-4 gap-4">
```

**Form Grid:**
```tsx
<div className="grid grid-cols-2 gap-4">
```

**Field Wrapper:**
```tsx
<div className="space-y-2">
  <Label>Label</Label>
  <Input />
</div>
```

---

**Print this page and keep it handy! 📄**

*All measurements in 8pt grid • All colors theme-aware • All components reusable*
