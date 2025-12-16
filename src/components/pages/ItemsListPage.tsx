import React, { useState } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Download, Upload, Filter, Search, Edit2, Trash2, Package, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

interface Item {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  barcode: string;
  warrantyMonths: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const mockItems: Item[] = [
  {
    id: '1',
    sku: 'GRC-001',
    name: 'Premium Rice 5kg',
    category: 'Groceries',
    stock: 150,
    reorderLevel: 50,
    costPrice: 320,
    sellingPrice: 400,
    supplier: 'ABC Wholesale',
    barcode: '8901234567890',
    warrantyMonths: 12,
    status: 'in-stock',
  },
  {
    id: '2',
    sku: 'GRC-002',
    name: 'Cooking Oil 1L',
    category: 'Groceries',
    stock: 35,
    reorderLevel: 30,
    costPrice: 190,
    sellingPrice: 240,
    supplier: 'XYZ Traders',
    barcode: '8901234567891',
    warrantyMonths: 6,
    status: 'low-stock',
  },
  {
    id: '3',
    sku: 'GRC-003',
    name: 'Sugar 1kg',
    category: 'Groceries',
    stock: 0,
    reorderLevel: 100,
    costPrice: 42,
    sellingPrice: 52,
    supplier: 'ABC Wholesale',
    barcode: '8901234567892',
    warrantyMonths: 0,
    status: 'out-of-stock',
  },
  {
    id: '4',
    sku: 'BEV-001',
    name: 'Tea Powder 500g',
    category: 'Beverages',
    stock: 180,
    reorderLevel: 40,
    costPrice: 95,
    sellingPrice: 120,
    supplier: 'PQR Distributors',
    barcode: '8901234567893',
    warrantyMonths: 24,
    status: 'in-stock',
  },
  {
    id: '5',
    sku: 'GRC-004',
    name: 'Wheat Flour 10kg',
    category: 'Groceries',
    stock: 120,
    reorderLevel: 30,
    costPrice: 320,
    sellingPrice: 400,
    supplier: 'ABC Wholesale',
    barcode: '8901234567894',
    warrantyMonths: 12,
    status: 'in-stock',
  },
];

export const ItemsListPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  
  const [categories, setCategories] = useState(['Groceries', 'Beverages', 'Snacks', 'Personal Care']);
  const [suppliers, setSuppliers] = useState(['ABC Wholesale', 'XYZ Traders', 'PQR Distributors']);
  
