import React, { useState, useEffect } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Download, Upload, Filter, Search, Edit2, Trash2, Package, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { productsAPI, categoriesAPI, suppliersAPI } from '../../services/api';
import { SupplierFormModal } from '../modals/SupplierFormModal';

interface Item {
  id: number;
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  supplier_name: string;
  barcode: string;
  warrantyMonths: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

const mockItems: Item[] = [
  {
    id: '1',
    sku: 'PHN-IP13P-128',
    name: 'iPhone 13 Pro 128GB',
    category: 'Smartphones',
    stock: 12,
    reorderLevel: 5,
    costPrice: 115000,
    sellingPrice: 135000,
    supplier: 'Apple Authorized',
    barcode: '8901234567890',
    warrantyMonths: 12,
    status: 'in-stock',
  },
  {
    id: '2',
    sku: 'PHN-SAM-S23',
    name: 'Samsung Galaxy S23',
    category: 'Smartphones',
    stock: 8,
    reorderLevel: 5,
    costPrice: 95000,
    sellingPrice: 110000,
    supplier: 'Samsung Official',
    barcode: '8901234567891',
    warrantyMonths: 12,
    status: 'in-stock',
  },
  {
    id: '3',
    sku: 'PHN-IP12-64',
    name: 'iPhone 12 64GB',
    category: 'Smartphones',
    stock: 2,
    reorderLevel: 5,
    costPrice: 75000,
    sellingPrice: 88000,
    supplier: 'Apple Authorized',
    barcode: '8901234567892',
    warrantyMonths: 6,
    status: 'low-stock',
  },
  {
    id: '4',
    sku: 'ACC-AP-PRO2',
    name: 'AirPods Pro 2nd Gen',
    category: 'Accessories',
    stock: 25,
    reorderLevel: 10,
    costPrice: 28000,
    sellingPrice: 32000,
    supplier: 'Apple Authorized',
    barcode: '8901234567893',
    warrantyMonths: 12,
    status: 'in-stock',
  },
  {
    id: '5',
    sku: 'ACC-CHR-25W',
    name: 'Samsung Charger 25W',
    category: 'Accessories',
    stock: 0,
    reorderLevel: 20,
    costPrice: 1200,
    sellingPrice: 1800,
    supplier: 'Samsung Official',
    barcode: '8901234567894',
    warrantyMonths: 6,
    status: 'out-of-stock',
  },
  {
    id: '6',
    sku: 'PHN-IP11-128',
    name: 'iPhone 11 128GB',
    category: 'Smartphones',
    stock: 10,
    reorderLevel: 5,
    costPrice: 58000,
    sellingPrice: 68000,
    supplier: 'Apple Authorized',
    barcode: '8901234567895',
    warrantyMonths: 6,
    status: 'in-stock',
  },
  {
    id: '7',
    sku: 'PHN-OP-N3',
    name: 'OnePlus Nord 3',
    category: 'Smartphones',
    stock: 18,
    reorderLevel: 8,
    costPrice: 42000,
    sellingPrice: 52000,
    supplier: 'OnePlus Distributor',
    barcode: '8901234567896',
    warrantyMonths: 12,
    status: 'in-stock',
  },
  {
    id: '8',
    sku: 'ACC-CASE-UNI',
    name: 'Phone Case Universal',
    category: 'Accessories',
    stock: 100,
    reorderLevel: 30,
    costPrice: 500,
    sellingPrice: 1200,
    supplier: 'Local Accessories',
    barcode: '8901234567897',
    warrantyMonths: 0,
    status: 'in-stock',
  },
  {
    id: '9',
    sku: 'ACC-GLASS-SC',
    name: 'Tempered Glass Screen',
    category: 'Accessories',
    stock: 150,
    reorderLevel: 50,
    costPrice: 300,
    sellingPrice: 800,
    supplier: 'Local Accessories',
    barcode: '8901234567898',
    warrantyMonths: 0,
    status: 'in-stock',
  },
  {
    id: '10',
    sku: 'ACC-PB-20K',
    name: 'Power Bank 20000mAh',
    category: 'Accessories',
    stock: 30,
    reorderLevel: 15,
    costPrice: 3500,
    sellingPrice: 5500,
    supplier: 'Local Accessories',
    barcode: '8901234567899',
    warrantyMonths: 12,
    status: 'in-stock',
  },
];

export const ItemsListPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([]);
  const [suppliers, setSuppliers] = useState<Array<{id: number, name: string}>>([]);
  const [productSKUs, setProductSKUs] = useState<Array<{id: number, name: string, sku: string, barcode: string, category: string, warranty_months: number}>>([]);
  
