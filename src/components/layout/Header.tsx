
import { useState, useEffect } from 'react';
import { Bell, Moon, Sun, Search } from 'lucide-react';
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

export const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();
  
  // Check system preference on initial load
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
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
      description: "You have no new notifications at this time.",
      duration: 3000,
    });
  };

  return (
    <header className="h-16 border-b border-border px-4 flex items-center justify-between bg-background z-10 animate-fade-in">
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-9 h-9 w-full bg-muted/40 border-0 focus-visible:ring-1 transition-all duration-200" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={showNotifications}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Notifications</h4>
              <p className="text-sm text-muted-foreground">
                View and manage your notifications here.
              </p>
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2 text-sm font-normal ml-2 transition-all duration-200 hover:bg-accent/50"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium transition-transform duration-200 hover:scale-105">
                TM
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 animate-fade-in">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer transition-colors duration-200">Profile</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer transition-colors duration-200">Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer transition-colors duration-200">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
