import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  RotateCcw,
  Clock,
  Package,
  Edit,
  FolderTree,
  Layers,
  Settings as SettingsIcon,
  Truck,
  ClipboardCheck,
  Users,
  UserCircle,
  BarChart3,
  TrendingUp,
  Calendar,
  UserCog,
  RefreshCw
} from 'lucide-react';

// Import all page components
import { DashboardPage } from './DashboardPage';
import { SalesBillingPage } from './SalesBillingPage';
import { SalesReturnPage } from './SalesReturnPage';
import { HoldBillsPage } from './HoldBillsPage';
import { ItemsListPage } from './ItemsListPage';
import { ItemFormPage } from './ItemFormPage';
import { CategoriesPage } from './CategoriesPage';
import { InventoryBatchesPage } from './InventoryBatchesPage';
import { StockAdjustmentPage } from './StockAdjustmentPage';
import { SuppliersListPage } from './SuppliersListPage';
import { GRNCreatePage } from './GRNCreatePage';
import { GRNApprovalPage } from './GRNApprovalPage';
import { CustomersListPage } from './CustomersListPage';
import { CustomerProfilePage } from './CustomerProfilePage';
import { ReportsOverviewPage } from './ReportsOverviewPage';
import { ProfitLossPage } from './ProfitLossPage';
import { DailySummaryPage } from './DailySummaryPage';
import { UserManagementPage } from './UserManagementPage';
import { SettingsPage } from './SettingsPage';
import { SyncCenterPage } from './SyncCenterPage';

type PageId = 
  | 'dashboard'
  | 'sales-billing'
  | 'sales-return'
  | 'hold-bills'
  | 'items-list'
  | 'item-form'
  | 'categories'
  | 'inventory-batches'
  | 'stock-adjustment'
  | 'suppliers-list'
  | 'grn-create'
  | 'grn-approval'
  | 'customers-list'
  | 'customer-profile'
  | 'reports-overview'
  | 'profit-loss'
  | 'daily-summary'
  | 'user-management'
  | 'settings'
  | 'sync-center';

interface PageTemplate {
  id: PageId;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ComponentType;
  category: string;
}

