import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './components/pages/DashboardPage';
import { SalesBillingPage } from './components/pages/SalesBillingPage';
import { SalesHistoryPage } from './components/pages/SalesHistoryPage';
import { ItemsListPage } from './components/pages/ItemsListPage';
import { CategoriesPage } from './components/pages/CategoriesPage';
import { SuppliersListPage } from './components/pages/SuppliersListPage';
import { CustomersListPage } from './components/pages/CustomersListPage';
import { ReceiptPage } from './components/pages/ReceiptPage';
import { RemindersPage } from './components/pages/RemindersPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { LoginPage } from './components/pages/LoginPage';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';

export type Route =
  | 'dashboard'
  | 'sales-billing'
  | 'sales-history'
  | 'receipt'
  | 'items-list'
  | 'categories'
  | 'suppliers-list'
  | 'customers-list'
  | 'reminders'
  | 'settings';

export interface AppContextType {
  currentRoute: Route;
  navigateTo: (route: Route) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const AppContext = React.createContext<AppContextType>({
  currentRoute: 'dashboard',
  navigateTo: () => {},
  theme: 'light',
  toggleTheme: () => {},
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
});

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<Route>('sales-billing'); // Start with sales billing
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

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
      case 'dashboard':
        return <DashboardPage />;
      case 'sales-billing':
        return <SalesBillingPage />;
      case 'sales-history':
        return <SalesHistoryPage />;
      case 'receipt':
        return <ReceiptPage />;
      case 'items-list':
        return <ItemsListPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'suppliers-list':
        return <SuppliersListPage />;
      case 'customers-list':
        return <CustomersListPage />;
      case 'reminders':
        return <RemindersPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className={theme}>
        <LoginPage />
        <Toaster theme={theme} />
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ currentRoute, navigateTo, theme, toggleTheme, sidebarCollapsed, setSidebarCollapsed }}>
      <div className={theme}>
        <AppShell currentRoute={currentRoute} onNavigate={navigateTo}>
          {renderPage()}
        </AppShell>
        <Toaster theme={theme} />
      </div>
    </AppContext.Provider>
  );
}
