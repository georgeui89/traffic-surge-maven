import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface BreadcrumbsProps {
  className?: string;
  showShareButton?: boolean;
}

export const Breadcrumbs = ({ className, showShareButton = false }: BreadcrumbsProps) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  const { toast } = useToast();
  
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
  
  const handleCopyPath = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "The URL has been copied to your clipboard.",
      type: "success",
      duration: 3000,
    });
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <motion.nav 
        className="flex items-center text-sm text-muted-foreground"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.ol className="flex items-center space-x-1" variants={container}>
          <motion.li variants={item}>
            <Link 
              to="/" 
              className="flex items-center hover:text-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </motion.li>
          
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = routeNames[name] || name;
            
            return (
              <motion.li key={name} className="flex items-center" variants={item}>
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
              </motion.li>
            );
          })}
        </motion.ol>
      </motion.nav>
      
      {showShareButton && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCopyPath}>
              Copy Link
            </DropdownMenuItem>
            <DropdownMenuItem>
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              Email Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};