import React from 'react';

export const SpacingRadius: React.FC = () => {
  const spacingValues = [
    { name: '1', value: '4px', var: '--spacing-1' },
    { name: '2', value: '8px', var: '--spacing-2' },
    { name: '3', value: '12px', var: '--spacing-3' },
    { name: '4', value: '16px', var: '--spacing-4' },
    { name: '5', value: '20px', var: '--spacing-5' },
    { name: '6', value: '24px', var: '--spacing-6' },
    { name: '8', value: '32px', var: '--spacing-8' },
    { name: '10', value: '40px', var: '--spacing-10' },
    { name: '12', value: '48px', var: '--spacing-12' },
    { name: '16', value: '64px', var: '--spacing-16' },
  ];

  const radiusValues = [
    { name: 'sm', value: '6px', var: '--radius-sm' },
    { name: 'md', value: '8px', var: '--radius-md' },
    { name: 'lg', value: '12px', var: '--radius-lg' },
    { name: 'xl', value: '16px', var: '--radius-xl' },
    { name: '2xl', value: '24px', var: '--radius-2xl' },
  ];

  return (
    <div className="space-y-12">
      {/* Spacing Scale */}
      <div>
        <h3 className="mb-6">Spacing Scale</h3>
        <div className="space-y-4">
          {spacingValues.map((spacing) => (
            <div key={spacing.name} className="flex items-center gap-6">
              <div className="w-32 flex-shrink-0">
                <p className="text-sm">
                  <span className="font-medium">spacing-{spacing.name}</span>
                  <span className="text-muted-foreground ml-2">{spacing.value}</span>
                </p>
              </div>
              <div 
                className="h-8 bg-primary rounded"
                style={{ width: `var(${spacing.var})` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <h3 className="mb-6">Border Radius</h3>
        <div className="grid grid-cols-5 gap-6">
          {radiusValues.map((radius) => (
            <div key={radius.name} className="space-y-3">
              <div 
                className="h-24 bg-primary"
                style={{ borderRadius: `var(${radius.var})` }}
              />
              <div>
                <p className="text-sm font-medium">radius-{radius.name}</p>
                <p className="text-xs text-muted-foreground">{radius.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing Examples */}
      <div>
        <h3 className="mb-6">Spacing in Use</h3>
        <div className="space-y-6">
          <div className="p-6 border border-border rounded-lg bg-surface">
            <p className="text-sm text-muted-foreground mb-4">Gap spacing-4 (16px)</p>
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-primary rounded-lg" />
              <div className="w-20 h-20 bg-primary rounded-lg" />
              <div className="w-20 h-20 bg-primary rounded-lg" />
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg bg-surface">
            <p className="text-sm text-muted-foreground mb-4">Padding spacing-6 (24px)</p>
            <div className="p-6 bg-primary/10 border border-primary rounded-lg">
              <div className="h-12 bg-primary rounded" />
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg bg-surface">
            <p className="text-sm text-muted-foreground mb-4">Margin spacing-8 (32px)</p>
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="h-12 bg-primary rounded mb-8" />
              <div className="h-12 bg-primary rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
