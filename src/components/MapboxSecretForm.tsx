import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink } from 'lucide-react';

interface MapboxSecretFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (token: string) => void;
}

const MapboxSecretForm: React.FC<MapboxSecretFormProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const [mapboxToken, setMapboxToken] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    if (!mapboxToken.trim()) {
      toast({
        title: 'Token required',
        description: 'Please enter your Mapbox public token',
        variant: 'destructive'
      });
      return;
    }

    if (!mapboxToken.startsWith('pk.')) {
      toast({
        title: 'Invalid token format',
        description: 'Mapbox public tokens should start with "pk."',
        variant: 'destructive'
      });
      return;
    }

    onSave(mapboxToken.trim());
    setMapboxToken('');
    onOpenChange(false);
    
    toast({
      title: 'Mapbox token saved',
      description: 'You can now use Mapbox for map services'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Mapbox</DialogTitle>
          <DialogDescription>
            Enter your Mapbox public token to enable Mapbox map services.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-2">
            <p className="font-medium">How to get your Mapbox token:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Go to <a 
                href="https://mapbox.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                mapbox.com <ExternalLink className="w-3 h-3" />
              </a></li>
              <li>Create an account or sign in</li>
              <li>Navigate to the Tokens section in your dashboard</li>
              <li>Copy your default public token (starts with "pk.")</li>
            </ol>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!mapboxToken.trim()}>
            Save Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MapboxSecretForm;