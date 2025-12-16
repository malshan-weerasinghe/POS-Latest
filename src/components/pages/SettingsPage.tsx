import React, { useState } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Save, Upload, Store, FileText, Calculator, Printer, Bell, Database, Eye } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';

export const SettingsPage: React.FC = () => {
  const [storeName, setStoreName] = useState('My Store');
  const [storeAddress, setStoreAddress] = useState('123 Main Street, City, State 12345');
  const [storePhone, setStorePhone] = useState('+91 98765 43210');
  const [storeEmail, setStoreEmail] = useState('store@email.com');
  const [gstNumber, setGstNumber] = useState('22AAAAA0000A1Z5');
  const [storePhone2, setStorePhone2] = useState('');
  
  const [taxRate, setTaxRate] = useState('5');
  const [currency, setCurrency] = useState('INR');
  const [invoicePrefix, setInvoicePrefix] = useState('INV-');
  const [receiptFooter, setReceiptFooter] = useState('Thank you for your business!');
  const [warrantyTerms, setWarrantyTerms] = useState(`1. This original bill is mandatory for any warranty claims.
2. Warranty covers hardware defects ONLY.
3. Warranty is VOID in case of physical damage, water/liquid damage, or unauthorized repairs.
4. No cash refunds. Exchange within 7 days for faulty devices only.`);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  
  const [autoPrint, setAutoPrint] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);

  const handleSave = () => {
    console.log('Settings saved');
    // Here you would save settings to backend/localStorage
  };

  return (
    <PageTemplate
      title="Settings"
      subtitle="Configure your POS system"
      actions={
        <>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </>
      }
    >
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Store className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="billing">
            <FileText className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="receipt">
            <Printer className="h-4 w-4 mr-2" />
            Receipt
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Bell className="h-4 w-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="backup">
            <Database className="h-4 w-4 mr-2" />
            Backup
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Basic details about your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Store Name *</Label>
                  <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>GST Number</Label>
                  <Input value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Store Address *</Label>
                <Textarea 
                  value={storeAddress} 
                  onChange={(e) => setStoreAddress(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone Number *</Label>
                  <Input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Store Logo</CardTitle>
              <CardDescription>Upload your store logo for invoices and receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-24 w-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30">
                  <Store className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Recommended size: 200x200px, PNG or JPG
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>Configure invoice numbering and formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Prefix</Label>
                  <Input value={invoicePrefix} onChange={(e) => setInvoicePrefix(e.target.value)} />
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Example: {invoicePrefix}00001
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Starting Number</Label>
                  <Input type="number" defaultValue="1" />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Warranty Terms & Conditions</Label>
                <Textarea 
                  value={warrantyTerms}
                  onChange={(e) => setWarrantyTerms(e.target.value)}
                  rows={8}
                  placeholder="Enter warranty terms and conditions..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Enable or disable payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Cash Payments</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Accept cash payments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Card Payments</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Accept debit/credit card payments
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">UPI Payments</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Accept UPI payments (PhonePe, Google Pay, etc.)
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Credit/Account</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Allow credit sales for registered customers
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receipt Settings */}
        <TabsContent value="receipt" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Side - Settings Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Footer Message</CardTitle>
                  <CardDescription>Message that appears at the bottom of the receipt</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Footer Text</Label>
                    <Textarea 
                      value={receiptFooter}
                      onChange={(e) => setReceiptFooter(e.target.value)}
                      rows={3}
                      placeholder="Thank You For Your Purchase!"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Live Preview */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Receipt Preview (80mm)</CardTitle>
                  <CardDescription>Live preview of your receipt</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ 
                    fontFamily: '"Courier New", monospace', 
                    fontSize: '11px', 
                    lineHeight: '1.3',
                    padding: '10px',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    background: 'white',
                    maxHeight: '600px',
                    overflowY: 'auto',
                    width: '302px',
                    margin: '0 auto'
                  }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px' }}>** {storeName.toUpperCase()} **</div>
                      <div style={{ fontSize: '11px', marginTop: '2px' }}>Premium Pre-Owned Devices</div>
                      <div style={{ fontSize: '11px' }}>{storeAddress}</div>
                      <div style={{ fontSize: '11px' }}>Ph: {storePhone}{storePhone2 && ` / ${storePhone2}`}</div>
                    </div>
                    <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

                    {/* Bill Info */}
                    <div style={{ fontSize: '11px', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Date: {new Date().toLocaleDateString('en-GB')}</span>
                        <span>Time: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                      </div>
                      <div>Bill No: #{invoicePrefix}12345</div>
                      <div>Cashier: Admin</div>
                    </div>
                    <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

                    {/* Sample Customer */}
                    <div style={{ fontSize: '11px', marginBottom: '5px' }}>
                      <div>Customer: John Doe</div>
                      <div>Phone: 071-1234567</div>
                    </div>
                    <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

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

                    {/* Sample Item */}
                    <div style={{ fontSize: '11px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ width: '20px' }}>01</span>
                        <span style={{ flex: 1 }}>PHN-001</span>
                        <span style={{ width: '60px', textAlign: 'right' }}>165000.00</span>
                        <span style={{ width: '30px', textAlign: 'center' }}>1</span>
                        <span style={{ width: '60px', textAlign: 'right' }}>165000.00</span>
                      </div>
                      <div style={{ marginLeft: '20px', fontSize: '11px' }}>iPhone 13 Pro (128GB)</div>
                      <div style={{ marginLeft: '20px', fontSize: '10px' }}>*6 months warranty</div>
                    </div>

                    <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

                    {/* Totals */}
                    <div style={{ fontSize: '11px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span>Subtotal:</span>
                        <span>165000.00</span>
                      </div>
                    </div>
                    <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

                    {/* Grand Total */}
                    <div style={{ fontSize: '13px', fontWeight: 'bold', textAlign: 'center', margin: '5px 0' }}>
                      *** GRAND TOTAL:      LKR 165000.00 ***
                    </div>
                    <div style={{ borderTop: '1px dashed #000', margin: '5px 0' }}></div>

                    {/* Payment */}
                    <div style={{ fontSize: '11px', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>PAID BY: CASH</span>
                        <span>165000.00</span>
                      </div>
                    </div>

                    {/* Warranty Terms */}
                    <div style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', margin: '8px 0', padding: '5px 0' }}>
                      <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>
                        WARRANTY TERMS
                      </div>
                      <div style={{ fontSize: '9px', lineHeight: '1.3', whiteSpace: 'pre-line' }}>
                        {warrantyTerms}
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{ textAlign: 'center', fontSize: '11px', marginTop: '8px', whiteSpace: 'pre-line' }}>
                      <div style={{ fontWeight: 'bold' }}>{receiptFooter}</div>
                      <div style={{ marginTop: '2px' }}>Please Visit Again.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure application behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-print Receipts</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Automatically print receipt after each sale
                  </p>
                </div>
                <Switch checked={autoPrint} onCheckedChange={setAutoPrint} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sound Effects</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Play sounds for scans and transactions
                  </p>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Show alerts when items reach reorder level
                  </p>
                </div>
                <Switch checked={lowStockAlert} onCheckedChange={setLowStockAlert} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Barcode Scanner Integration</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Enable barcode scanner support
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Backup</CardTitle>
              <CardDescription>Backup and restore your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Automatic Backup</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Automatically backup data daily
                  </p>
                </div>
                <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Every Hour</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex gap-3">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Backup Now
                </Button>
                <Button variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Restore from Backup
                </Button>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Last backup: November 18, 2025 at 6:00 AM
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTemplate>
  );
};
