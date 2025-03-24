import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
}

export const ResponsiveContainer = ({
  children,
  className,
  maxWidth = 'xl',
  padding = true,
}: ResponsiveContainerProps) => {
  return (
    <div
      className={cn(
        'w-full mx-auto',
        maxWidth === 'sm' && 'max-w-screen-sm',
        maxWidth === 'md' && 'max-w-screen-md',
        maxWidth === 'lg' && 'max-w-screen-lg',
        maxWidth === 'xl' && 'max-w-screen-xl',
        maxWidth === '2xl' && 'max-w-screen-2xl',
        maxWidth === 'full' && 'max-w-full',
        padding && 'px-4 sm:px-6 md:px-8',
        className
      )}
    >
      {children}
    </div>
  );
};