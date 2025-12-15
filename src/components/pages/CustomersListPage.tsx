import React, { useState, useContext } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Download, Upload, Search, Edit2, Eye, Phone, Mail, MapPin, Star } from 'lucide-react';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { AppContext } from '../../App';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  loyaltyPoints: number;
  totalPurchases: number;
  lastPurchase: string;
  tier: 'Gold' | 'Silver' | 'Bronze' | 'Regular';
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.k@email.com',
    address: '123 Main St, Mumbai, MH 400001',
    loyaltyPoints: 1250,
    totalPurchases: 125600,
    lastPurchase: '2025-11-17',
    tier: 'Gold',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    phone: '+91 98765 43211',
    email: 'priya.s@email.com',
    address: '456 Park Ave, Delhi, DL 110001',
    loyaltyPoints: 850,
    totalPurchases: 85400,
    lastPurchase: '2025-11-16',
    tier: 'Silver',
  },
  {
    id: '3',
    name: 'Amit Patel',
    phone: '+91 98765 43212',
    email: 'amit.p@email.com',
    address: '789 Lake Road, Bangalore, KA 560001',
    loyaltyPoints: 420,
    totalPurchases: 42000,
    lastPurchase: '2025-11-15',
    tier: 'Bronze',
  },
  {
    id: '4',
    name: 'Sneha Reddy',
    phone: '+91 98765 43213',
    email: 'sneha.r@email.com',
    address: '321 Hill View, Hyderabad, TS 500001',
    loyaltyPoints: 180,
    totalPurchases: 18500,
    lastPurchase: '2025-11-14',
    tier: 'Regular',
  },
  {
    id: '5',
    name: 'Vikram Singh',
    phone: '+91 98765 43214',
    email: 'vikram.s@email.com',
    address: '654 Garden St, Pune, MH 411001',
    loyaltyPoints: 950,
    totalPurchases: 95200,
    lastPurchase: '2025-11-18',
    tier: 'Silver',
  },
];

export const CustomersListPage: React.FC = () => {
  const { navigateTo } = useContext(AppContext);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: customers.length,
    gold: customers.filter((c) => c.tier === 'Gold').length,
    silver: customers.filter((c) => c.tier === 'Silver').length,
    bronze: customers.filter((c) => c.tier === 'Bronze').length,
  };

  const resetForm = () => {
    setFormData({
      name: '',
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
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
    });
    setShowAddModal(true);
  };

  const handleSaveCustomer = () => {
    if (editingCustomer) {
      setCustomers(
        customers.map((customer) =>
          customer.id === editingCustomer.id
            ? {
                ...customer,
                ...formData,
              }
            : customer
        )
      );
    } else {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        ...formData,
        loyaltyPoints: 0,
        totalPurchases: 0,
        lastPurchase: new Date().toISOString().split('T')[0],
        tier: 'Regular',
      };
      setCustomers([...customers, newCustomer]);
    }
    setShowAddModal(false);
    resetForm();
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
      breadcrumbs={[{ label: 'Customers' }, { label: 'All Customers' }]}
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
                    <TableHead>Tier</TableHead>
                    <TableHead>Loyalty Points</TableHead>
                    <TableHead>Total Purchases</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
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
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span style={{ fontSize: 'var(--text-body-s)' }}>{customer.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getTierBadge(customer.tier)}</TableCell>
                      <TableCell>{customer.loyaltyPoints} pts</TableCell>
                      <TableCell>₹{customer.totalPurchases.toLocaleString()}</TableCell>
                      <TableCell>{new Date(customer.lastPurchase).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => navigateTo('customer-profile')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditCustomer(customer)}>
                            <Edit2 className="h-4 w-4" />
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
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
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
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCustomer}>
              {editingCustomer ? 'Update Customer' : 'Add Customer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Customer Modal */}
      <Dialog open={!!viewingCustomer} onOpenChange={() => setViewingCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {viewingCustomer && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3>{viewingCustomer.name}</h3>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Customer ID: {viewingCustomer.id}
                  </p>
                </div>
                {getTierBadge(viewingCustomer.tier)}
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{viewingCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{viewingCustomer.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <span>{viewingCustomer.address}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Loyalty Points
                  </p>
                  <p className="font-medium">{viewingCustomer.loyaltyPoints} pts</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Total Purchases
                  </p>
                  <p className="font-medium">₹{viewingCustomer.totalPurchases.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Last Purchase
                  </p>
                  <p className="font-medium">{new Date(viewingCustomer.lastPurchase).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingCustomer(null)}>
              Close
            </Button>
            <Button onClick={() => {
              setViewingCustomer(null);
              if (viewingCustomer) handleEditCustomer(viewingCustomer);
            }}>
              Edit Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};
