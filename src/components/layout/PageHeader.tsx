import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
}

/**
 * Standardized Page Header Component
 * 
 * Spacing: 8pt grid aligned
 * - Title: Display-S (24px)
 * - Description: Body-M (14px)
 * - Gap: 4px between title and description
 * - Bottom margin: 24px (3 units)
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  breadcrumb,
}) => {
  return (
    <div className="space-y-6">
      {breadcrumb && <div>{breadcrumb}</div>}
      
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h1 
            className="text-foreground"
            style={{
              fontSize: 'var(--text-display-s)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 'var(--line-height-tight)',
            }}
          >
            {title}
          </h1>
          {description && (
            <p 
              className="text-muted-foreground"
              style={{
                fontSize: 'var(--text-body-m)',
                lineHeight: 'var(--line-height-normal)',
              }}
            >
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
