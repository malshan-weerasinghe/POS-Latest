import React, { useState, useContext } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Printer, Save, Trash2, Plus, Minus, Search, X, CreditCard, Wallet, Banknote, Smartphone } from 'lucide-react';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { AppContext } from '../../App';
import { toast } from 'sonner@2.0.3';

interface CartItem {
  id: string;
  name: string;
  sku: string;
  costPrice: number;
  price: number;
  quantity: number;
  discount: number;
  tax: number;
}

const mockProducts = [
  { id: '1', name: 'Premium Rice 5kg', sku: 'GRC-001', costPrice: 300, price: 400, stock: 150, category: 'Groceries' },
  { id: '2', name: 'Cooking Oil 1L', sku: 'GRC-002', costPrice: 180, price: 240, stock: 200, category: 'Groceries' },
  { id: '3', name: 'Sugar 1kg', sku: 'GRC-003', costPrice: 40, price: 52, stock: 300, category: 'Groceries' },
  { id: '4', name: 'Tea Powder 500g', sku: 'BEV-001', costPrice: 90, price: 120, stock: 180, category: 'Beverages' },
  { id: '5', name: 'Wheat Flour 10kg', sku: 'GRC-004', costPrice: 320, price: 400, stock: 120, category: 'Groceries' },
];

export const SalesBillingPage: React.FC = () => {
  const { navigateTo } = useContext(AppContext);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountReceived, setAmountReceived] = useState('');

  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: typeof mockProducts[0]) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      updateQuantity(product.id, existing.quantity + 1);
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          sku: product.sku,
          costPrice: product.costPrice,
          price: product.price,
          quantity: 1,
          discount: 0,
          tax: 5, // 5% tax
        },
      ]);
    }
    setSearchQuery('');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const updateDiscount = (id: string, discount: number) => {
    setCart(cart.map((item) => (item.id === id ? { ...item, discount: Math.max(0, discount) } : item)));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const calculateItemTotal = (item: CartItem) => {
    const subtotal = item.price * item.quantity;
    const afterDiscount = subtotal - item.discount;
    const taxAmount = (afterDiscount * item.tax) / 100;
    return afterDiscount + taxAmount;
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = cart.reduce((sum, item) => sum + item.discount, 0);
  const taxableAmount = subtotal - totalDiscount;
  const totalTax = cart.reduce((sum, item) => {
    const itemSubtotal = item.price * item.quantity;
    return sum + ((itemSubtotal - item.discount) * item.tax) / 100;
  }, 0);
  const grandTotal = taxableAmount + totalTax;

  const handlePayment = () => {
    if (cart.length === 0) return;
    setShowPaymentModal(true);
  };

  const completePayment = () => {
    // Here you would process the payment
    console.log('Payment completed:', {
      cart,
      total: grandTotal,
      paymentMethod,
      amountReceived: parseFloat(amountReceived),
      customer: customerPhone,
    });
    
    // Show success toast
    toast.success('Payment Completed!', {
      description: `Invoice generated for Rs ${grandTotal.toFixed(2)}`,
    });
    
    // Reset
    setCart([]);
    setCustomerPhone('');
    setPaymentMethod('cash');
    setAmountReceived('');
    setShowPaymentModal(false);
    // Navigate to receipt page
    navigateTo('receipt');
  };

  const holdBill = () => {
    console.log('Bill held:', cart);
    toast.info('Bill Held', {
      description: `${cart.length} items saved for later`,
    });
    setCart([]);
    // Navigate to hold bills page
    navigateTo('hold-bills');
  };

  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Sales' }, { label: 'Billing' }]}
      title="Sales & Billing"
      subtitle="Create new sales invoice"
    >
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Product Selection & Cart */}
        <div className="col-span-2 space-y-4">
          {/* Search Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Scan barcode or search product by name/SKU..."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Search Results */}
              {searchQuery && (
                <div className="mt-3 border rounded-lg max-h-48 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className="w-full px-4 py-3 text-left hover:bg-surface-hover border-b last:border-b-0 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                            {product.sku} • Stock: {product.stock}
                          </p>
                        </div>
                        <p className="font-medium">Rs {product.price}</p>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-muted-foreground">No products found</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invoice Items ({cart.length})</CardTitle>
                {cart.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => setCart([])}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="h-96 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                  <Search className="h-12 w-12 mb-3 opacity-30" />
                  <p>Search and add items to start billing</p>
                </div>
              ) : (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="w-28">Cost</TableHead>
                        <TableHead className="w-28">Price</TableHead>
                        <TableHead className="w-36">Quantity</TableHead>
                        <TableHead className="w-24">Disc</TableHead>
                        <TableHead className="w-28 text-right">Total</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                                {item.sku}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>Rs {item.costPrice}</TableCell>
                          <TableCell>Rs {item.price}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.discount}
                              onChange={(e) => updateDiscount(item.id, parseFloat(e.target.value) || 0)}
                              className="h-8 w-20"
                              min="0"
                            />
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            Rs {calculateItemTotal(item).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
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
        </div>

        {/* Right: Customer & Payment */}
        <div className="space-y-4">
          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  placeholder="Enter phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Customer
              </Button>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rs {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-destructive">-Rs {totalDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (5%)</span>
                  <span>Rs {totalTax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Grand Total</span>
                  <span className="text-primary" style={{ fontSize: 'var(--text-headline-m)' }}>
                    Rs {grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPaymentMethod('cash')}
                  className="h-16 flex flex-col items-center gap-1"
                >
                  <Banknote className="h-5 w-5" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Cash</span>
                </Button>
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPaymentMethod('card')}
                  className="h-16 flex flex-col items-center gap-1"
                >
                  <CreditCard className="h-5 w-5" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Card</span>
                </Button>
                <Button
                  variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPaymentMethod('upi')}
                  className="h-16 flex flex-col items-center gap-1"
                >
                  <Smartphone className="h-5 w-5" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>UPI</span>
                </Button>
                <Button
                  variant={paymentMethod === 'credit' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPaymentMethod('credit')}
                  className="h-16 flex flex-col items-center gap-1"
                >
                  <Wallet className="h-5 w-5" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Credit</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button className="w-full h-12" size="lg" onClick={handlePayment} disabled={cart.length === 0}>
              Complete Sale - Rs {grandTotal.toFixed(2)}
            </Button>
            <Button variant="outline" className="w-full" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Enter payment details to complete the transaction
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Total Amount</Label>
              <Input value={`Rs ${grandTotal.toFixed(2)}`} disabled />
            </div>
            {paymentMethod === 'cash' && (
              <>
                <div className="space-y-2">
                  <Label>Amount Received</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    autoFocus
                  />
                </div>
                {amountReceived && parseFloat(amountReceived) >= grandTotal && (
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Change to Return:</span>
                      <span className="text-primary font-medium">
                        Rs {(parseFloat(amountReceived) - grandTotal).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={completePayment}
              disabled={paymentMethod === 'cash' && (!amountReceived || parseFloat(amountReceived) < grandTotal)}
            >
              Complete Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};
