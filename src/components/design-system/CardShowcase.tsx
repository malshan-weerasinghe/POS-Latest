import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowUpRight, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';

export const CardShowcase: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Basic Cards */}
      <div>
        <h4 className="mb-4">Basic Cards</h4>
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the card content area. You can put any content here.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>With Footer</CardTitle>
              <CardDescription>This card has a footer section</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content with action buttons below.</p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" className="flex-1">Cancel</Button>
              <Button className="flex-1">Save</Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Hoverable</CardTitle>
              <CardDescription>This card has hover effects</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Hover over this card to see the shadow effect.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KPI Cards */}
      <div>
        <h4 className="mb-4">KPI Dashboard Cards</h4>
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-semibold">$45,231.89</p>
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+20.1% from last month</span>
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
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-semibold">+2,350</p>
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+12.5% from last month</span>
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
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-semibold">+573</p>
                  <div className="flex items-center text-xs text-red-600 dark:text-red-400">
                    <TrendingDown className="mr-1 h-3 w-3" />
                    <span>-4.2% from last month</span>
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
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="text-2xl font-semibold">1,234</p>
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    <span>+8.3% from last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Elevated Cards */}
      <div>
        <h4 className="mb-4">Card Variants</h4>
        <div className="grid grid-cols-3 gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Thick Border</CardTitle>
              <CardDescription>Card with thicker border</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has a thicker border for emphasis.</p>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground border-primary">
            <CardHeader>
              <CardTitle>Primary Card</CardTitle>
              <CardDescription className="text-primary-foreground/80">Highlighted card variant</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card uses the primary color scheme.</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-accent-500/10">
            <CardHeader>
              <CardTitle>Gradient Background</CardTitle>
              <CardDescription>Card with gradient</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has a subtle gradient background.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content Cards */}
      <div>
        <h4 className="mb-4">Content Cards</h4>
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>You made 265 sales this month</CardDescription>
                </div>
                <Badge>+12%</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Olivia Martin', email: 'olivia.martin@email.com', amount: '+$1,999.00' },
                  { name: 'Jackson Lee', email: 'jackson.lee@email.com', amount: '+$39.00' },
                  { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', amount: '+$299.00' },
                ].map((sale, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{sale.name}</p>
                      <p className="text-xs text-muted-foreground">{sale.email}</p>
                    </div>
                    <p className="text-sm font-medium">{sale.amount}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                View All
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Overview of key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Conversion Rate</span>
                  <span className="text-sm font-medium">3.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Order Value</span>
                  <span className="text-sm font-medium">$124.50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Customer Retention</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Net Profit Margin</span>
                  <span className="text-sm font-medium">15.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
