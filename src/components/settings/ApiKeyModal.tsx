
import React, { useState } from 'react';
import { Check, X, Copy, Eye, EyeOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformName: string;
  platformId: string;
  isConnected: boolean;
  existingKey?: string;
}

export function ApiKeyModal({
  isOpen,
  onClose,
  platformName,
  platformId,
  isConnected,
  existingKey
}: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  // Mask API key for display
  const maskedKey = existingKey ? 
    `${existingKey.substring(0, 4)}${'*'.repeat(existingKey.length - 8)}${existingKey.substring(existingKey.length - 4)}` : 
    '';

  const handleSave = () => {
    if (!apiKey && !isConnected) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isConnected ? "API Key Updated" : "Platform Connected",
      description: `${platformName} API key has been ${isConnected ? 'updated' : 'saved'} successfully.`,
      duration: 3000,
    });
    
    onClose();
  };

  const handleDisconnect = () => {
    toast({
      title: "Platform Disconnected",
      description: `${platformName} has been disconnected successfully.`,
      duration: 3000,
    });
    
    onClose();
  };

  const copyToClipboard = () => {
    if (existingKey) {
      navigator.clipboard.writeText(existingKey);
      toast({
        title: "Copied to Clipboard",
        description: "API key has been copied to clipboard.",
        duration: 2000,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isConnected ? `Manage ${platformName} API Key` : `Connect to ${platformName}`}</DialogTitle>
          <DialogDescription>
            {isConnected 
              ? `Your ${platformName} account is currently connected. You can update or disconnect your API key.` 
              : `Enter your ${platformName} API key to connect your account.`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {isConnected ? (
            <div className="space-y-2">
              <Label htmlFor="current-key">Current API Key</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <Input 
                    id="current-key"
                    value={showKey ? existingKey : maskedKey}
                    readOnly
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showKey ? "Hide API key" : "Show API key"}</span>
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy API key</span>
                </Button>
              </div>
            </div>
          ) : null}
          
          <div className="space-y-2">
            <Label htmlFor="api-key">{isConnected ? "New API Key" : "API Key"}</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            {isConnected 
              ? "Leave this field empty if you don't want to update your API key." 
              : `You can find your ${platformName} API key in your account settings.`}
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          {isConnected ? (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDisconnect}
            >
              <X className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          ) : null}
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 sm:flex-initial">
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} className="flex-1 sm:flex-initial">
              <Check className="h-4 w-4 mr-2" />
              {isConnected ? (apiKey ? "Update" : "Done") : "Connect"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
