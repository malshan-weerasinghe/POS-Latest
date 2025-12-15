import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

interface CustomToasterProps extends ToasterProps {
  theme?: 'light' | 'dark';
}

const Toaster = ({ theme = 'light', ...props }: CustomToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
