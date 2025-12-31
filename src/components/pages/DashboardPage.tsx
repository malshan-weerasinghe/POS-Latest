import React, { useContext, useState, useEffect } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, Download, Filter, ArrowUpRight, ArrowDownRight, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AppContext } from '../../App';
import { remindersAPI } from '../../services/api';

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

interface DueReminder {
  id: string;
  title: string;
  scheduledDateTime: string;
  priority: 'Low' | 'Medium' | 'High';
}

export const DashboardPage: React.FC = () => {
  const { navigateTo } = useContext(AppContext);
  const [dueReminders, setDueReminders] = useState<DueReminder[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(true);

  useEffect(() => {
    loadDueReminders();
  }, []);

  const loadDueReminders = async () => {
    try {
      setLoadingReminders(true);
      const response = await remindersAPI.getAll({ limit: 50 });
      
      if (response && response.success) {
        const remindersData = response.data?.reminders || response.data || [];
        
        if (Array.isArray(remindersData)) {
          // Filter for only pending reminders (not completed, not overdue)
          // Sort by scheduled date/time (earliest first)
          // Take the first 4
          const due = remindersData
            .filter((r: any) => r.status === 'Pending')
            .map((r: any) => ({
              id: r.id.toString(),
              title: r.title,
              scheduledDateTime: r.scheduled_date_time || r.next_trigger || r.scheduled_date_time,
              priority: r.priority,
            }))
            .sort((a: DueReminder, b: DueReminder) => {
              const dateA = new Date(a.scheduledDateTime);
              const dateB = new Date(b.scheduledDateTime);
              return dateA.getTime() - dateB.getTime();
            })
            .slice(0, 4);
          
          setDueReminders(due);
        }
      }
    } catch (error) {
      console.error('Error loading due reminders:', error);
    } finally {
      setLoadingReminders(false);
    }
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    }
    // Check if it's tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    }
    
    // Check if overdue
    if (date < today) {
      return `Overdue: ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    
    // Future date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getPriorityBorderColor = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'Low':
        return 'border-[#10b981]'; // Green
      case 'Medium':
        return 'border-[#ffbd59]'; // Orange/Yellow
      case 'High':
        return 'border-[#ef4444]'; // Red
      default:
        return 'border-gray-300';
    }
  };

  const getPriorityBorderColorValue = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'Low':
        return '#10b981'; // Green
      case 'Medium':
        return '#ffbd59'; // Orange/Yellow
      case 'High':
        return '#ef4444'; // Red
      default:
        return '#9ca3af';
    }
  };

  const getPriorityIcon = (priority: 'Low' | 'Medium' | 'High') => {
    switch (priority) {
      case 'Low':
        return <CheckCircle2 className="h-4 w-4 text-[#10b981]" />;
      case 'Medium':
        return <AlertCircle className="h-4 w-4 text-[#ffbd59]" />;
      case 'High':
        return <AlertCircle className="h-4 w-4 text-[#ef4444]" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  return (
    <PageTemplate
      title="Dashboard"
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
        {/* Latest Due Reminders */}
        {dueReminders.length > 0 && (
          <div>
            <h3 className="text-base font-semibold mb-4">Latest Due Reminders</h3>
            <div className="grid grid-cols-4 gap-6">
              {dueReminders.map((reminder) => (
                <Card 
                  key={reminder.id} 
                  className={`border-2 ${getPriorityBorderColor(reminder.priority)} cursor-pointer hover:shadow-md transition-shadow`}
                  style={{ borderColor: getPriorityBorderColorValue(reminder.priority) }}
                  onClick={() => {
                    sessionStorage.setItem('expandReminderId', reminder.id);
                    navigateTo('reminders');
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(reminder.priority)}
                        <p className="text-muted-foreground text-xs font-medium uppercase">{reminder.priority}</p>
                      </div>
                      <h3 className="font-semibold text-sm leading-tight">{reminder.title}</h3>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <p className="text-xs" style={{ fontSize: 'var(--text-body-s)' }}>
                          {formatDueDate(reminder.scheduledDateTime)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Divider Line */}
        <div className="w-full h-0.5 bg-black my-6"></div>

        {/* KPI Cards */}
        <div className="w-full h-0.5 bg-black mb-6"></div>
        <h3 className="text-base font-semibold mb-4">Overview of your store performance</h3>
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
