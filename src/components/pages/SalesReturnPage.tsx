import React, { useState } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Search, RotateCcw, Check } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';

interface InvoiceItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  total: number;
  returnQty: number;
  selected: boolean;
}

export const SalesReturnPage: React.FC = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [searchedInvoice, setSearchedInvoice] = useState(false);
  const [reason, setReason] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);

  const searchInvoice = () => {
    // Mock invoice data
    setItems([
      {
        id: '1',
        name: 'Premium Rice 5kg',
        qty: 2,
        price: 400,
        total: 800,
        returnQty: 0,
        selected: false,
      },
      {
        id: '2',
        name: 'Cooking Oil 1L',
        qty: 3,
        price: 240,
        total: 720,
        returnQty: 0,
        selected: false,
      },
      {
        id: '3',
        name: 'Tea Powder 500g',
        qty: 1,
        price: 120,
        total: 120,
        returnQty: 0,
        selected: false,
      },
    ]);
    setSearchedInvoice(true);
  };

  const toggleItemSelection = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              selected: !item.selected,
              returnQty: !item.selected ? item.qty : 0,
            }
          : item
      )
    );
  };

  const updateReturnQty = (id: string, qty: number) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              returnQty: Math.min(qty, item.qty),
            }
          : item
      )
    );
  };

  const totalReturnAmount = items.reduce((sum, item) => sum + (item.selected ? item.returnQty * item.price : 0), 0);

  const processReturn = () => {
    const returnItems = items.filter((item) => item.selected && item.returnQty > 0);
    console.log('Processing return:', {
      invoiceNumber,
      reason,
      items: returnItems,
      totalAmount: totalReturnAmount,
    });
    // Reset form
    setInvoiceNumber('');
    setSearchedInvoice(false);
    setReason('');
    setItems([]);
  };

  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Sales' }, { label: 'Sales Return' }]}
      title="Sales Return"
      subtitle="Process returns and refunds"
    >
      <div className="space-y-6">
        {/* Search Invoice */}
        <Card>
          <CardHeader>
            <CardTitle>Find Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1 space-y-2">
                <Label>Invoice Number</Label>
                <Input
                  placeholder="Enter invoice number"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div className="pt-6">
                <Button onClick={searchInvoice} disabled={!invoiceNumber}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {searchedInvoice && (
          <>
            {/* Invoice Details */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                      Invoice Number
                    </p>
                    <p className="font-medium">{invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                      Date
                    </p>
                    <p className="font-medium">Nov 18, 2025</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                      Customer
                    </p>
                    <p className="font-medium">Rajesh Kumar</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                      Total Amount
                    </p>
                    <p className="font-medium">
                      ₹{items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Return Items */}
            <Card>
              <CardHeader>
                <CardTitle>Select Items to Return</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Qty Sold</TableHead>
                        <TableHead>Return Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="text-right">Return Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Checkbox
                              checked={item.selected}
                              onCheckedChange={() => toggleItemSelection(item.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.qty}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.returnQty}
                              onChange={(e) => updateReturnQty(item.id, parseInt(e.target.value) || 0)}
                              className="h-9 w-20"
                              min="0"
                              max={item.qty}
                              disabled={!item.selected}
                            />
                          </TableCell>
                          <TableCell>₹{item.price}</TableCell>
                          <TableCell className="text-right font-medium">
                            ₹{(item.selected ? item.returnQty * item.price : 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Return Reason */}
            <Card>
              <CardHeader>
                <CardTitle>Return Reason</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Reason for Return *</Label>
                  <Textarea
                    placeholder="Enter reason for return..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Return Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Return Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items Selected:</span>
                  <span className="font-medium">{items.filter((i) => i.selected).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Quantity:</span>
                  <span className="font-medium">
                    {items.reduce((sum, item) => sum + (item.selected ? item.returnQty : 0), 0)} units
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Refund Amount:</span>
                  <span className="text-primary" style={{ fontSize: 'var(--text-headline-m)' }}>
                    ₹{totalReturnAmount.toFixed(2)}
                  </span>
                </div>
                <div className="pt-4">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={processReturn}
                    disabled={!items.some((i) => i.selected && i.returnQty > 0) || !reason}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Process Return - ₹{totalReturnAmount.toFixed(2)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageTemplate>
  );
};
