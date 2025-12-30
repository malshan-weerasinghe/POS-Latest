import React, { useContext } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Route, AppContext } from '../../App';

interface AppShellProps {
  children: React.ReactNode;
  currentRoute: Route;
  onNavigate: (route: Route) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { sidebarCollapsed } = useContext(AppContext);
  
  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar - Fixed Left */}
      <Sidebar />

      {/* Main Content Area */}
      <div 
        className="h-screen flex flex-col transition-all duration-300 bg-background"
        style={{ marginLeft: sidebarCollapsed ? '70px' : '240px' }}
      >
        {/* Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};
