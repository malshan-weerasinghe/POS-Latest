import React from 'react';
import { Card, CardContent } from './card';

interface PageFiltersProps {
  children: React.ReactNode;
}

/**
 * Standardized Page Filters Component
 * 
 * Spacing: 8pt grid aligned
 * - Padding: 24px (card-padding)
 * - Grid gap: 16px (spacing-4)
 * - Consistent with 4-column layout
 */
export const PageFilters: React.FC<PageFiltersProps> = ({ children }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-4 gap-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

interface FilterFieldProps {
  children: React.ReactNode;
  span?: 1 | 2 | 3 | 4;
}

export const FilterField: React.FC<FilterFieldProps> = ({ children, span = 1 }) => {
  const colSpanClass = span === 1 ? '' : 
                       span === 2 ? 'col-span-2' :
                       span === 3 ? 'col-span-3' : 'col-span-4';
  
  return (
    <div className={`space-y-2 ${colSpanClass}`}>
      {children}
    </div>
  );
};
