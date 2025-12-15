import React from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { FileText, TrendingUp, Package, Users, DollarSign, Calendar, BarChart3, PieChart, Download } from 'lucide-react';

interface ReportCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

const reports: ReportCard[] = [
  {
    title: 'Daily Summary',
    description: 'End of day sales and cash reconciliation report',
    icon: <Calendar className="h-6 w-6" />,
    route: '/reports/daily-summary',
    color: '#0d9488',
  },
  {
    title: 'Sales Report',
    description: 'Detailed sales analysis by period, category, and item',
    icon: <TrendingUp className="h-6 w-6" />,
    route: '/reports/sales',
    color: '#3b82f6',
  },
  {
    title: 'Profit & Loss',
    description: 'Revenue, costs, and profit analysis',
    icon: <DollarSign className="h-6 w-6" />,
    route: '/reports/profit-loss',
    color: '#10b981',
  },
  {
    title: 'Inventory Report',
    description: 'Stock levels, valuation, and movement analysis',
    icon: <Package className="h-6 w-6" />,
    route: '/reports/inventory',
    color: '#8b5cf6',
  },
  {
    title: 'Customer Report',
    description: 'Customer purchase history and loyalty analysis',
    icon: <Users className="h-6 w-6" />,
    route: '/reports/customers',
    color: '#f59e0b',
  },
  {
    title: 'Payment Methods',
    description: 'Analysis of payment modes and reconciliation',
    icon: <PieChart className="h-6 w-6" />,
    route: '/reports/payments',
    color: '#ef4444',
  },
  {
    title: 'Category Performance',
    description: 'Sales performance by product categories',
    icon: <BarChart3 className="h-6 w-6" />,
    route: '/reports/categories',
    color: '#06b6d4',
  },
  {
    title: 'Tax Report',
    description: 'GST/VAT summary and tax liability report',
    icon: <FileText className="h-6 w-6" />,
    route: '/reports/tax',
    color: '#ec4899',
  },
];

export const ReportsOverviewPage: React.FC = () => {
  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Reports & Analytics' }]}
      title="Reports & Analytics"
      subtitle="Generate and view business reports"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Today's Sales</p>
                <h3 className="text-primary">₹45,680</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>This Month</p>
                <h3>₹12,45,890</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Profit (MTD)</p>
                <h3 className="text-[#10b981]">₹3,45,267</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Orders (MTD)</p>
                <h3>3,842</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle>{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${report.color}15` }}
                  >
                    <div style={{ color: report.color }}>{report.icon}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recently Generated Reports</CardTitle>
            <CardDescription>Your recent report exports and downloads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Daily Summary - Nov 17, 2025', date: '2025-11-18 09:30 AM', type: 'PDF' },
                { name: 'Sales Report - November 2025', date: '2025-11-15 02:15 PM', type: 'Excel' },
                { name: 'Inventory Valuation Report', date: '2025-11-12 11:45 AM', type: 'PDF' },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-surface-hover">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                        Generated on {report.date}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};
