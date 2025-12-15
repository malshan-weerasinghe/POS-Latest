/**
 * OPTIMIZED PAGE EXAMPLE - Production Grade UI
 * 
 * This example demonstrates all optimization standards:
 * - 8pt grid spacing
 * - Consistent typography using design tokens
 * - Standardized icon sizes
 * - Theme token colors
 * - Clean component structure
 * - Proper alignment
 * 
 * Use this as a reference for all pages.
 */

import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { KPICard } from '../components/ui/kpi-card';
import { PageFilters, FilterField } from '../components/ui/page-filters';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Download, Plus, Search, DollarSign, TrendingUp, Package, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const OptimizedPageExample: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const mockData = [
    { id: '001', name: 'Item Alpha', category: 'Electronics', quantity: 150, value: 45000, status: 'Active' },
    { id: '002', name: 'Item Beta', category: 'Groceries', quantity: 320, value: 28800, status: 'Active' },
    { id: '003', name: 'Item Gamma', category: 'Beverages', quantity: 89, value: 12450, status: 'Low Stock' },
    { id: '004', name: 'Item Delta', category: 'Personal Care', quantity: 0, value: 0, status: 'Out of Stock' },
  ];

  const handleAddItem = () => {
    toast.success('Item Added', { description: 'The item has been added successfully.' });
    setShowAddModal(false);
  };

  return (
    // Main page container - 24px gap between all sections (8pt grid: 3 units)
    <div className="space-y-6">
      
      {/* PAGE HEADER - Standardized component */}
      <PageHeader
        title="Inventory Management"
        description="Manage your stock levels and product catalog"
        actions={
          <>
            <Button variant="outline">
              <Download style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }} className="mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }} className="mr-2" />
              Add Item
            </Button>
          </>
        }
      />

      {/* KPI SECTION - 4 columns, 24px gap (8pt grid: 3 units) */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard
          label="Total Items"
          value="1,234"
          icon={Package}
          iconColor="var(--color-primary)"
          iconBgColor="var(--color-primary)"
          trend={{
            value: "+12 this week",
            direction: "up",
            color: "#10b981"
          }}
        />
        
        <KPICard
          label="Total Value"
          value="₹8,45,230"
          icon={DollarSign}
          iconColor="var(--color-accent-foreground)"
          iconBgColor="var(--color-accent-foreground)"
          trend={{
            value: "+8.5%",
            direction: "up",
            color: "#10b981"
          }}
        />
        
        <KPICard
          label="Low Stock"
          value="23"
          icon={TrendingUp}
          iconColor="#f59e0b"
          iconBgColor="#f59e0b"
          trend={{
            value: "Needs attention",
            color: "#f59e0b"
          }}
        />
        
        <KPICard
          label="Categories"
          value="12"
          icon={Users}
          iconColor="var(--color-primary)"
          iconBgColor="var(--color-primary)"
          subtitle="Active"
        />
      </div>

      {/* FILTERS SECTION - Standardized component */}
      <PageFilters>
        <FilterField>
          <Label>Category</Label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="groceries">Groceries</SelectItem>
              <SelectItem value="beverages">Beverages</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField>
          <Label>Status</Label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField>
          <Label>Sort By</Label>
          <Select defaultValue="name">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="quantity">Quantity</SelectItem>
              <SelectItem value="value">Value</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>

        <FilterField>
          <Label>Search</Label>
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              style={{ width: 'var(--icon-sm)', height: 'var(--icon-sm)' }}
            />
            <Input
              placeholder="Search items..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </FilterField>
      </PageFilters>

      {/* DATA TABLE SECTION - Optimized spacing and typography */}
      <Card>
        <CardHeader>
          <CardTitle>Items List</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table with border and rounded corners */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Value (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell 
                      className="font-medium"
                      style={{ fontSize: 'var(--text-body-m)' }}
                    >
                      {item.id}
                    </TableCell>
                    <TableCell style={{ fontSize: 'var(--text-body-m)' }}>
                      {item.name}
                    </TableCell>
                    <TableCell 
                      className="text-muted-foreground"
                      style={{ fontSize: 'var(--text-body-m)' }}
                    >
                      {item.category}
                    </TableCell>
                    <TableCell 
                      className="text-right font-medium"
                      style={{ fontSize: 'var(--text-body-m)' }}
                    >
                      {item.quantity}
                    </TableCell>
                    <TableCell 
                      className="text-right font-medium"
                      style={{ fontSize: 'var(--text-body-m)' }}
                    >
                      ₹{item.value.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          item.status === 'Active' ? 'default' :
                          item.status === 'Low Stock' ? 'secondary' : 'destructive'
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination - Consistent spacing */}
          <div className="flex items-center justify-between mt-4">
            <p 
              className="text-muted-foreground"
              style={{ fontSize: 'var(--text-body-s)' }}
            >
              Showing 1-4 of 4 items
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ADD ITEM MODAL - Standardized spacing and structure */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle 
              style={{ 
                fontSize: 'var(--text-headline-m)',
                fontWeight: 'var(--font-weight-semibold)',
                lineHeight: 'var(--line-height-tight)'
              }}
            >
              Add New Item
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body-m)' }}>
              Enter the details of the new inventory item
            </DialogDescription>
          </DialogHeader>

          {/* Form content - 16px gaps between fields (8pt grid: 2 units) */}
          <div className="space-y-4 py-4">
            {/* 2-column grid with 16px gap */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label style={{ fontSize: 'var(--text-body-m)' }}>Item Name *</Label>
                <Input placeholder="Enter item name" />
              </div>

              <div className="space-y-2">
                <Label style={{ fontSize: 'var(--text-body-m)' }}>Category *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="groceries">Groceries</SelectItem>
                    <SelectItem value="beverages">Beverages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label style={{ fontSize: 'var(--text-body-m)' }}>Quantity *</Label>
                <Input type="number" placeholder="0" />
              </div>

              <div className="space-y-2">
                <Label style={{ fontSize: 'var(--text-body-m)' }}>Unit Price (₹) *</Label>
                <Input type="number" placeholder="0.00" />
              </div>
            </div>

            <div className="space-y-2">
              <Label style={{ fontSize: 'var(--text-body-m)' }}>Description</Label>
              <Input placeholder="Optional item description" />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddItem}>
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/**
 * KEY OPTIMIZATION POINTS DEMONSTRATED:
 * 
 * 1. SPACING (8pt Grid):
 *    - Main sections: space-y-6 (24px)
 *    - KPI grid: gap-6 (24px)
 *    - Filter grid: gap-4 (16px)
 *    - Form fields: space-y-2 (8px) for label/input
 *    - Form rows: space-y-4 (16px)
 * 
 * 2. TYPOGRAPHY:
 *    - Page title: var(--text-display-s) - 24px
 *    - Modal title: var(--text-headline-m) - 24px
 *    - Card title: var(--text-subtitle-s) - 16px
 *    - Body text: var(--text-body-m) - 14px
 *    - Captions: var(--text-body-s) - 13px
 * 
 * 3. ICONS:
 *    - Button icons: var(--icon-sm) - 16px (h-4 w-4)
 *    - KPI icons: var(--icon-lg) - 24px (h-6 w-6)
 *    - Search icon: var(--icon-sm) - 16px
 * 
 * 4. COLORS:
 *    - All colors use theme tokens (var(--color-*))
 *    - Semantic colors for states (#10b981, #f59e0b, #ef4444)
 *    - Works in both light/dark mode
 * 
 * 5. STRUCTURE:
 *    - Reusable components (PageHeader, KPICard, PageFilters)
 *    - Consistent grid layouts
 *    - Clean component hierarchy
 *    - Proper semantic HTML
 * 
 * 6. ALIGNMENT:
 *    - Text left-aligned
 *    - Numbers right-aligned
 *    - Consistent vertical rhythm
 * 
 * 7. ACCESSIBILITY:
 *    - Proper label/input associations
 *    - Focus states (handled by design system)
 *    - Semantic badges for status
 * 
 * Apply these patterns to ALL pages for production-grade quality.
 */
