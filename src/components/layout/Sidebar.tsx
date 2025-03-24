
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
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  highlight?: boolean;
  isNew?: boolean;
};

const NavItem = ({ to, icon: Icon, label, collapsed, highlight, isNew }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={to} className="block">
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
              {!collapsed && <span>{label}</span>}
              {!collapsed && isNew && (
                <Badge className="ml-2 bg-primary text-xs py-0 px-1.5">NEW</Badge>
              )}
            </Button>
          </Link>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right" className="flex items-center gap-2">
            {label}
            {isNew && <Badge className="bg-primary text-xs py-0 px-1.5">NEW</Badge>}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
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
    <div
      className={cn(
        'h-screen flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out relative z-10',
        collapsed ? 'w-16' : 'w-64'
      )}
      style={{
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(15, 15, 20, 0.85)'
      }}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div 
            id="app-logo"
            className="font-semibold text-lg tracking-tight text-primary/90 flex items-center gap-2"
          >
            <Zap className="h-5 w-5 text-primary" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              TrafficManager
            </span>
          </div>
        )}
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
        <div className="mb-2">
          {!collapsed && <div className="text-xs font-medium text-sidebar-foreground/50 mb-2 ml-3">OVERVIEW</div>}
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
        </div>
        
        {!collapsed && <Separator className="my-3 bg-sidebar-border/70" />}
        
        <div className="mb-2">
          {!collapsed && <div className="text-xs font-medium text-sidebar-foreground/50 mb-2 ml-3">TRAFFIC MANAGEMENT</div>}
          <NavItem to="/platforms" icon={Globe} label="Platforms" collapsed={collapsed} />
          <NavItem to="/rdp-management" icon={Server} label="RDP Management" collapsed={collapsed} />
          <NavItem to="/campaigns" icon={MonitorPlay} label="Campaigns" collapsed={collapsed} />
          <NavItem to="/traffic-analytics" icon={TrendingUp} label="Traffic Analytics" collapsed={collapsed} />
        </div>
        
        {!collapsed && <Separator className="my-3 bg-sidebar-border/70" />}
        
        <div className="mb-2">
          {!collapsed && <div className="text-xs font-medium text-sidebar-foreground/50 mb-2 ml-3">INTELLIGENCE</div>}
          <NavItem to="/automation" icon={Bot} label="Automation" collapsed={collapsed} />
          <NavItem to="/budget-optimizer" icon={DollarSign} label="Budget Optimizer" collapsed={collapsed} />
          <NavItem to="/reporting" icon={FileText} label="Reporting" collapsed={collapsed} />
        </div>

        {!collapsed && <Separator className="my-3 bg-sidebar-border/70" />}
        
        <div className="mb-2">
          {!collapsed && <div className="text-xs font-medium text-sidebar-foreground/50 mb-2 ml-3">TOOLS</div>}
          <NavItem to="/cpm-calculator" icon={Calculator} label="CPM Calculator" collapsed={collapsed} isNew={true} />
          <NavItem to="/rdp-scaler" icon={Activity} label="RDP Scaler" collapsed={collapsed} isNew={true} />
        </div>
      </nav>

      <div className="border-t border-sidebar-border py-4 px-3">
        <NavItem to="/settings" icon={Settings} label="Settings" collapsed={collapsed} />
      </div>

      {!collapsed && (
        <div className="p-3 mx-3 mb-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="text-xs font-medium text-primary/90 mb-2">Pro Features Available</div>
          <div className="text-xs text-sidebar-foreground/70">Upgrade to access AI Autopilot and advanced analytics</div>
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-2 w-full bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary"
          >
            Upgrade Now
          </Button>
        </div>
      )}
    </div>
  );
};
