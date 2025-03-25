
import { useState, useEffect } from 'react';
import { Bell, Moon, Sun, Search, HelpCircle, Gift, Shield, User, Command, Zap } from 'lucide-react';
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
    <header className="h-16 border-b border-border/30 backdrop-blur-lg px-4 flex items-center justify-between bg-background/40 z-10 animate-fade-in">
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="flex items-center gap-2 text-gradient-cyan font-futuristic">
          <Zap className="h-5 w-5 text-neon-cyan animate-pulse" />
          <span className="text-lg font-medium hidden md:inline-block">TrafficManager</span>
        </div>
        <div className="relative w-full">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
            <Command className="h-3.5 w-3.5" />
            <span className="text-xs hidden sm:inline-block">K</span>
          </div>
          <Input 
            placeholder="Search across platforms, RDPs, campaigns..." 
            className="pl-10 h-9 w-full bg-background/30 border-border/30 focus-visible:ring-neon-cyan/30 focus-visible:border-neon-cyan/50 transition-all duration-200" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1 bg-neon-cyan/10 text-neon-cyan px-3.5 py-1.5 rounded-md border border-neon-cyan/20 shadow-neon-cyan animate-float">
          <span className="text-sm font-medium">{earningsToday}</span>
          <span className="text-xs text-neon-cyan/80">today</span>
        </div>

        <div className="flex items-center gap-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-neon-cyan transition-colors duration-200 relative hover:bg-neon-cyan/10"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-neon-magenta text-white">3</Badge>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 glass-card border-neon-cyan/20">
              <div className="space-y-3">
                <h4 className="text-sm font-futuristic text-gradient-cyan">Recent Notifications</h4>
                <div className="space-y-2">
                  <div className="p-2 rounded-md bg-warning/10 border border-warning/20 text-sm backdrop-blur-sm">
                    <div className="font-medium">Warning: Low Acceptance Rate</div>
                    <div className="text-xs text-muted-foreground">Hit Leap platform showing 28% acceptance</div>
                  </div>
                  <div className="p-2 rounded-md bg-neon-cyan/10 border border-neon-cyan/20 text-sm backdrop-blur-sm">
                    <div className="font-medium text-neon-cyan">Budget Target Reached</div>
                    <div className="text-xs text-muted-foreground">Daily goal of $5 achieved</div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10" onClick={showNotifications}>
                  View All
                </Button>
              </div>
            </HoverCardContent>
          </HoverCard>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleDarkMode}
                className="text-muted-foreground hover:text-neon-cyan transition-colors duration-200 hover:bg-neon-cyan/10"
              >
                {isDarkMode ? 
                  <Sun className="h-5 w-5 transition-transform duration-300 hover:rotate-12" /> : 
                  <Moon className="h-5 w-5 transition-transform duration-300 hover:-rotate-12" />
                }
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 glass-card border-neon-cyan/20">
              <div className="space-y-2">
                <h4 className="text-sm font-futuristic text-gradient-cyan">Theme Preference</h4>
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
                className="text-muted-foreground hover:text-neon-cyan transition-colors duration-200 hover:bg-neon-cyan/10"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64 glass-card border-neon-cyan/20">
              <div className="space-y-2">
                <h4 className="text-sm font-futuristic text-gradient-cyan">Help & Support</h4>
                <p className="text-sm text-muted-foreground">
                  Get assistance with using Traffic Manager
                </p>
                <Button variant="outline" size="sm" className="w-full border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10">
                  View Documentation
                </Button>
              </div>
            </HoverCardContent>
          </HoverCard>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-sm font-normal ml-2 transition-all duration-200 hover:bg-neon-cyan/10"
              >
                <div className="h-8 w-8 rounded-full bg-neon-cyan/10 flex items-center justify-center text-neon-cyan font-medium transition-transform duration-200 hover:scale-105 border border-neon-cyan/30 shadow-neon-cyan">
                  <User className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 animate-fade-in glass-card border-neon-cyan/20">
              <DropdownMenuLabel className="text-gradient-cyan font-futuristic">My Account</DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer transition-colors duration-200 flex items-center gap-2 hover:bg-neon-cyan/10 hover:text-neon-cyan focus:bg-neon-cyan/10 focus:text-neon-cyan">
                <User className="h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer transition-colors duration-200 flex items-center gap-2 hover:bg-neon-cyan/10 hover:text-neon-cyan focus:bg-neon-cyan/10 focus:text-neon-cyan">
                <Shield className="h-4 w-4" /> Subscription
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer transition-colors duration-200 flex items-center gap-2 hover:bg-neon-cyan/10 hover:text-neon-cyan focus:bg-neon-cyan/10 focus:text-neon-cyan">
                <Gift className="h-4 w-4" /> Refer a Friend
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/30" />
              <DropdownMenuItem className="cursor-pointer transition-colors duration-200 hover:bg-neon-magenta/10 hover:text-neon-magenta focus:bg-neon-magenta/10 focus:text-neon-magenta">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
