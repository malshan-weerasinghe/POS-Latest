import React from 'react';

export const Typography: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Headlines */}
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
            Headline XL • 36px / 2.25rem • Semibold
          </p>
          <h1 style={{ fontSize: 'var(--text-headline-xl)', fontWeight: 'var(--font-weight-semibold)', lineHeight: 'var(--line-height-tight)' }}>
            The quick brown fox jumps over the lazy dog
          </h1>
        </div>
        <div>
          <p className="mb-2 text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
            Headline L • 30px / 1.875rem • Semibold
          </p>
          <h1 style={{ fontSize: 'var(--text-headline-l)', fontWeight: 'var(--font-weight-semibold)', lineHeight: 'var(--line-height-tight)' }}>
            The quick brown fox jumps over the lazy dog
          </h1>
        </div>
        <div>
          <p className="mb-2 text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
            Headline M • 24px / 1.5rem • Semibold
          </p>
          <h2 style={{ fontSize: 'var(--text-headline-m)', fontWeight: 'var(--font-weight-semibold)', lineHeight: 'var(--line-height-tight)' }}>
            The quick brown fox jumps over the lazy dog
          </h2>
        </div>
      </div>

      {/* Subtitles */}
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
            Subtitle M • 18px / 1.125rem • Medium
          </p>
          <p style={{ fontSize: 'var(--text-subtitle-m)', fontWeight: 'var(--font-weight-medium)', lineHeight: 'var(--line-height-normal)' }}>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
        <div>
          <p className="mb-2 text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
            Subtitle S • 16px / 1rem • Medium
          </p>
          <p style={{ fontSize: 'var(--text-subtitle-s)', fontWeight: 'var(--font-weight-medium)', lineHeight: 'var(--line-height-normal)' }}>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      </div>

      {/* Body Text */}
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
            Body L • 16px / 1rem • Regular
          </p>
          <p style={{ fontSize: 'var(--text-body-l)', fontWeight: 'var(--font-weight-regular)', lineHeight: 'var(--line-height-normal)' }}>
            The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div>
          <p className="mb-2 text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
            Body M • 14px / 0.875rem • Regular
          </p>
          <p style={{ fontSize: 'var(--text-body-m)', fontWeight: 'var(--font-weight-regular)', lineHeight: 'var(--line-height-normal)' }}>
            The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div>
          <p className="mb-2 text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
            Body S • 13px / 0.8125rem • Regular
          </p>
          <p style={{ fontSize: 'var(--text-body-s)', fontWeight: 'var(--font-weight-regular)', lineHeight: 'var(--line-height-normal)' }}>
            The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>

      {/* Caption & Overline */}
      <div className="space-y-6">
        <div>
          <p className="mb-2 text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
            Caption • 12px / 0.75rem • Regular
          </p>
          <p style={{ fontSize: 'var(--text-caption)', fontWeight: 'var(--font-weight-regular)', lineHeight: 'var(--line-height-normal)' }}>
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
        <div>
          <p className="mb-2 text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
            Overline • 11px / 0.6875rem • Medium • Uppercase • Letter Spacing
          </p>
          <p style={{ 
            fontSize: 'var(--text-overline)', 
            fontWeight: 'var(--font-weight-medium)', 
            lineHeight: 'var(--line-height-normal)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            The quick brown fox
          </p>
        </div>
      </div>

      {/* Font Weights */}
      <div className="space-y-4">
        <p className="mb-4 text-muted-foreground" style={{ fontSize: 'var(--text-caption)' }}>
          Font Weight Variants • 16px
        </p>
        <p style={{ fontSize: 'var(--text-body-l)', fontWeight: 'var(--font-weight-regular)' }}>
          Regular (400) - The quick brown fox jumps over the lazy dog
        </p>
        <p style={{ fontSize: 'var(--text-body-l)', fontWeight: 'var(--font-weight-medium)' }}>
          Medium (500) - The quick brown fox jumps over the lazy dog
        </p>
        <p style={{ fontSize: 'var(--text-body-l)', fontWeight: 'var(--font-weight-semibold)' }}>
          Semibold (600) - The quick brown fox jumps over the lazy dog
        </p>
        <p style={{ fontSize: 'var(--text-body-l)', fontWeight: 'var(--font-weight-bold)' }}>
          Bold (700) - The quick brown fox jumps over the lazy dog
        </p>
      </div>
    </div>
  );
};
