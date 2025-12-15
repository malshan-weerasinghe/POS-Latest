import React, { useContext } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Download, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AppContext } from '../../App';

// Mock data for charts
const dailySalesData = [
  { date: 'Mon', sales: 12500, profit: 3800 },
  { date: 'Tue', sales: 15200, profit: 4600 },
  { date: 'Wed', sales: 14800, profit: 4400 },
  { date: 'Thu', sales: 18900, profit: 5700 },
  { date: 'Fri', sales: 21300, profit: 6400 },
  { date: 'Sat', sales: 25600, profit: 7700 },
  { date: 'Sun', sales: 19800, profit: 5900 },
];

const topCategoriesData = [
  { category: 'Electronics', sales: 85600 },
  { category: 'Groceries', sales: 72400 },
  { category: 'Beverages', sales: 56800 },
  { category: 'Snacks', sales: 48200 },
  { category: 'Personal Care', sales: 39500 },
];

const paymentModesData = [
  { name: 'Cash', value: 45, amount: 125600 },
  { name: 'Card', value: 30, amount: 83700 },
  { name: 'UPI', value: 20, amount: 55800 },
  { name: 'Credit', value: 5, amount: 13950 },
];

const topItemsData = [
  { name: 'Premium Rice 5kg', qty: 245, revenue: 98000 },
  { name: 'Cooking Oil 1L', qty: 312, revenue: 74880 },
  { name: 'Sugar 1kg', qty: 289, revenue: 15034 },
  { name: 'Wheat Flour 10kg', qty: 156, revenue: 62400 },
  { name: 'Tea Powder 500g', qty: 402, revenue: 48240 },
];

const COLORS = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b'];

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, trend }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-m)' }}>{title}</p>
            <h2 className="tracking-tight">{value}</h2>
            <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
              {trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span style={{ fontSize: 'var(--text-body-s)' }}>
                {Math.abs(change)}% from yesterday
              </span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardPage: React.FC = () => {
  const { navigateTo } = useContext(AppContext);
  
  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Dashboard' }]}
      title="Dashboard"
      subtitle="Overview of your store performance"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateTo('reports-overview')}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6">
          <KPICard
            title="Today's Sales"
            value="₹25,680"
            change={12.5}
            trend="up"
            icon={<DollarSign className="h-6 w-6" />}
          />
          <KPICard
            title="Total Orders"
            value="142"
            change={8.2}
            trend="up"
            icon={<ShoppingCart className="h-6 w-6" />}
          />
          <KPICard
            title="Customers Today"
            value="89"
            change={-3.1}
            trend="down"
            icon={<Users className="h-6 w-6" />}
          />
          <KPICard
            title="Low Stock Items"
            value="23"
            change={5.4}
            trend="up"
            icon={<Package className="h-6 w-6" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Daily Sales Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Sales Trend</CardTitle>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                Sales and profit for the last 7 days
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" style={{ fontSize: 'var(--text-body-s)' }} />
                  <YAxis stroke="var(--muted-foreground)" style={{ fontSize: 'var(--text-body-s)' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius-md)'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#0d9488" strokeWidth={2} name="Sales" />
                  <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                Sales by category this week
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCategoriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="category" stroke="var(--muted-foreground)" style={{ fontSize: 'var(--text-body-s)' }} />
                  <YAxis stroke="var(--muted-foreground)" style={{ fontSize: 'var(--text-body-s)' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius-md)'
                    }} 
                  />
                  <Bar dataKey="sales" fill="#0d9488" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-3 gap-6">
          {/* Payment Modes */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Modes</CardTitle>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                Distribution by payment type
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={paymentModesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentModesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)',
                      borderRadius: 'var(--radius-md)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Items */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                Best performing products today
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topItemsData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                          {item.qty} units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{item.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
};
