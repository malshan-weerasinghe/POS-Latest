import React from 'react';
import { Button } from '../ui/button';
import { Download, Plus, Trash2, Settings } from 'lucide-react';

export const ButtonShowcase: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Primary Buttons */}
      <div>
        <h4 className="mb-4">Primary Buttons</h4>
        <div className="flex flex-wrap items-center gap-4">
          <Button>Default</Button>
          <Button><Plus className="mr-2 h-4 w-4" />With Icon</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>

      {/* Secondary Buttons */}
      <div>
        <h4 className="mb-4">Secondary Buttons</h4>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="secondary">Default</Button>
          <Button variant="secondary"><Download className="mr-2 h-4 w-4" />With Icon</Button>
          <Button variant="secondary" size="sm">Small</Button>
          <Button variant="secondary" size="lg">Large</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </div>
      </div>

      {/* Outline Buttons */}
      <div>
        <h4 className="mb-4">Outline Buttons</h4>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline">Default</Button>
          <Button variant="outline"><Settings className="mr-2 h-4 w-4" />With Icon</Button>
          <Button variant="outline" size="sm">Small</Button>
          <Button variant="outline" size="lg">Large</Button>
          <Button variant="outline" disabled>Disabled</Button>
        </div>
      </div>

      {/* Ghost Buttons */}
      <div>
        <h4 className="mb-4">Ghost Buttons</h4>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="ghost">Default</Button>
          <Button variant="ghost"><Settings className="mr-2 h-4 w-4" />With Icon</Button>
          <Button variant="ghost" size="sm">Small</Button>
          <Button variant="ghost" size="lg">Large</Button>
          <Button variant="ghost" disabled>Disabled</Button>
        </div>
      </div>

      {/* Destructive Buttons */}
      <div>
        <h4 className="mb-4">Destructive Buttons</h4>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="destructive">Delete</Button>
          <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />Remove</Button>
          <Button variant="destructive" size="sm">Small</Button>
          <Button variant="destructive" size="lg">Large</Button>
          <Button variant="destructive" disabled>Disabled</Button>
        </div>
      </div>

      {/* Link Buttons */}
      <div>
        <h4 className="mb-4">Link Buttons</h4>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="link">Default</Button>
          <Button variant="link" size="sm">Small</Button>
          <Button variant="link" size="lg">Large</Button>
          <Button variant="link" disabled>Disabled</Button>
        </div>
      </div>

      {/* Icon Only Buttons */}
      <div>
        <h4 className="mb-4">Icon Only Buttons</h4>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="icon"><Plus className="h-4 w-4" /></Button>
          <Button size="icon" variant="secondary"><Settings className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline"><Download className="h-4 w-4" /></Button>
          <Button size="icon" variant="ghost"><Settings className="h-4 w-4" /></Button>
          <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Button States */}
      <div>
        <h4 className="mb-4">Button States</h4>
        <div className="space-y-3">
          <div className="flex gap-4 items-center">
            <div className="w-24 text-sm text-muted-foreground">Default</div>
            <Button>Hover me</Button>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-24 text-sm text-muted-foreground">Disabled</div>
            <Button disabled>Can't click</Button>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-24 text-sm text-muted-foreground">Loading</div>
            <Button disabled>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Loading...
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
