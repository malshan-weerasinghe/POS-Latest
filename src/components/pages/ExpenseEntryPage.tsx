import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Search, Download, Plus, TrendingUp, DollarSign, CreditCard, Wallet } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const ExpenseEntryPage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const expenses = [
    { id: 'EXP001', date: '2025-11-18', category: 'Rent', description: 'Monthly shop rent', amount: 25000, paymentMode: 'Online Transfer', paidTo: 'Property Owner', status: 'Paid' },
    { id: 'EXP002', date: '2025-11-17', category: 'Utilities', description: 'Electricity bill', amount: 3500, paymentMode: 'Cash', paidTo: 'Electricity Board', status: 'Paid' },
    { id: 'EXP003', date: '2025-11-16', category: 'Salaries', description: 'Staff salary - November', amount: 45000, paymentMode: 'Online Transfer', paidTo: 'Employees', status: 'Paid' },
    { id: 'EXP004', date: '2025-11-15', category: 'Maintenance', description: 'AC repair and service', amount: 4500, paymentMode: 'Cash', paidTo: 'Service Center', status: 'Paid' },
    { id: 'EXP005', date: '2025-11-14', category: 'Transportation', description: 'Delivery vehicle fuel', amount: 2800, paymentMode: 'Cash', paidTo: 'Fuel Station', status: 'Paid' },
    { id: 'EXP006', date: '2025-11-13', category: 'Marketing', description: 'Social media ads', amount: 5000, paymentMode: 'Online Transfer', paidTo: 'Ad Platform', status: 'Pending' },
    { id: 'EXP007', date: '2025-11-12', category: 'Office Supplies', description: 'Stationery and printing', amount: 1200, paymentMode: 'Cash', paidTo: 'Stationery Shop', status: 'Paid' },
    { id: 'EXP008', date: '2025-11-11', category: 'Utilities', description: 'Internet & phone bill', amount: 2000, paymentMode: 'Online Transfer', paidTo: 'Telecom Provider', status: 'Paid' },
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const todayExpenses = expenses.filter(e => e.date === '2025-11-18').reduce((sum, e) => sum + e.amount, 0);
  const monthExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const pendingCount = expenses.filter(e => e.status === 'Pending').length;

  const handleAddExpense = () => {
    toast.success('Expense Added', { description: 'Expense entry has been recorded successfully.' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground" style={{
            fontSize: 'var(--text-display-s)',
            fontWeight: 'var(--font-weight-bold)',
            lineHeight: 'var(--line-height-tight)'
          }}>
            Expense Entry
          </h1>
          <p className="text-muted-foreground mt-1" style={{
            fontSize: 'var(--text-body-m)',
            lineHeight: 'var(--line-height-normal)'
          }}>
            Track and manage business expenses
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Today's Expenses
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  ₹{todayExpenses.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-[#ef4444]">
                  <TrendingUp className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>1 entry</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  This Month
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  ₹{monthExpenses.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-[#ef4444]">
                  <TrendingUp className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>8 entries</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Average Daily
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  ₹{Math.round(totalExpenses / 7).toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Last 7 days</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Pending Payment
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  {pendingCount}
                </p>
                <div className="flex items-center gap-1 text-[#f59e0b]">
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Action needed</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="salaries">Salaries</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="office">Office Supplies</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Mode</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online">Online Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select defaultValue="month">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Description or vendor..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Paid To</TableHead>
                  <TableHead>Payment Mode</TableHead>
                  <TableHead className="text-right">Amount (₹)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{expense.category}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{expense.description}</TableCell>
                    <TableCell>{expense.paidTo}</TableCell>
                    <TableCell>{expense.paymentMode}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={expense.status === 'Paid' ? 'default' : 'secondary'}>
                        {expense.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
              Showing 1-8 of 8 entries
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Expense Entry</DialogTitle>
            <DialogDescription>
              Record a new business expense
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense-date">Date *</Label>
                <Input id="expense-date" type="date" defaultValue="2025-11-18" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="salaries">Salaries</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="office">Office Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" placeholder="Expense description..." rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input id="amount" type="number" placeholder="0.00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paid-to">Paid To *</Label>
                <Input id="paid-to" placeholder="Vendor/Person name" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment-mode">Payment Mode *</Label>
                <Select>
                  <SelectTrigger id="payment-mode">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoice">Invoice/Receipt Number</Label>
              <Input id="invoice" placeholder="Optional reference number" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExpense}>
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
