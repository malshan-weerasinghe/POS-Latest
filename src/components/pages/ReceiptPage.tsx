import React, { useContext } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Printer, Download, CheckCircle, ArrowLeft } from 'lucide-react';
import { Separator } from '../ui/separator';
import { AppContext } from '../../App';

export const ReceiptPage: React.FC = () => {
  const { navigateTo } = useContext(AppContext);

  const receiptData = {
    invoiceNumber: 'INV-2025-001',
    date: new Date().toLocaleString(),
    cashier: 'John Doe',
    customer: 'Walk-in Customer',
    items: [
      { name: 'Premium Rice 5kg', qty: 2, price: 400, total: 800 },
      { name: 'Cooking Oil 1L', qty: 1, price: 240, total: 240 },
      { name: 'Tea Powder 500g', qty: 3, price: 120, total: 360 },
    ],
    subtotal: 1400,
    discount: 70,
    tax: 66.5,
    total: 1396.5,
    paymentMethod: 'Cash',
    amountReceived: 1500,
    change: 103.5,
  };

  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Sales' }, { label: 'Receipt' }]}
      title="Receipt"
      subtitle={`Invoice #${receiptData.invoiceNumber}`}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => navigateTo('sales-billing')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            New Sale
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
        </>
      }
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success Message */}
        <Card className="border-[#10b981] bg-[#d1fae5] dark:bg-[#064e3b]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[#10b981] flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-[#065f46] dark:text-[#6ee7b7]">Sale Completed Successfully!</h3>
                <p className="text-[#047857] dark:text-[#34d399]" style={{ fontSize: 'var(--text-body-s)' }}>
                  Payment received and receipt generated
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receipt */}
        <Card>
          <CardHeader className="text-center border-b">
            <div className="space-y-2">
              <CardTitle>My Store</CardTitle>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                123 Main Street, City, State 12345
              </p>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                Phone: +91 98765 43210 | GST: 22AAAAA0000A1Z5
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Invoice Number
                </p>
                <p className="font-medium">{receiptData.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Date & Time
                </p>
                <p className="font-medium">{receiptData.date}</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Cashier
                </p>
                <p className="font-medium">{receiptData.cashier}</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Customer
                </p>
                <p className="font-medium">{receiptData.customer}</p>
              </div>
            </div>

            <Separator />

            {/* Items */}
            <div>
              <p className="font-medium mb-3">Items Purchased</p>
              <div className="space-y-2">
                {receiptData.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                        {item.qty} × ₹{item.price}
                      </p>
                    </div>
                    <p className="font-medium">₹{item.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{receiptData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-[#ef4444]">-₹{receiptData.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (GST 5%)</span>
                <span>₹{receiptData.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount</span>
                <span className="text-primary" style={{ fontSize: 'var(--text-headline-m)' }}>
                  ₹{receiptData.total.toFixed(2)}
                </span>
              </div>
            </div>

            <Separator />

            {/* Payment Details */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium">{receiptData.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Received</span>
                <span>₹{receiptData.amountReceived.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Change</span>
                <span className="font-medium">₹{receiptData.change.toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            {/* Footer */}
            <div className="text-center space-y-2">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                Thank you for your business!
              </p>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
                Goods once sold will not be taken back
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};
