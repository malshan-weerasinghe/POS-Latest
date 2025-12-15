import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Search, Download, Plus, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const EmployeeAttendancePage: React.FC = () => {
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const attendanceRecords = [
    { id: 'EMP001', name: 'Rajesh Kumar', role: 'Cashier', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', hours: 9, date: '2025-11-18', notes: '' },
    { id: 'EMP002', name: 'Priya Sharma', role: 'Sales Associate', checkIn: '09:15 AM', checkOut: '06:10 PM', status: 'Present', hours: 8.9, date: '2025-11-18', notes: '' },
    { id: 'EMP003', name: 'Amit Patel', role: 'Store Manager', checkIn: '08:45 AM', checkOut: '06:30 PM', status: 'Present', hours: 9.75, date: '2025-11-18', notes: '' },
    { id: 'EMP004', name: 'Sneha Reddy', role: 'Inventory Clerk', checkIn: '-', checkOut: '-', status: 'Absent', hours: 0, date: '2025-11-18', notes: 'Sick leave' },
    { id: 'EMP005', name: 'Vikram Singh', role: 'Delivery Boy', checkIn: '10:00 AM', checkOut: '-', status: 'Half Day', hours: 0, date: '2025-11-18', notes: 'Personal work' },
    { id: 'EMP006', name: 'Anita Desai', role: 'Accountant', checkIn: '09:30 AM', checkOut: '06:00 PM', status: 'Present', hours: 8.5, date: '2025-11-18', notes: '' },
  ];

  const totalEmployees = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(r => r.status === 'Present').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'Absent').length;
  const halfDayCount = attendanceRecords.filter(r => r.status === 'Half Day').length;

  const handleMarkAttendance = () => {
    toast.success('Attendance Marked', { description: 'Employee attendance has been recorded.' });
    setShowMarkModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground" style={{
            fontSize: 'var(--text-display-s)',
            fontWeight: 'var(--font-weight-bold)',
            lineHeight: 'var(--line-height-tight)'
          }}>
            Employee Attendance
          </h1>
          <p className="text-muted-foreground mt-1" style={{
            fontSize: 'var(--text-body-m)',
            lineHeight: 'var(--line-height-normal)'
          }}>
            Track daily employee attendance and work hours
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowMarkModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Total Employees
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  {totalEmployees}
                </p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span style={{ fontSize: 'var(--text-body-s)' }}>Active</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Present Today
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  {presentCount}
                </p>
                <div className="flex items-center gap-1 text-[#10b981]">
                  <CheckCircle className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>{Math.round((presentCount/totalEmployees)*100)}%</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-[#10b981]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Absent
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  {absentCount}
                </p>
                <div className="flex items-center gap-1 text-[#ef4444]">
                  <XCircle className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>{Math.round((absentCount/totalEmployees)*100)}%</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-[#ef4444]/10 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-[#ef4444]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>
                  Half Day / Late
                </p>
                <p className="text-foreground" style={{ 
                  fontSize: 'var(--text-headline-l)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>
                  {halfDayCount}
                </p>
                <div className="flex items-center gap-1 text-[#f59e0b]">
                  <Clock className="h-3 w-3" />
                  <span style={{ fontSize: 'var(--text-body-s)' }}>{Math.round((halfDayCount/totalEmployees)*100)}%</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-[#f59e0b]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" defaultValue="2025-11-18" />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="halfday">Half Day</SelectItem>
                  <SelectItem value="leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Department/Role</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                  <SelectItem value="sales">Sales Associate</SelectItem>
                  <SelectItem value="manager">Store Manager</SelectItem>
                  <SelectItem value="inventory">Inventory Clerk</SelectItem>
                  <SelectItem value="delivery">Delivery Boy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Employee name or ID..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance - November 18, 2025</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Work Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell className="text-muted-foreground">{record.role}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>{record.checkOut}</TableCell>
                    <TableCell>
                      {record.hours > 0 ? `${record.hours} hrs` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        record.status === 'Present' ? 'default' :
                        record.status === 'Absent' ? 'destructive' : 'secondary'
                      }>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {record.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Present</p>
                <p className="text-[#10b981] font-medium mt-1">{presentCount} ({Math.round((presentCount/totalEmployees)*100)}%)</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Absent</p>
                <p className="text-[#ef4444] font-medium mt-1">{absentCount} ({Math.round((absentCount/totalEmployees)*100)}%)</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Half Day</p>
                <p className="text-[#f59e0b] font-medium mt-1">{halfDayCount} ({Math.round((halfDayCount/totalEmployees)*100)}%)</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-body-s)' }}>Attendance Rate</p>
                <p className="text-foreground font-medium mt-1">{Math.round(((presentCount + halfDayCount)/totalEmployees)*100)}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mark Attendance Modal */}
      <Dialog open={showMarkModal} onOpenChange={setShowMarkModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
            <DialogDescription>
              Record employee attendance for today
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee *</Label>
                <Select>
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emp001">EMP001 - Rajesh Kumar</SelectItem>
                    <SelectItem value="emp002">EMP002 - Priya Sharma</SelectItem>
                    <SelectItem value="emp003">EMP003 - Amit Patel</SelectItem>
                    <SelectItem value="emp004">EMP004 - Sneha Reddy</SelectItem>
                    <SelectItem value="emp005">EMP005 - Vikram Singh</SelectItem>
                    <SelectItem value="emp006">EMP006 - Anita Desai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" type="date" defaultValue="2025-11-18" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="halfday">Half Day</SelectItem>
                    <SelectItem value="leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leave-type">Leave Type</Label>
                <Select>
                  <SelectTrigger id="leave-type">
                    <SelectValue placeholder="Select if on leave" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="casual">Casual Leave</SelectItem>
                    <SelectItem value="earned">Earned Leave</SelectItem>
                    <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="check-in">Check In Time</Label>
                <Input id="check-in" type="time" defaultValue="09:00" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="check-out">Check Out Time</Label>
                <Input id="check-out" type="time" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes / Remarks</Label>
              <Textarea id="notes" placeholder="Any additional notes..." rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMarkModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleMarkAttendance}>
              Mark Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
