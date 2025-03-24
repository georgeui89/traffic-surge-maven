import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-success text-success-foreground hover:bg-success/90 active:bg-success/80",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/80",
        traffic: "bg-traffic text-traffic-foreground hover:bg-traffic/90 active:bg-traffic/80",
        earnings: "bg-earnings text-earnings-foreground hover:bg-earnings/90 active:bg-earnings/80",
        platforms: "bg-platforms text-platforms-foreground hover:bg-platforms/90 active:bg-platforms/80",
        rdp: "bg-rdp text-rdp-foreground hover:bg-rdp/90 active:bg-rdp/80",
        // Gradient variants
        gradient: "bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 active:opacity-80",
        "gradient-success": "bg-gradient-to-r from-success to-secondary text-white hover:opacity-90 active:opacity-80",
        "gradient-warning": "bg-gradient-to-r from-warning to-destructive text-white hover:opacity-90 active:opacity-80",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-6 rounded-md px-2 text-xs",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7 rounded-md",
        "icon-lg": "h-11 w-11 rounded-md",
      },
      fullWidth: {
        true: "w-full",
      },
      withIcon: {
        true: "gap-2",
      },
      elevated: {
        true: "shadow-md hover:shadow-lg",
      },
      rounded: {
        true: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animate?: boolean;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    withIcon, 
    elevated,
    rounded,
    asChild = false, 
    isLoading = false, 
    loadingText, 
    leftIcon,
    rightIcon,
    animate = true,
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const content = (
      <Comp
        className={cn(buttonVariants({ 
          variant, 
          size, 
          fullWidth, 
          withIcon: Boolean(leftIcon || rightIcon || withIcon), 
          elevated,
          rounded,
          className 
        }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-1">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-1">{rightIcon}</span>}
          </>
        )}
      </Comp>
    );
    
    if (animate) {
      return (
        <motion.div
          whileTap={{ scale: 0.97 }}
          whileHover={{ translateY: -2 }}
          transition={{ duration: 0.1 }}
        >
          {content}
        </motion.div>
      );
    }
    
    return content;
  }
);
EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton, buttonVariants };