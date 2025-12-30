import React, { useState, useContext, useEffect } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Download, Upload, Search, Edit2, Trash2, Phone, Mail, MapPin, Star } from 'lucide-react';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { AppContext } from '../../App';
import { customersAPI } from '../../services/api';
import { toast } from 'sonner';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: string;
  loyaltyPoints?: number;
  totalPurchases?: number;
  lastPurchase?: string;
  tier?: 'Gold' | 'Silver' | 'Bronze' | 'Regular';
  name?: string; // computed field for display
}

export const CustomersListPage: React.FC = () => {
  const { navigateTo } = useContext(AppContext);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
  });

  // Load customers data
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersAPI.getAll();
      if (response.success) {
        // Handle nested response structure: response.data.customers
        const customersData = response.data?.customers || response.data || [];
        const customersWithNames = customersData.map(customer => ({
          ...customer,
          name: customer.firstName && customer.lastName 
            ? `${customer.firstName} ${customer.lastName}`.trim()
            : customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
          loyaltyPoints: customer.loyaltyPoints || 0,
          totalPurchases: customer.totalPurchases || 0,
          tier: customer.tier || 'Regular'
        }));
        setCustomers(customersWithNames);
      } else {
        toast.error('Failed to load customers');
        setCustomers([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      toast.error('Failed to load customers');
      setCustomers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Search customers with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchCustomers(searchQuery);
      } else {
        loadCustomers();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const searchCustomers = async (query: string) => {
    try {
      setLoading(true);
      const response = await customersAPI.search(query);
      if (response.success) {
        // Handle response structure: response.data is array for search
        const customersData = Array.isArray(response.data) ? response.data : response.data?.customers || [];
        const processedCustomers = customersData.map(customer => ({
          ...customer,
          // Backend has 'name' field, but frontend form needs firstName/lastName
          firstName: customer.firstName || customer.name?.split(' ')[0] || '',
          lastName: customer.lastName || customer.name?.split(' ').slice(1).join(' ') || '',
          name: customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
          loyaltyPoints: customer.loyaltyPoints || 0,
          totalPurchases: customer.totalPurchases || 0,
          tier: customer.tier || 'Regular'
        }));
        setCustomers(processedCustomers);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error searching customers:', error);
      toast.error('Failed to search customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers;

  const stats = {
    total: customers.length,
    gold: customers.filter((c) => c.tier === 'Gold').length,
    silver: customers.filter((c) => c.tier === 'Silver').length,
    bronze: customers.filter((c) => c.tier === 'Bronze').length,
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
    });
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    resetForm();
    setShowAddModal(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    // Split name field for editing form
    const nameParts = customer.name ? customer.name.split(' ') : [];
    setFormData({
      firstName: customer.firstName || nameParts[0] || '',
      lastName: customer.lastName || nameParts.slice(1).join(' ') || '',
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
    });
    setShowAddModal(true);
  };

  const handleSaveCustomer = async () => {
    if (!formData.firstName.trim() || !formData.phone.trim()) {
      toast.error('First name and phone are required');
      return;
    }

    // Basic phone validation
    if (formData.phone.trim().length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    try {
      setSubmitting(true);
      const customerData = {
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        address: formData.address.trim() || undefined,
      };

      let response;
      if (editingCustomer) {
        // Update existing customer
        response = await customersAPI.update(editingCustomer.id, customerData);
      } else {
        // Create new customer
        response = await customersAPI.create(customerData);
      }

      if (response.success) {
        toast.success(editingCustomer ? 'Customer updated successfully' : 'Customer added successfully');
        setShowAddModal(false);
        setEditingCustomer(null);
        resetForm();
        loadCustomers(); // Reload the list
      } else {
        toast.error(response.error || response.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      if (error.message.includes('Validation failed')) {
        toast.error('Please check all required fields and try again');
      } else if (error.message.includes('already exists')) {
        toast.error('A customer with this phone number already exists');
      } else {
        toast.error('Failed to save customer. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!deletingCustomer) return;

    try {
      const response = await customersAPI.delete(deletingCustomer.id);
      if (response.success) {
        toast.success('Customer deleted successfully');
        setDeletingCustomer(null);
        loadCustomers(); // Reload the list
      } else {
        toast.error(response.error || 'Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      Gold: 'bg-[#fef3c7] text-[#f59e0b] border-[#fcd34d]',
      Silver: 'bg-[#e5e5e5] text-[#737373] border-[#d4d4d4]',
      Bronze: 'bg-[#fed7aa] text-[#ea580c] border-[#fdba74]',
      Regular: 'bg-[#dbeafe] text-[#3b82f6] border-[#93c5fd]',
    };
    return (
      <Badge variant="secondary" className={colors[tier as keyof typeof colors]}>
        <Star className="h-3 w-3 mr-1" />
        {tier}
      </Badge>
    );
  };

  return (
    <PageTemplate
      title="Customers"
      subtitle="Manage your customer database"
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
          <Button size="sm" onClick={handleAddCustomer}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
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
                placeholder="Search by name, phone, or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Customers</p>
                <h3>{stats.total}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Gold Tier</p>
                <h3 className="text-[#f59e0b]">{stats.gold}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Silver Tier</p>
                <h3 className="text-[#737373]">{stats.silver}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Bronze Tier</p>
                <h3 className="text-[#ea580c]">{stats.bronze}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Total Purchases</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          Loading customers...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? 'No customers found matching your search.' : 'No customers added yet. Click "Add Customer" to get started.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                              ID: {customer.id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span style={{ fontSize: 'var(--text-body-s)' }}>{customer.phone}</span>
                            </div>
                            {customer.email && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span style={{ fontSize: 'var(--text-body-s)' }}>{customer.email}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>LKR {customer.totalPurchases?.toLocaleString() || '0'}</TableCell>
                        <TableCell>
                          {customer.lastPurchase 
                            ? new Date(customer.lastPurchase).toLocaleDateString()
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditCustomer(customer)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setDeletingCustomer(customer)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Customer Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
            <DialogDescription>
              {editingCustomer ? 'Update customer details' : 'Enter details for the new customer'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="07x xxx xxxx"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@email.com"
              />
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
                setEditingCustomer(null);
                resetForm();
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCustomer} disabled={submitting}>
              {submitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  {editingCustomer ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                editingCustomer ? 'Update Customer' : 'Add Customer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCustomer} onOpenChange={() => setDeletingCustomer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingCustomer?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCustomer} 
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
