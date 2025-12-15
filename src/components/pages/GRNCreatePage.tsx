import React, { useState } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Save, X, Search, Minus, Calendar } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Separator } from '../ui/separator';

interface GRNItem {
  id: string;
  itemName: string;
  sku: string;
  orderedQty: number;
  receivedQty: number;
  costPrice: number;
  batchNumber: string;
  expiryDate: string;
}

const mockProducts = [
  { id: '1', name: 'Premium Rice 5kg', sku: 'GRC-001', costPrice: 320 },
  { id: '2', name: 'Cooking Oil 1L', sku: 'GRC-002', costPrice: 190 },
  { id: '3', name: 'Sugar 1kg', sku: 'GRC-003', costPrice: 42 },
  { id: '4', name: 'Tea Powder 500g', sku: 'BEV-001', costPrice: 95 },
  { id: '5', name: 'Wheat Flour 10kg', sku: 'GRC-004', costPrice: 320 },
];

export const GRNCreatePage: React.FC = () => {
  const [items, setItems] = useState<GRNItem[]>([]);
  const [supplier, setSupplier] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addItem = (product: typeof mockProducts[0]) => {
    const newItem: GRNItem = {
      id: Date.now().toString(),
      itemName: product.name,
      sku: product.sku,
      orderedQty: 0,
      receivedQty: 0,
      costPrice: product.costPrice,
      batchNumber: '',
      expiryDate: '',
    };
    setItems([...items, newItem]);
    setSearchQuery('');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof GRNItem, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const totalAmount = items.reduce((sum, item) => sum + item.receivedQty * item.costPrice, 0);

  const handleSaveGRN = () => {
    console.log('GRN Saved:', {
      supplier,
      poNumber,
      invoiceNumber,
      invoiceDate,
      items,
      totalAmount,
    });
    // Reset form
  };

  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Suppliers & GRN' }, { label: 'Create GRN' }]}
      title="Create GRN"
      subtitle="Goods Receipt Note for incoming stock"
      actions={
        <>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSaveGRN} disabled={items.length === 0}>
            <Save className="h-4 w-4 mr-2" />
            Save GRN
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* GRN Header */}
        <Card>
          <CardHeader>
            <CardTitle>GRN Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Supplier *</Label>
                <Select value={supplier} onValueChange={setSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ABC Wholesale">ABC Wholesale</SelectItem>
                    <SelectItem value="XYZ Traders">XYZ Traders</SelectItem>
                    <SelectItem value="PQR Distributors">PQR Distributors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>PO Number (Optional)</Label>
                <Input
                  placeholder="Enter PO number"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Supplier Invoice Number *</Label>
                <Input
                  placeholder="Enter invoice number"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Invoice Date *</Label>
                <Input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
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
                          {product.sku}
                        </p>
                      </div>
                      <p className="font-medium">₹{product.costPrice}</p>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">No items found</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>GRN Items ({items.length})</CardTitle>
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
                <p>Add items to create GRN</p>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="w-28">Ordered</TableHead>
                      <TableHead className="w-28">Received</TableHead>
                      <TableHead className="w-28">Cost Price</TableHead>
                      <TableHead className="w-36">Batch No.</TableHead>
                      <TableHead className="w-36">Expiry Date</TableHead>
                      <TableHead className="w-28 text-right">Total</TableHead>
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
                        <TableCell>
                          <Input
                            type="number"
                            value={item.orderedQty}
                            onChange={(e) => updateItem(item.id, 'orderedQty', parseInt(e.target.value) || 0)}
                            className="h-9"
                            min="0"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.receivedQty}
                            onChange={(e) => updateItem(item.id, 'receivedQty', parseInt(e.target.value) || 0)}
                            className="h-9"
                            min="0"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.costPrice}
                            onChange={(e) => updateItem(item.id, 'costPrice', parseFloat(e.target.value) || 0)}
                            className="h-9"
                            min="0"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.batchNumber}
                            onChange={(e) => updateItem(item.id, 'batchNumber', e.target.value)}
                            placeholder="Batch"
                            className="h-9"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={item.expiryDate}
                            onChange={(e) => updateItem(item.id, 'expiryDate', e.target.value)}
                            className="h-9"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{(item.receivedQty * item.costPrice).toFixed(2)}
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
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Items:</span>
                  <span className="font-medium">{items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Quantity Received:</span>
                  <span className="font-medium">
                    {items.reduce((sum, item) => sum + item.receivedQty, 0)} units
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-primary" style={{ fontSize: 'var(--text-headline-m)' }}>
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTemplate>
  );
};
