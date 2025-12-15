import React from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Edit2, Phone, Mail, MapPin, Star, TrendingUp, Package, Calendar } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const purchaseHistory = [
  { id: 'INV-001', date: '2025-11-18', items: 5, amount: 1250, payment: 'Cash' },
  { id: 'INV-045', date: '2025-11-15', items: 3, amount: 850, payment: 'UPI' },
  { id: 'INV-089', date: '2025-11-10', items: 8, amount: 2140, payment: 'Card' },
  { id: 'INV-123', date: '2025-11-05', items: 4, amount: 980, payment: 'Cash' },
  { id: 'INV-156', date: '2025-10-28', items: 6, amount: 1560, payment: 'UPI' },
];

const spendingTrend = [
  { month: 'Jul', amount: 8500 },
  { month: 'Aug', amount: 12400 },
  { month: 'Sep', amount: 9800 },
  { month: 'Oct', amount: 15600 },
  { month: 'Nov', amount: 18200 },
];

const topPurchases = [
  { item: 'Premium Rice 5kg', quantity: 12, total: 4800 },
  { item: 'Cooking Oil 1L', quantity: 18, total: 4320 },
  { item: 'Tea Powder 500g', quantity: 8, total: 960 },
  { item: 'Sugar 1kg', quantity: 25, total: 1300 },
  { item: 'Wheat Flour 10kg', quantity: 6, total: 2400 },
];

export const CustomerProfilePage: React.FC = () => {
  const customer = {
    id: 'CUST-001',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.k@email.com',
    address: '123 Main St, Sector 15, Mumbai, MH 400001',
    tier: 'Gold',
    loyaltyPoints: 1250,
    totalPurchases: 125600,
    totalOrders: 45,
    avgOrderValue: 2791,
    joinedDate: '2024-03-15',
    lastPurchase: '2025-11-18',
  };

  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Customers' }, { label: 'Customer Profile' }]}
      title={customer.name}
      subtitle={`Customer ID: ${customer.id}`}
      actions={
        <>
          <Button variant="outline" size="sm">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Customer Info Card */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tier</span>
                <Badge variant="secondary" className="bg-[#fef3c7] text-[#f59e0b] border-[#fcd34d]">
                  <Star className="h-3 w-3 mr-1" />
                  {customer.tier}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                      Phone
                    </p>
                    <p>{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                      Email
                    </p>
                    <p>{customer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                      Address
                    </p>
                    <p>{customer.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                      Member Since
                    </p>
                    <p>{new Date(customer.joinedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="col-span-2 grid grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Loyalty Points
                  </p>
                  <h3 className="text-primary">{customer.loyaltyPoints} pts</h3>
                  <div className="flex items-center gap-1 text-[#10b981]">
                    <TrendingUp className="h-3 w-3" />
                    <span style={{ fontSize: 'var(--text-body-s)' }}>+150 this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Total Purchases
                  </p>
                  <h3>₹{customer.totalPurchases.toLocaleString()}</h3>
                  <div className="flex items-center gap-1 text-[#10b981]">
                    <TrendingUp className="h-3 w-3" />
                    <span style={{ fontSize: 'var(--text-body-s)' }}>+18% this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Total Orders
                  </p>
                  <h3>{customer.totalOrders}</h3>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Last: {new Date(customer.lastPurchase).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Avg Order Value
                  </p>
                  <h3>₹{customer.avgOrderValue.toLocaleString()}</h3>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Per transaction
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Spending Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Spending Trend (Last 5 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={spendingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" style={{ fontSize: 'var(--text-body-s)' }} />
                <YAxis stroke="var(--muted-foreground)" style={{ fontSize: 'var(--text-body-s)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius-md)',
                  }}
                />
                <Line type="monotone" dataKey="amount" stroke="#0d9488" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Purchase History & Top Items */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseHistory.map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-medium">{purchase.id}</TableCell>
                        <TableCell style={{ fontSize: 'var(--text-body-s)' }}>
                          {new Date(purchase.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{purchase.items}</TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{purchase.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Purchased Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPurchases.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{item.item}</p>
                          <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                            {item.quantity} units
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">₹{item.total.toLocaleString()}</p>
                    </div>
                    {index < topPurchases.length - 1 && <Separator className="mt-3" />}
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
