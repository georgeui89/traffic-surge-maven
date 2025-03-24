
import React, { useState } from 'react';
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
  Cpu,
  PanelTop
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  highlight?: boolean;
};

const NavItem = ({ to, icon: Icon, label, collapsed, highlight }: NavItemProps) => {
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
                'w-full justify-start mb-1 transition-all duration-200 ease-in-out',
                isActive 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                highlight ? 'border-l-2 border-primary' : '',
                collapsed ? 'px-3' : 'px-4'
              )}
            >
              <Icon className={cn('h-5 w-5', collapsed ? 'mr-0' : 'mr-3')} />
              {!collapsed && <span>{label}</span>}
            </Button>
          </Link>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'h-screen flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="font-semibold text-lg tracking-tight">
            TrafficManager
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground',
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
          <NavItem to="/traffic-analytics" icon={TrendingUp} label="Traffic Analytics" collapsed={collapsed} highlight={true} />
        </div>
        
        {!collapsed && <Separator className="my-3 bg-sidebar-border/70" />}
        
        <div className="mb-2">
          {!collapsed && <div className="text-xs font-medium text-sidebar-foreground/50 mb-2 ml-3">INTELLIGENCE</div>}
          <NavItem to="/automation" icon={Bot} label="Automation" collapsed={collapsed} />
          <NavItem to="/budget-optimizer" icon={DollarSign} label="Budget Optimizer" collapsed={collapsed} />
          <NavItem to="/reporting" icon={FileText} label="Reporting" collapsed={collapsed} />
        </div>
      </nav>

      <div className="border-t border-sidebar-border py-4 px-3">
        <NavItem to="/settings" icon={Settings} label="Settings" collapsed={collapsed} />
      </div>
    </div>
  );
};