  const [isNewProduct, setIsNewProduct] = useState(true); // Toggle between new/existing
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
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
    reorderLevel: '5',
    costPrice: '',
    sellingPrice: '',
    supplier: '',
    barcode: '',
    warrantyMonths: '0',
  });

  // Load products, categories, suppliers and SKUs on mount
  useEffect(() => {
    loadProducts();
    loadCategories();
    loadSuppliers();
    loadProductSKUs();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getAll();
      if (response.success) {
        // Transform backend data to match UI interface
        const products = response.data?.products || [];
        const transformedItems = products.map((product: any) => ({
          id: product.product_supplier_id || product.id,
          sku: product.sku,
          name: product.name,
          category: product.category || 'Uncategorized',
          stock: product.stock || 0,
          reorderLevel: product.reorder_level || 5,
          costPrice: product.cost_price || 0,
          sellingPrice: product.sale_price || 0,
          supplier: product.supplier_name || 'N/A',
          supplier_name: product.supplier_name || 'N/A',
          barcode: product.barcode || '',
          warrantyMonths: product.warranty_months || 0,
          status: product.stock === 0 ? 'out-of-stock' : product.stock <= (product.reorder_level || 5) ? 'low-stock' : 'in-stock'
        }));
        setItems(transformedItems);
      } else {
        setError('Failed to load products');
        toast.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products. Please try again.');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      if (response.success) {
        // Categories API returns data directly as array, not nested
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll();
      if (response.success) {
        const suppliers = response.data?.suppliers || [];
        setSuppliers(suppliers);
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
    }
  };

  const loadProductSKUs = async () => {
    try {
      const response = await productsAPI.getSKUs();
      if (response.success) {
        setProductSKUs(response.data || []);
      }
    } catch (error) {
      console.error('Error loading product SKUs:', error);
    }
  };

  const filteredItems = Array.isArray(items) ? items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.barcode.includes(searchQuery);
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  }) : [];

  const stats = {
    total: items.length || 0,
    inStock: Array.isArray(items) ? items.filter((i) => i.status === 'in-stock').length : 0,
    lowStock: Array.isArray(items) ? items.filter((i) => i.status === 'low-stock').length : 0,
    outOfStock: Array.isArray(items) ? items.filter((i) => i.status === 'out-of-stock').length : 0,
  };

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      category: '',
      stock: '',
      reorderLevel: '5',
      costPrice: '',
      sellingPrice: '',
      supplier: '',
      barcode: '',
      warrantyMonths: '0',
    });
    setIsNewProduct(true);
    setSelectedProductId(null);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    resetForm();
    setShowAddModal(true);
  };

  // Handle product SKU selection
  const handleProductSKUChange = (productId: string) => {
    if (productId === 'new') {
      setIsNewProduct(true);
      setSelectedProductId(null);
      setFormData({
        ...formData,
        sku: '',
        name: '',
        category: '',
        barcode: '',
        warrantyMonths: '0',
      });
    } else {
      const product = productSKUs.find(p => p.id === parseInt(productId));
      if (product) {
        setIsNewProduct(false);
        setSelectedProductId(product.id);
        setFormData({
          ...formData,
          sku: product.sku,
          name: product.name,
          category: product.category || '',
          barcode: product.barcode || '',
          warrantyMonths: product.warranty_months.toString(),
        });
      }
    }
  };

  const handleAddCategory = async () => {
    if (!categoryFormData.name) {
      toast.error('Category name is required');
      return;
    }
    
    try {
      const response = await categoriesAPI.create(categoryFormData);
      if (response.success) {
        toast.success('Category added successfully');
        await loadCategories();
        setFormData({ ...formData, category: response.data.name });
        setCategoryFormData({ name: '', description: '' });
        setShowAddCategoryModal(false);
      } else {
        toast.error(response.error || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleAddSupplier = async () => {
    if (!supplierFormData.name || !supplierFormData.contactPerson || !supplierFormData.phone) {
      toast.error('Supplier name, contact person, and phone are required');
      return;
    }
    
    try {
      // Map camelCase to snake_case for API
      const supplierData = {
        name: supplierFormData.name.trim(),
        contact_person: supplierFormData.contactPerson.trim(),
        phone: supplierFormData.phone.trim(),
        email: supplierFormData.email?.trim() || undefined,
        address: supplierFormData.address?.trim() || undefined,
      };
      const response = await suppliersAPI.create(supplierData);
      if (response.success) {
        toast.success('Supplier added successfully');
        await loadSuppliers();
        // Set supplier ID, not name
        setFormData({ ...formData, supplier: response.data.id.toString() });
        setSupplierFormData({ name: '', contactPerson: '', phone: '', email: '', address: '' });
        setShowAddSupplierModal(false);
      } else {
        // Show validation errors if available
        if (response.details && response.details.length > 0) {
          response.details.forEach(err => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else {
          toast.error(response.error || 'Failed to add supplier');
        }
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
      toast.error(error.message || 'Failed to add supplier');
    }
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
      warrantyMonths: item.warrantyMonths.toString(),
    });
    setShowAddModal(true);
  };

  const handleSaveItem = async () => {
    if (!formData.name.trim() || !formData.supplier) {
      toast.error('Product name and supplier are required');
      return;
    }

    try {
      setSubmitting(true);
      const productData: any = {
        name: formData.name.trim(),
        supplier_id: parseInt(formData.supplier),
        category: formData.category || 'Uncategorized',
        stock: parseInt(formData.stock) || 0,
        reorder_level: parseInt(formData.reorderLevel) || 5,
        cost_price: parseFloat(formData.costPrice) || 0,
        sale_price: parseFloat(formData.sellingPrice) || 0,
        warranty_months: parseInt(formData.warrantyMonths) || 0,
      };

      // If existing product selected, include product_id
      if (!isNewProduct && selectedProductId) {
        productData.product_id = selectedProductId;
      }

      let response;
      if (editingItem) {
        response = await productsAPI.update(editingItem.id, productData);
      } else {
        response = await productsAPI.create(productData);
      }

      if (response.success) {
        toast.success(editingItem ? 'Product updated successfully' : 'Product added successfully');
        setShowAddModal(false);
        setEditingItem(null);
        resetForm();
        loadProducts();
        loadProductSKUs(); // Reload SKUs list
      } else {
        // Show validation errors if available
        if (response.details && response.details.length > 0) {
          response.details.forEach(err => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else {
          toast.error(response.error || 'Operation failed');
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const handleDeleteItem = async (id: number) => {
    try {
      const response = await productsAPI.delete(id);
      if (response.success) {
        toast.success('Product deleted successfully');
        setDeleteDialogOpen(false);
        setItemToDelete(null);
        loadProducts();
      } else {
        toast.error(response.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
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
        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">Error loading products</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
                <Button onClick={loadProducts} variant="outline" size="sm">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        {!loading && !error && (
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
                  {Array.isArray(categories) && categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
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
        )}

        {/* Stats */}
        {!loading && !error && (
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
        )}

        {/* Items Table */}
        {!loading && !error && (
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
                    <TableHead>Supplier</TableHead>
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
                          <p className="text-sm">{item.supplier_name}</p>
                        </TableCell>
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
                            <AlertDialog open={deleteDialogOpen && itemToDelete?.id === item.id} onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setItemToDelete(null); }}>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => { setItemToDelete(item); setDeleteDialogOpen(true); }}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Item</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete <b>{item.name}</b>? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => handleDeleteItem(item.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        )}
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
            {/* Product SKU Selection */}
            <div className="col-span-2 space-y-2">
              <Label>Product Selection *</Label>
              <Select 
                value={isNewProduct ? 'new' : selectedProductId?.toString()} 
                onValueChange={handleProductSKUChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select existing product or create new" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">➕ Create New Product</SelectItem>
                  {productSKUs.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.sku} - {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!isNewProduct && (
                <p className="text-sm text-muted-foreground">
                  Adding new supplier batch for existing product
                </p>
              )}
            </div>

            {/* SKU and Barcode - Read-only if existing, hidden if new */}
            {!isNewProduct && (
              <>
                <div className="space-y-2">
                  <Label>SKU (Auto-generated)</Label>
                  <Input
                    value={formData.sku}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Barcode (Auto-generated)</Label>
                  <Input
                    value={formData.barcode}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </>
            )}
            
            <div className="col-span-2 space-y-2">
              <Label>Item Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., iPhone 13 Pro 128GB"
                disabled={!isNewProduct}
                className={!isNewProduct ? 'bg-muted' : ''}
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <div className="flex gap-2">
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  disabled={!isNewProduct}
                >
                  <SelectTrigger className={`flex-1 ${!isNewProduct ? 'bg-muted' : ''}`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(categories) && categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isNewProduct && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowAddCategoryModal(true)}
                    title="Add new category"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
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
                    {Array.isArray(suppliers) && suppliers.map((sup) => (
                      <SelectItem key={sup.id} value={sup.id.toString()}>
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
            <div className="col-span-2 space-y-2">
              <Label>Warranty Period</Label>
              <Select 
                value={formData.warrantyMonths} 
                onValueChange={(value) => setFormData({ ...formData, warrantyMonths: value })}
                disabled={!isNewProduct}
              >
                <SelectTrigger className={!isNewProduct ? 'bg-muted' : ''}>
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
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveItem} disabled={submitting}>
              {submitting ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
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
      <SupplierFormModal
        open={showAddSupplierModal}
        onOpenChange={(open) => {
          setShowAddSupplierModal(open);
          if (!open) {
            setSupplierFormData({ name: '', contactPerson: '', phone: '', email: '', address: '' });
          }
        }}
        formData={supplierFormData}
        onFormDataChange={setSupplierFormData}
        onSubmit={handleAddSupplier}
      />
    </PageTemplate>
  );
};
