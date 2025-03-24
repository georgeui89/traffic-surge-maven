import * as React from "react";
import { cn } from "@/lib/utils";

interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function FormSection({
  title,
  description,
  children,
  className,
  ...props
}: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}