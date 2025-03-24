import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Settings, 
  Globe, 
  Server, 
  Bot, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  MonitorPlay,
  TrendingUp,
  DollarSign,
  Calculator,
  Activity,
  Zap,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  LogOut,
  User,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  highlight?: boolean;
  isNew?: boolean;
  badge?: string | number;
  badgeColor?: string;
};

const NavItem = ({ 
  to, 
  icon: Icon, 
  label, 
  collapsed, 
  highlight, 
  isNew,
  badge,
  badgeColor = "bg-primary"
}: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={to} className="block">
            <motion.div whileHover={{ x: collapsed ? 0 : 4 }} transition={{ duration: 0.2 }}>
              <Button
                variant="ghost"
                size="lg"
                className={cn(
                  'w-full justify-start mb-1 transition-all duration-200 ease-in-out relative',
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                  highlight ? 'border-l-2 border-primary' : '',
                  collapsed ? 'px-3' : 'px-4'
                )}
              >
                <Icon className={cn('h-5 w-5', collapsed ? 'mr-0' : 'mr-3')} />
                {!collapsed && (
                  <span className="flex-1 text-left">{label}</span>
                )}
                {!collapsed && isNew && (
                  <Badge className="ml-2 bg-primary text-xs py-0 px-1.5">NEW</Badge>
                )}
                {!collapsed && badge && (
                  <Badge className={cn("ml-2 text-xs py-0 px-1.5", badgeColor)}>
                    {badge}
                  </Badge>
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute right-0 top-0 h-full w-1 bg-primary rounded-l"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Button>
            </motion.div>
          </Link>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right" className="flex items-center gap-2">
            {label}
            {isNew && <Badge className="bg-primary text-xs py-0 px-1.5">NEW</Badge>}
            {badge && (
              <Badge className={cn("text-xs py-0 px-1.5", badgeColor)}>
                {badge}
              </Badge>
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

type NavGroupProps = {
  title: string;
  collapsed: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

const NavGroup = ({ title, collapsed, defaultOpen = true, children }: NavGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="mb-2">
      {!collapsed && (
        <div 
          className="flex items-center justify-between px-3 py-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
            {title}
          </div>
          <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
            {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </Button>
        </div>
      )}
      
      <AnimatePresence initial={false}>
        {(isOpen || collapsed) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Add a subtle pulsing effect to the logo on initial load
  useEffect(() => {
    if (!prefersReducedMotion) {
      const logo = document.getElementById('app-logo');
      if (logo) {
        logo.classList.add('animate-pulse');
        setTimeout(() => {
          logo.classList.remove('animate-pulse');
        }, 2000);
      }
    }
  }, []);

  return (
    <motion.div
      className={cn(
        'h-screen flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out relative z-10',
      )}
      style={{
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(15, 15, 20, 0.85)',
        width: collapsed ? '4rem' : '16rem'
      }}
      animate={{ width: collapsed ? '4rem' : '16rem' }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div 
              id="app-logo"
              className="font-semibold text-lg tracking-tight text-primary/90 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Zap className="h-5 w-5 text-primary" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                TrafficManager
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors hover:bg-sidebar-accent/30',
            collapsed && 'ml-auto mr-auto'
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <NavGroup title="Overview" collapsed={collapsed}>
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
        </NavGroup>
        
        {!collapsed && <Separator className="my-3 bg-sidebar-border/70" />}
        
        <NavGroup title="Traffic Management" collapsed={collapsed}>
          <NavItem to="/platforms" icon={Globe} label="Platforms" collapsed={collapsed} badge="12" />
          <NavItem to="/rdp-management" icon={Server} label="RDP Management" collapsed={collapsed} badge="5" />
          <NavItem to="/campaigns" icon={MonitorPlay} label="Campaigns" collapsed={collapsed} />
          <NavItem to="/traffic-analytics" icon={TrendingUp} label="Traffic Analytics" collapsed={collapsed} />
        </NavGroup>
        
        {!collapsed && <Separator className="my-3 bg-sidebar-border/70" />}
        
        <NavGroup title="Intelligence" collapsed={collapsed}>
          <NavItem to="/automation" icon={Bot} label="Automation" collapsed={collapsed} />
          <NavItem to="/budget-optimizer" icon={DollarSign} label="Budget Optimizer" collapsed={collapsed} />
          <NavItem to="/reporting" icon={FileText} label="Reporting" collapsed={collapsed} />
        </NavGroup>

        {!collapsed && <Separator className="my-3 bg-sidebar-border/70" />}
        
        <NavGroup title="Tools" collapsed={collapsed}>
          <NavItem to="/cpm-calculator" icon={Calculator} label="CPM Calculator" collapsed={collapsed} isNew={true} />
          <NavItem to="/rdp-scaler" icon={Activity} label="RDP Scaler" collapsed={collapsed} isNew={true} />
        </NavGroup>
      </nav>

      <div className="border-t border-sidebar-border py-4 px-3">
        <NavItem to="/settings" icon={Settings} label="Settings" collapsed={collapsed} />
        
        {!collapsed && (
          <div className="flex items-center justify-between mt-4 px-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {!collapsed && (
        <motion.div 
          className="p-3 mx-3 mb-4 rounded-lg bg-primary/10 border border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <div className="text-xs font-medium text-primary/90 mb-2">Pro Features Available</div>
          <div className="text-xs text-sidebar-foreground/70">Upgrade to access AI Autopilot and advanced analytics</div>
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-2 w-full bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary"
          >
            Upgrade Now
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};