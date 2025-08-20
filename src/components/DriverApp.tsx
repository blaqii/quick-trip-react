import React, { useState, useEffect } from 'react';
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
import UniversalMap from '@/components/UniversalMap';

const DriverApp = ({ onModeSwitch }: { onModeSwitch: (mode: 'driver' | 'rider') => void }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const { requests, acceptRideRequest, updateRideStatus } = useRideRequests();
  const { trips: myTrips, loading: tripsLoading } = useUserTrips(currentUser?.uid || '', 'driver');
  const { toast } = useToast();
  
  const [currentView, setCurrentView] = useState('home');
  const [isOnline, setIsOnline] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState<any>(null);
  const [currentTrip, setCurrentTrip] = useState<any>(null);
  const [earnings, setEarnings] = useState(0);
  
  // Calculate today's earnings from completed trips
  useEffect(() => {
    if (myTrips.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todaysEarnings = myTrips
        .filter(trip => trip.completedAt.toDate() >= today)
        .reduce((total, trip) => total + trip.fare, 0);
      
      setEarnings(todaysEarnings);
    }
  }, [myTrips]);

  // Listen for incoming requests when online
  useEffect(() => {
    if (isOnline && requests.length > 0 && !incomingRequest && !currentTrip) {
      const pendingRequest = requests.find(req => req.status === 'pending');
      if (pendingRequest) {
        setIncomingRequest(pendingRequest);
      }
    }
  }, [isOnline, requests, incomingRequest, currentTrip]);

  const acceptRide = async () => {
    try {
      if (incomingRequest && incomingRequest.id) {
        await acceptRideRequest(
          incomingRequest.id, 
          currentUser!.uid, 
          userProfile?.name || currentUser!.email!
        );
        setCurrentTrip(incomingRequest);
        setIncomingRequest(null);
        setCurrentView('trip');
        
        toast({
          title: "Ride Accepted!",
          description: "Navigate to pickup location",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const declineRide = () => {
    setIncomingRequest(null);
  };

  const completeTrip = async () => {
    try {
      if (currentTrip && currentTrip.id) {
        await updateRideStatus(currentTrip.id, 'completed');
        setCurrentTrip(null);
        setCurrentView('home');
        
        toast({
          title: "Trip Completed!",
          description: `Earned $${currentTrip.fare}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const HomeScreen = () => (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Header */}
      <div className="bg-gradient-card p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Good evening, {userProfile?.name || 'Driver'}</h1>
            <p className="text-muted-foreground">Ready to earn some money?</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Today's earnings</p>
            <p className="text-2xl font-bold text-primary">${earnings.toFixed(2)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Online Status Toggle */}
        <div className="flex items-center justify-between bg-card rounded-xl p-4 border">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-driver-online animate-pulse' : 'bg-driver-offline'}`}></div>
            <div>
              <p className="font-semibold">{isOnline ? 'You\'re Online' : 'You\'re Offline'}</p>
              <p className="text-sm text-muted-foreground">
                {isOnline ? 'Ready to accept rides' : 'Tap to go online'}
              </p>
            </div>
          </div>
          <Button
            variant={isOnline ? "warning" : "driver"}
            size="lg"
            onClick={() => setIsOnline(!isOnline)}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-card rounded-xl p-4 shadow-card">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 p-3 rounded-lg">
                <Car className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myTrips.filter(trip => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return trip.completedAt.toDate() >= today;
                }).length}</p>
                <p className="text-sm text-muted-foreground">Trips today</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-card rounded-xl p-4 shadow-card">
            <div className="flex items-center space-x-3">
              <div className="bg-success/20 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">5.2h</p>
                <p className="text-sm text-muted-foreground">Online time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-gradient-card rounded-xl p-4 shadow-card pb-32">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Location</h3>
            <Button variant="outline" size="sm">
              <Navigation className="w-4 h-4" />
              Center
            </Button>
          </div>
          <UniversalMap 
            height="256px" 
            showUserLocation={true}
            className="rounded-lg"
          />
        </div>

        {/* Status Message */}
        {!isOnline && (
          <div className="bg-card border border-warning/20 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="font-semibold">You're offline</p>
                <p className="text-sm text-muted-foreground">Go online to start receiving ride requests</p>
              </div>
            </div>
          </div>
        )}

        {isOnline && !incomingRequest && (
          <div className="bg-card border border-success/20 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-success animate-pulse" />
              </div>
              <div>
                <p className="font-semibold">Looking for rides...</p>
                <p className="text-sm text-muted-foreground">You'll be notified when a request comes in</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="flex justify-around py-4">
          <button className="flex flex-col items-center space-y-1">
            <Car className="w-6 h-6 text-primary" />
            <span className="text-xs text-primary">Home</span>
          </button>
          <button 
            onClick={() => setCurrentView('earnings')}
            className="flex flex-col items-center space-y-1"
          >
            <CreditCard className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Earnings</span>
          </button>
          <button 
            onClick={() => setCurrentView('profile')}
            className="flex flex-col items-center space-y-1"
          >
            <User className="w-6 h-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Profile</span>
          </button>
        </div>
      </div>

      {/* Incoming Request Modal */}
      {incomingRequest && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end">
          <div className="w-full bg-gradient-card rounded-t-3xl p-6 shadow-2xl border-t border-border animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">New Ride Request</h2>
              <div className="bg-warning/20 px-3 py-1 rounded-full">
                <span className="text-warning font-semibold">15s</span>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-lg">{incomingRequest?.riderName}</p>
                <p className="text-muted-foreground">★ 4.9 • 3 min away</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-bold text-success">${incomingRequest?.fare}</p>
                <p className="text-sm text-muted-foreground">8.2 km</p>
              </div>
            </div>
              
              <div className="bg-secondary rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pickup</p>
                    <p className="font-medium">{incomingRequest?.pickup}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <div>
                    <p className="text-sm text-muted-foreground">Destination</p>
                    <p className="font-medium">{incomingRequest?.destination}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="driver"
                onClick={declineRide}
                className="flex-1"
              >
                Decline
              </Button>
              <Button
                variant="driver"
                size="driver"
                onClick={acceptRide}
                className="flex-1"
              >
                Accept Ride
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const TripScreen = () => (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-card p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView('home')}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold">Trip in Progress</h1>
            <p className="text-sm text-muted-foreground">Drive safely</p>
          </div>
          <div className="w-10"></div>
        </div>
        
        <div className="bg-card rounded-xl p-4 border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">{currentTrip?.riderName}</p>
              <p className="text-muted-foreground">★ 4.9 • ${currentTrip?.fare}</p>
            </div>
            <Button variant="outline" size="sm">
              <Search className="w-4 h-4" />
              Call
            </Button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="p-6">
        <div className="bg-gradient-card rounded-xl p-4 shadow-card mb-6">
          <div className="h-80 bg-secondary rounded-lg relative overflow-hidden">
            {/* Simulated navigation map */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-0 right-0 h-px bg-border"></div>
              <div className="absolute top-40 left-0 right-0 h-px bg-border"></div>
              <div className="absolute top-60 left-0 right-0 h-px bg-border"></div>
              <div className="absolute left-20 top-0 bottom-0 w-px bg-border"></div>
              <div className="absolute left-40 top-0 bottom-0 w-px bg-border"></div>
              <div className="absolute left-60 top-0 bottom-0 w-px bg-border"></div>
            </div>
            
            {/* Route line */}
            <div className="absolute top-1/2 left-4 right-4 h-1 bg-gradient-to-r from-primary via-warning to-success rounded-full transform -translate-y-1/2"></div>
            
            {/* Current position */}
            <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-primary rounded-full shadow-glow"></div>
            </div>
            
            {/* Destination */}
            <div className="absolute top-1/2 right-8 transform translate-x-1/2 -translate-y-1/2">
              <div className="w-4 h-4 bg-success rounded-full"></div>
            </div>
            
            {/* Navigation overlay */}
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-primary/90 backdrop-blur-sm rounded-lg p-3 text-primary-foreground">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">Turn right on Main St</p>
                    <p className="text-sm opacity-80">in 200m</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* ETA */}
            <div className="absolute bottom-4 right-4">
              <div className="bg-success/90 backdrop-blur-sm rounded-lg px-3 py-2 text-success-foreground">
                <p className="text-sm font-semibold">ETA: 8 min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-gradient-card rounded-xl p-4 shadow-card mb-6">
          <h3 className="font-semibold mb-3">Trip Details</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div>
                <p className="text-sm text-muted-foreground">Pickup</p>
                <p className="font-medium">{currentTrip?.pickup}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <div>
                <p className="text-sm text-muted-foreground">Destination</p>
                <p className="font-medium">{currentTrip?.destination}</p>
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="driver"
          size="driver"
          onClick={completeTrip}
          className="w-full"
        >
          Complete Trip
        </Button>
      </div>
    </div>
  );

  const EarningsScreen = () => (
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
          <h1 className="text-2xl font-bold ml-4">Earnings</h1>
        </div>

        {/* Today's Summary */}
        <div className="bg-gradient-card rounded-xl p-6 shadow-card mb-6">
          <h2 className="text-lg font-semibold mb-4">Today's Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">${earnings.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-success">{myTrips.filter(trip => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return trip.completedAt.toDate() >= today;
              }).length}</p>
              <p className="text-sm text-muted-foreground">Completed Trips</p>
            </div>
          </div>
        </div>

        {/* Recent Trips */}
        <div className="bg-gradient-card rounded-xl p-4 shadow-card">
          <h3 className="font-semibold mb-4">Recent Trips</h3>
          <div className="space-y-3">
            {[
              { passenger: 'Sarah M.', fare: '$23.50', time: '2:30 PM' },
              { passenger: 'John D.', fare: '$18.75', time: '1:45 PM' },
              { passenger: 'Emma R.', fare: '$31.25', time: '12:20 PM' },
              { passenger: 'Mike T.', fare: '$15.00', time: '11:15 AM' },
            ].map((trip, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div>
                  <p className="font-medium">{trip.passenger}</p>
                  <p className="text-sm text-muted-foreground">{trip.time}</p>
                </div>
                <p className="font-semibold text-success">{trip.fare}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileScreen = () => (
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
          <h1 className="text-2xl font-bold ml-4">Profile</h1>
        </div>

        {/* Driver Info */}
        <div className="bg-gradient-card rounded-xl p-6 shadow-card mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Mike Johnson</h2>
              <p className="text-muted-foreground">★ 4.8 • 247 trips</p>
              <p className="text-sm text-muted-foreground">Member since March 2023</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-card rounded-xl p-4 shadow-card text-center">
            <p className="text-2xl font-bold text-primary">4.8</p>
            <p className="text-sm text-muted-foreground">Rating</p>
          </div>
          <div className="bg-gradient-card rounded-xl p-4 shadow-card text-center">
            <p className="text-2xl font-bold text-success">98%</p>
            <p className="text-sm text-muted-foreground">Acceptance Rate</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-gradient-card rounded-xl p-4 shadow-card mb-6">
          <div className="space-y-1">
            {[
              { icon: Car, label: 'Vehicle Information' },
              { icon: CreditCard, label: 'Payment Methods' },
              { icon: Clock, label: 'Drive History' },
              { icon: User, label: 'Account Settings' },
            ].map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center space-x-3 p-3 hover:bg-secondary rounded-lg transition-colors"
              >
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* App Mode Switch */}
        <div className="bg-card/90 backdrop-blur-sm border rounded-xl p-1 flex w-full mb-4">
          <Button
            variant="default"
            size="sm"
            className="flex items-center space-x-2 flex-1"
          >
            <Car className="w-4 h-4" />
            <span>Driver</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onModeSwitch('rider')}
            className="flex items-center space-x-2 flex-1"
          >
            <User className="w-4 h-4" />
            <span>Rider</span>
          </Button>
        </div>

        {/* Sign Out */}
        <Button variant="outline" className="w-full">
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {currentView === 'home' && <HomeScreen />}
      {currentView === 'trip' && <TripScreen />}
      {currentView === 'earnings' && <EarningsScreen />}
      {currentView === 'profile' && <ProfileScreen />}
    </div>
  );
};

export default DriverApp;