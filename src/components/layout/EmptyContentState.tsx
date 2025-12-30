import React from 'react';

interface EmptyContentStateProps {
  pageName?: string;
}

export const EmptyContentState: React.FC<EmptyContentStateProps> = ({ pageName }) => {
  return (
    <div className="h-full min-h-[calc(100vh-64px)] flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-muted">
          <svg
            className="w-12 h-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
            />
          </svg>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h3 className="text-foreground" style={{ 
            fontSize: 'var(--text-headline-m)',
            fontWeight: 'var(--font-weight-semibold)',
            lineHeight: 'var(--line-height-tight)'
          }}>
            {pageName ? `${pageName} Page` : 'Main Content Container'}
          </h3>
          <p className="text-muted-foreground mx-auto max-w-lg" style={{ 
            fontSize: 'var(--text-body-l)',
            lineHeight: 'var(--line-height-relaxed)'
          }}>
            {pageName 
              ? `The ${pageName.toLowerCase()} screen will be rendered here with all necessary components and functionality.`
              : 'This is the primary content area where all page screens will be rendered. The layout uses a fixed sidebar (240px) and topbar (64px) with a scrollable content region.'
            }
          </p>
        </div>

        {/* Specifications */}
        <div className="pt-6 border-t border-border max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="space-y-1">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
                Resolution
              </p>
              <p className="text-foreground" style={{ 
                fontSize: 'var(--text-body-m)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                1920 × 1080
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
                Sidebar Width
              </p>
              <p className="text-foreground" style={{ 
                fontSize: 'var(--text-body-m)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                240px
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
                Topbar Height
              </p>
              <p className="text-foreground" style={{ 
                fontSize: 'var(--text-body-m)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                64px
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
                Content Width
              </p>
              <p className="text-foreground" style={{ 
                fontSize: 'var(--text-body-m)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                1680px
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="pt-4 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <p className="text-muted-foreground" style={{ 
              fontSize: 'var(--text-caption)'
            }}>
              Layout Active
            </p>
          </div>
          <p className="text-muted-foreground" style={{ 
            fontSize: 'var(--text-caption)'
          }}>
            Built with Modern Minimalist Design System • Light & Dark Theme Support
          </p>
        </div>
      </div>
    </div>
  );
};
