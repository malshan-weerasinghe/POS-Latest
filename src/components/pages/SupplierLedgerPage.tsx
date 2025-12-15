import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Search, Filter, Download, Plus, TrendingUp, TrendingDown, DollarSign, Receipt } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const SupplierLedgerPage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const ledgerEntries = [
    { id: 'LE001', date: '2025-11-15', supplier: 'ABC Wholesale Ltd', type: 'Purchase', invoiceNo: 'INV-2345', debit: 45000, credit: 0, balance: 45000, description: 'Grocery items purchase' },
    { id: 'LE002', date: '2025-11-14', supplier: 'ABC Wholesale Ltd', type: 'Payment', invoiceNo: 'PAY-1234', debit: 0, credit: 20000, balance: 25000, description: 'Cash payment' },
    { id: 'LE003', date: '2025-11-13', supplier: 'Tech Supplies Co', type: 'Purchase', invoiceNo: 'INV-2344', debit: 32000, credit: 0, balance: 32000, description: 'Electronics purchase' },
    { id: 'LE004', date: '2025-11-12', supplier: 'Tech Supplies Co', type: 'Payment', invoiceNo: 'PAY-1233', debit: 0, credit: 32000, balance: 0, description: 'Online transfer' },
    { id: 'LE005', date: '2025-11-11', supplier: 'Fresh Foods Pvt', type: 'Purchase', invoiceNo: 'INV-2343', debit: 18500, credit: 0, balance: 18500, description: 'Fresh produce' },
    { id: 'LE006', date: '2025-11-10', supplier: 'ABC Wholesale Ltd', type: 'Return', invoiceNo: 'RET-456', debit: 0, credit: 5000, balance: 20000, description: 'Damaged goods return' },
  ];

  const suppliers = ['All Suppliers', 'ABC Wholesale Ltd', 'Tech Supplies Co', 'Fresh Foods Pvt'];

  const totalPayable = ledgerEntries.reduce((sum, entry) => sum + entry.balance, 0);
  const totalPurchases = ledgerEntries.filter(e => e.type === 'Purchase').reduce((sum, e) => sum + e.debit, 0);
  const totalPayments = ledgerEntries.filter(e => e.type === 'Payment').reduce((sum, e) => sum + e.credit, 0);

  const handleAddEntry = () => {
    toast.success('Entry Added', { description: 'Ledger entry has been recorded successfully.' });
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
            Supplier Ledger
          </h1>
          <p className="text-muted-foreground mt-1" style={{
            fontSize: 'var(--text-body-m)',
            lineHeight: 'var(--line-height-normal)'
          }}>
            Track all supplier transactions and outstanding balances
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
                  Total Payable
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  ₹{totalPayable.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-[#ef4444]">
                  <TrendingUp className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Outstanding</span>
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
                  Total Purchases
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  ₹{totalPurchases.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-[#10b981]">
                  <TrendingUp className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>This Month</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Receipt className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Total Payments
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  ₹{totalPayments.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-[#10b981]">
                  <TrendingDown className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Paid Out</span>
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
                  Total Suppliers
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  {suppliers.length - 1}
                </p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Active</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Receipt className="h-6 w-6 text-accent" />
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
              <Label>Supplier</Label>
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  <SelectItem value="abc">ABC Wholesale Ltd</SelectItem>
                  <SelectItem value="tech">Tech Supplies Co</SelectItem>
                  <SelectItem value="fresh">Fresh Foods Pvt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
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
                  placeholder="Invoice or description..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ledger Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ledger Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Invoice/Ref No.</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit (₹)</TableHead>
                  <TableHead className="text-right">Credit (₹)</TableHead>
                  <TableHead className="text-right">Balance (₹)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.date}</TableCell>
                    <TableCell>{entry.supplier}</TableCell>
                    <TableCell>
                      <Badge variant={
                        entry.type === 'Purchase' ? 'default' :
                        entry.type === 'Payment' ? 'secondary' : 'outline'
                      }>
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.invoiceNo}</TableCell>
                    <TableCell className="text-muted-foreground">{entry.description}</TableCell>
                    <TableCell className="text-right font-medium">
                      {entry.debit > 0 ? `₹${entry.debit.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-[#10b981]">
                      {entry.credit > 0 ? `₹${entry.credit.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{entry.balance.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
              Showing 1-6 of 6 entries
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Entry Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Ledger Entry</DialogTitle>
            <DialogDescription>
              Record a new transaction in the supplier ledger
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entry-date">Date *</Label>
                <Input id="entry-date" type="date" defaultValue="2025-11-18" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Select>
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abc">ABC Wholesale Ltd</SelectItem>
                    <SelectItem value="tech">Tech Supplies Co</SelectItem>
                    <SelectItem value="fresh">Fresh Foods Pvt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type *</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="return">Return</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoice">Invoice/Reference No. *</Label>
                <Input id="invoice" placeholder="INV-1234" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="debit">Debit Amount (₹)</Label>
                <Input id="debit" type="number" placeholder="0.00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credit">Credit Amount (₹)</Label>
                <Input id="credit" type="number" placeholder="0.00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="Transaction description..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-mode">Payment Mode</Label>
              <Select>
                <SelectTrigger id="payment-mode">
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online">Online Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
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
