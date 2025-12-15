import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './components/pages/DashboardPage';
import { SalesBillingPage } from './components/pages/SalesBillingPage';
import { ItemsListPage } from './components/pages/ItemsListPage';
import { CategoriesPage } from './components/pages/CategoriesPage';
import { SuppliersListPage } from './components/pages/SuppliersListPage';
import { CustomersListPage } from './components/pages/CustomersListPage';
import { ReceiptPage } from './components/pages/ReceiptPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { Toaster } from './components/ui/sonner';

export type Route =
  | 'dashboard'
  | 'sales-billing'
  | 'receipt'
  | 'items-list'
  | 'categories'
  | 'suppliers-list'
  | 'customers-list'
  | 'settings';

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
  const [currentRoute, setCurrentRoute] = useState<Route>('dashboard');
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
      case 'dashboard':
        return <DashboardPage />;
      case 'sales-billing':
        return <SalesBillingPage />;
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
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

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
