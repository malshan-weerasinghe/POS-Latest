import React, { useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { AppContext } from '../../App';
import { Palette, Code, Layout, Moon, Sun, ArrowRight } from 'lucide-react';

export const IndexPage: React.FC = () => {
  const { navigateTo, theme, toggleTheme } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-surface">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-foreground" style={{
                fontSize: 'var(--text-display-m)',
                fontWeight: 'var(--font-weight-bold)',
                lineHeight: 'var(--line-height-tight)'
              }}>
                Modern Minimalist POS
              </h1>
              <p className="text-muted-foreground mt-2" style={{
                fontSize: 'var(--text-body-l)',
                lineHeight: 'var(--line-height-normal)'
              }}>
                Complete design system and application framework
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-3 gap-8">
          {/* Component Library */}
          <Card className="border-primary hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>03 – Component Library</CardTitle>
              <CardDescription>
                Complete, production-ready UI components with code examples and documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                <li>✓ 40+ React Components</li>
                <li>✓ Buttons, Inputs, Forms</li>
                <li>✓ Tables, Cards, Charts</li>
                <li>✓ Modals, Toasts, Tabs</li>
                <li>✓ Date Pickers, Pagination</li>
                <li>✓ Searchable Dropdowns</li>
                <li>✓ Code Examples</li>
                <li>✓ Ready to Export</li>
              </ul>
              <Button className="w-full" onClick={() => navigateTo('component-library')}>
                View Components
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Application Demo */}
          <Card className="border-accent hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Layout className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>POS Application</CardTitle>
              <CardDescription>
                Fully functional point-of-sale system with 20+ connected pages and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                <li>✓ Sales & Billing</li>
                <li>✓ Inventory Management</li>
                <li>✓ Customer Management</li>
                <li>✓ Supplier & GRN</li>
                <li>✓ Reports & Analytics</li>
                <li>✓ User Management</li>
                <li>✓ Full Navigation</li>
                <li>✓ Theme Switching</li>
              </ul>
              <Button className="w-full" onClick={() => navigateTo('dashboard')}>
                Launch App
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Design System */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-foreground" />
              </div>
              <CardTitle>01 – Design System</CardTitle>
              <CardDescription>
                Design tokens, typography scales, color palettes, and spacing guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                <li>✓ Light & Dark Themes</li>
                <li>✓ Color Tokens (50-950)</li>
                <li>✓ Typography Scale</li>
                <li>✓ Spacing System (4-64px)</li>
                <li>✓ Border Radius</li>
                <li>✓ Semantic Colors</li>
                <li>✓ Component Showcase</li>
                <li>✓ Design Tokens</li>
              </ul>
              <Button className="w-full" variant="outline">
                View Design Tokens
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mt-16 pt-16 border-t border-border">
          <h2 className="text-foreground mb-8" style={{
            fontSize: 'var(--text-headline-l)',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--line-height-tight)'
          }}>
            What's Included
          </h2>

          <div className="grid grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>🎨 Design System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Design Tokens</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Light/Dark Theme</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Typography Scale</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Color Palette (Neutral + Teal)</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Spacing & Radius Tokens</span>
                  <span className="font-medium">✓</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🧩 Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Buttons (5 variants)</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Form Inputs & Controls</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tables with Pagination</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cards & KPI Tiles</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Charts (Line, Bar, Pie)</span>
                  <span className="font-medium">✓</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🏗️ Layout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">App Shell (Sidebar + Topbar)</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Navigation System</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Breadcrumbs</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Page Templates</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Responsive Grid System</span>
                  <span className="font-medium">✓</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⚡ Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">20+ Full Pages</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Interactive Modals</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Toast Notifications</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Form Validation Ready</span>
                  <span className="font-medium">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Complete Navigation Flow</span>
                  <span className="font-medium">✓</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-16 pt-16 border-t border-border">
          <h2 className="text-foreground mb-8" style={{
            fontSize: 'var(--text-headline-l)',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--line-height-tight)'
          }}>
            Tech Stack
          </h2>

          <div className="grid grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="font-medium">React 18</p>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  UI Framework
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="font-medium">TypeScript</p>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Type Safety
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="font-medium">Tailwind CSS v4</p>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Styling
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="font-medium">Radix UI</p>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Primitives
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mt-16 pt-16 border-t border-border">
          <Card className="bg-primary/5 border-primary">
            <CardHeader>
              <CardTitle>🚀 Quick Start</CardTitle>
              <CardDescription>Get started in minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="space-y-3 list-decimal list-inside">
                <li className="text-foreground">
                  <strong>Explore Components</strong>
                  <p className="text-muted-foreground ml-6" style={{ fontSize: 'var(--text-body-s)' }}>
                    Browse the component library to see all available UI elements
                  </p>
                </li>
                <li className="text-foreground">
                  <strong>Check the App Demo</strong>
                  <p className="text-muted-foreground ml-6" style={{ fontSize: 'var(--text-body-s)' }}>
                    See how components work together in a full application
                  </p>
                </li>
                <li className="text-foreground">
                  <strong>Copy & Customize</strong>
                  <p className="text-muted-foreground ml-6" style={{ fontSize: 'var(--text-body-s)' }}>
                    Use the code examples and adapt them to your needs
                  </p>
                </li>
              </ol>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => navigateTo('component-library')}>
                  View Component Library
                </Button>
                <Button variant="outline" onClick={() => navigateTo('dashboard')}>
                  Launch Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
