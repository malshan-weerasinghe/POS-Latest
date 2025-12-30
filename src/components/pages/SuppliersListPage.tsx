import React, { useState, useEffect } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Download, Upload, Search, Edit2, Trash2, Phone, Mail, MapPin, Building2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { suppliersAPI } from '../../services/api';
import { toast } from 'sonner';
import { SupplierFormModal } from '../modals/SupplierFormModal';

interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  phone: string;
  email?: string;
  address?: string;
  payment_terms: string;
  categories?: string[];
  total_orders?: number;
  // Computed fields for display compatibility
  contactPerson?: string;
  totalOrders?: number;
}



export const SuppliersListPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    paymentTerms: 'Net 30',
  });

  // Load suppliers data
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const response = await suppliersAPI.getAll();
      if (response.success) {
        // Handle nested response structure and add computed fields
        const suppliersData = response.data?.suppliers || response.data || [];
        const processedSuppliers = suppliersData.map(supplier => ({
          ...supplier,
          // Add computed fields for display compatibility
          contactPerson: supplier.contact_person,
          totalOrders: supplier.total_orders || 0,
        }));
        setSuppliers(processedSuppliers);
        setError(null);
      } else {
        const errorMessage = 'Failed to load suppliers';
        setError(errorMessage);
        toast.error(errorMessage);
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Error loading suppliers:', error);
      const errorMessage = 'Failed to load suppliers. Please check your connection.';
      setError(errorMessage);
      toast.error(errorMessage);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  // Search suppliers with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchSuppliers(searchQuery);
      } else {
        loadSuppliers();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const searchSuppliers = async (query: string) => {
    try {
      setLoading(true);
      const response = await suppliersAPI.search(query);
      if (response.success) {
        const suppliersData = Array.isArray(response.data) ? response.data : [];
        const processedSuppliers = suppliersData.map(supplier => ({
          ...supplier,
          contactPerson: supplier.contact_person,
          totalOrders: supplier.total_orders || 0,
        }));
        setSuppliers(processedSuppliers);
        setError(null);
      } else {
        setSuppliers([]);
        setError('No suppliers found');
      }
    } catch (error) {
      console.error('Error searching suppliers:', error);
      setError('Failed to search suppliers. Please try again.');
      toast.error('Failed to search suppliers');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers;

  const resetForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
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
      contactPerson: supplier.contact_person || supplier.contactPerson || '',
      phone: supplier.phone,
      email: supplier.email || '',
      address: supplier.address || '',
    });
    setShowAddModal(true);
  };

  const handleSaveSupplier = async () => {
    if (!formData.name.trim() || !formData.contactPerson.trim() || !formData.phone.trim()) {
      toast.error('Name, contact person, and phone are required');
      return;
    }

    // Basic phone validation
    if (formData.phone.trim().length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setSubmitting(true);
      const supplierData = {
        name: formData.name.trim(),
        contact_person: formData.contactPerson.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        address: formData.address.trim() || undefined,
      };

      let response;
      if (editingSupplier) {
        // Update existing supplier
        response = await suppliersAPI.update(editingSupplier.id, supplierData);
      } else {
        // Create new supplier
        response = await suppliersAPI.create(supplierData);
      }

      if (response.success) {
        toast.success(editingSupplier ? 'Supplier updated successfully' : 'Supplier added successfully');
        setShowAddModal(false);
        setEditingSupplier(null);
        resetForm();
        loadSuppliers(); // Reload the list
      } else {
        toast.error(response.error || response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving supplier:', error);
      if (error.message.includes('Validation failed')) {
        toast.error('Please check all required fields and try again');
      } else {
        toast.error('Failed to save supplier. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!deletingSupplier) return;

    try {
      const response = await suppliersAPI.delete(deletingSupplier.id);
      if (response.success) {
        toast.success('Supplier deleted successfully');
        setDeletingSupplier(null);
        loadSuppliers(); // Reload the list
      } else {
        toast.error(response.error || 'Failed to delete supplier');
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
      toast.error('Failed to delete supplier');
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

        {/* Suppliers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Suppliers ({filteredSuppliers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground">Loading suppliers...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <p className="text-red-600 mb-2">{error}</p>
                  <Button onClick={loadSuppliers} variant="outline" size="sm">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier Name</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Contact Details</TableHead>
                      <TableHead>Total Orders</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.length > 0 ? (
                      filteredSuppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{supplier.name}</p>
                                {supplier.categories && supplier.categories.length > 0 && (
                                  <div className="flex gap-1 mt-1">
                                    {supplier.categories.slice(0, 2).map((cat) => (
                                      <Badge key={cat} variant="secondary" style={{ fontSize: 'var(--text-caption)' }}>
                                        {cat}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{supplier.contact_person || supplier.contactPerson || '-'}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                <span style={{ fontSize: 'var(--text-body-s)' }}>{supplier.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span style={{ fontSize: 'var(--text-body-s)' }}>{supplier.email || '-'}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{supplier.totalOrders || 0}</TableCell>
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <Building2 className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">
                              {searchQuery ? 'No suppliers match your search' : 'No suppliers found'}
                            </p>
                            {!searchQuery && (
                              <Button onClick={handleAddSupplier} size="sm">
                                Add First Supplier
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Supplier Modal */}
      <SupplierFormModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        formData={formData}
        onFormDataChange={setFormData}
        onSubmit={handleSaveSupplier}
        submitting={submitting}
        editMode={!!editingSupplier}
      />

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
