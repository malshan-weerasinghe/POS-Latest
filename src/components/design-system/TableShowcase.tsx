import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { Input } from '../ui/input';

const sampleData = [
  { id: '001', product: 'Laptop Pro 15"', category: 'Electronics', price: '$1,299.00', stock: 45, status: 'In Stock' },
  { id: '002', product: 'Wireless Mouse', category: 'Electronics', price: '$29.99', stock: 120, status: 'In Stock' },
  { id: '003', product: 'USB-C Cable', category: 'Accessories', price: '$14.99', stock: 5, status: 'Low Stock' },
  { id: '004', product: 'Office Chair', category: 'Furniture', price: '$349.00', stock: 0, status: 'Out of Stock' },
  { id: '005', product: 'Desk Lamp', category: 'Furniture', price: '$79.99', stock: 28, status: 'In Stock' },
  { id: '006', product: 'Notebook Set', category: 'Stationery', price: '$12.99', stock: 200, status: 'In Stock' },
  { id: '007', product: 'Mechanical Keyboard', category: 'Electronics', price: '$159.00', stock: 32, status: 'In Stock' },
  { id: '008', product: 'Monitor Stand', category: 'Accessories', price: '$45.00', stock: 8, status: 'Low Stock' },
];

export const TableShowcase: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sampleData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sampleData.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Stock':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">In Stock</Badge>;
      case 'Low Stock':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Low Stock</Badge>;
      case 'Out of Stock':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Out of Stock</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Table with Filters */}
      <div>
        <h4 className="mb-4">Product Table with Pagination & Filters</h4>
        
        {/* Filters */}
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search products..." />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.id}</TableCell>
                  <TableCell>{item.product}</TableCell>
                  <TableCell className="text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="text-right font-medium">{item.price}</TableCell>
                  <TableCell className="text-right">{item.stock}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, sampleData.length)} of {sampleData.length} results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Zebra Striped Table */}
      <div>
        <h4 className="mb-4">Zebra Striped Table</h4>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.slice(0, 6).map((item, index) => (
                <TableRow 
                  key={item.id}
                  className={index % 2 === 1 ? 'bg-muted/30' : ''}
                >
                  <TableCell>{item.product}</TableCell>
                  <TableCell className="text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="text-right font-medium">{item.price}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Compact Table */}
      <div>
        <h4 className="mb-4">Compact Table</h4>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="h-8 text-xs">ID</TableHead>
                <TableHead className="h-8 text-xs">Product</TableHead>
                <TableHead className="h-8 text-xs text-right">Price</TableHead>
                <TableHead className="h-8 text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.slice(0, 5).map((item) => (
                <TableRow key={item.id} className="text-xs">
                  <TableCell className="h-8 font-mono">{item.id}</TableCell>
                  <TableCell className="h-8">{item.product}</TableCell>
                  <TableCell className="h-8 text-right">{item.price}</TableCell>
                  <TableCell className="h-8">{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
