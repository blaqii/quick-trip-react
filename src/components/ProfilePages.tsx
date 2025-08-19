import React, { useState } from 'react';
import { ChevronLeft, CreditCard, MapPin, Bell, Lock, HelpCircle, Star, Plus, X, Car, Calendar, User, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import AddPaymentMethodDialog from '@/components/ui/add-payment-method-dialog';

import { useToast } from '@/hooks/use-toast';

interface ProfilePagesProps {
  currentPage: string;
  onBack: () => void;
}

// Bottom Navigation Component
const BottomNavigation: React.FC<{
  currentView: string;
  onViewChange: (view: string) => void;
}> = ({ currentView, onViewChange }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t">
    <div className="flex justify-around py-4">
      <button 
        onClick={() => onViewChange('home')}
        className="flex flex-col items-center space-y-1"
      >
        <Car className={`w-6 h-6 ${currentView === 'home' ? 'text-primary' : 'text-muted-foreground'}`} />
        <span className={`text-xs ${currentView === 'home' ? 'text-primary' : 'text-muted-foreground'}`}>Rides</span>
      </button>
      <button 
        onClick={() => onViewChange('trips')}
        className="flex flex-col items-center space-y-1"
      >
        <Calendar className={`w-6 h-6 ${currentView === 'trips' ? 'text-primary' : 'text-muted-foreground'}`} />
        <span className={`text-xs ${currentView === 'trips' ? 'text-primary' : 'text-muted-foreground'}`}>Trips</span>
      </button>
      <button 
        onClick={() => onViewChange('profile')}
        className="flex flex-col items-center space-y-1"
      >
        <User className={`w-6 h-6 ${currentView === 'profile' ? 'text-primary' : 'text-muted-foreground'}`} />
        <span className={`text-xs ${currentView === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}>You</span>
      </button>
    </div>
  </div>
);

const ProfilePages: React.FC<ProfilePagesProps> = ({ currentPage, onBack }) => {
  const { userProfile, currentUser } = useAuth();
  const { toast } = useToast();
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [mapboxSecretOpen, setMapboxSecretOpen] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  const PaymentMethodsPage = () => {
    const [cards, setCards] = useState([
      { id: 1, last4: '4242', brand: 'Visa', isDefault: true },
      { id: 2, last4: '1234', brand: 'Mastercard', isDefault: false }
    ]);

    const handleAddPayment = (newCard: any) => {
      setCards([...cards, newCard]);
      setAddPaymentOpen(false);
    };

    const handleRemoveCard = (cardId: number) => {
      setCards(cards.filter(card => card.id !== cardId));
    };

    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold ml-4">Payment methods</h1>
          </div>

          {/* Add Payment Method */}
          <Button 
            className="w-full mb-6 flex items-center space-x-2"
            onClick={() => setAddPaymentOpen(true)}
          >
            <Plus className="w-5 h-5" />
            <span>Add payment method</span>
          </Button>

          {/* Payment Methods */}
          <div className="space-y-4">
            {cards.map((card) => (
              <div key={card.id} className="bg-card rounded-xl p-4 border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gradient-primary rounded flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{card.brand} •••• {card.last4}</p>
                      {card.isDefault && (
                        <p className="text-sm text-success">Default payment method</p>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveCard(card.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavigation currentView="profile" onViewChange={() => onBack()} />
        
        {/* Add Payment Method Dialog */}
        <AddPaymentMethodDialog
          open={addPaymentOpen}
          onOpenChange={setAddPaymentOpen}
          onSave={handleAddPayment}
        />
      </div>
    );
  };

  const SavedPlacesPage = () => {
    const [places] = useState([
      { id: 1, name: 'Home', address: '123 Main St, City', icon: '🏠' },
      { id: 2, name: 'Work', address: '456 Business Ave, Downtown', icon: '🏢' }
    ]);

    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold ml-4">Saved places</h1>
          </div>

          {/* Add Place */}
          <Button className="w-full mb-6 flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add a place</span>
          </Button>

          {/* Saved Places */}
          <div className="space-y-4">
            {places.map((place) => (
              <div key={place.id} className="bg-card rounded-xl p-4 border">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                    {place.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{place.name}</p>
                    <p className="text-sm text-muted-foreground">{place.address}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavigation currentView="profile" onViewChange={() => onBack()} />
      </div>
    );
  };

  const AccountSettingsPage = () => {
    const [useMapbox, setUseMapbox] = useState(false);
    
    const handleMapboxToggle = (checked: boolean) => {
      if (checked && !mapboxToken) {
        setMapboxSecretOpen(true);
        return;
      }
      setUseMapbox(checked);
      if (!checked) {
        setMapboxToken('');
      }
    };

    const handleMapboxTokenSave = (token: string) => {
      setMapboxToken(token);
      setUseMapbox(true);
    };
    
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold ml-4">Account settings</h1>
          </div>

          {/* Profile Information */}
          <div className="bg-card rounded-xl p-4 border mb-6">
            <h3 className="font-semibold mb-4">Profile information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <Input 
                  defaultValue={userProfile?.name || currentUser?.displayName || ''} 
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <Input 
                  defaultValue={currentUser?.email || ''} 
                  disabled 
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Phone</label>
                <Input 
                  defaultValue={userProfile?.phone || ''} 
                  placeholder="Add phone number"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Settings Options */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl p-4 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-muted-foreground">Push notifications and emails</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-4 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Lock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Privacy & Data</p>
                    <p className="text-sm text-muted-foreground">Manage your data and privacy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Provider Selection */}
            <div className="bg-card rounded-xl p-4 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Map className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Map Provider</p>
                    <p className="text-sm text-muted-foreground">
                      {useMapbox ? 'Using Mapbox' : 'Using Google Maps'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="mapbox-toggle" className="text-sm text-muted-foreground">
                    Mapbox
                  </Label>
                  <Switch
                    id="mapbox-toggle"
                    checked={useMapbox}
                    onCheckedChange={handleMapboxToggle}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full mt-6">Save changes</Button>
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavigation currentView="profile" onViewChange={() => onBack()} />
        
      </div>
    );
  };

  const HelpSupportPage = () => {
    const [helpTopics] = useState([
      { title: 'Trip issues', description: 'Problems with a recent trip' },
      { title: 'Account & payment', description: 'Login, payment, and billing issues' },
      { title: 'Using the app', description: 'How to use features and settings' },
      { title: 'Safety', description: 'Report safety concerns' },
      { title: 'Accessibility', description: 'Accessibility features and support' }
    ]);

    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-2xl font-bold ml-4">Help & support</h1>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Input 
              placeholder="Search for help..."
              className="pl-4"
            />
          </div>

          {/* Help Topics */}
          <div className="space-y-4">
            {helpTopics.map((topic, index) => (
              <div key={index} className="bg-card rounded-xl p-4 border">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{topic.title}</p>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Support */}
          <div className="mt-8 bg-card rounded-xl p-4 border">
            <h3 className="font-semibold mb-2">Still need help?</h3>
            <p className="text-sm text-muted-foreground mb-4">Get in touch with our support team</p>
            <Button className="w-full">Contact support</Button>
          </div>
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavigation currentView="profile" onViewChange={() => onBack()} />
      </div>
    );
  };

  switch (currentPage) {
    case 'payment':
      return <PaymentMethodsPage />;
    case 'places':
      return <SavedPlacesPage />;
    case 'account':
      return <AccountSettingsPage />;
    case 'help':
      return <HelpSupportPage />;
    default:
      return null;
  }
};

export default ProfilePages;