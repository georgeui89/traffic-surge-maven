import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbsProps {
  className?: string;
}

export const Breadcrumbs = ({ className }: BreadcrumbsProps) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Map of route paths to human-readable names
  const routeNames: Record<string, string> = {
    'platforms': 'Platforms',
    'rdp-management': 'RDP Management',
    'campaigns': 'Campaigns',
    'traffic-analytics': 'Traffic Analytics',
    'automation': 'Automation',
    'budget-optimizer': 'Budget Optimizer',
    'reporting': 'Reporting',
    'cpm-calculator': 'CPM Calculator',
    'rdp-scaler': 'RDP Scaler',
    'settings': 'Settings',
  };
  
  return (
    <nav className={cn("flex items-center text-sm text-muted-foreground", className)}>
      <ol className="flex items-center space-x-1">
        <li>
          <Link 
            to="/" 
            className="flex items-center hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = routeNames[name] || name;
          
          return (
            <li key={name} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" />
              {isLast ? (
                <span className="font-medium text-foreground">{displayName}</span>
              ) : (
                <Link 
                  to={routeTo}
                  className="hover:text-foreground transition-colors"
                >
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};