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
import { Search, Download, Plus, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const DailyCashBookPage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const cashEntries = [
    { id: 'CB001', time: '09:30 AM', type: 'Cash In', category: 'Sales', description: 'Cash sales - Invoice #1234', amount: 5600, balance: 55600, reference: 'INV-1234' },
    { id: 'CB002', time: '10:15 AM', type: 'Cash Out', category: 'Purchase', description: 'Supplier payment', amount: 3000, balance: 52600, reference: 'SUP-789' },
    { id: 'CB003', time: '11:00 AM', type: 'Cash In', category: 'Sales', description: 'Cash sales - Invoice #1235', amount: 8200, balance: 60800, reference: 'INV-1235' },
    { id: 'CB004', time: '12:30 PM', type: 'Cash Out', category: 'Expense', description: 'Electricity bill payment', amount: 3500, balance: 57300, reference: 'EXP-456' },
    { id: 'CB005', time: '02:00 PM', type: 'Cash In', category: 'Collection', description: 'Customer payment received', amount: 12000, balance: 69300, reference: 'CUST-123' },
    { id: 'CB006', time: '03:45 PM', type: 'Cash Out', category: 'Salary', description: 'Staff advance payment', amount: 5000, balance: 64300, reference: 'SAL-789' },
    { id: 'CB007', time: '04:30 PM', type: 'Cash In', category: 'Sales', description: 'Cash sales - Invoice #1236', amount: 4800, balance: 69100, reference: 'INV-1236' },
    { id: 'CB008', time: '05:15 PM', type: 'Cash Out', category: 'Expense', description: 'Miscellaneous expenses', amount: 1200, balance: 67900, reference: 'EXP-457' },
  ];

  const openingBalance = 50000;
  const totalCashIn = cashEntries.filter(e => e.type === 'Cash In').reduce((sum, e) => sum + e.amount, 0);
  const totalCashOut = cashEntries.filter(e => e.type === 'Cash Out').reduce((sum, e) => sum + e.amount, 0);
  const closingBalance = openingBalance + totalCashIn - totalCashOut;

  const handleAddEntry = () => {
    toast.success('Entry Added', { description: 'Cash book entry has been recorded successfully.' });
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
            Daily Cash Book
          </h1>
          <p className="text-muted-foreground mt-1" style={{
            fontSize: 'var(--text-body-m)',
            lineHeight: 'var(--line-height-normal)'
          }}>
            Track daily cash inflow and outflow transactions
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
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
                  Opening Balance
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  ₹{openingBalance.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Today Start</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <Wallet className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Total Cash In
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  ₹{totalCashIn.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-[#10b981]">
                  <ArrowDownRight className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Received</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#10b981]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Total Cash Out
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  ₹{totalCashOut.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-[#ef4444]">
                  <ArrowUpRight className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Paid Out</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-[#ef4444]/10 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-[#ef4444]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Closing Balance
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  ₹{closingBalance.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-[#10b981]">
                  <TrendingUp className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Current</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
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
              <Label>Date</Label>
              <Input type="date" defaultValue="2025-11-18" />
            </div>

            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="in">Cash In</SelectItem>
                  <SelectItem value="out">Cash Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="collection">Collection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Description or reference..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Book Table */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Cash In (₹)</TableHead>
                  <TableHead className="text-right">Cash Out (₹)</TableHead>
                  <TableHead className="text-right">Balance (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Opening Balance Row */}
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={6} className="font-medium">Opening Balance</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right font-medium">₹{openingBalance.toLocaleString()}</TableCell>
                </TableRow>

                {cashEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.id}</TableCell>
                    <TableCell>{entry.time}</TableCell>
                    <TableCell>
                      <Badge variant={entry.type === 'Cash In' ? 'default' : 'destructive'}>
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.category}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{entry.description}</TableCell>
                    <TableCell className="font-medium">{entry.reference}</TableCell>
                    <TableCell className="text-right font-medium text-[#10b981]">
                      {entry.type === 'Cash In' ? `₹${entry.amount.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-[#ef4444]">
                      {entry.type === 'Cash Out' ? `₹${entry.amount.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{entry.balance.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}

                {/* Closing Balance Row */}
                <TableRow className="bg-muted/30 font-medium">
                  <TableCell colSpan={6}>Closing Balance</TableCell>
                  <TableCell className="text-right text-[#10b981]">₹{totalCashIn.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-[#ef4444]">₹{totalCashOut.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{closingBalance.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Receipts</p>
                <p className="text-foreground font-medium mt-1">₹{totalCashIn.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Payments</p>
                <p className="text-foreground font-medium mt-1">₹{totalCashOut.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Net Change</p>
                <p className="text-foreground font-medium mt-1">
                  ₹{(totalCashIn - totalCashOut).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Entry Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Cash Book Entry</DialogTitle>
            <DialogDescription>
              Record a new cash transaction
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entry-time">Date & Time *</Label>
                <Input id="entry-time" type="datetime-local" defaultValue="2025-11-18T17:30" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type *</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Cash In</SelectItem>
                    <SelectItem value="out">Cash Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="collection">Collection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input id="amount" type="number" placeholder="0.00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" placeholder="Transaction description..." rows={3} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number</Label>
              <Input id="reference" placeholder="Invoice/Receipt number" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEntry}>
              Add Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