  const [categoryFormData, setCategoryFormData] = useState({ name: '', description: '' });
  const [supplierFormData, setSupplierFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
  });

  // Form state
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    stock: '',
    reorderLevel: '',
    costPrice: '',
    sellingPrice: '',
    supplier: '',
    barcode: '',
    warrantyMonths: '0',
  });

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode.includes(searchQuery);
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: items.length,
    inStock: items.filter((i) => i.status === 'in-stock').length,
    lowStock: items.filter((i) => i.status === 'low-stock').length,
    outOfStock: items.filter((i) => i.status === 'out-of-stock').length,
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      category: '',
      stock: '',
      reorderLevel: '',
      costPrice: '',
      sellingPrice: '',
      supplier: '',
      barcode: '',
      warrantyMonths: '0',
    });
  };

  const handleAddCategory = () => {
    if (!categoryFormData.name) {
      toast.error('Category name is required');
      return;
    }
    
    setCategories([...categories, categoryFormData.name]);
    setFormData({ ...formData, category: categoryFormData.name });
    toast.success('Category added successfully');
    
    setCategoryFormData({ name: '', description: '' });
    setShowAddCategoryModal(false);
  };

  const handleAddSupplier = () => {
    if (!supplierFormData.name) {
      toast.error('Supplier name is required');
      return;
    }
    
    setSuppliers([...suppliers, supplierFormData.name]);
    setFormData({ ...formData, supplier: supplierFormData.name });
    toast.success('Supplier added successfully');
    
    setSupplierFormData({ name: '', contactPerson: '', phone: '', email: '', address: '' });
    setShowAddSupplierModal(false);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    resetForm();
    setShowAddModal(true);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setFormData({
      sku: item.sku,
      name: item.name,
      category: item.category,
      stock: item.stock.toString(),
      reorderLevel: item.reorderLevel.toString(),
      costPrice: item.costPrice.toString(),
      sellingPrice: item.sellingPrice.toString(),
      supplier: item.supplier,
      barcode: item.barcode,
    });
    setShowAddModal(true);
  };

  const handleSaveItem = () => {
    if (editingItem) {
      // Update existing item
      setItems(
        items.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...formData,
                stock: parseInt(formData.stock),
                reorderLevel: parseInt(formData.reorderLevel),
                costPrice: parseFloat(formData.costPrice),
                sellingPrice: parseFloat(formData.sellingPrice),
                status:
                  parseInt(formData.stock) === 0
                    ? 'out-of-stock'
                    : parseInt(formData.stock) <= parseInt(formData.reorderLevel)
                    ? 'low-stock'
                    : 'in-stock',
              }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: Item = {
        id: Date.now().toString(),
        ...formData,
        stock: parseInt(formData.stock),
        reorderLevel: parseInt(formData.reorderLevel),
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        status:
          parseInt(formData.stock) === 0
            ? 'out-of-stock'
            : parseInt(formData.stock) <= parseInt(formData.reorderLevel)
            ? 'low-stock'
            : 'in-stock',
      };
      setItems([...items, newItem]);
    }
    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return (
          <Badge variant="secondary" className="bg-[#d1fae5] text-[#10b981] border-[#6ee7b7]">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            In Stock
          </Badge>
        );
      case 'low-stock':
        return (
          <Badge variant="secondary" className="bg-[#fef3c7] text-[#f59e0b] border-[#fcd34d]">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Low Stock
          </Badge>
        );
      case 'out-of-stock':
        return (
          <Badge variant="secondary" className="bg-[#fee2e2] text-[#ef4444] border-[#fca5a5]">
            <Package className="h-3 w-3 mr-1" />
            Out of Stock
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <PageTemplate
      title="Items & Inventory"
      subtitle="Manage your product catalog"
      actions={
        <>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, SKU, or barcode..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Groceries">Groceries</SelectItem>
                  <SelectItem value="Beverages">Beverages</SelectItem>
                  <SelectItem value="Snacks">Snacks</SelectItem>
                  <SelectItem value="Personal Care">Personal Care</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Items</p>
                <h3>{stats.total}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>In Stock</p>
                <h3 className="text-[#10b981]">{stats.inStock}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Low Stock</p>
                <h3 className="text-[#f59e0b]">{stats.lowStock}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Out of Stock</p>
                <h3 className="text-[#ef4444]">{stats.outOfStock}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Items ({filteredItems.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Cost Price</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                              {item.barcode}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div>
                            <p>{item.stock} units</p>
                            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                              Reorder at {item.reorderLevel}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>₹{item.costPrice}</TableCell>
                        <TableCell>₹{item.sellingPrice}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditItem(item)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Item Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update item details' : 'Enter details for the new item'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>SKU *</Label>
              <Input
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g., GRC-001"
              />
            </div>
            <div className="space-y-2">
              <Label>Barcode *</Label>
              <Input
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="e.g., 8901234567890"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Item Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Premium Rice 5kg"
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <div className="flex gap-2">
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
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
              <Label>Supplier *</Label>
              <div className="flex gap-2">
                <Select value={formData.supplier} onValueChange={(value) => setFormData({ ...formData, supplier: value })}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((sup) => (
                      <SelectItem key={sup} value={sup}>
                        {sup}
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
            <div className="col-span-2 space-y-2">
              <Label>Warranty Period</Label>
              <Select 
                value={formData.warrantyMonths} 
                onValueChange={(value) => setFormData({ ...formData, warrantyMonths: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select warranty period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Warranty</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months (1 Year)</SelectItem>
                  <SelectItem value="24">24 Months (2 Years)</SelectItem>
                  <SelectItem value="36">36 Months (3 Years)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Stock Quantity *</Label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Reorder Level *</Label>
              <Input
                type="number"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Cost Price *</Label>
              <Input
                type="number"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Selling Price *</Label>
              <Input
                type="number"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveItem}>
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
