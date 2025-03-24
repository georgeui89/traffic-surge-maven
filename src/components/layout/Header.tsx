
import { useState, useEffect } from 'react';
import { Bell, Moon, Sun, Search, HelpCircle, Gift, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { toast } = useToast();
  
  // Check system preference on initial load
  useEffect(() => {
    document.documentElement.classList.add('dark');
    setIsDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
    
    toast({
      title: `${isDarkMode ? 'Light' : 'Dark'} mode activated`,
      duration: 2000,
    });
  };

  const showNotifications = () => {
    toast({
      title: "Notifications",
      description: "You have 3 new platform alerts.",
      duration: 3000,
    });
  };

  const earningsToday = '$3.45';

  return (
    <header className="h-16 border-b border-border px-4 flex items-center justify-between bg-background/80 backdrop-blur-sm z-10 animate-fade-in">
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search across platforms, RDPs, campaigns..." 
            className="pl-9 h-9 w-full bg-muted/40 border-0 focus-visible:ring-1 transition-all duration-200" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1 bg-success/10 text-success px-3.5 py-1.5 rounded-md border border-success/20">
          <span className="text-sm font-medium">{earningsToday}</span>
          <span className="text-xs text-success/80">today</span>
        </div>

        <div className="flex items-center gap-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">3</Badge>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Recent Notifications</h4>
                <div className="space-y-2">
                  <div className="p-2 rounded-md bg-warning/10 border border-warning/20 text-sm">
                    <div className="font-medium">Warning: Low Acceptance Rate</div>
                    <div className="text-xs text-muted-foreground">Hit Leap platform showing 28% acceptance</div>
                  </div>
                  <div className="p-2 rounded-md bg-success/10 border border-success/20 text-sm">
                    <div className="font-medium">Budget Target Reached</div>
                    <div className="text-xs text-muted-foreground">Daily goal of $5 achieved</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={showNotifications}>View All</Button>
              </div>
            </HoverCardContent>
          </HoverCard>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleDarkMode}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {isDarkMode ? 
                  <Sun className="h-5 w-5 transition-transform duration-300 hover:rotate-12" /> : 
                  <Moon className="h-5 w-5 transition-transform duration-300 hover:-rotate-12" />
                }
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Theme Preference</h4>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark mode.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Help & Support</h4>
                <p className="text-sm text-muted-foreground">
                  Get assistance with using Traffic Manager
                </p>
                <Button variant="outline" size="sm" className="w-full">View Documentation</Button>
              </div>
            </HoverCardContent>
          </HoverCard>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-sm font-normal ml-2 transition-all duration-200 hover:bg-accent/50"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium transition-transform duration-200 hover:scale-105">
                  <User className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-fade-in">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer transition-colors duration-200 flex items-center gap-2">
                <User className="h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer transition-colors duration-200 flex items-center gap-2">
                <Shield className="h-4 w-4" /> Subscription
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer transition-colors duration-200 flex items-center gap-2">
                <Gift className="h-4 w-4" /> Refer a Friend
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer transition-colors duration-200">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
