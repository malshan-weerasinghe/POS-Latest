import React, { useContext, useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Tags,
  ChevronLeft,
  Menu,
  History
} from 'lucide-react';
import { cn } from '../ui/utils';
import { AppContext, Route } from '../../App';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  route?: Route;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    route: 'dashboard'
  },
  {
    id: 'sales',
    label: 'Sales & Billing',
    icon: ShoppingCart,
    route: 'sales-billing'
  },
  {
    id: 'sales-history',
    label: 'Sales History',
    icon: History,
    route: 'sales-history'
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    children: [
      { id: 'items-list', label: 'Items List', icon: Package, route: 'items-list' },
      { id: 'categories', label: 'Categories', icon: Tags, route: 'categories' },
    ]
  },
  {
    id: 'suppliers',
    label: 'Suppliers',
    icon: Truck,
    route: 'suppliers-list'
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: Users,
    route: 'customers-list'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    route: 'settings'
  },
];

export const Sidebar: React.FC = () => {
  const { currentRoute, navigateTo, sidebarCollapsed, setSidebarCollapsed } = useContext(AppContext);
  const [expandedItems, setExpandedItems] = useState<string[]>(['products']);

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      if (!sidebarCollapsed) {
        toggleExpand(item.id);
      } else {
        // If collapsed and has children, navigate to first child
        if (item.children[0]?.route) {
          navigateTo(item.children[0].route);
        }
      }
    } else if (item.route) {
      navigateTo(item.route);
    }
  };

  const isRouteActive = (item: MenuItem): boolean => {
    if (item.route === currentRoute) return true;
    if (item.children) {
      return item.children.some((child) => child.route === currentRoute);
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const Icon = item.icon;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = isRouteActive(item);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => handleItemClick(item)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
            level > 0 && "pl-6",
            isActive && !hasChildren
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            sidebarCollapsed && "justify-center"
          )}
          title={sidebarCollapsed ? item.label : undefined}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          {!sidebarCollapsed && (
            <>
              <span
                className="flex-1 text-left"
                style={{
                  fontSize: 'var(--text-body-m)',
                  fontWeight: 'var(--font-weight-medium)',
                  lineHeight: 'var(--line-height-normal)'
                }}
              >
                {item.label}
              </span>
              {hasChildren && (
                isExpanded ? (
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                )
              )}
            </>
          )}
        </button>

        {!sidebarCollapsed && hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => {
              const ChildIcon = child.icon;
              const isChildActive = child.route === currentRoute;

              return (
                <button
                  key={child.id}
                  onClick={() => child.route && navigateTo(child.route)}
                  className={cn(
                    "w-full flex items-center gap-3 pl-11 pr-3 py-2 rounded-lg transition-colors",
                    isChildActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <ChildIcon className="h-4 w-4 flex-shrink-0" />
                  <span style={{
                    fontSize: 'var(--text-body-s)',
                    fontWeight: 'var(--font-weight-medium)',
                    lineHeight: 'var(--line-height-normal)'
                  }}>
                    {child.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={cn(
      "h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-50 transition-all duration-300",
      sidebarCollapsed ? "w-[70px]" : "w-[240px]"
    )}>
      {/* Sidebar Header: Shop icon and name (expanded), icon only (collapsed) + collapse/expand button */}
      <div className="h-16 px-4 flex items-center border-b border-sidebar-border">
        {sidebarCollapsed ? (
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center focus:outline-none"
              title="Expand sidebar"
            >
              <ShoppingCart className="h-5 w-5 text-sidebar-primary-foreground" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-1">
              <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <span className="text-sidebar-foreground text-lg font-semibold leading-tight whitespace-nowrap">Unlimited Mobile</span>
            </div>
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="h-8 w-8 rounded-lg hover:bg-sidebar-accent flex items-center justify-center transition-colors ml-2"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-5 w-5 text-sidebar-foreground" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </nav>

      {/* Footer: Profile and Looper7 logo, only when expanded */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-sidebar-border flex flex-col gap-2">
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-base">JD</div>
            <div className="text-left">
              <p className="text-sidebar-foreground text-sm font-medium leading-tight">John Doe</p>
              <p className="text-sidebar-foreground/60 text-xs leading-tight">Administrator</p>
            </div>
          </div>
          {/* Looper7 Logo */}
          <div className="flex justify-center mt-1">
            <img src="/src/assets/looper7-logo.png" alt="LOOPER7" className="h-12 w-auto object-contain" />
          </div>
        </div>
      )}
    </aside>
  );
};
