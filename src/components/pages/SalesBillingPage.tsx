import React, { useState, useContext, useEffect } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Printer, Trash2, Plus, Minus, Search, X, CreditCard, Banknote, AlertTriangle } from 'lucide-react';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { AppContext } from '../../App';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { productsAPI, customersAPI, salesAPI } from '../../services/api';
import { cn } from '../ui/utils';

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

interface Product {
  id: string;
  name: string;
  sku: string;
  cost_price: number;
  sale_price: number;
  stock: number;
  category: string;
  warranty_months: number;
}

export const SalesBillingPage: React.FC = () => {
  // Format number with commas for LKR currency
  const formatLKR = (amount: number): string => {
    return amount.toLocaleString('en-LK');
  };

  const { navigateTo } = useContext(AppContext);
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerResults, setShowCustomerResults] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [amountReceived, setAmountReceived] = useState('');
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);
  const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);
  const [isProcessingSale, setIsProcessingSale] = useState(false);
  const [paymentError, setPaymentError] = useState<string>('');

  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
  });

  // Search products API call
  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearchingProducts(true);
    try {
      const response = await productsAPI.search(query);
      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Failed to search products');
    } finally {
      setIsSearchingProducts(false);
    }
  };

  // Search customers API call
  const searchCustomers = async (query: string) => {
    if (!query.trim()) {
      setCustomerResults([]);
      return;
    }

    setIsSearchingCustomers(true);
    try {
      const response = await customersAPI.search(query);
      if (response.success) {
        setCustomerResults(response.data);
      }
    } catch (error) {
      console.error('Error searching customers:', error);
      toast.error('Failed to search customers');
    } finally {
      setIsSearchingCustomers(false);
    }
  };

  // Debounced search effects
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchProducts(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (customerSearch && showCustomerResults) {
        searchCustomers(customerSearch);
      } else {
        setCustomerResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [customerSearch, showCustomerResults]);

  const filteredProducts = searchResults;
  const filteredCustomers = customerResults;

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        toast.error(`Only ${product.stock} units available in stock`);
        return;
      }
      updateQuantity(product.id, existing.quantity + 1);
    } else {
      if (product.stock < 1) {
        toast.error('Product is out of stock');
        return;
      }
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          sku: product.sku,
          costPrice: product.cost_price,
          price: product.sale_price,
          quantity: 1,
          discount: 0,
          tax: 5, // 5% tax
          warrantyMonths: product.warranty_months,
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

  const totalCost = cart.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = cart.reduce((sum, item) => sum + item.discount, 0);
  const taxableAmount = subtotal - totalDiscount;
  const totalTax = cart.reduce((sum, item) => {
    const itemSubtotal = item.price * item.quantity;
    return sum + ((itemSubtotal - item.discount) * item.tax) / 100;
  }, 0);
  const grandTotal = taxableAmount; // No tax added
  const changeAmount = amountReceived && parseFloat(amountReceived) >= grandTotal
    ? parseFloat(amountReceived) - grandTotal
    : 0;

  const getWarrantyExpiry = (months: number) => {
    if (months === 0) return null;
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString('en-GB');
  };

  const handlePayment = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    if (paymentMethod === 'cash' && (!amountReceived || parseFloat(amountReceived) < grandTotal)) {
      toast.error('Please enter amount received (must be >= Grand Total)');
      return;
    }
    setPaymentError(''); // Clear any previous errors
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

  const completePayment = async () => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    setIsProcessingSale(true);
    setPaymentError(''); // Clear any previous errors
    
    try {
      // Prepare sale data
      const saleData: any = {
        items: cart.map(item => ({
          product_id: parseInt(item.id),
          quantity: item.quantity,
          unit_price: item.price,
          discount: item.discount
        })),
        payment_method: paymentMethod,
        amount_received: paymentMethod === 'cash' ? parseFloat(amountReceived) : grandTotal
      };

      // Only add customer_id if a customer is selected
      if (selectedCustomer?.id) {
        saleData.customer_id = selectedCustomer.id;
      }

      // Create the sale
      const response = await salesAPI.create(saleData);
      
      if (response.success) {
        // Show success toast
        toast.success('Payment Completed!', {
          description: `Invoice ${response.data.invoice_number} generated for Rs ${grandTotal.toFixed(2)}`,
        });

        // Reset the form
        setCart([]);
        setCustomerSearch('');
        setSelectedCustomer(null);
        setPaymentMethod('cash');
        setAmountReceived('');
        setShowPaymentModal(false);
        setPaymentError('');
      } else {
        // Show validation errors if available
        let errorMessage = response.message || response.error || 'Failed to process payment';
        if (response.details && Array.isArray(response.details)) {
          errorMessage = response.details.map((d: any) => `${d.field}: ${d.message}`).join(', ');
        }
        setPaymentError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error processing payment:', error);
      const errorMessage = error.message || 'Failed to process payment';
      setPaymentError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessingSale(false);
    }
  };

  const completePaymentAndPrint = () => {
    // Complete the payment first
    completePayment();
    // Print functionality disabled for now
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.phone);
    setShowCustomerResults(false);
  };

  const handleAddNewCustomer = async () => {
    if (!newCustomer.firstName || !newCustomer.phone) {
      toast.error('First Name and Phone are required');
      return;
    }

    try {
      const customerData = {
        name: `${newCustomer.firstName} ${newCustomer.lastName}`.trim(),
        phone: newCustomer.phone,
        email: newCustomer.email || null,
        address: newCustomer.address || null,
      };

      const response = await customersAPI.create(customerData);
      
      if (response.success) {
        const newCustomerRecord = response.data;
        
        toast.success('Customer Added!', {
          description: `${newCustomerRecord.name} has been added successfully`,
        });

        // Select the new customer
        setSelectedCustomer(newCustomerRecord);
        setCustomerSearch(newCustomerRecord.phone);

        // Reset form and close modal
        setNewCustomer({ firstName: '', lastName: '', phone: '', email: '', address: '' });
        setShowAddCustomerModal(false);
      } else {
        toast.error(response.message || 'Failed to add customer');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Failed to add customer');
    }
  };

  const holdBill = () => {
    console.log('Bill held:', cart);
    toast.info('Bill Held', {
      description: `${cart.length} items saved for later`,
    });
    setCart([]);
    // Navigate to hold bills page
    // navigateTo('hold-bills');
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
            <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>** UNLIMITED MOBILE **</div>
            <div style={{ fontSize: '11px', marginTop: '2px' }}>Premium Mobile Phones & Accessories</div>
            <div style={{ fontSize: '11px' }}>123 Main Street, Colombo, Sri Lanka</div>
            <div style={{ fontSize: '11px' }}>Ph: +94 77 123 4567 / +94 11 234 5678</div>
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

                {/* Search Results - Positioned absolutely to overlay */}
                {searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 border rounded-lg max-h-64 overflow-y-auto bg-background shadow-lg z-50">
                    {isSearchingProducts ? (
                      <div className="px-4 py-8 text-center text-muted-foreground">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                        Searching products...
                      </div>
                    ) : filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className={cn(
                            "w-full px-4 py-3 text-left hover:bg-surface-hover border-b last:border-b-0 flex items-center justify-between",
                            product.stock === 0 && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                              {product.sku} • Stock: {product.stock}
                              {product.stock === 0 && " (Out of Stock)"}
                              {product.stock > 0 && product.stock <= 10 && " (Low Stock)"}
                            </p>
                          </div>
                          <p className="font-medium">LKR {formatLKR(product.sale_price)}</p>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-muted-foreground">No products found</div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cart Items */}
          <Card className="flex flex-col" style={{ height: 'calc(100vh - 15rem)' }}>
            <CardHeader className="flex-shrink-0 pb-3">
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

            <CardContent className="flex-1 flex flex-col overflow-hidden p-0 px-6 pb-6">
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg mb-3">
                  <Search className="h-12 w-12 mb-3 opacity-30" />
                  <p>Search and add items to start billing</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto border rounded-lg mb-3">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="w-28">Cost</TableHead>
                        <TableHead className="w-28">Price</TableHead>
                        <TableHead className="w-32">Quantity</TableHead>
                        <TableHead className="w-24">Disc</TableHead>
                        <TableHead className="w-36 text-right">Total</TableHead>
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
                                  {item.warrantyMonths} mo warranty
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>LKR {formatLKR(item.costPrice)}</TableCell>
                          <TableCell>LKR {formatLKR(item.price)}</TableCell>
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
                            LKR {formatLKR(calculateItemTotal(item))}
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

              {/* Summary Bar - Aligned with table columns */}
              <div className="flex-shrink-0 bg-surface-secondary rounded-lg border-2">
                <table className="w-full">
                  <tbody>
                    <tr>
                      {/* Spacer for Item column */}
                      <td className="flex-1 p-3"></td>

                      {/* Total Cost - aligns with Cost column */}
                      <td className="w-28 p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">Total Cost</p>
                        <p className="text-base font-semibold">LKR {formatLKR(totalCost)}</p>
                      </td>

                      {/* Total Price - aligns with Price column */}
                      <td className="w-28 p-3 text-center">
                        <p className="text-xs text-muted-foreground mb-0.5">Total Price</p>
                        <p className="text-base font-semibold">LKR {formatLKR(subtotal)}</p>
                      </td>

                      {/* Blank Space - aligns with Quantity column */}
                      <td className="w-32 p-3"></td>

                      {/* Total Discount - aligns with Disc column, extended width */}
                      <td className="p-3 text-center" colSpan={2}>
                        <p className="text-xs text-muted-foreground mb-0.5">Total Discount</p>
                        <p className="text-base font-semibold text-destructive">LKR {formatLKR(totalDiscount)}</p>
                      </td>

                      {/* Grand Total - compact on the right */}
                      <td className="p-3 text-right">
                        <div className="bg-primary/10 rounded-md p-2 inline-block">
                          <p className="text-xs text-muted-foreground mb-0.5 font-medium">Grand Total</p>
                          <p className="text-lg font-bold text-primary">LKR {formatLKR(grandTotal)}</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Customer & Payment */}
        <div className="flex flex-col gap-6" style={{ height: 'calc(100vh - 15rem)' }}>
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
                      {isSearchingCustomers ? (
                        <div className="px-3 py-4 text-center text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                          Searching customers...
                        </div>
                      ) : filteredCustomers.length > 0 ? (
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

          {/* Payment Method */}
          <Card className="flex-1">
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
                      type="text"
                      placeholder="Enter amount"
                      value={amountReceived ? formatLKR(parseFloat(amountReceived)) : ''}
                      onChange={(e) => {
                        // Remove commas and non-numeric characters except decimal point
                        const numericValue = e.target.value.replace(/,/g, '').replace(/[^\d.]/g, '');
                        setAmountReceived(numericValue);
                      }}
                      className="text-lg font-semibold"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button className="w-full h-12" size="lg" onClick={handlePayment} disabled={cart.length === 0}>
              Complete Sale - LKR {formatLKR(grandTotal)}
            </Button>
            <Button variant="outline" className="w-full" size="sm" onClick={handlePrintPreview}>
              <Printer className="h-4 w-4 mr-2" />
              Print Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Confirmation */}
      <AlertDialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <AlertDialogContent onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === 'Enter' && !e.defaultPrevented) {
            e.preventDefault();
            completePayment();
          }
        }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Sale</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between py-1">
                  <span>Payment Method:</span>
                  <span className="font-semibold">{paymentMethod?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Grand Total:</span>
                  <span className="font-semibold">LKR {formatLKR(grandTotal)}</span>
                </div>
                {paymentMethod === 'cash' && amountReceived && (
                  <>
                    <div className="flex justify-between py-1">
                      <span>Amount Received:</span>
                      <span className="font-semibold">LKR {formatLKR(parseFloat(amountReceived))}</span>
                    </div>
                    {parseFloat(amountReceived) > grandTotal && (
                      <div className="flex justify-between py-1">
                        <span>Change:</span>
                        <span className="font-semibold text-green-600">LKR {formatLKR(parseFloat(amountReceived) - grandTotal)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {paymentError && (
            <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              <AlertTriangle className="mr-2 h-4 w-4" />
              {paymentError}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={completePayment} disabled={isProcessingSale}>
              {isProcessingSale ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                'Confirm'
              )}
            </AlertDialogAction>
            <AlertDialogAction onClick={completePaymentAndPrint} className="ml-2" disabled={isProcessingSale}>
              <Printer className="h-4 w-4 mr-2" />
              Confirm & Print
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>** UNLIMITED MOBILE **</div>
              <div style={{ fontSize: '11px', marginTop: '2px' }}>Premium Mobile Phones & Accessories</div>
              <div style={{ fontSize: '11px' }}>123 Main Street, Colombo, Sri Lanka</div>
              <div style={{ fontSize: '11px' }}>Ph: +94 77 123 4567 / +94 11 234 5678</div>
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
