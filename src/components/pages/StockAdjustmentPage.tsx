import React, { useState } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Save, Search, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Textarea } from '../ui/textarea';

interface AdjustmentItem {
  id: string;
  itemName: string;
  sku: string;
  currentStock: number;
  adjustmentQty: number;
  newStock: number;
  reason: string;
}

const mockProducts = [
  { id: '1', name: 'Premium Rice 5kg', sku: 'GRC-001', stock: 150 },
  { id: '2', name: 'Cooking Oil 1L', sku: 'GRC-002', stock: 35 },
  { id: '3', name: 'Sugar 1kg', sku: 'GRC-003', stock: 0 },
  { id: '4', name: 'Tea Powder 500g', sku: 'BEV-001', stock: 180 },
];

export const StockAdjustmentPage: React.FC = () => {
  const [items, setItems] = useState<AdjustmentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'subtract'>('add');
  const [globalReason, setGlobalReason] = useState('');

  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addItem = (product: typeof mockProducts[0]) => {
    const newItem: AdjustmentItem = {
      id: Date.now().toString(),
      itemName: product.name,
      sku: product.sku,
      currentStock: product.stock,
      adjustmentQty: 0,
      newStock: product.stock,
      reason: '',
    };
    setItems([...items, newItem]);
    setSearchQuery('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateAdjustment = (id: string, qty: number) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              adjustmentQty: qty,
              newStock: adjustmentType === 'add' ? item.currentStock + qty : item.currentStock - qty,
            }
          : item
      )
    );
  };

  const updateReason = (id: string, reason: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, reason } : item)));
  };

  const saveAdjustment = () => {
    console.log('Stock Adjustment:', {
      type: adjustmentType,
      reason: globalReason,
      items,
    });
    // Reset
    setItems([]);
    setGlobalReason('');
  };

  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Adjustment' }]}
      title="Stock Adjustment"
      subtitle="Adjust inventory levels for physical count or corrections"
      actions={
        <>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm" onClick={saveAdjustment} disabled={items.length === 0}>
            <Save className="h-4 w-4 mr-2" />
            Save Adjustment
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Adjustment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Adjustment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Adjustment Type *</Label>
                <Select value={adjustmentType} onValueChange={(value: 'add' | 'subtract') => setAdjustmentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Stock (+)</SelectItem>
                    <SelectItem value="subtract">Reduce Stock (-)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Adjustment Date</Label>
                <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Overall Reason *</Label>
              <Textarea
                placeholder="Enter reason for stock adjustment (e.g., Physical count, Damage, Theft, etc.)"
                value={globalReason}
                onChange={(e) => setGlobalReason(e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Add Items */}
        <Card>
          <CardHeader>
            <CardTitle>Add Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items by name or SKU..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {searchQuery && (
              <div className="mt-3 border rounded-lg max-h-48 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addItem(product)}
                      className="w-full px-4 py-3 text-left hover:bg-surface-hover border-b last:border-b-0 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                          {product.sku} • Current Stock: {product.stock}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">No items found</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Adjustment Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Adjustment Items ({items.length})</CardTitle>
              {items.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setItems([])}>
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Search className="h-12 w-12 mb-3 opacity-30" />
                <p>Add items to adjust stock</p>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="w-28">Current</TableHead>
                      <TableHead className="w-32">Adjustment</TableHead>
                      <TableHead className="w-28">New Stock</TableHead>
                      <TableHead className="w-64">Reason</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.itemName}</p>
                            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                              {item.sku}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{item.currentStock}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className={adjustmentType === 'add' ? 'text-[#10b981]' : 'text-[#ef4444]'}>
                              {adjustmentType === 'add' ? '+' : '-'}
                            </span>
                            <Input
                              type="number"
                              value={item.adjustmentQty}
                              onChange={(e) => updateAdjustment(item.id, parseInt(e.target.value) || 0)}
                              className="h-9 w-20"
                              min="0"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <span
                            className={
                              item.newStock > item.currentStock
                                ? 'text-[#10b981]'
                                : item.newStock < item.currentStock
                                ? 'text-[#ef4444]'
                                : ''
                            }
                          >
                            {item.newStock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.reason}
                            onChange={(e) => updateReason(item.id, e.target.value)}
                            placeholder="Item reason (optional)"
                            className="h-9"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        {items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Adjustment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Items to Adjust
                  </p>
                  <p className="font-medium">{items.length} items</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Total Adjustment
                  </p>
                  <p
                    className={`font-medium ${
                      adjustmentType === 'add' ? 'text-[#10b981]' : 'text-[#ef4444]'
                    }`}
                  >
                    {adjustmentType === 'add' ? '+' : '-'}
                    {items.reduce((sum, item) => sum + item.adjustmentQty, 0)} units
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Adjustment Type
                  </p>
                  <p className="font-medium">{adjustmentType === 'add' ? 'Add Stock' : 'Reduce Stock'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
};
