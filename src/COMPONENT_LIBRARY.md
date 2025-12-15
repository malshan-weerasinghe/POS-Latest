# Modern Minimalist POS - Component Library

A complete, production-ready UI component library for building Point of Sale applications with React, TypeScript, and Tailwind CSS.

## 🎨 Design System

### Theme Support
- **Light Mode** - Clean, minimal interface with subtle shadows
- **Dark Mode** - Comfortable low-light experience with softer depth

### Color Palette
- **Neutral Grays**: 50-950 scale for backgrounds and text
- **Teal Accent**: Primary brand color with semantic variants
- **Semantic Colors**: Success, Warning, Error, Info states

### Typography
- **Font**: Inter / SF Pro
- **Scale**: Display, Headline, Subtitle, Body, Caption, Overline
- **Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

### Spacing & Layout
- **Scale**: 4px base unit (4, 8, 12, 16, 24, 32, 48, 64)
- **Border Radius**: 4px, 8px, 12px, 16px
- **Screen**: Optimized for 1920×1080 desktop

## 📦 Components

### Buttons
```tsx
import { Button } from './components/ui/button';

<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

**Variants**: `default`, `secondary`, `outline`, `ghost`, `destructive`  
**Sizes**: `sm`, `default`, `lg`, `icon`

### Form Inputs
```tsx
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="email@example.com" />
<Textarea rows={4} placeholder="Description..." />
```

**Types**: text, email, password, number, search, tel, url

### Select & Dropdown
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Searchable Combobox
```tsx
import { Command, CommandInput, CommandList, CommandItem } from './components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Select...</Button>
  </PopoverTrigger>
  <PopoverContent>
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandItem>Item 1</CommandItem>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```

### Form Controls
```tsx
import { Checkbox } from './components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
import { Switch } from './components/ui/switch';
import { Slider } from './components/ui/slider';

<Checkbox id="terms" />
<RadioGroup defaultValue="option1">
  <RadioGroupItem value="option1" id="r1" />
</RadioGroup>
<Switch id="notifications" />
<Slider defaultValue={[50]} max={100} step={1} />
```

### Tables
```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item 1</TableCell>
      <TableCell><Badge>Active</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Cards
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### KPI Tiles
```tsx
<Card>
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-muted-foreground">Total Sales</p>
        <p className="text-foreground text-2xl font-bold">₹45,231</p>
        <div className="flex items-center gap-1 text-green-500">
          <TrendingUp className="h-3 w-3" />
          <span>+12.5%</span>
        </div>
      </div>
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <DollarSign className="h-6 w-6 text-primary" />
      </div>
    </div>
  </CardContent>
</Card>
```

### Badges
```tsx
import { Badge } from './components/ui/badge';

<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

### Toast Notifications
```tsx
import { toast } from 'sonner';

toast.success('Success!', { description: 'Operation completed' });
toast.error('Error!', { description: 'Something went wrong' });
toast.info('Info', { description: 'Information message' });
toast.warning('Warning', { description: 'Please be careful' });
```

### Tabs
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Breadcrumbs
```tsx
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './components/ui/breadcrumb';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Pagination
```tsx
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from './components/ui/pagination';

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

### Date Picker
```tsx
import { Calendar } from './components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { Button } from './components/ui/button';
import { CalendarIcon } from 'lucide-react';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? date.toLocaleDateString() : "Pick a date"}
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <Calendar mode="single" selected={date} onSelect={setDate} />
  </PopoverContent>
</Popover>
```

### Charts
```tsx
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="value" stroke="var(--primary)" />
  </LineChart>
</ResponsiveContainer>
```

### Dialogs/Modals
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from './components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <div>Modal content</div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## 🎯 Additional Components

- **Alert**: Information and warning messages
- **Avatar**: User profile pictures
- **Accordion**: Collapsible content sections
- **Popover**: Floating content containers
- **Tooltip**: Hover information
- **Progress**: Loading and progress indicators
- **Separator**: Visual content dividers
- **Skeleton**: Loading placeholders
- **Scroll Area**: Custom scrollbars

## 🚀 Usage

### Installation
```bash
# All components are self-contained in /components/ui/
# Copy the entire folder to your project
```

### Theming
```tsx
// Wrap your app with theme provider
<div className={theme}>
  <YourApp />
  <Toaster theme={theme} />
</div>
```

### Design Tokens
All design tokens are defined in `/styles/globals.css`:
- Colors: `--primary`, `--accent`, `--background`, etc.
- Typography: `--text-display-l`, `--font-weight-bold`, etc.
- Spacing: Use Tailwind's default scale
- Radius: `--radius` variable

## 📱 Responsive Design
Components are optimized for desktop (1920×1080) but include responsive variants:
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Mobile-first approach where applicable

## ♿ Accessibility
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly

## 🎨 Customization

### Colors
Modify CSS variables in `/styles/globals.css`:
```css
:root {
  --primary: 14 92% 45%;
  --accent: 174 72% 56%;
  /* ... */
}
```

### Typography
Update font family and sizes in globals.css:
```css
:root {
  --text-display-l: 3rem;
  --font-weight-bold: 700;
  /* ... */
}
```

## 📄 License
Components are based on shadcn/ui and Radix UI primitives.
Free to use for commercial and personal projects.

## 🤝 Contributing
This is a complete design system ready for production use.
Feel free to customize and extend based on your needs.

---

**Built for**: Modern Minimalist POS Application  
**Version**: 1.0.0  
**Screen**: 1920×1080 Desktop  
**Stack**: React + TypeScript + Tailwind CSS v4
