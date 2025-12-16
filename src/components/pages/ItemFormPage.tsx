import React, { useState } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Save, X, Plus } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';

export const ItemFormPage: React.FC = () => {
  const [categories, setCategories] = useState([
    { id: '1', name: 'Groceries' },
    { id: '2', name: 'Beverages' },
    { id: '3', name: 'Snacks' },
  ]);
  
  const [suppliers, setSuppliers] = useState([
    { id: '1', name: 'ABC Wholesale' },
    { id: '2', name: 'XYZ Traders' },
    { id: '3', name: 'PQR Distributors' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
  });
  
  const [supplierFormData, setSupplierFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
  });

  const handleAddCategory = () => {
    if (!categoryFormData.name) {
      toast.error('Category name is required');
      return;
    }
    
    const newCategory = {
      id: Date.now().toString(),
      name: categoryFormData.name,
    };
    
    setCategories([...categories, newCategory]);
    setSelectedCategory(newCategory.id);
    toast.success('Category added successfully');
    
    setCategoryFormData({ name: '', description: '' });
    setShowAddCategoryModal(false);
  };

  const handleAddSupplier = () => {
    if (!supplierFormData.name) {
      toast.error('Supplier name is required');
      return;
    }
    
    const newSupplier = {
      id: Date.now().toString(),
      name: supplierFormData.name,
    };
    
    setSuppliers([...suppliers, newSupplier]);
    setSelectedSupplier(newSupplier.id);
    toast.success('Supplier added successfully');
    
    setSupplierFormData({ name: '', contactPerson: '', phone: '', email: '', address: '' });
    setShowAddSupplierModal(false);
  };
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
                  <div className="flex gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowAddCategoryModal(true)}
                      title="Add new category"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
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
              <CardTitle>Supplier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Supplier</Label>
                <div className="flex gap-2">
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((sup) => (
                        <SelectItem key={sup.id} value={sup.id}>
                          {sup.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowAddSupplierModal(true)}
                    title="Add new supplier"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
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

      {/* Add Category Modal */}
      <Dialog open={showAddCategoryModal} onOpenChange={setShowAddCategoryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new product category
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category Name *</Label>
              <Input
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                placeholder="Enter category name"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={categoryFormData.description}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                placeholder="Enter category description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddCategoryModal(false);
                setCategoryFormData({ name: '', description: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Supplier Modal */}
      <Dialog open={showAddSupplierModal} onOpenChange={setShowAddSupplierModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
            <DialogDescription>
              Enter details for the new supplier
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Supplier Name *</Label>
              <Input
                value={supplierFormData.name}
                onChange={(e) => setSupplierFormData({ ...supplierFormData, name: e.target.value })}
                placeholder="Enter supplier name"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input
                value={supplierFormData.contactPerson}
                onChange={(e) => setSupplierFormData({ ...supplierFormData, contactPerson: e.target.value })}
                placeholder="Enter contact person name"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={supplierFormData.phone}
                onChange={(e) => setSupplierFormData({ ...supplierFormData, phone: e.target.value })}
                placeholder="07x xxx xxxx"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={supplierFormData.email}
                onChange={(e) => setSupplierFormData({ ...supplierFormData, email: e.target.value })}
                placeholder="supplier@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                value={supplierFormData.address}
                onChange={(e) => setSupplierFormData({ ...supplierFormData, address: e.target.value })}
                placeholder="Enter complete address"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddSupplierModal(false);
                setSupplierFormData({ name: '', contactPerson: '', phone: '', email: '', address: '' });
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddSupplier}>
              Add Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};
