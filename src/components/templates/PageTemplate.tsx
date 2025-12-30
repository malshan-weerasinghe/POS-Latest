import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { Button } from '../ui/button';
import { ChevronRight } from 'lucide-react';

interface PageTemplateProps {
  breadcrumbs?: { label: string; href?: string }[];
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  hideHeader?: boolean;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({
  breadcrumbs,
  title,
  subtitle,
  actions,
  children,
  hideHeader = false,
}) => {
  return (
    <div className="p-8 space-y-6">
      {/* Breadcrumb */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href || '#'}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Page Header */}
      {!hideHeader && (
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-foreground" style={{ 
              fontSize: 'var(--text-headline-l)',
              fontWeight: 'var(--font-weight-semibold)',
              lineHeight: 'var(--line-height-tight)'
            }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-muted-foreground" style={{ 
                fontSize: 'var(--text-body-l)',
                lineHeight: 'var(--line-height-normal)'
              }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
};
