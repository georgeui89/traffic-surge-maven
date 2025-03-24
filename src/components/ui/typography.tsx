import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

const fadeInVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export function TypographyH1({ children, className, animate = false }: TypographyProps) {
  const Component = animate ? motion.h1 : "h1";
  const animationProps = animate ? {
    variants: fadeInVariants,
    initial: "hidden",
    animate: "visible",
    transition: { duration: 0.3 }
  } : {};
  
  return (
    <Component 
      className={cn(
        "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl",
        className
      )}
      {...animationProps}
    >
      {children}
    </Component>
  );
}

export function TypographyH2({ children, className, animate = false }: TypographyProps) {
  const Component = animate ? motion.h2 : "h2";
  const animationProps = animate ? {
    variants: fadeInVariants,
    initial: "hidden",
    animate: "visible",
    transition: { duration: 0.3, delay: 0.1 }
  } : {};
  
  return (
    <Component 
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...animationProps}
    >
      {children}
    </Component>
  );
}

export function TypographyH3({ children, className, animate = false }: TypographyProps) {
  const Component = animate ? motion.h3 : "h3";
  const animationProps = animate ? {
    variants: fadeInVariants,
    initial: "hidden",
    animate: "visible",
    transition: { duration: 0.3, delay: 0.2 }
  } : {};
  
  return (
    <Component 
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...animationProps}
    >
      {children}
    </Component>
  );
}

export function TypographyH4({ children, className, animate = false }: TypographyProps) {
  const Component = animate ? motion.h4 : "h4";
  const animationProps = animate ? {
    variants: fadeInVariants,
    initial: "hidden",
    animate: "visible",
    transition: { duration: 0.3, delay: 0.2 }
  } : {};
  
  return (
    <Component 
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...animationProps}
    >
      {children}
    </Component>
  );
}

export function TypographyP({ children, className, animate = false }: TypographyProps) {
  const Component = animate ? motion.p : "p";
  const animationProps = animate ? {
    variants: fadeInVariants,
    initial: "hidden",
    animate: "visible",
    transition: { duration: 0.3, delay: 0.3 }
  } : {};
  
  return (
    <Component 
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...animationProps}
    >
      {children}
    </Component>
  );
}

export function TypographyLead({ children, className, animate = false }: TypographyProps) {
  const Component = animate ? motion.p : "p";
  const animationProps = animate ? {
    variants: fadeInVariants,
    initial: "hidden",
    animate: "visible",
    transition: { duration: 0.3, delay: 0.2 }
  } : {};
  
  return (
    <Component 
      className={cn("text-xl text-muted-foreground", className)}
      {...animationProps}
    >
      {children}
    </Component>
  );
}

export function TypographyLarge({ children, className, animate = false }: TypographyProps) {
  const Component = animate ? motion.div : "div";
  const animationProps = animate ? {
    variants: fadeInVariants,
    initial: "hidden",
    animate: "visible",
    transition: { duration: 0.3 }
  } : {};
  
  return (
    <Component 
      className={cn("text-lg font-semibold", className)}
      {...animationProps}
    >
      {children}
    </Component>
  );
}

export function TypographySmall({ children, className, animate = false }: TypographyProps) {
  const Component = animate ? motion.small : "small";
  const animationProps = animate ? {
    variants: fadeInVariants,
    initial: "hidden",
    animate: "visible",
    transition: { duration: 0.3 }
  } : {};
  
  return (
    <Component 
      className={cn("text-sm font-medium leading-none", className)}
      {...animationProps}
    >
      {children}
    </Component>
  );
}

export function TypographyMuted({ children, className, animate = false }: TypographyProps) {
  const Component = animate ? motion.p : "p";
  const animationProps = animate ? {
    variants: fadeInVariants,
    initial: "hidden",
    animate: "visible",
    transition: { duration: 0.3 }
  } : {};
  
  return (
    <Component 
      className={cn("text-sm text-muted-foreground", className)}
      {...animationProps}
    >
      {children}
    </Component>
  );
}

export function TypographyGradient({ children, className, animate = false }: TypographyProps) {
  const Component = animate ? motion.span : "span";
  const animationProps = animate ? {
    variants: fadeInVariants,
    initial: "hidden",
    animate: "visible",
    transition: { duration: 0.3 }
  } : {};
  
  return (
    <Component 
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent",
        className
      )}
      {...animationProps}
    >
      {children}
    </Component>
  );
}