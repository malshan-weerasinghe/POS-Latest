import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './components/pages/DashboardPage';
import { SalesBillingPage } from './components/pages/SalesBillingPage';
import { HoldBillsPage } from './components/pages/HoldBillsPage';
import { SalesReturnPage } from './components/pages/SalesReturnPage';
import { ItemsListPage } from './components/pages/ItemsListPage';
import { CategoriesPage } from './components/pages/CategoriesPage';
import { StockAdjustmentPage } from './components/pages/StockAdjustmentPage';
import { InventoryBatchesPage } from './components/pages/InventoryBatchesPage';
import { SuppliersListPage } from './components/pages/SuppliersListPage';
import { GRNCreatePage } from './components/pages/GRNCreatePage';
import { GRNApprovalPage } from './components/pages/GRNApprovalPage';
import { CustomersListPage } from './components/pages/CustomersListPage';
import { CustomerProfilePage } from './components/pages/CustomerProfilePage';
import { ReportsOverviewPage } from './components/pages/ReportsOverviewPage';
import { DailySummaryPage } from './components/pages/DailySummaryPage';
import { ProfitLossPage } from './components/pages/ProfitLossPage';
import { UserManagementPage } from './components/pages/UserManagementPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { SyncCenterPage } from './components/pages/SyncCenterPage';
import { ReceiptPage } from './components/pages/ReceiptPage';
import { ComponentLibraryPage } from './components/pages/ComponentLibraryPage';
import { IndexPage } from './components/pages/IndexPage';
import { SupplierLedgerPage } from './components/pages/SupplierLedgerPage';
import { ExpenseEntryPage } from './components/pages/ExpenseEntryPage';
import { DailyCashBookPage } from './components/pages/DailyCashBookPage';
import { EmployeeAttendancePage } from './components/pages/EmployeeAttendancePage';
import { StockMovementLogPage } from './components/pages/StockMovementLogPage';
import { Toaster } from './components/ui/sonner';

export type Route =
  | 'index'
  | 'component-library'
  | 'dashboard'
  | 'sales-billing'
  | 'receipt'
  | 'hold-bills'
  | 'sales-return'
  | 'items-list'
  | 'categories'
  | 'stock-adjustment'
  | 'inventory-batches'
  | 'suppliers-list'
  | 'grn-create'
  | 'grn-approval'
  | 'customers-list'
  | 'customer-profile'
  | 'reports-overview'
  | 'daily-summary'
  | 'profit-loss'
  | 'user-management'
  | 'settings'
  | 'sync-center'
  | 'supplier-ledger'
  | 'expense-entry'
  | 'daily-cash-book'
  | 'employee-attendance'
  | 'stock-movement-log';

export interface AppContextType {
  currentRoute: Route;
  navigateTo: (route: Route) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const AppContext = React.createContext<AppContextType>({
  currentRoute: 'dashboard',
  navigateTo: () => {},
  theme: 'light',
  toggleTheme: () => {},
});

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('index');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const navigateTo = (route: Route) => {
    setCurrentRoute(route);
  };

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      // Update the document class for theme switching
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newTheme;
    });
  };

  const renderPage = () => {
    switch (currentRoute) {
      case 'component-library':
        return <ComponentLibraryPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'sales-billing':
        return <SalesBillingPage />;
      case 'receipt':
        return <ReceiptPage />;
      case 'hold-bills':
        return <HoldBillsPage />;
      case 'sales-return':
        return <SalesReturnPage />;
      case 'items-list':
        return <ItemsListPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'stock-adjustment':
        return <StockAdjustmentPage />;
      case 'inventory-batches':
        return <InventoryBatchesPage />;
      case 'suppliers-list':
        return <SuppliersListPage />;
      case 'grn-create':
        return <GRNCreatePage />;
      case 'grn-approval':
        return <GRNApprovalPage />;
      case 'customers-list':
        return <CustomersListPage />;
      case 'customer-profile':
        return <CustomerProfilePage />;
      case 'reports-overview':
        return <ReportsOverviewPage />;
      case 'daily-summary':
        return <DailySummaryPage />;
      case 'profit-loss':
        return <ProfitLossPage />;
      case 'user-management':
        return <UserManagementPage />;
      case 'settings':
        return <SettingsPage />;
      case 'sync-center':
        return <SyncCenterPage />;
      case 'supplier-ledger':
        return <SupplierLedgerPage />;
      case 'expense-entry':
        return <ExpenseEntryPage />;
      case 'daily-cash-book':
        return <DailyCashBookPage />;
      case 'employee-attendance':
        return <EmployeeAttendancePage />;
      case 'stock-movement-log':
        return <StockMovementLogPage />;
      default:
        return <DashboardPage />;
    }
  };

  // Index, Component Library pages are standalone (no app shell)
  if (currentRoute === 'index') {
    return (
      <AppContext.Provider value={{ currentRoute, navigateTo, theme, toggleTheme }}>
        <div className={theme}>
          <IndexPage />
          <Toaster theme={theme} />
        </div>
      </AppContext.Provider>
    );
  }

  if (currentRoute === 'component-library') {
    return (
      <AppContext.Provider value={{ currentRoute, navigateTo, theme, toggleTheme }}>
        <div className={theme}>
          <ComponentLibraryPage />
          <Toaster theme={theme} />
        </div>
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={{ currentRoute, navigateTo, theme, toggleTheme }}>
      <div className={theme}>
        <AppShell currentRoute={currentRoute} onNavigate={navigateTo}>
          {renderPage()}
        </AppShell>
        <Toaster theme={theme} />
      </div>
    </AppContext.Provider>
  );
}