const pageTemplates: PageTemplate[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Main overview with KPIs and charts',
    icon: LayoutDashboard,
    component: DashboardPage,
    category: 'Overview'
  },
  {
    id: 'sales-billing',
    title: 'Sales & Billing',
    description: 'Create new sales invoice',
    icon: ShoppingCart,
    component: SalesBillingPage,
    category: 'Sales'
  },
  {
    id: 'sales-return',
    title: 'Sales Return',
    description: 'Process returns and refunds',
    icon: RotateCcw,
    component: SalesReturnPage,
    category: 'Sales'
  },
  {
    id: 'hold-bills',
    title: 'Hold Bills',
    description: 'Manage saved and pending invoices',
    icon: Clock,
    component: HoldBillsPage,
    category: 'Sales'
  },
  {
    id: 'items-list',
    title: 'Items List',
    description: 'Manage product catalog',
    icon: Package,
    component: ItemsListPage,
    category: 'Inventory'
  },
  {
    id: 'item-form',
    title: 'Item Create/Edit',
    description: 'Add or edit product details',
    icon: Edit,
    component: ItemFormPage,
    category: 'Inventory'
  },
  {
    id: 'categories',
    title: 'Categories',
    description: 'Organize products into categories',
    icon: FolderTree,
    component: CategoriesPage,
    category: 'Inventory'
  },
  {
    id: 'inventory-batches',
    title: 'Inventory Batches',
    description: 'Track product batches and expiry',
    icon: Layers,
    component: InventoryBatchesPage,
    category: 'Inventory'
  },
  {
    id: 'stock-adjustment',
    title: 'Stock Adjustment',
    description: 'Adjust inventory levels manually',
    icon: SettingsIcon,
    component: StockAdjustmentPage,
    category: 'Inventory'
  },
  {
    id: 'suppliers-list',
    title: 'Suppliers List',
    description: 'Manage suppliers and vendors',
    icon: Truck,
    component: SuppliersListPage,
    category: 'Suppliers'
  },
  {
    id: 'grn-create',
    title: 'GRN Create',
    description: 'Create Goods Receipt Note',
    icon: ClipboardCheck,
    component: GRNCreatePage,
    category: 'Suppliers'
  },
  {
    id: 'grn-approval',
    title: 'GRN Approval',
    description: 'Review and approve GRNs',
    icon: ClipboardCheck,
    component: GRNApprovalPage,
    category: 'Suppliers'
  },
  {
    id: 'customers-list',
    title: 'Customers List',
    description: 'Manage customer database',
    icon: Users,
    component: CustomersListPage,
    category: 'Customers'
  },
  {
    id: 'customer-profile',
    title: 'Customer Profile',
    description: 'View customer details and loyalty',
    icon: UserCircle,
    component: CustomerProfilePage,
    category: 'Customers'
  },
  {
    id: 'reports-overview',
    title: 'Reports Overview',
    description: 'Access all business reports',
    icon: BarChart3,
    component: ReportsOverviewPage,
    category: 'Reports'
  },
  {
    id: 'profit-loss',
    title: 'Profit & Loss',
    description: 'Comprehensive P&L statement',
    icon: TrendingUp,
    component: ProfitLossPage,
    category: 'Reports'
  },
  {
    id: 'daily-summary',
    title: 'Daily Summary',
    description: 'End of day reports',
    icon: Calendar,
    component: DailySummaryPage,
    category: 'Reports'
  },
  {
    id: 'user-management',
    title: 'User Management',
    description: 'Manage users and roles',
    icon: UserCog,
    component: UserManagementPage,
    category: 'Settings'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure POS system',
    icon: SettingsIcon,
    component: SettingsPage,
    category: 'Settings'
  },
  {
    id: 'sync-center',
    title: 'Sync Center',
    description: 'Data synchronization and backups',
    icon: RefreshCw,
    component: SyncCenterPage,
    category: 'System'
  },
];

export const PageTemplatesShowcase: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<PageId>('dashboard');

  const SelectedComponent = pageTemplates.find(p => p.id === selectedPage)?.component || DashboardPage;

  const categories = Array.from(new Set(pageTemplates.map(p => p.category)));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-surface sticky top-0 z-50">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-foreground mb-2" style={{ 
              fontSize: 'var(--text-headline-l)',
              fontWeight: 'var(--font-weight-semibold)',
              lineHeight: 'var(--line-height-tight)'
            }}>
              02 – Page Templates
            </h1>
            <p className="text-muted-foreground" style={{ 
              fontSize: 'var(--text-body-l)',
              lineHeight: 'var(--line-height-normal)'
            }}>
              All module pages with consistent structure: 32px padding, breadcrumbs, and placeholder content
            </p>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        {/* Sidebar Navigation */}
        <div className="w-80 border-r bg-surface overflow-y-auto">
          <div className="p-4 space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-muted-foreground mb-2 px-3" style={{ 
                  fontSize: 'var(--text-caption)',
                  fontWeight: 'var(--font-weight-semibold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {category}
                </h3>
                <div className="space-y-1">
                  {pageTemplates
                    .filter(p => p.category === category)
                    .map((page) => {
                      const Icon = page.icon;
                      return (
                        <button
                          key={page.id}
                          onClick={() => setSelectedPage(page.id)}
                          className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left ${
                            selectedPage === page.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted text-foreground'
                          }`}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          <div>
                            <p style={{ 
                              fontSize: 'var(--text-body-m)',
                              fontWeight: 'var(--font-weight-medium)',
                              lineHeight: 'var(--line-height-tight)'
                            }}>
                              {page.title}
                            </p>
                            <p className={`mt-0.5 ${selectedPage === page.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`} style={{ 
                              fontSize: 'var(--text-caption)',
                              lineHeight: 'var(--line-height-tight)'
                            }}>
                              {page.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-background">
          <SelectedComponent />
        </div>
      </div>
    </div>
  );
};
