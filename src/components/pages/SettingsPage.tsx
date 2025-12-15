import React, { useState } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Save, Upload, Store, FileText, Calculator, Printer, Bell, Database } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';

export const SettingsPage: React.FC = () => {
  const [storeName, setStoreName] = useState('My Store');
  const [storeAddress, setStoreAddress] = useState('123 Main Street, City, State 12345');
  const [storePhone, setStorePhone] = useState('+91 98765 43210');
  const [storeEmail, setStoreEmail] = useState('store@email.com');
  const [gstNumber, setGstNumber] = useState('22AAAAA0000A1Z5');
  
  const [taxRate, setTaxRate] = useState('5');
  const [currency, setCurrency] = useState('INR');
  const [invoicePrefix, setInvoicePrefix] = useState('INV-');
  const [receiptFooter, setReceiptFooter] = useState('Thank you for your business!');
  
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
      breadcrumbs={[{ label: 'Settings' }]}
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
          <TabsTrigger value="tax">
            <Calculator className="h-4 w-4 mr-2" />
            Tax & Currency
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
                <Label>Invoice Terms & Conditions</Label>
                <Textarea 
                  placeholder="Enter terms and conditions to appear on invoices"
                  rows={4}
                  defaultValue="1. Goods once sold will not be taken back.&#10;2. All disputes subject to local jurisdiction."
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

        {/* Tax & Currency */}
        <TabsContent value="tax" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
              <CardDescription>Set up tax rates for your products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Tax Rate (%)</Label>
                  <Input 
                    type="number" 
                    value={taxRate} 
                    onChange={(e) => setTaxRate(e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tax Type</Label>
                  <Select defaultValue="gst">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gst">GST</SelectItem>
                      <SelectItem value="vat">VAT</SelectItem>
                      <SelectItem value="sales">Sales Tax</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Include Tax in Price</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Display prices inclusive of tax
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
              <CardDescription>Configure currency and number formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                      <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">£ British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Decimal Places</Label>
                  <Select defaultValue="2">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receipt Settings */}
        <TabsContent value="receipt" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Format</CardTitle>
              <CardDescription>Customize your receipt layout and content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Receipt Width</Label>
                <Select defaultValue="80mm">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="58mm">58mm (Small)</SelectItem>
                    <SelectItem value="80mm">80mm (Standard)</SelectItem>
                    <SelectItem value="a4">A4 (Full Page)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Footer Message</Label>
                <Textarea 
                  value={receiptFooter}
                  onChange={(e) => setReceiptFooter(e.target.value)}
                  rows={3}
                  placeholder="Thank you message"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Barcode</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Display barcode on receipt
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Customer Details</p>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Include customer name and phone
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
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
