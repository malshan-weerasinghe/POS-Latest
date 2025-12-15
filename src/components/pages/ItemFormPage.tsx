import React from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Save, X } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export const ItemFormPage: React.FC = () => {
  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Inventory' }, { label: 'Items' }, { label: 'Create Item' }]}
      title="Create New Item"
      subtitle="Add a new product to your inventory"
      actions={
        <>
          <Button variant="outline" size="sm">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Item
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Main Details */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Item Name *</Label>
                  <Input placeholder="Enter item name" />
                </div>
                <div className="space-y-2">
                  <Label>SKU / Barcode *</Label>
                  <Input placeholder="Enter SKU or scan barcode" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <div className="h-24 bg-muted/30 rounded flex items-center justify-center">
                  <span className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>Textarea</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <div className="h-10 bg-muted/30 rounded flex items-center px-3">
                    <span className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>Select</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Input placeholder="Brand name" />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <div className="h-10 bg-muted/30 rounded flex items-center px-3">
                    <span className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>Select</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Purchase Price</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Selling Price *</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>MRP</Label>
                  <Input type="number" placeholder="0.00" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax & Discounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tax Rate (%)</Label>
                  <div className="h-10 bg-muted/30 rounded flex items-center px-3">
                    <span className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>Select Tax</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Discount (%)</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Additional Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Opening Stock</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Minimum Stock Level</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Maximum Stock Level</Label>
                <Input type="number" placeholder="0" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Item Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-muted/30 rounded flex items-center justify-center">
                <span className="text-muted-foreground">Upload Image</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-8 bg-muted/30 rounded flex items-center px-3">
                <span className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>Track Inventory</span>
              </div>
              <div className="h-8 bg-muted/30 rounded flex items-center px-3">
                <span className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>Allow Sale</span>
              </div>
              <div className="h-8 bg-muted/30 rounded flex items-center px-3">
                <span className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>Is Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTemplate>
  );
};
