import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Ruler, Monitor, Layout, Palette } from 'lucide-react';

export const LayoutSpecs: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-foreground mb-2" style={{ 
          fontSize: 'var(--text-headline-m)',
          fontWeight: 'var(--font-weight-semibold)'
        }}>
          App Shell – Main Layout
        </h3>
        <p className="text-muted-foreground" style={{ 
          fontSize: 'var(--text-body-m)'
        }}>
          Modern Minimalist POS Application Layout for Electron Desktop
        </p>
      </div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground mb-1" style={{ fontSize: 'var(--text-caption)' }}>
                  Target Resolution
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-m)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  1920 × 1080
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Layout className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-muted-foreground mb-1" style={{ fontSize: 'var(--text-caption)' }}>
                  Sidebar Width
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-m)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  240px
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Ruler className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-muted-foreground mb-1" style={{ fontSize: 'var(--text-caption)' }}>
                  Topbar Height
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-m)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  64px
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Palette className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-muted-foreground mb-1" style={{ fontSize: 'var(--text-caption)' }}>
                  Theme Support
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-m)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  Light & Dark
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Layout Structure */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-foreground mb-4" style={{ 
            fontSize: 'var(--text-subtitle-s)',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            Layout Structure
          </h4>
          <div className="bg-muted/30 rounded-lg p-8 border-2 border-dashed border-border">
            <div className="flex gap-4 h-[400px]">
              {/* Sidebar Visual */}
              <div className="w-[180px] bg-sidebar border border-sidebar-border rounded-lg p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-sidebar-border">
                  <div className="h-6 w-6 rounded bg-sidebar-primary" />
                  <div className="text-xs font-medium text-sidebar-foreground">Logo</div>
                </div>
                <div className="space-y-2 flex-1">
                  {['Dashboard', 'Sales', 'Inventory', 'Suppliers', 'Customers', 'Reports', 'Users', 'Settings'].map((item, i) => (
                    <div 
                      key={item}
                      className={`h-8 rounded px-2 flex items-center text-xs ${
                        i === 0 ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-sidebar-accent/50 text-sidebar-foreground'
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Area Visual */}
              <div className="flex-1 flex flex-col">
                {/* Topbar Visual */}
                <div className="h-12 bg-surface border border-border rounded-lg px-4 flex items-center justify-between mb-4">
                  <div className="text-xs font-medium text-foreground">Page Title</div>
                  <div className="flex-1 mx-4 h-8 bg-input-background border border-input rounded flex items-center px-3">
                    <div className="text-xs text-muted-foreground">Search...</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-muted" />
                    <div className="h-6 w-6 rounded bg-muted" />
                    <div className="h-6 w-6 rounded-full bg-primary" />
                  </div>
                </div>

                {/* Content Visual */}
                <div className="flex-1 bg-background border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="text-sm font-medium text-foreground">Content Area</div>
                    <div className="text-xs text-muted-foreground">Scrollable • 1680px wide</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Details */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h4 className="text-foreground mb-4" style={{ 
              fontSize: 'var(--text-subtitle-s)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              Topbar Components
            </h4>
            <ul className="space-y-3 text-muted-foreground" style={{ fontSize: 'var(--text-body-m)' }}>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Page Title (Headline M, Semibold)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Global Search Bar (max-width: 600px)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Theme Switch Button (Light/Dark toggle)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Notification Icon with badge indicator</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>User Avatar with name and role</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h4 className="text-foreground mb-4" style={{ 
              fontSize: 'var(--text-subtitle-s)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              Sidebar Navigation
            </h4>
            <ul className="space-y-3 text-muted-foreground" style={{ fontSize: 'var(--text-body-m)' }}>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Sales & Billing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Items & Inventory</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Suppliers & GRN</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Customers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Reports & Analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>User Management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Settings</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Sync Status</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Design Tokens */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-foreground mb-4" style={{ 
            fontSize: 'var(--text-subtitle-s)',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            Design System Integration
          </h4>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-muted-foreground mb-2" style={{ fontSize: 'var(--text-caption)' }}>
                COLOR TOKENS
              </p>
              <ul className="space-y-1 text-sm text-foreground">
                <li>• Sidebar: bg-sidebar</li>
                <li>• Surface: bg-surface</li>
                <li>• Background: bg-background</li>
                <li>• Primary: bg-primary</li>
                <li>• Border: border-border</li>
              </ul>
            </div>
            <div>
              <p className="text-muted-foreground mb-2" style={{ fontSize: 'var(--text-caption)' }}>
                TYPOGRAPHY
              </p>
              <ul className="space-y-1 text-sm text-foreground">
                <li>• Headline M: Page titles</li>
                <li>• Subtitle S: Brand name</li>
                <li>• Body M: Menu items</li>
                <li>• Caption: User role, version</li>
              </ul>
            </div>
            <div>
              <p className="text-muted-foreground mb-2" style={{ fontSize: 'var(--text-caption)' }}>
                SPACING
              </p>
              <ul className="space-y-1 text-sm text-foreground">
                <li>• Padding: 24px (spacing-6)</li>
                <li>• Gap: 12px (spacing-3)</li>
                <li>• Radius: 8px (radius-md)</li>
                <li>• Icon size: 20px</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
