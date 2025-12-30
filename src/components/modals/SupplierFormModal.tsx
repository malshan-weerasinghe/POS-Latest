import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface SupplierFormData {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}

interface SupplierFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: SupplierFormData;
  onFormDataChange: (data: SupplierFormData) => void;
  onSubmit: () => void;
  submitting?: boolean;
  editMode?: boolean;
}

export const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  open,
  onOpenChange,
  formData,
  onFormDataChange,
  onSubmit,
  submitting = false,
  editMode = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editMode ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
          <DialogDescription>
            {editMode ? 'Update supplier details' : 'Enter details for the new supplier'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Supplier Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              placeholder="Enter supplier name"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label>Contact Person *</Label>
            <Input
              value={formData.contactPerson}
              onChange={(e) => onFormDataChange({ ...formData, contactPerson: e.target.value })}
              placeholder="Enter contact person name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
                placeholder="07x xxx xxxx"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
                placeholder="supplier@email.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea
              value={formData.address}
              onChange={(e) => onFormDataChange({ ...formData, address: e.target.value })}
              placeholder="Enter complete address"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : editMode ? 'Update Supplier' : 'Add Supplier'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
