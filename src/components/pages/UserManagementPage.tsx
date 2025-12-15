import React, { useState } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Search, Edit2, Lock, UserCheck, UserX, Shield } from 'lucide-react';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Cashier' | 'Inventory';
  status: 'active' | 'inactive';
  lastLogin: string;
  permissions: string[];
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    username: 'admin',
    email: 'admin@store.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2025-11-18 10:30 AM',
    permissions: ['all'],
  },
  {
    id: '2',
    name: 'Store Manager',
    username: 'manager1',
    email: 'manager@store.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '2025-11-18 09:15 AM',
    permissions: ['sales', 'inventory', 'reports'],
  },
  {
    id: '3',
    name: 'Cashier 1',
    username: 'cashier1',
    email: 'cashier1@store.com',
    role: 'Cashier',
    status: 'active',
    lastLogin: '2025-11-18 08:00 AM',
    permissions: ['sales'],
  },
  {
    id: '4',
    name: 'Inventory Manager',
    username: 'inventory1',
    email: 'inventory@store.com',
    role: 'Inventory',
    status: 'active',
    lastLogin: '2025-11-17 06:45 PM',
    permissions: ['inventory', 'suppliers'],
  },
];

const allPermissions = [
  { id: 'sales', label: 'Sales & Billing' },
  { id: 'inventory', label: 'Inventory Management' },
  { id: 'suppliers', label: 'Supplier Management' },
  { id: 'customers', label: 'Customer Management' },
  { id: 'reports', label: 'Reports & Analytics' },
  { id: 'users', label: 'User Management' },
  { id: 'settings', label: 'System Settings' },
];

export const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    role: 'Cashier' as 'Admin' | 'Manager' | 'Cashier' | 'Inventory',
    password: '',
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    admins: users.filter((u) => u.role === 'Admin').length,
  };

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      role: 'Cashier',
      password: '',
    });
    setSelectedPermissions([]);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    resetForm();
    setShowAddModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      password: '',
    });
    setSelectedPermissions(user.permissions);
    setShowAddModal(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                ...formData,
                permissions: selectedPermissions,
              }
            : user
        )
      );
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        status: 'active',
        lastLogin: 'Never',
        permissions: selectedPermissions,
      };
      setUsers([...users, newUser]);
    }
    setShowAddModal(false);
    resetForm();
  };

  const toggleUserStatus = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === 'active' ? 'inactive' : 'active',
            }
          : user
      )
    );
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      Admin: 'bg-[#fef3c7] text-[#f59e0b] border-[#fcd34d]',
      Manager: 'bg-[#dbeafe] text-[#3b82f6] border-[#93c5fd]',
      Cashier: 'bg-[#d1fae5] text-[#10b981] border-[#6ee7b7]',
      Inventory: 'bg-[#e9d5ff] text-[#8b5cf6] border-[#c4b5fd]',
    };
    return (
      <Badge variant="secondary" className={colors[role as keyof typeof colors]}>
        <Shield className="h-3 w-3 mr-1" />
        {role}
      </Badge>
    );
  };

  const togglePermission = (permissionId: string) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Settings' }, { label: 'User Management' }]}
      title="User Management"
      subtitle="Manage user accounts and permissions"
      actions={
        <>
          <Button size="sm" onClick={handleAddUser}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
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
                placeholder="Search by name, username, or email..."
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
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Users</p>
                <h3>{stats.total}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Active Users</p>
                <h3 className="text-[#10b981]">{stats.active}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Administrators</p>
                <h3>{stats.admins}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                            {user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono" style={{ fontSize: 'var(--text-body-s)' }}>
                        {user.username}
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            user.status === 'active'
                              ? 'bg-[#d1fae5] text-[#10b981] border-[#6ee7b7]'
                              : 'bg-[#fee2e2] text-[#ef4444] border-[#fca5a5]'
                          }
                        >
                          {user.status === 'active' ? (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <UserX className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => toggleUserStatus(user.id)}>
                            <Lock className="h-4 w-4" />
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

      {/* Add/Edit User Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {editingUser ? 'Update user details and permissions' : 'Create a new user account'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Username *</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@store.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Cashier">Cashier</SelectItem>
                    <SelectItem value="Inventory">Inventory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{editingUser ? 'New Password (leave empty to keep current)' : 'Password *'}</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>
            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-3 border rounded-lg p-4">
                {allPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.id}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id)}
                    />
                    <label
                      htmlFor={permission.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div>
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
            <Button onClick={handleSaveUser}>
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};
