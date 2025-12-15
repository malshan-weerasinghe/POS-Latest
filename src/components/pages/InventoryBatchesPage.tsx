import React, { useState } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Search, AlertTriangle, Calendar } from 'lucide-react';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Batch {
  id: string;
  itemName: string;
  sku: string;
  batchNumber: string;
  quantity: number;
  costPrice: number;
  expiryDate: string;
  supplier: string;
  receivedDate: string;
  status: 'active' | 'expiring-soon' | 'expired';
}

const mockBatches: Batch[] = [
  {
    id: '1',
    itemName: 'Premium Rice 5kg',
    sku: 'GRC-001',
    batchNumber: 'BATCH-2025-001',
    quantity: 50,
    costPrice: 320,
    expiryDate: '2026-12-31',
    supplier: 'ABC Wholesale',
    receivedDate: '2025-11-01',
    status: 'active',
  },
  {
    id: '2',
    itemName: 'Cooking Oil 1L',
    sku: 'GRC-002',
    batchNumber: 'BATCH-2025-045',
    quantity: 35,
    costPrice: 190,
    expiryDate: '2025-12-15',
    supplier: 'XYZ Traders',
    receivedDate: '2025-10-15',
    status: 'expiring-soon',
  },
  {
    id: '3',
    itemName: 'Sugar 1kg',
    sku: 'GRC-003',
    batchNumber: 'BATCH-2025-012',
    quantity: 0,
    costPrice: 42,
    expiryDate: '2025-11-10',
    supplier: 'ABC Wholesale',
    receivedDate: '2025-09-10',
    status: 'expired',
  },
  {
    id: '4',
    itemName: 'Tea Powder 500g',
    sku: 'BEV-001',
    batchNumber: 'BATCH-2025-078',
    quantity: 120,
    costPrice: 95,
    expiryDate: '2026-06-30',
    supplier: 'PQR Distributors',
    receivedDate: '2025-11-10',
    status: 'active',
  },
  {
    id: '5',
    itemName: 'Wheat Flour 10kg',
    sku: 'GRC-004',
    batchNumber: 'BATCH-2025-023',
    quantity: 80,
    costPrice: 320,
    expiryDate: '2025-12-01',
    supplier: 'ABC Wholesale',
    receivedDate: '2025-10-01',
    status: 'expiring-soon',
  },
];

export const InventoryBatchesPage: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: batches.length,
    active: batches.filter((b) => b.status === 'active').length,
    expiringSoon: batches.filter((b) => b.status === 'expiring-soon').length,
    expired: batches.filter((b) => b.status === 'expired').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="secondary" className="bg-[#d1fae5] text-[#10b981] border-[#6ee7b7]">
            Active
          </Badge>
        );
      case 'expiring-soon':
        return (
          <Badge variant="secondary" className="bg-[#fef3c7] text-[#f59e0b] border-[#fcd34d]">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Expiring Soon
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="secondary" className="bg-[#fee2e2] text-[#ef4444] border-[#fca5a5]">
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Inventory' }, { label: 'Batches & Expiry' }]}
      title="Inventory Batches"
      subtitle="Track batch numbers and expiry dates"
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by item name, SKU, or batch number..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
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
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Batches</p>
                <h3>{stats.total}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Active</p>
                <h3 className="text-[#10b981]">{stats.active}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Expiring Soon</p>
                <h3 className="text-[#f59e0b]">{stats.expiringSoon}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Expired</p>
                <h3 className="text-[#ef4444]">{stats.expired}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Batches Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Batches ({filteredBatches.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Batch Number</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Received Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.map((batch) => {
                    const daysUntilExpiry = getDaysUntilExpiry(batch.expiryDate);
                    return (
                      <TableRow key={batch.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{batch.itemName}</p>
                            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                              {batch.sku}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono" style={{ fontSize: 'var(--text-body-s)' }}>
                          {batch.batchNumber}
                        </TableCell>
                        <TableCell>{batch.quantity} units</TableCell>
                        <TableCell className="text-muted-foreground">{batch.supplier}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span style={{ fontSize: 'var(--text-body-s)' }}>
                              {new Date(batch.receivedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p style={{ fontSize: 'var(--text-body-s)' }}>
                              {new Date(batch.expiryDate).toLocaleDateString()}
                            </p>
                            {daysUntilExpiry > 0 && daysUntilExpiry <= 30 && (
                              <p className="text-[#f59e0b]" style={{ fontSize: 'var(--text-caption)' }}>
                                {daysUntilExpiry} days left
                              </p>
                            )}
                            {daysUntilExpiry <= 0 && (
                              <p className="text-[#ef4444]" style={{ fontSize: 'var(--text-caption)' }}>
                                Expired {Math.abs(daysUntilExpiry)} days ago
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(batch.status)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTemplate>
  );
};
