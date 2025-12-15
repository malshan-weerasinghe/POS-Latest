import React, { useState } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Eye, Check, X, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface GRN {
  id: string;
  grnNumber: string;
  supplier: string;
  poNumber: string;
  invoiceNumber: string;
  items: number;
  totalAmount: number;
  receivedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockGRNs: GRN[] = [
  {
    id: '1',
    grnNumber: 'GRN-2025-001',
    supplier: 'ABC Wholesale',
    poNumber: 'PO-2025-045',
    invoiceNumber: 'INV-12345',
    items: 12,
    totalAmount: 45600,
    receivedDate: '2025-11-18',
    status: 'pending',
  },
  {
    id: '2',
    grnNumber: 'GRN-2025-002',
    supplier: 'XYZ Traders',
    poNumber: 'PO-2025-046',
    invoiceNumber: 'INV-67890',
    items: 8,
    totalAmount: 32400,
    receivedDate: '2025-11-17',
    status: 'pending',
  },
  {
    id: '3',
    grnNumber: 'GRN-2025-003',
    supplier: 'PQR Distributors',
    poNumber: '',
    invoiceNumber: 'INV-11223',
    items: 15,
    totalAmount: 58900,
    receivedDate: '2025-11-16',
    status: 'approved',
  },
];

const mockGRNItems = [
  { name: 'Premium Rice 5kg', ordered: 50, received: 48, costPrice: 320 },
  { name: 'Cooking Oil 1L', ordered: 100, received: 100, costPrice: 190 },
  { name: 'Sugar 1kg', ordered: 200, received: 195, costPrice: 42 },
];

export const GRNApprovalPage: React.FC = () => {
  const [grns, setGrns] = useState<GRN[]>(mockGRNs);
  const [viewingGRN, setViewingGRN] = useState<GRN | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedGRN, setSelectedGRN] = useState<GRN | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const stats = {
    total: grns.length,
    pending: grns.filter((g) => g.status === 'pending').length,
    approved: grns.filter((g) => g.status === 'approved').length,
    rejected: grns.filter((g) => g.status === 'rejected').length,
  };

  const handleApprove = (grn: GRN) => {
    setSelectedGRN(grn);
    setShowApproveModal(true);
  };

  const handleReject = (grn: GRN) => {
    setSelectedGRN(grn);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const confirmApprove = () => {
    if (selectedGRN) {
      setGrns(grns.map((g) => (g.id === selectedGRN.id ? { ...g, status: 'approved' as const } : g)));
    }
    setShowApproveModal(false);
    setSelectedGRN(null);
  };

  const confirmReject = () => {
    if (selectedGRN) {
      setGrns(grns.map((g) => (g.id === selectedGRN.id ? { ...g, status: 'rejected' as const } : g)));
    }
    setShowRejectModal(false);
    setSelectedGRN(null);
    setRejectReason('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-[#fef3c7] text-[#f59e0b] border-[#fcd34d]">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="secondary" className="bg-[#d1fae5] text-[#10b981] border-[#6ee7b7]">
            <Check className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="secondary" className="bg-[#fee2e2] text-[#ef4444] border-[#fca5a5]">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Suppliers & GRN' }, { label: 'GRN Approval' }]}
      title="GRN Approval"
      subtitle="Review and approve goods receipt notes"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total GRNs</p>
                <h3>{stats.total}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Pending</p>
                <h3 className="text-[#f59e0b]">{stats.pending}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Approved</p>
                <h3 className="text-[#10b981]">{stats.approved}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Rejected</p>
                <h3 className="text-[#ef4444]">{stats.rejected}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* GRN Table */}
        <Card>
          <CardHeader>
            <CardTitle>All GRNs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>GRN Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Received Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grns.map((grn) => (
                    <TableRow key={grn.id}>
                      <TableCell className="font-medium">{grn.grnNumber}</TableCell>
                      <TableCell>{grn.supplier}</TableCell>
                      <TableCell>{grn.invoiceNumber}</TableCell>
                      <TableCell>{grn.items} items</TableCell>
                      <TableCell className="font-medium">₹{grn.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(grn.receivedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(grn.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setViewingGRN(grn)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {grn.status === 'pending' && (
                            <>
                              <Button variant="default" size="sm" onClick={() => handleApprove(grn)}>
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReject(grn)}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
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

      {/* View GRN Details Modal */}
      <Dialog open={!!viewingGRN} onOpenChange={() => setViewingGRN(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>GRN Details</DialogTitle>
          </DialogHeader>
          {viewingGRN && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    GRN Number
                  </p>
                  <p className="font-medium">{viewingGRN.grnNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Supplier
                  </p>
                  <p className="font-medium">{viewingGRN.supplier}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    PO Number
                  </p>
                  <p className="font-medium">{viewingGRN.poNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Invoice Number
                  </p>
                  <p className="font-medium">{viewingGRN.invoiceNumber}</p>
                </div>
              </div>
              <div>
                <p className="font-medium mb-2">Items Received</p>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Ordered</TableHead>
                        <TableHead>Received</TableHead>
                        <TableHead className="text-right">Cost Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockGRNItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.ordered}</TableCell>
                          <TableCell>
                            <span
                              className={item.received < item.ordered ? 'text-[#f59e0b]' : ''}
                            >
                              {item.received}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">₹{item.costPrice}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingGRN(null)}>
              Close
            </Button>
            {viewingGRN && viewingGRN.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleReject(viewingGRN);
                    setViewingGRN(null);
                  }}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    handleApprove(viewingGRN);
                    setViewingGRN(null);
                  }}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve GRN</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this GRN? This will update the inventory.
            </DialogDescription>
          </DialogHeader>
          {selectedGRN && (
            <div className="py-4">
              <p className="text-muted-foreground">
                GRN: <span className="font-medium text-foreground">{selectedGRN.grnNumber}</span>
              </p>
              <p className="text-muted-foreground">
                Supplier: <span className="font-medium text-foreground">{selectedGRN.supplier}</span>
              </p>
              <p className="text-muted-foreground">
                Amount: <span className="font-medium text-foreground">₹{selectedGRN.totalAmount.toLocaleString()}</span>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApprove}>
              <Check className="h-4 w-4 mr-2" />
              Approve GRN
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject GRN</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this GRN
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rejection Reason *</Label>
              <Textarea
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectReason}
            >
              <X className="h-4 w-4 mr-2" />
              Reject GRN
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};
