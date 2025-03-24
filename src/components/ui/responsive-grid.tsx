import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
}

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = "gap-6",
}: ResponsiveGridProps) {
  // Generate grid columns classes based on the cols prop
  const gridColsClasses = [
    `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(" ");

  return (
    <div className={cn(
      "grid",
      gridColsClasses,
      gap,
      className
    )}>
      {children}
    </div>
  );
}