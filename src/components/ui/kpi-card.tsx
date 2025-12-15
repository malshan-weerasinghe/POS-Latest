import React from 'react';
import { Card, CardContent } from './card';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: string;
    direction?: 'up' | 'down' | 'neutral';
    color?: string;
  };
}

/**
 * Standardized KPI Card Component
 * 
 * Spacing: 8pt grid aligned
 * - Padding: 24px (card-padding)
 * - Icon size: 24px (icon-lg)
 * - Icon container: 48px (6 units)
 * - Gap between elements: 8px (spacing-2)
 */
export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'var(--color-primary)',
  iconBgColor = 'var(--color-primary)',
  trend,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p 
              className="text-muted-foreground"
              style={{ fontSize: 'var(--text-body-m)' }}
            >
              {label}
            </p>
            <p 
              className="text-foreground"
              style={{ 
                fontSize: 'var(--text-headline-l)',
                fontWeight: 'var(--font-weight-bold)',
                lineHeight: 'var(--line-height-tight)',
              }}
            >
              {value}
            </p>
            {(trend || subtitle) && (
              <div 
                className="flex items-center gap-1"
                style={{ 
                  color: trend?.color || 'var(--color-muted-foreground)',
                }}
              >
                {trend?.direction === 'up' && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 3L9 6H7.5V9H4.5V6H3L6 3Z" fill="currentColor" />
                  </svg>
                )}
                {trend?.direction === 'down' && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 9L3 6H4.5V3H7.5V6H9L6 9Z" fill="currentColor" />
                  </svg>
                )}
                <span style={{ fontSize: 'var(--text-body-s)' }}>
                  {trend?.value || subtitle}
                </span>
              </div>
            )}
          </div>
          
          {Icon && (
            <div 
              className="flex items-center justify-center rounded-lg"
              style={{
                width: 'var(--spacing-12)',
                height: 'var(--spacing-12)',
                backgroundColor: `${iconBgColor}10`,
              }}
            >
              <Icon 
                style={{
                  width: 'var(--icon-lg)',
                  height: 'var(--icon-lg)',
                  color: iconColor,
                }}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
