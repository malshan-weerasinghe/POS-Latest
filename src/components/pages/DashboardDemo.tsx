import React from 'react';
import { Card, CardContent } from '../ui/card';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';

export const DashboardDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <div>
        <h3 className="text-foreground mb-2" style={{ 
          fontSize: 'var(--text-subtitle-m)',
          fontWeight: 'var(--font-weight-medium)'
        }}>
          Welcome back, John!
        </h3>
        <p className="text-muted-foreground" style={{ 
          fontSize: 'var(--text-body-m)'
        }}>
          Here's what's happening with your store today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Today's Sales
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-m)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  $12,426
                </p>
                <div className="flex items-center text-green-600 dark:text-green-400" style={{ fontSize: 'var(--text-caption)' }}>
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>+18.2% from yesterday</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Total Orders
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-m)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  156
                </p>
                <div className="flex items-center text-green-600 dark:text-green-400" style={{ fontSize: 'var(--text-caption)' }}>
                  <TrendingUp className="mr-1 h-3 w-3" />
                  <span>+12.5% from yesterday</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Customers
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-m)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  1,234
                </p>
                <div className="flex items-center text-red-600 dark:text-red-400" style={{ fontSize: 'var(--text-caption)' }}>
                  <TrendingDown className="mr-1 h-3 w-3" />
                  <span>-2.4% from yesterday</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Low Stock Items
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-m)',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  23
                </p>
                <div className="flex items-center text-yellow-600 dark:text-yellow-400" style={{ fontSize: 'var(--text-caption)' }}>
                  <span>Requires attention</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder Cards */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-foreground" style={{ 
                fontSize: 'var(--text-subtitle-s)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                Recent Transactions
              </h4>
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-m)' }}>
                Transaction list will appear here
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-foreground" style={{ 
                fontSize: 'var(--text-subtitle-s)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                Sales Chart
              </h4>
            </div>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-m)' }}>
                Sales chart will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h4 className="text-foreground mb-4" style={{ 
              fontSize: 'var(--text-subtitle-s)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              Top Products
            </h4>
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                Product list
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h4 className="text-foreground mb-4" style={{ 
              fontSize: 'var(--text-subtitle-s)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              Inventory Alerts
            </h4>
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                Alert list
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h4 className="text-foreground mb-4" style={{ 
              fontSize: 'var(--text-subtitle-s)',
              fontWeight: 'var(--font-weight-medium)'
            }}>
              Quick Actions
            </h4>
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                Action buttons
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
