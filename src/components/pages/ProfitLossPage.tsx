import React, { useState } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Download, Printer, TrendingUp, TrendingDown } from 'lucide-react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', revenue: 245000, cost: 156000, profit: 89000 },
  { month: 'Feb', revenue: 268000, cost: 171000, profit: 97000 },
  { month: 'Mar', revenue: 289000, cost: 184000, profit: 105000 },
  { month: 'Apr', revenue: 312000, cost: 198000, profit: 114000 },
  { month: 'May', revenue: 298000, cost: 189000, profit: 109000 },
  { month: 'Jun', revenue: 334000, cost: 212000, profit: 122000 },
];

export const ProfitLossPage: React.FC = () => {
  const [period, setPeriod] = useState('this-month');

  const data = {
    revenue: {
      sales: 1245890,
      other: 12500,
      total: 1258390,
    },
    costs: {
      cogs: 789500,
      utilities: 36000,
      rent: 50000,
      salaries: 120000,
      supplies: 25000,
      other: 15000,
      total: 1035500,
    },
    grossProfit: 468890,
    netProfit: 222890,
    profitMargin: 17.71,
  };

  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Reports' }, { label: 'Profit & Loss' }]}
      title="Profit & Loss Statement"
      subtitle="Financial performance analysis"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Period Selection */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Label>Select Period</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="this-quarter">This Quarter</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Revenue</p>
                <h3>₹{data.revenue.total.toLocaleString()}</h3>
                <div className="flex items-center gap-1 text-[#10b981]">
                  <TrendingUp className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>+15.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Costs</p>
                <h3>₹{data.costs.total.toLocaleString()}</h3>
                <div className="flex items-center gap-1 text-[#ef4444]">
                  <TrendingUp className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>+8.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Net Profit</p>
                <h3 className="text-primary">₹{data.netProfit.toLocaleString()}</h3>
                <div className="flex items-center gap-1 text-[#10b981]">
                  <TrendingUp className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>+22.3%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Profit Margin</p>
                <h3>{data.profitMargin.toFixed(2)}%</h3>
                <div className="flex items-center gap-1 text-[#10b981]">
                  <TrendingUp className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>+1.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profit Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Profit Trend (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
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
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} name="Cost" />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* P&L Statement */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sales Revenue</span>
                  <span className="font-medium">₹{data.revenue.sales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Other Income</span>
                  <span className="font-medium">₹{data.revenue.other.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Revenue</span>
                  <span className="font-medium text-primary" style={{ fontSize: 'var(--text-subtitle-m)' }}>
                    ₹{data.revenue.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost of Goods Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product Costs</span>
                  <span className="font-medium">₹{data.costs.cogs.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total COGS</span>
                  <span className="font-medium text-[#ef4444]" style={{ fontSize: 'var(--text-subtitle-m)' }}>
                    ₹{data.costs.cogs.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Gross Profit</span>
                  <span className="font-medium text-[#10b981]" style={{ fontSize: 'var(--text-subtitle-m)' }}>
                    ₹{data.grossProfit.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operating Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Operating Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rent & Utilities</span>
                  <span className="font-medium">₹{(data.costs.rent + data.costs.utilities).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Staff Salaries</span>
                  <span className="font-medium">₹{data.costs.salaries.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supplies & Materials</span>
                  <span className="font-medium">₹{data.costs.supplies.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Other Expenses</span>
                  <span className="font-medium">₹{data.costs.other.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Operating Expenses</span>
                  <span className="font-medium text-[#ef4444]">
                    ₹
                    {(
                      data.costs.rent +
                      data.costs.utilities +
                      data.costs.salaries +
                      data.costs.supplies +
                      data.costs.other
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Net Profit Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Net Profit Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gross Profit</span>
                <span className="font-medium">₹{data.grossProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Operating Expenses</span>
                <span className="font-medium text-[#ef4444]">
                  -₹
                  {(
                    data.costs.rent +
                    data.costs.utilities +
                    data.costs.salaries +
                    data.costs.supplies +
                    data.costs.other
                  ).toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-medium">Net Profit</span>
                <span className="font-medium text-primary" style={{ fontSize: 'var(--text-headline-m)' }}>
                  ₹{data.netProfit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Net Profit Margin</span>
                <span className="font-medium text-primary">{data.profitMargin.toFixed(2)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};
