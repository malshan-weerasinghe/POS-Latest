import React, { useContext, useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Truck, 
  Users, 
  BarChart3, 
  UserCog, 
  Settings, 
  RefreshCw,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  RotateCcw,
  Tags,
  Sliders,
  PackageSearch,
  FileText,
  TrendingUp,
  Receipt,
  DollarSign,
  Wallet,
  UserCheck,
  ArrowRightLeft
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
    children: [
      { id: 'sales-billing', label: 'New Sale', icon: ShoppingCart, route: 'sales-billing' },
      { id: 'hold-bills', label: 'Hold Bills', icon: ClipboardList, route: 'hold-bills' },
      { id: 'sales-return', label: 'Sales Return', icon: RotateCcw, route: 'sales-return' },
    ]
  },
  { 
    id: 'inventory', 
    label: 'Items & Inventory', 
    icon: Package,
    children: [
      { id: 'items-list', label: 'Items List', icon: Package, route: 'items-list' },
      { id: 'categories', label: 'Categories', icon: Tags, route: 'categories' },
      { id: 'stock-adjustment', label: 'Stock Adjustment', icon: Sliders, route: 'stock-adjustment' },
      { id: 'inventory-batches', label: 'Batches & Expiry', icon: PackageSearch, route: 'inventory-batches' },
      { id: 'stock-movement-log', label: 'Movement Log', icon: ArrowRightLeft, route: 'stock-movement-log' },
    ]
  },
  { 
    id: 'suppliers', 
    label: 'Suppliers & GRN', 
    icon: Truck,
    children: [
      { id: 'suppliers-list', label: 'Suppliers', icon: Truck, route: 'suppliers-list' },
      { id: 'grn-create', label: 'Create GRN', icon: FileText, route: 'grn-create' },
      { id: 'grn-approval', label: 'GRN Approval', icon: ClipboardList, route: 'grn-approval' },
      { id: 'supplier-ledger', label: 'Supplier Ledger', icon: Receipt, route: 'supplier-ledger' },
    ]
  },
  { 
    id: 'customers', 
    label: 'Customers', 
    icon: Users,
    route: 'customers-list'
  },
  { 
    id: 'reports', 
    label: 'Reports & Analytics', 
    icon: BarChart3,
    children: [
      { id: 'reports-overview', label: 'All Reports', icon: BarChart3, route: 'reports-overview' },
      { id: 'daily-summary', label: 'Daily Summary', icon: FileText, route: 'daily-summary' },
      { id: 'profit-loss', label: 'Profit & Loss', icon: TrendingUp, route: 'profit-loss' },
      { id: 'expense-entry', label: 'Expense Entry', icon: DollarSign, route: 'expense-entry' },
      { id: 'daily-cash-book', label: 'Daily Cash Book', icon: Wallet, route: 'daily-cash-book' },
    ]
  },
  { 
    id: 'users', 
    label: 'User Management', 
    icon: UserCog,
    children: [
      { id: 'user-management', label: 'Users & Roles', icon: UserCog, route: 'user-management' },
      { id: 'employee-attendance', label: 'Attendance', icon: UserCheck, route: 'employee-attendance' },
    ]
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings,
    route: 'settings'
  },
  { 
    id: 'sync', 
    label: 'Sync Status', 
    icon: RefreshCw,
    route: 'sync-center'
  },
];

export const Sidebar: React.FC = () => {
  const { currentRoute, navigateTo } = useContext(AppContext);
  const [expandedItems, setExpandedItems] = useState<string[]>(['sales', 'inventory', 'suppliers', 'reports']);

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      toggleExpand(item.id);
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
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
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
        </button>
        
        {hasChildren && isExpanded && (
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
    <aside className="w-[240px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-50">
      {/* Logo/Brand */}
      <div className="h-16 px-6 flex items-center border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <ShoppingCart className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sidebar-foreground" style={{ 
              fontSize: 'var(--text-subtitle-s)',
              fontWeight: 'var(--font-weight-semibold)',
              lineHeight: 'var(--line-height-tight)'
            }}>
              POS System
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </nav>

      {/* Footer/Version Info */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <button
          onClick={() => navigateTo('index')}
          className="w-full px-3 py-2 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent text-sidebar-accent-foreground transition-colors"
        >
          <span style={{ 
            fontSize: 'var(--text-body-s)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 'var(--line-height-normal)'
          }}>
            🏠 Home
          </span>
        </button>
        <button
          onClick={() => navigateTo('component-library')}
          className="w-full px-3 py-2 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent text-sidebar-accent-foreground transition-colors"
        >
          <span style={{ 
            fontSize: 'var(--text-body-s)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 'var(--line-height-normal)'
          }}>
            📚 Components
          </span>
        </button>
        <div className="text-center space-y-1">
          <p className="text-sidebar-foreground/60" style={{ 
            fontSize: 'var(--text-caption)',
            lineHeight: 'var(--line-height-normal)'
          }}>
            Version 1.0.0
          </p>
          <p className="text-sidebar-foreground/40" style={{ 
            fontSize: 'var(--text-overline)',
            lineHeight: 'var(--line-height-normal)',
            letterSpacing: '0.05em'
          }}>
            1920×1080
          </p>
        </div>
      </div>
    </aside>
  );
};
