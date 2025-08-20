import React, { useState } from 'react';
import { ChevronLeft, Bell, Lock, Map, HelpCircle, Shield, User, Phone, Mail, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useMapSettings } from '@/contexts/MapContext';
import { useToast } from '@/hooks/use-toast';

interface DriverAccountSettingsProps {
  onBack: () => void;
}

const DriverAccountSettings: React.FC<DriverAccountSettingsProps> = ({ onBack }) => {
  const { userProfile, currentUser, logout } = useAuth();
  const { useMapbox, setUseMapbox } = useMapSettings();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    tripRequests: true,
    earnings: true,
    promotions: false,
    safety: true
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your account settings have been updated",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold ml-4">Account Settings</h1>
        </div>

        {/* Profile Information */}
        <div className="bg-card rounded-xl p-6 border mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Profile Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                defaultValue={userProfile?.name || currentUser?.displayName || ''} 
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                defaultValue={currentUser?.email || ''} 
                disabled 
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone"
                defaultValue={userProfile?.phone || ''} 
                placeholder="Add phone number"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Driver Preferences */}
        <div className="bg-card rounded-xl p-6 border mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Driver Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Accept Pool Rides</p>
                <p className="text-sm text-muted-foreground">Allow multiple passengers</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Long Distance Trips</p>
                <p className="text-sm text-muted-foreground">Accept trips over 30 minutes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Airport Trips</p>
                <p className="text-sm text-muted-foreground">Accept airport pickup/dropoff</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card rounded-xl p-6 border mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Trip Requests</p>
                <p className="text-sm text-muted-foreground">New ride requests and updates</p>
              </div>
              <Switch 
                checked={notifications.tripRequests}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, tripRequests: checked})
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Earnings Updates</p>
                <p className="text-sm text-muted-foreground">Daily and weekly earnings summaries</p>
              </div>
              <Switch 
                checked={notifications.earnings}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, earnings: checked})
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Promotions</p>
                <p className="text-sm text-muted-foreground">Special offers and bonuses</p>
              </div>
              <Switch 
                checked={notifications.promotions}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, promotions: checked})
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Safety Alerts</p>
                <p className="text-sm text-muted-foreground">Important safety notifications</p>
              </div>
              <Switch 
                checked={notifications.safety}
                onCheckedChange={(checked) => 
                  setNotifications({...notifications, safety: checked})
                }
              />
            </div>
          </div>
        </div>

        {/* Map Provider */}
        <div className="bg-card rounded-xl p-6 border mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <Map className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Map Settings</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Map Provider</p>
              <p className="text-sm text-muted-foreground">
                {useMapbox ? 'Using Mapbox' : 'Using Google Maps'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="mapbox-toggle" className="text-sm text-muted-foreground">
                Mapbox
              </Label>
              <Switch
                id="mapbox-toggle"
                checked={useMapbox}
                onCheckedChange={setUseMapbox}
              />
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="space-y-4">
          <div className="bg-card rounded-xl p-4 border">
            <div className="flex items-center space-x-4">
              <Lock className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">Privacy & Security</p>
                <p className="text-sm text-muted-foreground">Manage your data and privacy</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border">
            <div className="flex items-center space-x-4">
              <HelpCircle className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="font-medium">Help & Support</p>
                <p className="text-sm text-muted-foreground">Get help with your account</p>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} className="w-full mb-4">
            Save Changes
          </Button>

          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverAccountSettings;