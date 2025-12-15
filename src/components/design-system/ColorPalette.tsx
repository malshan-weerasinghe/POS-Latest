import React from 'react';

interface ColorSwatchProps {
  name: string;
  value: string;
  textClass?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, value, textClass = 'text-foreground' }) => (
  <div className="flex flex-col gap-2">
    <div 
      className="h-16 rounded-lg border border-border" 
      style={{ backgroundColor: value }}
    />
    <div className="space-y-0.5">
      <p className={`text-xs font-medium ${textClass}`}>{name}</p>
      <p className="text-xs text-muted-foreground">{value}</p>
    </div>
  </div>
);

export const ColorPalette: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Neutral Palette */}
      <div>
        <h3 className="mb-4">Neutral Palette</h3>
        <div className="grid grid-cols-11 gap-4">
          <ColorSwatch name="Gray 50" value="var(--gray-50)" />
          <ColorSwatch name="Gray 100" value="var(--gray-100)" />
          <ColorSwatch name="Gray 200" value="var(--gray-200)" />
          <ColorSwatch name="Gray 300" value="var(--gray-300)" />
          <ColorSwatch name="Gray 400" value="var(--gray-400)" />
          <ColorSwatch name="Gray 500" value="var(--gray-500)" textClass="text-white" />
          <ColorSwatch name="Gray 600" value="var(--gray-600)" textClass="text-white" />
          <ColorSwatch name="Gray 700" value="var(--gray-700)" textClass="text-white" />
          <ColorSwatch name="Gray 800" value="var(--gray-800)" textClass="text-white" />
          <ColorSwatch name="Gray 900" value="var(--gray-900)" textClass="text-white" />
          <ColorSwatch name="Gray 950" value="var(--gray-950)" textClass="text-white" />
        </div>
      </div>

      {/* Accent Colors */}
      <div>
        <h3 className="mb-4">Accent Colors (Teal)</h3>
        <div className="grid grid-cols-11 gap-4">
          <ColorSwatch name="Accent 50" value="var(--accent-50)" />
          <ColorSwatch name="Accent 100" value="var(--accent-100)" />
          <ColorSwatch name="Accent 200" value="var(--accent-200)" />
          <ColorSwatch name="Accent 300" value="var(--accent-300)" />
          <ColorSwatch name="Accent 400" value="var(--accent-400)" />
          <ColorSwatch name="Accent 500" value="var(--accent-500)" textClass="text-white" />
          <ColorSwatch name="Accent 600" value="var(--accent-600)" textClass="text-white" />
          <ColorSwatch name="Accent 700" value="var(--accent-700)" textClass="text-white" />
          <ColorSwatch name="Accent 800" value="var(--accent-800)" textClass="text-white" />
          <ColorSwatch name="Accent 900" value="var(--accent-900)" textClass="text-white" />
          <ColorSwatch name="Accent 950" value="var(--accent-950)" textClass="text-white" />
        </div>
      </div>

      {/* Semantic Colors */}
      <div>
        <h3 className="mb-4">Semantic Colors</h3>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="mb-3">Success</p>
            <div className="space-y-3">
              <ColorSwatch name="Main" value="var(--success-light)" textClass="text-white" />
              <ColorSwatch name="Background" value="var(--success-bg-light)" />
              <ColorSwatch name="Border" value="var(--success-border-light)" />
            </div>
          </div>
          <div>
            <p className="mb-3">Warning</p>
            <div className="space-y-3">
              <ColorSwatch name="Main" value="var(--warning-light)" textClass="text-white" />
              <ColorSwatch name="Background" value="var(--warning-bg-light)" />
              <ColorSwatch name="Border" value="var(--warning-border-light)" />
            </div>
          </div>
          <div>
            <p className="mb-3">Danger</p>
            <div className="space-y-3">
              <ColorSwatch name="Main" value="var(--danger-light)" textClass="text-white" />
              <ColorSwatch name="Background" value="var(--danger-bg-light)" />
              <ColorSwatch name="Border" value="var(--danger-border-light)" />
            </div>
          </div>
          <div>
            <p className="mb-3">Info</p>
            <div className="space-y-3">
              <ColorSwatch name="Main" value="var(--info-light)" textClass="text-white" />
              <ColorSwatch name="Background" value="var(--info-bg-light)" />
              <ColorSwatch name="Border" value="var(--info-border-light)" />
            </div>
          </div>
        </div>
      </div>

      {/* Surface & Background */}
      <div>
        <h3 className="mb-4">Surface & Background</h3>
        <div className="grid grid-cols-5 gap-4">
          <ColorSwatch name="Background" value="var(--background)" />
          <ColorSwatch name="Surface" value="var(--surface)" />
          <ColorSwatch name="Elevated" value="var(--surface-elevated)" />
          <ColorSwatch name="Hover" value="var(--surface-hover)" />
          <ColorSwatch name="Card" value="var(--card)" />
        </div>
      </div>

      {/* Borders & Dividers */}
      <div>
        <h3 className="mb-4">Borders & Dividers</h3>
        <div className="grid grid-cols-3 gap-4">
          <ColorSwatch name="Border" value="var(--border)" />
          <ColorSwatch name="Border Strong" value="var(--border-strong)" />
          <ColorSwatch name="Divider" value="var(--divider)" />
        </div>
      </div>
    </div>
  );
};
