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
import { Textarea } from '../ui/textarea';
import { AppContext } from '../../App';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  name: string;
  sku: string;
  costPrice: number;
  price: number;
  quantity: number;
  discount: number;
  tax: number;
  warrantyMonths: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

const mockCustomers: Customer[] = [
  { id: '1', name: 'John Silva', phone: '0771234567', email: 'john@email.com', address: 'Colombo 03' },
  { id: '2', name: 'Mary Fernando', phone: '0767654321', email: 'mary@email.com', address: 'Kandy' },
  { id: '3', name: 'Sunil Perera', phone: '0759876543', email: 'sunil@email.com', address: 'Galle' },
  { id: '4', name: 'Nimal Kumar', phone: '0771112222', email: 'nimal@email.com', address: 'Negombo' },
  { id: '5', name: 'Kamala Jayawardena', phone: '0763334444', email: 'kamala@email.com', address: 'Matara' },
];

const mockProducts = [
  { id: '1', name: 'Premium Rice 5kg', sku: 'GRC-001', costPrice: 300, price: 400, stock: 150, category: 'Groceries', warrantyMonths: 0 },
  { id: '2', name: 'Cooking Oil 1L', sku: 'GRC-002', costPrice: 180, price: 240, stock: 200, category: 'Groceries', warrantyMonths: 0 },
  { id: '3', name: 'Sugar 1kg', sku: 'GRC-003', costPrice: 40, price: 52, stock: 300, category: 'Groceries', warrantyMonths: 0 },
  { id: '4', name: 'Tea Powder 500g', sku: 'BEV-001', costPrice: 90, price: 120, stock: 180, category: 'Beverages', warrantyMonths: 0 },
  { id: '5', name: 'Wheat Flour 10kg', sku: 'GRC-004', costPrice: 320, price: 400, stock: 120, category: 'Groceries', warrantyMonths: 0 },
];

