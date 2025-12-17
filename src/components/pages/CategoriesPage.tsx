import React, { useState } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  color: string;
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Smartphones',
    description: 'iPhones, Samsung, OnePlus and other smartphones',
    itemCount: 245,
    color: '#10b981',
  },
  {
    id: '2',
    name: 'Accessories',
    description: 'Cases, chargers, cables, and other accessories',
    itemCount: 487,
    color: '#3b82f6',
  },
  {
    id: '3',
    name: 'Tablets',
    description: 'iPads and Android tablets',
    itemCount: 78,
    color: '#8b5cf6',
  },
  {
    id: '4',
    name: 'Smartwatches',
    description: 'Apple Watch, Samsung Galaxy Watch, and others',
    itemCount: 156,
    color: '#f59e0b',
  },
  {
    id: '5',
    name: 'Audio',
    description: 'Headphones, earbuds, and speakers',
    itemCount: 198,
    color: '#ef4444',
  },
];

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: categories.length,
    totalItems: categories.reduce((sum, cat) => sum + cat.itemCount, 0),
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    resetForm();
    setShowAddModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
    });
    setShowAddModal(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      setCategories(
        categories.map((category) =>
          category.id === editingCategory.id
            ? {
                ...category,
                ...formData,
              }
            : category
        )
      );
    } else {
      const colors = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
        itemCount: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setCategories([...categories, newCategory]);
    }
    setShowAddModal(false);
    resetForm();
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <PageTemplate
      title="Categories"
      subtitle="Manage product categories"
      actions={
        <>
          <Button size="sm" onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
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
                placeholder="Search categories..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Categories</p>
                <h3>{stats.total}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Items</p>
                <h3>{stats.totalItems}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className="h-12 w-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}15` }}
                    >
                      <Package className="h-6 w-6" style={{ color: category.color }} />
                    </div>
                    <Badge variant="secondary">{category.itemCount} items</Badge>
                  </div>
                  <div>
                    <h4>{category.name}</h4>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                      {category.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditCategory(category)}>
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog open={deleteDialogOpen && categoryToDelete?.id === category.id} onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setCategoryToDelete(null); }}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setCategoryToDelete(category); setDeleteDialogOpen(true); }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete <b>{category.name}</b>? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => handleDeleteCategory(category.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Item Count</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="h-8 w-8 rounded flex items-center justify-center"
                            style={{ backgroundColor: `${category.color}15` }}
                          >
                            <Package className="h-4 w-4" style={{ color: category.color }} />
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{category.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{category.itemCount} items</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <AlertDialog open={deleteDialogOpen && categoryToDelete?.id === category.id} onOpenChange={(open) => { setDeleteDialogOpen(open); if (!open) setCategoryToDelete(null); }}>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setCategoryToDelete(category); setDeleteDialogOpen(true); }}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete <b>{category.name}</b>? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => handleDeleteCategory(category.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Add/Edit Category Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update category details' : 'Create a new product category'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Category Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter category description"
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
            <Button onClick={handleSaveCategory} disabled={!formData.name}>
              {editingCategory ? 'Update Category' : 'Add Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};
