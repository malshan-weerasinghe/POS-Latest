import React, { useState, useEffect } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Search, Calendar, ChevronDown, ChevronRight, Printer, FileText, Download, DollarSign, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { salesAPI } from '../../services/api';
import { toast } from 'sonner';

interface InvoiceProduct {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  totalAmount: number;
  status: 'paid' | 'pending';
  paymentMethod: 'cash' | 'card' | 'upi';
  products: InvoiceProduct[];
}

// Mock data
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV25-10001',
    customerName: 'John Silva',
    customerPhone: '0771234567',
    date: '2025-12-18',
    time: '09:30 AM',
    totalAmount: 167200.00,
    status: 'paid',
    paymentMethod: 'cash',
    products: [
      { id: 'p1', name: 'iPhone 13 Pro 128GB', sku: 'PHN-IP13P-128', quantity: 1, unitPrice: 135000, discount: 1700, subtotal: 133300 },
      { id: 'p2', name: 'AirPods Pro 2nd Gen', sku: 'ACC-AP-PRO2', quantity: 1, unitPrice: 32000, discount: 500, subtotal: 31500 },
      { id: 'p3', name: 'Phone Case Universal', sku: 'ACC-CASE-UNI', quantity: 2, unitPrice: 1200, discount: 0, subtotal: 2400 },
    ],
  },
  {
    id: '2',
    invoiceNumber: 'INV25-10002',
    customerName: 'Mary Fernando',
    customerPhone: '0767654321',
    date: '2025-12-18',
    time: '10:15 AM',
    totalAmount: 112000.00,
    status: 'paid',
    paymentMethod: 'card',
    products: [
      { id: 'p4', name: 'Samsung Galaxy S23', sku: 'PHN-SAM-S23', quantity: 1, unitPrice: 110000, discount: 2200, subtotal: 107800 },
      { id: 'p5', name: 'Samsung Charger 25W', sku: 'ACC-CHR-25W', quantity: 1, unitPrice: 1800, discount: 0, subtotal: 1800 },
      { id: 'p6', name: 'Tempered Glass Screen', sku: 'ACC-GLASS-SC', quantity: 3, unitPrice: 800, discount: 0, subtotal: 2400 },
    ],
  },
  {
    id: '3',
    invoiceNumber: 'INV25-10003',
    customerName: 'Walk-in Customer',
    customerPhone: '-',
    date: '2025-12-18',
    time: '11:45 AM',
    totalAmount: 93380.00,
    status: 'paid',
    paymentMethod: 'cash',
    products: [
      { id: 'p7', name: 'iPhone 12 64GB', sku: 'PHN-IP12-64', quantity: 1, unitPrice: 88000, discount: 1320, subtotal: 86680 },
      { id: 'p8', name: 'Power Bank 20000mAh', sku: 'ACC-PB-20K', quantity: 1, unitPrice: 5500, discount: 0, subtotal: 5500 },
      { id: 'p9', name: 'Phone Case Universal', sku: 'ACC-CASE-UNI', quantity: 1, unitPrice: 1200, discount: 0, subtotal: 1200 },
    ],
  },
  {
    id: '4',
    invoiceNumber: 'INV25-10004',
    customerName: 'Sunil Perera',
    customerPhone: '0759876543',
    date: '2025-12-17',
    time: '02:30 PM',
    totalAmount: 86820.00,
    status: 'paid',
    paymentMethod: 'card',
    products: [
      { id: 'p10', name: 'OnePlus Nord 3', sku: 'PHN-OP-N3', quantity: 1, unitPrice: 52000, discount: 780, subtotal: 51220 },
      { id: 'p11', name: 'AirPods Pro 2nd Gen', sku: 'ACC-AP-PRO2', quantity: 1, unitPrice: 32000, discount: 0, subtotal: 32000 },
      { id: 'p12', name: 'Samsung Charger 25W', sku: 'ACC-CHR-25W', quantity: 2, unitPrice: 1800, discount: 0, subtotal: 3600 },
    ],
  },
  {
    id: '5',
    invoiceNumber: 'INV25-10005',
    customerName: 'Nimal Kumar',
    customerPhone: '0771112222',
    date: '2025-12-17',
    time: '03:15 PM',
    totalAmount: 132975.00,
    status: 'pending',
    paymentMethod: 'cash',
    products: [
      { id: 'p13', name: 'iPhone 13 Pro 128GB', sku: 'PHN-IP13P-128', quantity: 1, unitPrice: 135000, discount: 2025, subtotal: 132975 },
    ],
  },
  {
    id: '6',
    invoiceNumber: 'INV25-10006',
    customerName: 'Kamala Jayawardena',
    customerPhone: '0763334444',
    date: '2025-12-16',
    time: '04:45 PM',
    totalAmount: 218800.00,
    status: 'paid',
    paymentMethod: 'card',
    products: [
      { id: 'p14', name: 'Samsung Galaxy S23', sku: 'PHN-SAM-S23', quantity: 2, unitPrice: 110000, discount: 4400, subtotal: 215600 },
      { id: 'p15', name: 'Tempered Glass Screen', sku: 'ACC-GLASS-SC', quantity: 4, unitPrice: 800, discount: 0, subtotal: 3200 },
    ],
  },
];

