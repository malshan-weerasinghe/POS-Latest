import React, { useContext } from 'react';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { AppContext } from '../../App';

export const Topbar: React.FC = () => {
  const { theme, toggleTheme, sidebarCollapsed } = useContext(AppContext);

  const getPageTitle = () => {
    // You can enhance this to show dynamic titles based on route
    return 'POS System';
  };

  return (
    <header 
      className="h-16 bg-surface border-b border-border flex items-center px-6 fixed top-0 right-0 z-40 transition-all duration-300"
      style={{ left: sidebarCollapsed ? '70px' : '240px' }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Left: Page Title */}
        <div className="flex-shrink-0">
          <h2 className="text-foreground" style={{ 
            fontSize: 'var(--text-headline-m)',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--line-height-tight)'
          }}>
            {getPageTitle()}
          </h2>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products, orders, customers..."
              className="w-full pl-10 bg-input-background"
              style={{ 
                fontSize: 'var(--text-body-m)',
                height: '40px'
              }}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-10 w-10"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-10 w-10 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-surface" />
          </Button>

          {/* Divider */}
          <div className="h-8 w-px bg-border" />

          {/* User Avatar & Info */}
          <button className="flex items-center gap-3 hover:bg-muted/50 rounded-lg px-3 py-2 -mr-3 transition-colors">
            <div className="text-right">
              <p className="text-foreground" style={{ 
                fontSize: 'var(--text-body-m)',
                fontWeight: 'var(--font-weight-medium)',
                lineHeight: 'var(--line-height-tight)'
              }}>
                John Doe
              </p>
              <p className="text-muted-foreground" style={{ 
                fontSize: 'var(--text-caption)',
                lineHeight: 'var(--line-height-tight)'
              }}>
                Administrator
              </p>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground" style={{ 
                fontSize: 'var(--text-body-m)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                JD
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </header>
  );
};
