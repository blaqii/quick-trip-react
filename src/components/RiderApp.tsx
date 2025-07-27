import React, { useState, useCallback } from 'react';
import { 
  Search, 
  Calendar, 
  User, 
  Car, 
  Clock, 
  CreditCard, 
  MapPin, 
  Navigation, 
  Wifi, 
  WifiOff, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useRideRequests, useUserTrips } from '@/hooks/useFirestore';
import { useToast } from '@/hooks/use-toast';
import GoogleMap from '@/components/GoogleMap';
import LocationSearch from '@/components/LocationSearch';
import ProfilePages from '@/components/ProfilePages';

const RiderApp = ({ onModeSwitch }: { onModeSwitch: (mode: 'driver' | 'rider') => void }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const { createRideRequest } = useRideRequests();
  const { trips, loading: tripsLoading } = useUserTrips(currentUser?.uid || '', 'rider');
  const { toast } = useToast();
  
  const [currentView, setCurrentView] = useState('home');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedStartLocation, setSelectedStartLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [startLocation, setStartLocation] = useState<any>(null);

  // Memoized handlers to prevent re-renders
  const handleStartLocationChange = useCallback((value: string) => {
    setSelectedStartLocation(value);
  }, []);

  const handleStartLocationSelect = useCallback((location: any) => {
    setStartLocation(location);
  }, []);

  const handleDestinationChange = useCallback((value: string) => {
    setSelectedDestination(value);
  }, []);

  const handleDestinationSelect = useCallback((location: any) => {
    setSelectedLocation(location);
    setCurrentView('booking');
  }, []);
  const [isOnline, setIsOnline] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [profilePage, setProfilePage] = useState<string | null>(null);

  const HomeScreen = () => (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-xl"></div>
        <div className="absolute bottom-40 right-10 w-24 h-24 bg-primary rounded-full blur-xl"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-primary rounded-full blur-lg"></div>
      </div>
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-8 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">Oh hello, {userProfile?.name || 'Rider'}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center space-x-2 bg-card/70 backdrop-blur-sm rounded-xl p-4 border">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <p className="text-sm text-muted-foreground">
              25% off your next ride (max US$5/ride). Ends Jul 2. Excludes Wait & Save. Terms apply.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Where are you going?"
              className="w-full bg-card/50 backdrop-blur-sm border rounded-2xl py-4 pl-12 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              onClick={() => setCurrentView('search')}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-4 mb-8">
          <Button 
            variant="outline"
            onClick={() => setCurrentView('schedule')}
            className="flex items-center space-x-2"
          >
            <Calendar className="w-5 h-5" />
            <span>Schedule</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Change rider</span>
          </Button>
        </div>

        {/* Connection Status - Hidden */}
        {false && !isOnline && (
          <div className="bg-destructive/90 backdrop-blur-sm rounded-xl p-4 mb-6 flex items-center space-x-3 border border-destructive/30">
            <WifiOff className="w-5 h-5" />
            <div>
              <p className="font-semibold">No internet connection</p>
              <p className="text-sm opacity-80">Check your connection and try again.</p>
            </div>
          </div>
        )}

        {/* Map Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">You are here</h2>
          <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-4 border">
            <GoogleMap 
              height="256px" 
              showUserLocation={true}
              className="rounded-lg"
            />
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t">
          <div className="flex justify-around py-4">
            <button 
              onClick={() => setCurrentView('home')}
              className="flex flex-col items-center space-y-1"
            >
              <Car className={`w-6 h-6 ${currentView === 'home' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-xs ${currentView === 'home' ? 'text-primary' : 'text-muted-foreground'}`}>Rides</span>
            </button>
            <button 
              onClick={() => setCurrentView('trips')}
              className="flex flex-col items-center space-y-1"
            >
              <Calendar className={`w-6 h-6 ${currentView === 'trips' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-xs ${currentView === 'trips' ? 'text-primary' : 'text-muted-foreground'}`}>Trips</span>
            </button>
            <button 
              onClick={() => setCurrentView('profile')}
              className="flex flex-col items-center space-y-1"
            >
              <User className={`w-6 h-6 ${currentView === 'profile' ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`text-xs ${currentView === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}>You</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const SearchScreen = () => (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('home')}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold ml-4">Trip</h1>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-4 mb-6">
          <Button variant="secondary" className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Schedule</span>
          </Button>
          <Button variant="secondary" className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Change rider</span>
          </Button>
        </div>

        {/* Route Input */}
        <div className="bg-card rounded-2xl p-4 mb-6 border">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-primary rounded-full mr-4"></div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Start</p>
              <LocationSearch
                key="start-location-search"
                value={selectedStartLocation}
                onChange={handleStartLocationChange}
                onSelect={handleStartLocationSelect}
                placeholder="Current location"
              />
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-warning rounded-full mr-4"></div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Destination</p>
              <LocationSearch
                key="destination-location-search"
                value={selectedDestination}
                onChange={handleDestinationChange}
                onSelect={handleDestinationSelect}
                placeholder="Where to?"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  const BookingScreen = () => (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary to-card">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-primary rounded-full"></div>
          <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-primary rounded-full"></div>
          <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-warning rounded-full"></div>
        </div>
        
        {/* Route Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-warning to-success opacity-60 transform -translate-y-1/2"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 bg-card/50 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('search')}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Employee Entrance</p>
            <p className="font-medium">→ Rideshare</p>
          </div>
          <div></div>
        </div>
      </div>

      {/* Arrival Time */}
      <div className="absolute top-32 right-4 z-10">
        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
          Arrive 22:33
        </div>
      </div>

      {/* Connection Status - Hidden */}
      {false && !isOnline && (
        <div className="absolute bottom-80 left-4 right-4 z-10">
          <div className="bg-card/90 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-2 border">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">No network connection</span>
          </div>
        </div>
      )}

      {/* Promo Banner */}
      <div className="absolute bottom-64 left-4 right-4 z-10">
        <div className="bg-success/90 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-2 border border-success/30">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <span className="text-xs text-primary-foreground">%</span>
          </div>
          <span className="text-sm font-medium text-success-foreground">You're saving 25%, up to US$5. Nice.</span>
        </div>
      </div>

      {/* Ride Options */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-card/95 backdrop-blur-sm rounded-t-3xl p-6 border-t">
        <div className="bg-gradient-card rounded-2xl p-4 border-2 border-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Car className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">Standard</span>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">4</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xl font-bold text-primary">US$23.99</span>
                  <span className="text-sm bg-success text-success-foreground px-2 py-1 rounded">17% off</span>
                  <span className="text-sm text-muted-foreground line-through">US$28.99</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                  <Clock className="w-4 h-4" />
                  <span>in 11 min • 22:33</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <Button variant="secondary" className="flex items-center space-x-2 flex-1">
            <CreditCard className="w-5 h-5" />
            <span>Add payment</span>
          </Button>
          <Button variant="secondary" className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Schedule</span>
          </Button>
        </div>

        {/* Book Button */}
        <Button 
          className="w-full mt-4"
          size="driver"
          onClick={async () => {
            try {
              await createRideRequest({
                riderId: currentUser!.uid,
                riderName: userProfile?.name || currentUser!.email!,
                pickup: 'Downtown', // In a real app, this would be user's current location
                destination: selectedDestination,
                fare: 23.99
              });
              
              toast({
                title: "Ride Requested!",
                description: "Looking for available drivers...",
              });
              
              setCurrentView('home');
            } catch (error: any) {
              toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
              });
            }
          }}
        >
          Select Standard
        </Button>
      </div>
    </div>
  );

  const TripsScreen = () => (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 pt-8">
          <h1 className="text-4xl font-bold mb-4">Your trips</h1>
          <p className="text-muted-foreground">Review your ride history and receipts</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6">
          <Button variant="default" size="sm">All trips</Button>
          <Button variant="outline" size="sm">This month</Button>
          <Button variant="outline" size="sm">This year</Button>
        </div>

        {/* Trip History */}
        <div className="space-y-4">
          {tripsLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading trips...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No trips yet</p>
            </div>
          ) : (
            trips.map((trip) => (
              <div key={trip.id} className="bg-card rounded-xl p-4 border hover:bg-secondary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <Car className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{trip.pickup} → {trip.destination}</p>
                      <p className="text-sm text-muted-foreground">
                        {trip.completedAt.toDate().toLocaleDateString()} • Driver: {trip.driverName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${trip.fare.toFixed(2)}</p>
                    <p className="text-xs text-success">Completed</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8 pt-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{userProfile?.name || currentUser?.email || 'Rider'}</h1>
              <p className="text-muted-foreground">Member since {userProfile?.createdAt ? (userProfile.createdAt as any).toDate ? (userProfile.createdAt as any).toDate().getFullYear() : new Date(userProfile.createdAt).getFullYear() : new Date().getFullYear()}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 border">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">124</p>
              <p className="text-sm text-muted-foreground">Total trips</p>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border">
            <div className="text-center">
              <p className="text-3xl font-bold text-success">4.9</p>
              <p className="text-sm text-muted-foreground">Rating</p>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="space-y-4">
          <button 
            onClick={() => setProfilePage('payment')}
            className="w-full bg-card rounded-xl p-4 border hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Payment methods</p>
                  <p className="text-sm text-muted-foreground">Manage cards and payment options</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>

          <button 
            onClick={() => setProfilePage('places')}
            className="w-full bg-card rounded-xl p-4 border hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Saved places</p>
                  <p className="text-sm text-muted-foreground">Home, work, and favorite locations</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>

          <button 
            onClick={() => setProfilePage('account')}
            className="w-full bg-card rounded-xl p-4 border hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Account settings</p>
                  <p className="text-sm text-muted-foreground">Profile, notifications, and privacy</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>

          <button 
            onClick={() => setProfilePage('help')}
            className="w-full bg-card rounded-xl p-4 border hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Help & support</p>
                  <p className="text-sm text-muted-foreground">Get help with trips and account</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>
        </div>

        {/* App Mode Switch */}
        <div className="mt-8">
          <div className="bg-card/90 backdrop-blur-sm border rounded-xl p-1 flex w-full">
            <Button
              variant="default"
              size="sm"
              className="flex items-center space-x-2 flex-1"
            >
              <User className="w-4 h-4" />
              <span>Rider</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onModeSwitch('driver')}
              className="flex items-center space-x-2 flex-1"
            >
              <Car className="w-4 h-4" />
              <span>Driver</span>
            </Button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="mt-4">
          <Button variant="outline" className="w-full" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );

  // Show profile pages if any is selected
  if (profilePage) {
    return (
      <ProfilePages 
        currentPage={profilePage} 
        onBack={() => setProfilePage(null)} 
      />
    );
  }

  return (
    <div className="relative">
      {currentView === 'home' && <HomeScreen />}
      {currentView === 'search' && <SearchScreen />}
      {currentView === 'booking' && <BookingScreen />}
      {currentView === 'trips' && <TripsScreen />}
      {currentView === 'profile' && <ProfileScreen />}
    </div>
  );
};

export default RiderApp;