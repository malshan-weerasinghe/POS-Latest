import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { toast } from 'sonner@2.0.3';
import { 
  Search, Plus, Download, Upload, Trash2, Edit2, Eye, Check, X,
  TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package,
  Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Moon, Sun, ArrowRight
} from 'lucide-react';
import { cn } from '../ui/utils';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AppContext } from '../../App';

const ComponentSection: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ 
  title, 
  description, 
  children 
}) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-foreground border-b border-border pb-2" style={{
        fontSize: 'var(--text-headline-l)',
        fontWeight: 'var(--font-weight-semibold)',
        lineHeight: 'var(--line-height-tight)'
      }}>
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground mt-2" style={{
          fontSize: 'var(--text-body-m)',
          lineHeight: 'var(--line-height-normal)'
        }}>
          {description}
        </p>
      )}
    </div>
    {children}
  </div>
);

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <pre className="bg-muted p-4 rounded-lg overflow-x-auto border border-border">
    <code className="text-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
      {code}
    </code>
  </pre>
);

export const ComponentLibraryPage: React.FC = () => {
  const { theme, toggleTheme, navigateTo } = React.useContext(AppContext);
  const [date, setDate] = useState<Date>();
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState('');

  // Mock data for examples
  const chartData = [
    { name: 'Mon', sales: 4000, profit: 2400 },
    { name: 'Tue', sales: 3000, profit: 1398 },
    { name: 'Wed', sales: 2000, profit: 9800 },
    { name: 'Thu', sales: 2780, profit: 3908 },
    { name: 'Fri', sales: 1890, profit: 4800 },
    { name: 'Sat', sales: 2390, profit: 3800 },
    { name: 'Sun', sales: 3490, profit: 4300 },
  ];

  const pieData = [
    { name: 'Electronics', value: 400, color: 'var(--primary)' },
    { name: 'Groceries', value: 300, color: 'var(--accent)' },
    { name: 'Clothing', value: 200, color: 'var(--muted)' },
    { name: 'Other', value: 100, color: 'var(--muted-foreground)' },
  ];

  const frameworks = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-surface sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground" style={{
                fontSize: 'var(--text-display-s)',
                fontWeight: 'var(--font-weight-bold)',
                lineHeight: 'var(--line-height-tight)'
              }}>
                03 – Component Library
              </h1>
              <p className="text-muted-foreground mt-2" style={{
                fontSize: 'var(--text-body-l)',
                lineHeight: 'var(--line-height-normal)'
              }}>
                Production-ready UI components for Modern Minimalist POS
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme} title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}>
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Button variant="outline" onClick={() => navigateTo('index')}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Package
              </Button>
              <Button onClick={() => navigateTo('dashboard')}>
                View App Demo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12 space-y-16">
        
        {/* Buttons */}
        <ComponentSection 
          title="Buttons"
          description="Button components in multiple variants and sizes for various use cases."
        >
          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
              <CardDescription>All available button variants with icons and states</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Primary Actions</Label>
                <div className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    With Icon
                  </Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Secondary Actions</Label>
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="secondary">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="secondary" disabled>Disabled</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Outline Buttons</Label>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">Outline</Button>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button variant="outline" disabled>Disabled</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Ghost Buttons</Label>
                <div className="flex flex-wrap gap-3">
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="ghost">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="ghost" disabled>Disabled</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Destructive Actions</Label>
                <div className="flex flex-wrap gap-3">
                  <Button variant="destructive">Delete</Button>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                  <Button variant="destructive" disabled>Disabled</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Sizes</Label>
                <div className="flex items-center flex-wrap gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 border-t pt-6">
              <Label>Usage</Label>
              <CodeBlock code={`<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="icon"><Icon /></Button>`} />
            </CardFooter>
          </Card>
        </ComponentSection>

        {/* Inputs */}
        <ComponentSection 
          title="Form Inputs"
          description="Input fields, text areas, and form controls with various states."
        >
          <Card>
            <CardHeader>
              <CardTitle>Input Types</CardTitle>
              <CardDescription>Text inputs, search, password, and more</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="text-input">Text Input</Label>
                  <Input id="text-input" placeholder="Enter text..." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-input">Email Input</Label>
                  <Input id="email-input" type="email" placeholder="email@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-input">Password Input</Label>
                  <Input id="password-input" type="password" placeholder="••••••••" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number-input">Number Input</Label>
                  <Input id="number-input" type="number" placeholder="0" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search-input">Search Input</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="search-input" className="pl-10" placeholder="Search..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disabled-input">Disabled Input</Label>
                  <Input id="disabled-input" disabled placeholder="Disabled" />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="textarea">Textarea</Label>
                <Textarea id="textarea" placeholder="Enter multiple lines of text..." rows={4} />
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 border-t pt-6">
              <Label>Usage</Label>
              <CodeBlock code={`<Input placeholder="Text..." />
<Input type="email" placeholder="email@example.com" />
<Input type="password" placeholder="••••••••" />
<Textarea rows={4} placeholder="Long text..." />`} />
            </CardFooter>
          </Card>
        </ComponentSection>

        {/* Selects & Dropdowns */}
        <ComponentSection 
          title="Selects & Dropdowns"
          description="Dropdown menus, select components, and searchable comboboxes."
        >
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Dropdown</CardTitle>
                <CardDescription>Standard select component</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="groceries">Groceries</SelectItem>
                      <SelectItem value="clothing">Clothing</SelectItem>
                      <SelectItem value="furniture">Furniture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-4 border-t">
                <CodeBlock code={`<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>`} />
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Searchable Combobox</CardTitle>
                <CardDescription>Filterable dropdown with search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Framework</Label>
                  <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={searchOpen}
                        className="w-full justify-between"
                      >
                        {selectedFramework
                          ? frameworks.find((f) => f.value === selectedFramework)?.label
                          : "Select framework..."}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search framework..." />
                        <CommandList>
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {frameworks.map((framework) => (
                              <CommandItem
                                key={framework.value}
                                value={framework.value}
                                onSelect={(currentValue) => {
                                  setSelectedFramework(currentValue === selectedFramework ? "" : currentValue);
                                  setSearchOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedFramework === framework.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {framework.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-4 border-t">
                <CodeBlock code={`<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandItem>Option 1</CommandItem>
  </CommandList>
</Command>`} />
              </CardFooter>
            </Card>
          </div>
        </ComponentSection>

        {/* Form Controls */}
        <ComponentSection 
          title="Form Controls"
          description="Checkboxes, radio buttons, switches, and sliders."
        >
          <Card>
            <CardHeader>
              <CardTitle>Interactive Controls</CardTitle>
              <CardDescription>Various form control components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <Label>Checkboxes</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="check1" defaultChecked />
                    <Label htmlFor="check1" className="cursor-pointer">Checked by default</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="check2" />
                    <Label htmlFor="check2" className="cursor-pointer">Unchecked</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="check3" disabled />
                    <Label htmlFor="check3" className="cursor-not-allowed opacity-50">Disabled</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Radio Group</Label>
                <RadioGroup defaultValue="option1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option1" id="radio1" />
                    <Label htmlFor="radio1" className="cursor-pointer">Option 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option2" id="radio2" />
                    <Label htmlFor="radio2" className="cursor-pointer">Option 2</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option3" id="radio3" />
                    <Label htmlFor="radio3" className="cursor-pointer">Option 3</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Switches</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="switch1">Enable notifications</Label>
                    <Switch id="switch1" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="switch2">Dark mode</Label>
                    <Switch id="switch2" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="switch3" className="opacity-50">Disabled switch</Label>
                    <Switch id="switch3" disabled />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Slider</Label>
                <Slider defaultValue={[33]} max={100} step={1} />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Progress Bar</Label>
                <Progress value={66} />
              </div>
            </CardContent>
          </Card>
        </ComponentSection>

        {/* Tables */}
        <ComponentSection 
          title="Tables"
          description="Data tables with sorting, pagination, and row actions."
        >
          <Card>
            <CardHeader>
              <CardTitle>Data Table Example</CardTitle>
              <CardDescription>Responsive table with status badges and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">#001</TableCell>
                      <TableCell>Premium Rice 5kg</TableCell>
                      <TableCell>Groceries</TableCell>
                      <TableCell>₹400.00</TableCell>
                      <TableCell>150</TableCell>
                      <TableCell>
                        <Badge variant="default">In Stock</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#002</TableCell>
                      <TableCell>Wireless Mouse</TableCell>
                      <TableCell>Electronics</TableCell>
                      <TableCell>₹599.00</TableCell>
                      <TableCell>8</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Low Stock</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">#003</TableCell>
                      <TableCell>Cotton T-Shirt</TableCell>
                      <TableCell>Clothing</TableCell>
                      <TableCell>₹299.00</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Out of Stock</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 border-t pt-6">
              <CodeBlock code={`<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>`} />
            </CardFooter>
          </Card>
        </ComponentSection>

        {/* Cards */}
        <ComponentSection 
          title="Cards"
          description="Card components for organizing content and data."
        >
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>Basic card with header and content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This is a simple card component with a header, description, and content area.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Footer</CardTitle>
                <CardDescription>Includes action buttons</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cards can have footers for actions or additional information.
                </p>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button className="w-full">Action</Button>
              </CardFooter>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Highlighted Card</CardTitle>
                <CardDescription>With custom border color</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Use border colors to highlight important cards.
                </p>
              </CardContent>
            </Card>
          </div>
        </ComponentSection>

        {/* KPI Tiles */}
        <ComponentSection 
          title="KPI Tiles"
          description="Key Performance Indicator tiles for dashboards."
        >
          <div className="grid grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                      Total Sales
                    </p>
                    <p className="text-foreground" style={{ 
                      fontSize: 'var(--text-headline-l)',
                      fontWeight: 'var(--font-weight-bold)'
                    }}>
                      ₹45,231
                    </p>
                    <div className="flex items-center gap-1 text-[#10b981]">
                      <TrendingUp className="h-3 w-3" />
                      <span style={{ fontSize: 'var(--text-body-s)' }}>+12.5%</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                      Orders
                    </p>
                    <p className="text-foreground" style={{ 
                      fontSize: 'var(--text-headline-l)',
                      fontWeight: 'var(--font-weight-bold)'
                    }}>
                      1,234
                    </p>
                    <div className="flex items-center gap-1 text-[#10b981]">
                      <TrendingUp className="h-3 w-3" />
                      <span style={{ fontSize: 'var(--text-body-s)' }}>+8.2%</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                      Customers
                    </p>
                    <p className="text-foreground" style={{ 
                      fontSize: 'var(--text-headline-l)',
                      fontWeight: 'var(--font-weight-bold)'
                    }}>
                      892
                    </p>
                    <div className="flex items-center gap-1 text-[#ef4444]">
                      <TrendingDown className="h-3 w-3" />
                      <span style={{ fontSize: 'var(--text-body-s)' }}>-2.1%</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                      Products
                    </p>
                    <p className="text-foreground" style={{ 
                      fontSize: 'var(--text-headline-l)',
                      fontWeight: 'var(--font-weight-bold)'
                    }}>
                      567
                    </p>
                    <div className="flex items-center gap-1 text-[#10b981]">
                      <TrendingUp className="h-3 w-3" />
                      <span style={{ fontSize: 'var(--text-body-s)' }}>+5.4%</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ComponentSection>

        {/* Badges */}
        <ComponentSection 
          title="Badges"
          description="Status indicators and labels."
        >
          <Card>
            <CardHeader>
              <CardTitle>Badge Variants</CardTitle>
              <CardDescription>Different styles for different contexts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-[#10b981] hover:bg-[#059669]">Success</Badge>
                <Badge className="bg-[#f59e0b] hover:bg-[#d97706]">Warning</Badge>
                <Badge className="bg-[#3b82f6] hover:bg-[#2563eb]">Info</Badge>
              </div>
            </CardContent>
          </Card>
        </ComponentSection>

        {/* Toast Notifications */}
        <ComponentSection 
          title="Toast Notifications"
          description="Temporary notification messages."
        >
          <Card>
            <CardHeader>
              <CardTitle>Toast Types</CardTitle>
              <CardDescription>Click to trigger different toast notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => toast.success('Success!', { description: 'Your action was successful.' })}>
                  Success Toast
                </Button>
                <Button variant="secondary" onClick={() => toast.error('Error!', { description: 'Something went wrong.' })}>
                  Error Toast
                </Button>
                <Button variant="outline" onClick={() => toast.info('Info', { description: 'Here is some information.' })}>
                  Info Toast
                </Button>
                <Button variant="outline" onClick={() => toast.warning('Warning', { description: 'Please be careful.' })}>
                  Warning Toast
                </Button>
                <Button variant="outline" onClick={() => toast('Default', { description: 'Basic notification.' })}>
                  Default Toast
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 border-t pt-6">
              <CodeBlock code={`import { toast } from 'sonner';

toast.success('Success!', { description: 'Message' });
toast.error('Error!', { description: 'Message' });
toast.info('Info', { description: 'Message' });
toast.warning('Warning', { description: 'Message' });`} />
            </CardFooter>
          </Card>
        </ComponentSection>

        {/* Tabs */}
        <ComponentSection 
          title="Tabs"
          description="Organize content into tabbed interfaces."
        >
          <Card>
            <CardHeader>
              <CardTitle>Tab Component</CardTitle>
              <CardDescription>Navigate between different sections</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <p className="text-muted-foreground">Overview content goes here. This is the first tab.</p>
                </TabsContent>
                <TabsContent value="analytics" className="space-y-4 mt-4">
                  <p className="text-muted-foreground">Analytics content goes here. This is the second tab.</p>
                </TabsContent>
                <TabsContent value="reports" className="space-y-4 mt-4">
                  <p className="text-muted-foreground">Reports content goes here. This is the third tab.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </ComponentSection>

        {/* Breadcrumbs */}
        <ComponentSection 
          title="Breadcrumbs"
          description="Navigation trail showing current page location."
        >
          <Card>
            <CardHeader>
              <CardTitle>Breadcrumb Navigation</CardTitle>
              <CardDescription>Show hierarchical page structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Products</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Electronics</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Sales</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Orders</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Order #12345</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </CardContent>
          </Card>
        </ComponentSection>

        {/* Pagination */}
        <ComponentSection 
          title="Pagination"
          description="Navigate through multi-page content."
        >
          <Card>
            <CardHeader>
              <CardTitle>Pagination Component</CardTitle>
              <CardDescription>For tables and list navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>
        </ComponentSection>

        {/* Date Picker */}
        <ComponentSection 
          title="Date Picker"
          description="Calendar-based date selection."
        >
          <Card>
            <CardHeader>
              <CardTitle>Calendar Component</CardTitle>
              <CardDescription>Select dates with a calendar popover</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pick a Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? date.toLocaleDateString() : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </ComponentSection>

        {/* Charts */}
        <ComponentSection 
          title="Charts"
          description="Data visualization with Recharts library."
        >
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Line Chart</CardTitle>
                <CardDescription>Trend visualization</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--popover)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={2} />
                    <Line type="monotone" dataKey="profit" stroke="var(--accent)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bar Chart</CardTitle>
                <CardDescription>Comparative data display</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--popover)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="sales" fill="var(--primary)" />
                    <Bar dataKey="profit" fill="var(--accent)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pie Chart</CardTitle>
                <CardDescription>Proportional data representation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={80}
                      fill="var(--primary)"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--popover)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </ComponentSection>

        {/* Modals */}
        <ComponentSection 
          title="Modal Templates"
          description="Dialog and modal window patterns."
        >
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Standard Dialog</CardTitle>
                <CardDescription>Basic modal with actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Action</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to proceed with this action? This cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Dialog</CardTitle>
                <CardDescription>Modal with form inputs</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open Form</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Item</DialogTitle>
                      <DialogDescription>
                        Enter the details for the new item below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Item name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="groceries">Groceries</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Item</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </ComponentSection>

        {/* Footer */}
        <div className="border-t border-border pt-12 pb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-foreground" style={{
                fontSize: 'var(--text-headline-m)',
                fontWeight: 'var(--font-weight-semibold)'
              }}>
                Modern Minimalist POS
              </h3>
              <p className="text-muted-foreground mt-1" style={{ fontSize: 'var(--text-body-m)' }}>
                Complete component library for production use
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => toast.info('Documentation', { description: 'Coming soon!' })}>
                View Docs
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Package
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
