import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
  animate?: boolean;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = "gap-6",
  animate = false,
  staggerChildren = false,
  staggerDelay = 0.1,
}: ResponsiveGridProps) {
  // Generate grid columns classes based on the cols prop
  const gridColsClasses = [
    `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(" ");

  // If animation is disabled, render a regular grid
  if (!animate) {
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

  // Animation variants
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerChildren ? staggerDelay : 0,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  // If we're animating, wrap each child in a motion.div
  const animatedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    
    return (
      <motion.div variants={itemVariants}>
        {child}
      </motion.div>
    );
  });

  return (
    <motion.div
      className={cn(
        "grid",
        gridColsClasses,
        gap,
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {animatedChildren}
    </motion.div>
  );
}