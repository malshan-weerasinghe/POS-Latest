import React from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Bell, Settings, Search, Moon, Sun, Menu, Home, ShoppingCart, Package, Users, BarChart3, FileText, HelpCircle, LogOut } from 'lucide-react';

export const NavigationShowcase: React.FC = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  return (
    <div className="space-y-8">
      {/* Topbar */}
      <div>
        <h4 className="mb-4">Topbar / Header</h4>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-semibold">POS System</span>
              </div>
              
              <div className="relative w-96 ml-8">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products, orders..."
                  className="w-full h-9 pl-10 pr-4 rounded-lg border border-input bg-input-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="h-6 w-px bg-border mx-2" />
              <div className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-lg px-2 py-1.5 -mr-2 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">JD</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div>
        <h4 className="mb-4">Sidebar Navigation</h4>
        <div className="grid grid-cols-2 gap-6">
          {/* Expanded Sidebar */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="w-64 h-[600px] bg-sidebar border-r border-sidebar-border flex flex-col">
              <div className="h-16 px-4 flex items-center border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-sidebar-primary-foreground" />
                  </div>
                  <span className="font-semibold text-sidebar-foreground">POS System</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-colors">
                  <Home className="h-5 w-5" />
                  <span className="text-sm font-medium">Dashboard</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="text-sm font-medium">Sales</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <Package className="h-5 w-5" />
                  <span className="text-sm font-medium">Products</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">Customers</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm font-medium">Analytics</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm font-medium">Reports</span>
                </button>

                <div className="py-2">
                  <div className="h-px bg-sidebar-border" />
                </div>

                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <Settings className="h-5 w-5" />
                  <span className="text-sm font-medium">Settings</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <HelpCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Help</span>
                </button>
              </div>

              <div className="p-3 border-t border-sidebar-border">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Collapsed Sidebar */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="w-16 h-[600px] bg-sidebar border-r border-sidebar-border flex flex-col">
              <div className="h-16 px-3 flex items-center justify-center border-b border-sidebar-border">
                <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-sidebar-primary-foreground" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                <button className="w-full h-10 flex items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground transition-colors">
                  <Home className="h-5 w-5" />
                </button>
                <button className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                </button>
                <button className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <Package className="h-5 w-5" />
                </button>
                <button className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <Users className="h-5 w-5" />
                </button>
                <button className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <BarChart3 className="h-5 w-5" />
                </button>
                <button className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <FileText className="h-5 w-5" />
                </button>

                <div className="py-2">
                  <div className="h-px bg-sidebar-border" />
                </div>

                <button className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
                <button className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <HelpCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="p-2 border-t border-sidebar-border">
                <button className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div>
        <h4 className="mb-4">Breadcrumbs</h4>
        <div className="p-6 border border-border rounded-lg bg-surface">
          <nav className="flex items-center gap-2 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
            <span className="text-muted-foreground">/</span>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Products</a>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Electronics</span>
          </nav>
        </div>
      </div>

      {/* Pagination */}
      <div>
        <h4 className="mb-4">Pagination</h4>
        <div className="p-6 border border-border rounded-lg bg-surface flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1 to 10 of 97 results</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="default" size="sm" className="w-8">1</Button>
            <Button variant="outline" size="sm" className="w-8">2</Button>
            <Button variant="outline" size="sm" className="w-8">3</Button>
            <span className="flex items-center px-2 text-muted-foreground">...</span>
            <Button variant="outline" size="sm" className="w-8">10</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
