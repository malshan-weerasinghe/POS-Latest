import React, { useState, useContext } from 'react';
import { PageTemplate } from '../templates/PageTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Play, Trash2, Eye, Clock, User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { AppContext } from '../../App';

interface HoldBill {
  id: string;
  billNumber: string;
  customer: string;
  items: number;
  amount: number;
  timestamp: string;
  cashier: string;
}

const mockHoldBills: HoldBill[] = [
  {
    id: '1',
    billNumber: 'HOLD-001',
    customer: 'Walk-in Customer',
    items: 5,
    amount: 1250,
    timestamp: '2025-11-18 10:30 AM',
    cashier: 'Cashier 1',
  },
  {
    id: '2',
    billNumber: 'HOLD-002',
    customer: 'Rajesh Kumar',
    items: 3,
    amount: 850,
    timestamp: '2025-11-18 11:15 AM',
    cashier: 'Cashier 1',
  },
  {
    id: '3',
    billNumber: 'HOLD-003',
    customer: 'Walk-in Customer',
    items: 8,
    amount: 2140,
    timestamp: '2025-11-18 11:45 AM',
    cashier: 'Cashier 2',
  },
];

export const HoldBillsPage: React.FC = () => {
  const { navigateTo } = useContext(AppContext);
  const [holdBills, setHoldBills] = useState<HoldBill[]>(mockHoldBills);
  const [viewingBill, setViewingBill] = useState<HoldBill | null>(null);

  const resumeBill = (bill: HoldBill) => {
    console.log('Resuming bill:', bill);
    // Navigate to billing page with this bill data
    navigateTo('sales-billing');
  };

  const deleteBill = (id: string) => {
    setHoldBills(holdBills.filter((bill) => bill.id !== id));
  };

  const stats = {
    total: holdBills.length,
    totalAmount: holdBills.reduce((sum, bill) => sum + bill.amount, 0),
    totalItems: holdBills.reduce((sum, bill) => sum + bill.items, 0),
  };

  return (
    <PageTemplate
      breadcrumbs={[{ label: 'Sales' }, { label: 'Hold Bills' }]}
      title="Hold Bills"
      subtitle="Manage parked/held sales transactions"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Hold Bills</p>
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
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Total Amount</p>
                <h3 className="text-primary">₹{stats.totalAmount.toLocaleString()}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hold Bills Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Hold Bills</CardTitle>
          </CardHeader>
          <CardContent>
            {holdBills.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Clock className="h-12 w-12 mb-3 opacity-30" />
                <p>No hold bills found</p>
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bill Number</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Time Held</TableHead>
                      <TableHead>Cashier</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holdBills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.billNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{bill.customer}</span>
                          </div>
                        </TableCell>
                        <TableCell>{bill.items} items</TableCell>
                        <TableCell className="font-medium">₹{bill.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span style={{ fontSize: 'var(--text-body-s)' }}>{bill.timestamp}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{bill.cashier}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setViewingBill(bill)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="default" size="sm" onClick={() => resumeBill(bill)}>
                              <Play className="h-4 w-4 mr-1" />
                              Resume
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteBill(bill.id)}
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Bill Details Modal */}
      <Dialog open={!!viewingBill} onOpenChange={() => setViewingBill(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hold Bill Details</DialogTitle>
          </DialogHeader>
          {viewingBill && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Bill Number
                  </p>
                  <p className="font-medium">{viewingBill.billNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Customer
                  </p>
                  <p className="font-medium">{viewingBill.customer}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Items
                  </p>
                  <p className="font-medium">{viewingBill.items} items</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Amount
                  </p>
                  <p className="font-medium">₹{viewingBill.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Time Held
                  </p>
                  <p className="font-medium">{viewingBill.timestamp}</p>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                    Cashier
                  </p>
                  <p className="font-medium">{viewingBill.cashier}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingBill(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (viewingBill) resumeBill(viewingBill);
                setViewingBill(null);
              }}
            >
              <Play className="h-4 w-4 mr-2" />
              Resume Bill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTemplate>
  );
};
