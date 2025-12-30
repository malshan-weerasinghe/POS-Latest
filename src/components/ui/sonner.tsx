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
      toastOptions={{
        classNames: {
          success: 'bg-green-50 border-green-200 text-green-900',
          error: 'bg-red-50 border-red-200 text-red-900',
          icon: 'success-icon',
        },
        style: {
          borderWidth: '1px',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
