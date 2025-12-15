import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search, Mail, Lock, DollarSign } from 'lucide-react';

export const InputShowcase: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Text Inputs */}
      <div>
        <h4 className="mb-4">Text Inputs</h4>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled">Disabled Input</Label>
            <Input id="disabled" disabled placeholder="Disabled" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="readonly">Read Only</Label>
            <Input id="readonly" readOnly value="Read only value" />
          </div>
        </div>
      </div>

      {/* Inputs with Icons */}
      <div>
        <h4 className="mb-4">Inputs with Icons</h4>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="search" className="pl-10" placeholder="Search..." />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-icon">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email-icon" className="pl-10" type="email" placeholder="you@example.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" className="pl-10" type="password" placeholder="••••••••" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="price" className="pl-10" type="number" placeholder="0.00" />
            </div>
          </div>
        </div>
      </div>

      {/* Number Inputs */}
      <div>
        <h4 className="mb-4">Number Inputs</h4>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" min="0" defaultValue="1" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" step="0.01" placeholder="0.00" />
          </div>
        </div>
      </div>

      {/* Select Dropdowns */}
      <div>
        <h4 className="mb-4">Select Dropdowns</h4>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="food">Food & Beverage</SelectItem>
                <SelectItem value="books">Books</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue="active">
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Input Sizes */}
      <div>
        <h4 className="mb-4">Input Sizes</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Small</Label>
            <Input className="h-8 text-xs" placeholder="Small input" />
          </div>
          <div className="space-y-2">
            <Label>Default</Label>
            <Input placeholder="Default input" />
          </div>
          <div className="space-y-2">
            <Label>Large</Label>
            <Input className="h-12 text-base" placeholder="Large input" />
          </div>
        </div>
      </div>

      {/* Textarea */}
      <div>
        <h4 className="mb-4">Textarea</h4>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            className="flex min-h-[120px] w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm ring-offset-background placeholder:text-input-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter description..."
          />
        </div>
      </div>
    </div>
  );
};
