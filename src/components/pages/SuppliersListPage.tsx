import React, { useState } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Download, Upload, Search, Edit2, Trash2, Phone, Mail, MapPin, Building2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  paymentTerms: string;
  categories: string[];
  totalOrders: number;
  status: 'active' | 'inactive';
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Apple Authorized Distributor',
    contactPerson: 'Ramesh Gupta',
    phone: '+94 77 123 4567',
    email: 'ramesh@appledist.lk',
    address: '45 Colombo Road, Nugegoda, Sri Lanka',
    paymentTerms: 'Net 30',
    categories: ['Smartphones', 'Audio'],
    totalOrders: 156,
    status: 'active',
  },
  {
    id: '2',
    name: 'Samsung Official Partner',
    contactPerson: 'Sunita Perera',
    phone: '+94 77 234 5678',
    email: 'sunita@samsunglk.com',
    address: '78 Galle Road, Colombo 03, Sri Lanka',
    paymentTerms: 'Net 15',
    categories: ['Smartphones', 'Tablets', 'Smartwatches'],
    totalOrders: 203,
    status: 'active',
  },
  {
    id: '3',
    name: 'Mobile Accessories Wholesale',
    contactPerson: 'Anil Kumar',
    phone: '+94 77 345 6789',
    email: 'anil@mobileacc.lk',
    address: '123 Warehouse St, Kelaniya, Sri Lanka',
    paymentTerms: 'Net 45',
    categories: ['Accessories'],
    totalOrders: 289,
    status: 'active',
  },
  {
    id: '4',
    name: 'OnePlus Sri Lanka',
    contactPerson: 'Meena Silva',
    phone: '+94 77 456 7890',
    email: 'meena@oneplus.lk',
    address: '567 Kandy Road, Malabe, Sri Lanka',
    paymentTerms: 'COD',
    categories: ['Smartphones'],
    totalOrders: 45,
    status: 'active',
  },
];

export const SuppliersListPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    paymentTerms: 'Net 30',
  });

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.phone.includes(searchQuery)
  );

  const stats = {
    total: suppliers.length,
    active: suppliers.filter((s) => s.status === 'active').length,
    totalOrders: suppliers.reduce((sum, s) => sum + s.totalOrders, 0),
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      paymentTerms: 'Net 30',
    });
  };

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    resetForm();
    setShowAddModal(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      paymentTerms: supplier.paymentTerms,
    });
    setShowAddModal(true);
  };

  const handleSaveSupplier = () => {
    if (editingSupplier) {
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === editingSupplier.id
            ? {
                ...supplier,
                ...formData,
              }
            : supplier
        )
      );
    } else {
      const newSupplier: Supplier = {
        id: Date.now().toString(),
        ...formData,
        categories: ['Groceries'],
        totalOrders: 0,
        status: 'active',
      };
      setSuppliers([...suppliers, newSupplier]);
    }
    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteSupplier = () => {
    if (deletingSupplier) {
      setSuppliers(suppliers.filter((s) => s.id !== deletingSupplier.id));
      setDeletingSupplier(null);
    }
  };

  return (
    <PageTemplate
      title="Suppliers"
      subtitle="Manage your supplier database"
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
          <Button size="sm" onClick={handleAddSupplier}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by supplier name, contact person, or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Suppliers</p>
                <h3>{stats.total}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Active Suppliers</p>
                <h3 className="text-[#10b981]">{stats.active}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Orders</p>
                <h3>{stats.totalOrders}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suppliers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Suppliers ({filteredSuppliers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Contact Details</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{supplier.name}</p>
                            <div className="flex gap-1 mt-1">
                              {supplier.categories.slice(0, 2).map((cat) => (
                                <Badge key={cat} variant="secondary" style={{ fontSize: 'var(--text-caption)' }}>
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{supplier.contactPerson}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span style={{ fontSize: 'var(--text-body-s)' }}>{supplier.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span style={{ fontSize: 'var(--text-body-s)' }}>{supplier.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{supplier.paymentTerms}</Badge>
                      </TableCell>
                      <TableCell>{supplier.totalOrders}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            supplier.status === 'active'
                              ? 'bg-[#d1fae5] text-[#10b981] border-[#6ee7b7]'
                              : 'bg-[#fee2e2] text-[#ef4444] border-[#fca5a5]'
                          }
                        >
                          {supplier.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditSupplier(supplier)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setDeletingSupplier(supplier)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Supplier Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
            <DialogDescription>
              {editingSupplier ? 'Update supplier details' : 'Enter details for the new supplier'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Supplier Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter supplier name"
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Person *</Label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Enter contact person name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="supplier@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Payment Terms *</Label>
              <Select value={formData.paymentTerms} onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COD">Cash on Delivery (COD)</SelectItem>
                  <SelectItem value="Net 15">Net 15 Days</SelectItem>
                  <SelectItem value="Net 30">Net 30 Days</SelectItem>
                  <SelectItem value="Net 45">Net 45 Days</SelectItem>
                  <SelectItem value="Net 60">Net 60 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter complete address"
                rows={3}
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
            <Button onClick={handleSaveSupplier}>
              {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingSupplier} onOpenChange={() => setDeletingSupplier(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingSupplier?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSupplier} 
              className="bg-destructive hover:bg-destructive/90"
              autoFocus
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTemplate>
  );
};