export const SalesHistoryPage: React.FC = () => {
  // Format number with commas for LKR currency
  const formatLKR = (amount: number): string => {
    return amount.toLocaleString('en-LK');
  };

  const [sales, setSales] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    loadSales();
  }, [dateFrom, dateTo]);

  const loadSales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {};
      if (dateFrom) params.start_date = dateFrom;
      if (dateTo) params.end_date = dateTo;
      
      const response = await salesAPI.getAll(params);
      
      if (response.success) {
        // Transform backend data to match UI interface
        const transformedSales = await Promise.all(
          (response.data?.sales || []).map(async (sale: any) => {
            // Fetch detailed sale with items
            const detailResponse = await salesAPI.getById(sale.id);
            const saleDetails = detailResponse.success ? detailResponse.data : null;
            
            return {
              id: sale.id.toString(),
              invoiceNumber: sale.invoice_number,
              customerName: sale.customer_name || 'Walk-in Customer',
              customerPhone: sale.customer_phone || '-',
              date: new Date(sale.sale_date).toISOString().split('T')[0],
              time: new Date(sale.sale_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              totalAmount: sale.grand_total,
              status: 'paid', // All completed sales are paid
              paymentMethod: sale.payment_method,
              products: saleDetails?.items?.map((item: any) => ({
                id: item.id.toString(),
                name: item.product_name,
                sku: item.sku || '-',
                quantity: item.quantity,
                unitPrice: item.unit_price,
                discount: item.discount || 0,
                subtotal: item.line_total
              })) || []
            };
          })
        );
        
        setSales(transformedSales);
      } else {
        setError('Failed to load sales history');
        toast.error('Failed to load sales history');
      }
    } catch (error) {
      console.error('Error loading sales:', error);
      setError('Failed to load sales history. Please try again.');
      toast.error('Failed to load sales history');
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (invoiceId: string) => {
    setExpandedInvoiceId(expandedInvoiceId === invoiceId ? null : invoiceId);
  };

  // Filter invoices
  const filteredInvoices = sales.filter((invoice) => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customerPhone.includes(searchQuery);

    const matchesDateFrom = !dateFrom || invoice.date >= dateFrom;
    const matchesDateTo = !dateTo || invoice.date <= dateTo;
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || invoice.paymentMethod === paymentFilter;

    return matchesSearch && matchesDateFrom && matchesDateTo && matchesStatus && matchesPayment;
  });

  // Calculate stats
  const stats = {
    total: sales.length,
    totalRevenue: sales.reduce((sum, inv) => sum + inv.totalAmount, 0),
    paid: sales.filter((i) => i.status === 'paid').length,
    pending: sales.filter((i) => i.status === 'pending').length,
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    console.log('Print invoice:', invoice.invoiceNumber);
    // Implement print logic here
  };

  const handleViewDetails = (invoice: Invoice) => {
    console.log('View invoice details:', invoice.invoiceNumber);
    // Navigate to detailed invoice view
  };

  const getStatusBadge = (status: string) => {
    if (status === 'paid') {
      return (
        <Badge variant="secondary" className="bg-[#d1fae5] text-[#10b981] border-[#6ee7b7]">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Paid
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-[#fef3c7] text-[#f59e0b] border-[#fcd34d]">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  };

  return (
    <PageTemplate
      title="Sales History"
      subtitle="View and manage all sales invoices"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Print Report
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading sales history...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
        {/* Filters Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Invoice ID or Customer..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Date From */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10 w-48"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  placeholder="From Date"
                />
              </div>

              {/* Date To */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-10 w-48"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  placeholder="To Date"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              {/* Payment Filter */}
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Payments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Invoices</p>
                <h3>{stats.total}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Revenue</p>
                <h3 className="text-primary">LKR {formatLKR(stats.totalRevenue)}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Paid</p>
                <h3 className="text-[#10b981]">{stats.paid}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Pending</p>
                <h3 className="text-[#f59e0b]">{stats.pending}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales History Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Invoices ({filteredInvoices.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                        No invoices found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <Collapsible
                        key={invoice.id}
                        open={expandedInvoiceId === invoice.id}
                        onOpenChange={() => toggleRow(invoice.id)}
                        asChild
                      >
                        <>
                          {/* Main Invoice Row */}
                          <TableRow className="hover:bg-surface-hover cursor-pointer">
                            <TableCell>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  {expandedInvoiceId === invoice.id ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                            </TableCell>
                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{invoice.customerName}</p>
                                {invoice.customerPhone !== '-' && (
                                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                                    {invoice.customerPhone}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{new Date(invoice.date).toLocaleDateString('en-GB')}</TableCell>
                            <TableCell>{invoice.time}</TableCell>
                            <TableCell className="text-right font-semibold">
                              LKR {formatLKR(invoice.totalAmount)}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {invoice.paymentMethod}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(invoice.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePrintInvoice(invoice);
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>

                          {/* Expanded Product Details */}
                          <CollapsibleContent asChild>
                            <TableRow className="bg-surface-secondary hover:bg-surface-secondary">
                              <TableCell colSpan={9} className="p-0">
                                <div className="px-12 py-4">
                                  <p className="text-sm font-semibold mb-3">Invoice Items ({invoice.products.length})</p>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="h-8">Product</TableHead>
                                        <TableHead className="h-8 w-24">SKU</TableHead>
                                        <TableHead className="h-8 w-20 text-center">Qty</TableHead>
                                        <TableHead className="h-8 w-28 text-right">Unit Price</TableHead>
                                        <TableHead className="h-8 w-24 text-right">Discount</TableHead>
                                        <TableHead className="h-8 w-32 text-right">Subtotal</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {invoice.products.map((product) => (
                                        <TableRow key={product.id}>
                                          <TableCell className="font-medium">{product.name}</TableCell>
                                          <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                                          <TableCell className="text-center">{product.quantity}</TableCell>
                                          <TableCell className="text-right">LKR {formatLKR(product.unitPrice)}</TableCell>
                                          <TableCell className="text-right text-destructive">
                                            {product.discount > 0 ? `-LKR ${formatLKR(product.discount)}` : '-'}
                                          </TableCell>
                                          <TableCell className="text-right font-semibold">
                                            LKR {formatLKR(product.subtotal)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                  
                                  {/* Invoice Summary */}
                                  <div className="mt-4 flex justify-end">
                                    <div className="w-80 space-y-2 bg-background border rounded-lg p-4">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal:</span>
                                        <span className="font-medium">
                                          LKR {formatLKR(invoice.products.reduce((sum, p) => sum + (p.unitPrice * p.quantity), 0))}
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Total Discount:</span>
                                        <span className="font-medium text-destructive">
                                          -LKR {formatLKR(invoice.products.reduce((sum, p) => sum + p.discount, 0))}
                                        </span>
                                      </div>
                                      <div className="border-t pt-2 flex justify-between">
                                        <span className="font-semibold">Grand Total:</span>
                                        <span className="font-bold text-primary text-lg">
                                          LKR {formatLKR(invoice.totalAmount)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          </CollapsibleContent>
                        </>
                      </Collapsible>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        </>
        )}
      </div>
    </PageTemplate>
  );
};
