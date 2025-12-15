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
import { Search, Download, Plus, TrendingUp, TrendingDown, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const StockMovementLogPage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const movements = [
    { id: 'SM001', date: '2025-11-18', time: '10:30 AM', product: 'Premium Rice 5kg', sku: 'RICE-5KG', type: 'Stock In', quantity: 100, reason: 'Purchase from supplier', reference: 'PO-2345', performedBy: 'Amit Patel' },
    { id: 'SM002', date: '2025-11-18', time: '11:15 AM', product: 'Wireless Mouse', sku: 'TECH-MS-001', type: 'Stock Out', quantity: 5, reason: 'Sales - Invoice #1234', reference: 'INV-1234', performedBy: 'Priya Sharma' },
    { id: 'SM003', date: '2025-11-17', time: '02:00 PM', product: 'Cotton T-Shirt', sku: 'CLO-TS-001', type: 'Stock In', quantity: 50, reason: 'GRN approval', reference: 'GRN-456', performedBy: 'Amit Patel' },
    { id: 'SM004', date: '2025-11-17', time: '03:30 PM', product: 'Premium Rice 5kg', sku: 'RICE-5KG', type: 'Stock Out', quantity: 10, reason: 'Damaged goods', reference: 'ADJ-789', performedBy: 'Sneha Reddy' },
    { id: 'SM005', date: '2025-11-16', time: '09:45 AM', product: 'Basmati Rice 1kg', sku: 'RICE-BAS-1', type: 'Adjustment', quantity: 5, reason: 'Stock reconciliation', reference: 'ADJ-788', performedBy: 'Sneha Reddy' },
    { id: 'SM006', date: '2025-11-16', time: '04:00 PM', product: 'Laptop Charger', sku: 'TECH-CHR-001', type: 'Stock In', quantity: 20, reason: 'Purchase return credit', reference: 'RET-123', performedBy: 'Amit Patel' },
    { id: 'SM007', date: '2025-11-15', time: '11:00 AM', product: 'Wireless Mouse', sku: 'TECH-MS-001', type: 'Stock Out', quantity: 3, reason: 'Sales return', reference: 'RET-124', performedBy: 'Priya Sharma' },
    { id: 'SM008', date: '2025-11-15', time: '01:30 PM', product: 'Cotton T-Shirt', sku: 'CLO-TS-001', type: 'Transfer', quantity: 10, reason: 'Branch transfer', reference: 'TRF-456', performedBy: 'Vikram Singh' },
  ];

  const totalStockIn = movements.filter(m => m.type === 'Stock In').reduce((sum, m) => sum + m.quantity, 0);
  const totalStockOut = movements.filter(m => m.type === 'Stock Out').reduce((sum, m) => sum + m.quantity, 0);
  const totalAdjustments = movements.filter(m => m.type === 'Adjustment').length;
  const totalTransfers = movements.filter(m => m.type === 'Transfer').reduce((sum, m) => sum + m.quantity, 0);

  const handleAddMovement = () => {
    toast.success('Movement Logged', { description: 'Stock movement has been recorded successfully.' });
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
            Stock Movement Log
          </h1>
          <p className="text-muted-foreground mt-1" style={{
            fontSize: 'var(--text-body-m)',
            lineHeight: 'var(--line-height-normal)'
          }}>
            Track all inventory movements and adjustments
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Log Movement
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
                  Total Stock In
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  {totalStockIn}
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
                  Total Stock Out
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  {totalStockOut}
                </p>
                <div className="flex items-center gap-1 text-[#ef4444]">
                  <ArrowUpRight className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Dispatched</span>
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
                  Adjustments
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  {totalAdjustments}
                </p>
                <div className="flex items-center gap-1 text-[#f59e0b]">
                  <span style={{ fontSize: 'var(--text-body-s)' }}>This Period</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-[#f59e0b]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Transfers
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  {totalTransfers}
                </p>
                <div className="flex items-center gap-1 text-primary">
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Items Moved</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Movement Type</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="in">Stock In</SelectItem>
                  <SelectItem value="out">Stock Out</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
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
                  <SelectItem value="groceries">Groceries</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date From</Label>
              <Input type="date" defaultValue="2025-11-15" />
            </div>

            <div className="space-y-2">
              <Label>Date To</Label>
              <Input type="date" defaultValue="2025-11-18" />
            </div>

            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Product or SKU..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Movement Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Movement History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Performed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="font-medium">{movement.id}</TableCell>
                    <TableCell>
                      <div>{movement.date}</div>
                      <div className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                        {movement.time}
                      </div>
                    </TableCell>
                    <TableCell>{movement.product}</TableCell>
                    <TableCell className="font-medium">{movement.sku}</TableCell>
                    <TableCell>
                      <Badge variant={
                        movement.type === 'Stock In' ? 'default' :
                        movement.type === 'Stock Out' ? 'destructive' :
                        movement.type === 'Transfer' ? 'outline' : 'secondary'
                      }>
                        {movement.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={
                        movement.type === 'Stock In' ? 'text-[#10b981]' :
                        movement.type === 'Stock Out' ? 'text-[#ef4444]' : ''
                      }>
                        {movement.type === 'Stock In' && '+'}
                        {movement.type === 'Stock Out' && '-'}
                        {movement.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{movement.reason}</TableCell>
                    <TableCell className="font-medium">{movement.reference}</TableCell>
                    <TableCell>{movement.performedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
              Showing 1-8 of 8 movements
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Stock In</p>
                <p className="text-[#10b981] font-medium mt-1">+{totalStockIn} items</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Stock Out</p>
                <p className="text-[#ef4444] font-medium mt-1">-{totalStockOut} items</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Net Movement</p>
                <p className="text-foreground font-medium mt-1">
                  {totalStockIn - totalStockOut > 0 ? '+' : ''}
                  {totalStockIn - totalStockOut} items
                </p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Transactions</p>
                <p className="text-foreground font-medium mt-1">{movements.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Movement Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Log Stock Movement</DialogTitle>
            <DialogDescription>
              Record a new stock movement transaction
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="movement-date">Date & Time *</Label>
                <Input id="movement-date" type="datetime-local" defaultValue="2025-11-18T17:30" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Movement Type *</Label>
                <Select>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Stock In</SelectItem>
                    <SelectItem value="out">Stock Out</SelectItem>
                    <SelectItem value="adjustment">Adjustment</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product *</Label>
                <Select>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice5">Premium Rice 5kg</SelectItem>
                    <SelectItem value="mouse">Wireless Mouse</SelectItem>
                    <SelectItem value="tshirt">Cotton T-Shirt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input id="quantity" type="number" placeholder="0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Textarea id="reason" placeholder="Reason for stock movement..." rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference">Reference Number *</Label>
                <Input id="reference" placeholder="PO/INV/ADJ/TRF number" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="performed-by">Performed By</Label>
                <Input id="performed-by" placeholder="Employee name" defaultValue="Current User" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMovement}>
              Log Movement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