export const SalesBillingPage: React.FC = () => {
  const { navigateTo } = useContext(AppContext);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerResults, setShowCustomerResults] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountReceived, setAmountReceived] = useState('');
  
  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
  });

  const filteredProducts = mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustomers = mockCustomers.filter(
    (c) =>
      c.phone.includes(customerSearch) ||
      c.name.toLowerCase().includes(customerSearch.toLowerCase())
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
          warrantyMonths: product.warrantyMonths,
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
  const grandTotal = taxableAmount; // No tax added

  const getWarrantyExpiry = (months: number) => {
    if (months === 0) return null;
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString('en-GB');
  };

  const handlePayment = () => {
    if (cart.length === 0) return;
    setShowPaymentModal(true);
  };

  const handlePrintPreview = () => {
    if (cart.length === 0) {
      toast.error('Add items to cart before printing');
      return;
    }
    setShowInvoicePreview(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const completePayment = () => {
    // Here you would process the payment
    console.log('Payment completed:', {
      cart,
      total: grandTotal,
      paymentMethod,
      amountReceived: parseFloat(amountReceived),
      customer: selectedCustomer,
    });
    
    // Show success toast
    toast.success('Payment Completed!', {
      description: `Invoice generated for Rs ${grandTotal.toFixed(2)}`,
    });
    
    // Reset
    setCart([]);
    setCustomerSearch('');
    setSelectedCustomer(null);
    setPaymentMethod('cash');
    setAmountReceived('');
    setShowPaymentModal(false);
    // Navigate to receipt page
    navigateTo('receipt');
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.phone);
    setShowCustomerResults(false);
  };

  const handleAddNewCustomer = () => {
    if (!newCustomer.firstName || !newCustomer.phone) {
      toast.error('First Name and Phone are required');
      return;
    }

    const customer: Customer = {
      id: Date.now().toString(),
      name: `${newCustomer.firstName} ${newCustomer.lastName}`.trim(),
      phone: newCustomer.phone,
      email: newCustomer.email,
      address: newCustomer.address,
    };

    // In real app, save to database
    mockCustomers.push(customer);
    
    toast.success('Customer Added!', {
      description: `${customer.name} has been added successfully`,
    });

    // Select the new customer
    setSelectedCustomer(customer);
    setCustomerSearch(customer.phone);
    
    // Reset form and close modal
    setNewCustomer({ firstName: '', lastName: '', phone: '', email: '', address: '' });
    setShowAddCustomerModal(false);
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
    <PageTemplate hideHeader>
      {/* Hidden Receipt Template for 80mm Thermal Printer */}
      <div id="thermal-receipt" style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div style={{ 
          width: '80mm', 
          fontFamily: '"Courier New", monospace', 
          fontSize: '11px', 
          lineHeight: '1.3',
          padding: '2mm',
          color: '#000',
          background: '#fff'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>** MY PHONE SHOP **</div>
            <div style={{ fontSize: '11px', marginTop: '2px' }}>Premium Pre-Owned Devices</div>
            <div style={{ fontSize: '11px' }}>123 Mobile Street, Colombo</div>
            <div style={{ fontSize: '11px' }}>Ph: 011-2345678 / 077-1234567</div>
          </div>
          <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

          {/* Bill Info */}
          <div style={{ fontSize: '11px', marginBottom: '5px' }}>
            <div>Date: {new Date().toLocaleDateString('en-GB')}         Time: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
            <div>Bill No: #INV25-{Date.now().toString().slice(-5)}</div>
            <div>Cashier: Admin</div>
          </div>
          <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

          {/* Customer Info */}
          {selectedCustomer && (
            <>
              <div style={{ fontSize: '11px', marginBottom: '5px' }}>
                <div>Customer: {selectedCustomer.name}</div>
                <div>Phone: {selectedCustomer.phone}</div>
              </div>
              <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>
            </>
          )}

          {/* Items Header */}
          <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>
            <div>ITEM DESCRIPTION</div>
            <div>Qty x Price                        TOTAL</div>
          </div>
          <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

          {/* Items */}
          {cart.map((item, index) => (
            <div key={item.id} style={{ fontSize: '11px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div>{item.quantity} x {item.name}</div>
                  <div style={{ fontSize: '10px', marginLeft: '5px' }}>SKU: {item.sku}</div>
                  {item.warrantyMonths > 0 && (
                    <div style={{ fontSize: '10px', marginLeft: '5px' }}>
                      *Warranty: {item.warrantyMonths} Months (Till {getWarrantyExpiry(item.warrantyMonths)})
                    </div>
                  )}
                  {item.warrantyMonths === 0 && (
                    <div style={{ fontSize: '10px', marginLeft: '5px' }}>*Warranty: N/A</div>
                  )}
                </div>
                <div style={{ whiteSpace: 'nowrap', marginLeft: '10px' }}>
                  {(item.price * item.quantity - item.discount).toFixed(2)}
                </div>
              </div>
            </div>
          ))}

          <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

          {/* Totals */}
          <div style={{ fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>Subtotal:</span>
              <span>{subtotal.toFixed(2)}</span>
            </div>
            {totalDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span>Discount:</span>
                <span>-{totalDiscount.toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span>Tax (5%):</span>
              <span>{totalTax.toFixed(2)}</span>
            </div>
          </div>
          <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

          {/* Grand Total */}
          <div style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'center', margin: '5px 0' }}>
            *** GRAND TOTAL:      LKR {grandTotal.toFixed(2)} ***
          </div>
          <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

          {/* Payment Details */}
          {paymentMethod && (
            <div style={{ fontSize: '11px', marginBottom: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>PAID BY: {paymentMethod.toUpperCase()}</span>
                <span>{amountReceived || grandTotal.toFixed(2)}</span>
              </div>
              {paymentMethod === 'cash' && amountReceived && parseFloat(amountReceived) > grandTotal && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>CHANGE DUE:</span>
                  <span>{(parseFloat(amountReceived) - grandTotal).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {/* Warranty Terms */}
          <div style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', margin: '8px 0', padding: '5px 0' }}>
            <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>
              WARRANTY TERMS
            </div>
            <div style={{ fontSize: '9px', lineHeight: '1.3' }}>
              <div>1. This original bill is mandatory for</div>
              <div>   any warranty claims.</div>
              <div>2. Warranty covers hardware defects</div>
              <div>   ONLY.</div>
              <div>3. Warranty is VOID in case of physical</div>
              <div>   damage, water/liquid damage, or</div>
              <div>   unauthorized repairs.</div>
              <div>4. No cash refunds. Exchange within</div>
              <div>   7 days for faulty devices only.</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', fontSize: '11px', marginTop: '8px' }}>
            <div style={{ fontWeight: 'bold' }}>Thank You For Your Purchase!</div>
            <div style={{ marginTop: '2px' }}>Please Visit Again.</div>
          </div>
        </div>
      </div>

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
                              {item.warrantyMonths > 0 && (
                                <p className="text-primary" style={{ fontSize: 'var(--text-body-s)' }}>
                                  Warranty: {item.warrantyMonths} months (Valid till {getWarrantyExpiry(item.warrantyMonths)})
                                </p>
                              )}
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
        <div className="sticky top-8 h-[calc(100vh-8rem)] overflow-y-auto space-y-4">
          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle>Customer (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedCustomer ? (
                <div className="space-y-3">
                  <div className="p-3 bg-surface-secondary rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{selectedCustomer.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                          {selectedCustomer.phone}
                        </p>
                        {selectedCustomer.email && (
                          <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                            {selectedCustomer.email}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCustomer(null);
                          setCustomerSearch('');
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Search Customer</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Phone number or name..."
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setShowCustomerResults(true);
                      }}
                      onFocus={() => setShowCustomerResults(true)}
                      className="pl-10"
                    />
                  </div>

                  {/* Customer Search Results */}
                  {showCustomerResults && customerSearch && (
                    <div className="border rounded-lg max-h-48 overflow-y-auto">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <button
                            key={customer.id}
                            onClick={() => handleCustomerSelect(customer)}
                            className="w-full px-3 py-2 text-left hover:bg-surface-hover border-b last:border-b-0"
                          >
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                              {customer.phone}
                            </p>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                          No customers found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setShowAddCustomerModal(true)}
              >
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
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Grand Total</span>
                  <span className="text-primary" style={{ fontSize: 'var(--text-headline-m)' }}>
                    Rs {grandTotal.toFixed(2)}
                  </span>
                </div>
                {paymentMethod === 'cash' && amountReceived && parseFloat(amountReceived) >= grandTotal && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Amount Received</span>
                      <span>Rs {parseFloat(amountReceived).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-primary">Change</span>
                      <span className="text-primary font-semibold" style={{ fontSize: 'var(--text-headline-s)' }}>
                        Rs {(parseFloat(amountReceived) - grandTotal).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              </div>
              
              {/* Cash Payment Input */}
              {paymentMethod === 'cash' && (
                <div className="space-y-3 pt-2">
                  <div className="space-y-2">
                    <Label>Amount Received</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button className="w-full h-12" size="lg" onClick={handlePayment} disabled={cart.length === 0}>
              Complete Sale - Rs {grandTotal.toFixed(2)}
            </Button>
            <Button variant="outline" className="w-full" size="sm" onClick={handlePrintPreview}>
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

      {/* Add Customer Modal */}
      <Dialog open={showAddCustomerModal} onOpenChange={setShowAddCustomerModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter details for the new customer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={newCustomer.firstName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={newCustomer.lastName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                placeholder="07x xxx xxxx"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                placeholder="customer@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                placeholder="Enter complete address"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddCustomerModal(false);
              setNewCustomer({ firstName: '', lastName: '', phone: '', email: '', address: '' });
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddNewCustomer}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invoice Preview Modal */}
      <Dialog open={showInvoicePreview} onOpenChange={setShowInvoicePreview}>
        <DialogContent className="max-w-[340px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Preview (80mm)</DialogTitle>
          </DialogHeader>
          
          <div id="invoice-receipt" style={{ 
            fontFamily: '"Courier New", monospace', 
            fontSize: '11px', 
            lineHeight: '1.3',
            padding: '10px',
            border: '1px solid #e5e5e5',
            borderRadius: '8px',
            background: 'white',
            width: '302px',
            margin: '0 auto'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>** MY PHONE SHOP **</div>
              <div style={{ fontSize: '11px', marginTop: '2px' }}>Premium Pre-Owned Devices</div>
              <div style={{ fontSize: '11px' }}>123 Mobile Street, Colombo</div>
              <div style={{ fontSize: '11px' }}>Ph: 011-2345678 / 077-1234567</div>
            </div>
            <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

            {/* Bill Info */}
            <div style={{ fontSize: '11px', marginBottom: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Date: {new Date().toLocaleDateString('en-GB')}</span>
                <span>Time: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
              </div>
              <div>Bill No: #INV25-{Date.now().toString().slice(-5)}</div>
              <div>Cashier: Admin</div>
            </div>
            <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

            {/* Customer Info */}
            {selectedCustomer && (
              <>
                <div style={{ fontSize: '11px', marginBottom: '5px' }}>
                  <div>Customer: {selectedCustomer.name}</div>
                  <div>Phone: {selectedCustomer.phone}</div>
                </div>
                <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>
              </>
            )}

            {/* Items Header */}
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ width: '20px' }}>Ln</span>
                <span style={{ flex: 1 }}>Item</span>
                <span style={{ width: '60px', textAlign: 'right' }}>Price</span>
                <span style={{ width: '30px', textAlign: 'center' }}>Qty</span>
                <span style={{ width: '60px', textAlign: 'right' }}>Amount</span>
              </div>
            </div>
            <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

            {/* Items */}
            {cart.map((item, index) => (
              <div key={item.id} style={{ fontSize: '11px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ width: '20px' }}>{String(index + 1).padStart(2, '0')}</span>
                  <span style={{ flex: 1 }}>{item.sku}</span>
                  <span style={{ width: '60px', textAlign: 'right' }}>{item.price.toFixed(2)}</span>
                  <span style={{ width: '30px', textAlign: 'center' }}>{item.quantity}</span>
                  <span style={{ width: '60px', textAlign: 'right' }}>{(item.price * item.quantity - item.discount).toFixed(2)}</span>
                </div>
                <div style={{ marginLeft: '20px', fontSize: '11px' }}>
                  {item.name}
                </div>
                <div style={{ marginLeft: '20px', fontSize: '10px' }}>
                  {item.warrantyMonths > 0 ? (
                    <>*{item.warrantyMonths} months warranty</>
                  ) : (
                    <>*No warranty</>
                  )}
                </div>
              </div>
            ))}

            <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

            {/* Totals */}
            <div style={{ fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span>Subtotal:</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span>Discount:</span>
                  <span>-{totalDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

            {/* Grand Total */}
            <div style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'center', margin: '5px 0' }}>
              *** GRAND TOTAL:      LKR {grandTotal.toFixed(2)} ***
            </div>
            <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

            {/* Payment Details */}
            {paymentMethod && (
              <div style={{ fontSize: '11px', marginBottom: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>PAID BY: {paymentMethod.toUpperCase()}</span>
                  <span>{amountReceived || grandTotal.toFixed(2)}</span>
                </div>
                {paymentMethod === 'cash' && amountReceived && parseFloat(amountReceived) > grandTotal && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>CHANGE DUE:</span>
                    <span>{(parseFloat(amountReceived) - grandTotal).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Warranty Terms */}
            <div style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', margin: '8px 0', padding: '5px 0' }}>
              <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>
                WARRANTY TERMS
              </div>
              <div style={{ fontSize: '9px', lineHeight: '1.3' }}>
                <div>1. This original bill is mandatory for</div>
                <div>   any warranty claims.</div>
                <div>2. Warranty covers hardware defects</div>
                <div>   ONLY.</div>
                <div>3. Warranty is VOID in case of physical</div>
                <div>   damage, water/liquid damage, or</div>
                <div>   unauthorized repairs.</div>
                <div>4. No cash refunds. Exchange within</div>
                <div>   7 days for faulty devices only.</div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', fontSize: '11px', marginTop: '8px' }}>
              <div style={{ fontWeight: 'bold' }}>Thank You For Your Purchase!</div>
              <div style={{ marginTop: '2px' }}>Please Visit Again.</div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvoicePreview(false)}>
              Close
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};
