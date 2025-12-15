import React, { useState } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Download, Printer, Calendar, TrendingUp, TrendingDown, DollarSign, ShoppingCart, RotateCcw, Users } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Separator } from '../ui/separator';

interface PaymentBreakdown {
  method: string;
  transactions: number;
  amount: number;
}

interface TopItem {
  name: string;
  quantity: number;
  revenue: number;
}

export const DailySummaryPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const summaryData = {
    totalSales: 45680,
    totalOrders: 142,
    totalCustomers: 89,
    averageOrderValue: 321.69,
    returns: 2150,
    cashInHand: 43530,
    openingBalance: 10000,
    closingBalance: 53530,
  };

  const paymentBreakdown: PaymentBreakdown[] = [
    { method: 'Cash', transactions: 64, amount: 20560 },
    { method: 'Card', transactions: 42, amount: 13690 },
    { method: 'UPI', transactions: 28, amount: 9280 },
    { method: 'Credit', transactions: 8, amount: 2150 },
  ];

  const topItems: TopItem[] = [
    { name: 'Premium Rice 5kg', quantity: 45, revenue: 18000 },
    { name: 'Cooking Oil 1L', quantity: 52, revenue: 12480 },
    { name: 'Sugar 1kg', quantity: 68, revenue: 3536 },
    { name: 'Tea Powder 500g', quantity: 38, revenue: 4560 },
    { name: 'Wheat Flour 10kg', quantity: 29, revenue: 11600 },
  ];

  const expenses = [
    { category: 'Utilities', amount: 1200 },
    { category: 'Staff Salary', amount: 8000 },
    { category: 'Supplies', amount: 2500 },
  ];

  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Reports' }, { label: 'Daily Summary' }]}
      title="Daily Summary"
      subtitle="End of day report and cash reconciliation"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Date Selection */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Label>Select Date</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="pt-6">
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Sales</p>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="text-primary">₹{summaryData.totalSales.toLocaleString()}</h3>
                <div className="flex items-center gap-1 text-[#10b981]">
                  <TrendingUp className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>+12.5% vs yesterday</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Orders</p>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3>{summaryData.totalOrders}</h3>
                <div className="flex items-center gap-1 text-[#10b981]">
                  <TrendingUp className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>+8.2% vs yesterday</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Customers</p>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3>{summaryData.totalCustomers}</h3>
                <div className="flex items-center gap-1 text-[#ef4444]">
                  <TrendingDown className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>-3.1% vs yesterday</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Avg Order Value</p>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3>₹{summaryData.averageOrderValue.toFixed(2)}</h3>
                <div className="flex items-center gap-1 text-[#10b981]">
                  <TrendingUp className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>+5.4% vs yesterday</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Breakdown */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paymentBreakdown.map((payment, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-muted-foreground">{payment.method}</span>
                      <div className="text-right">
                        <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                          {payment.transactions} transactions
                        </p>
                      </div>
                    </div>
                    {index < paymentBreakdown.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cash Reconciliation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Opening Balance</span>
                  <span>₹{summaryData.openingBalance.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cash Sales</span>
                  <span className="text-[#10b981]">+₹{paymentBreakdown[0].amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cash Returns</span>
                  <span className="text-[#ef4444]">-₹{summaryData.returns.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Expected Cash in Hand</span>
                  <span className="font-medium">₹{summaryData.cashInHand.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Actual Cash in Hand</span>
                  <Input type="number" className="w-32 h-9" placeholder="Enter amount" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Items & Expenses */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">₹{item.revenue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenses.map((expense, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{expense.category}</span>
                      <span className="font-medium text-[#ef4444]">-₹{expense.amount.toLocaleString()}</span>
                    </div>
                    {index < expenses.length - 1 && <Separator />}
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Expenses</span>
                  <span className="font-medium text-[#ef4444]">
                    -₹{expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Day End Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Sales</span>
                    <span className="font-medium">₹{summaryData.totalSales.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Returns</span>
                    <span className="font-medium text-[#ef4444]">-₹{summaryData.returns.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expenses</span>
                    <span className="font-medium text-[#ef4444]">
                      -₹{expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Opening Balance</span>
                    <span className="font-medium">₹{summaryData.openingBalance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Net Sales</span>
                    <span className="font-medium">
                      ₹
                      {(
                        summaryData.totalSales -
                        summaryData.returns -
                        expenses.reduce((sum, e) => sum + e.amount, 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Closing Balance</span>
                    <span className="font-medium text-primary" style={{ fontSize: 'var(--text-headline-m)' }}>
                      ₹{summaryData.closingBalance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};
