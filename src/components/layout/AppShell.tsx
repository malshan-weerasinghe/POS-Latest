import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Route } from '../../App';

interface AppShellProps {
  children: React.ReactNode;
  currentRoute: Route;
  onNavigate: (route: Route) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar - Fixed Left */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-[240px] h-screen flex flex-col">
        {/* Topbar - Fixed Top */}
        <Topbar />

        {/* Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto mt-16 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};
