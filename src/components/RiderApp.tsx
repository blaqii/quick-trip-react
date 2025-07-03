import React, { useState } from 'react';
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
  Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const RiderApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const destinations = [
    { name: 'Central Business District', address: '120 Main St, Downtown', type: 'business' },
    { name: 'Golden Gate Mall', address: '456 Shopping Ave, Westside', type: 'shopping' },
    { name: 'Sunny Valley Airport', address: '789 Airport Blvd, Terminal 1', type: 'airport' },
    { name: 'Ocean View Beach', address: '321 Coastal Rd, Beachfront', type: 'recreation' },
    { name: 'Tech Park Complex', address: '555 Innovation Dr, Tech District', type: 'business' },
    { name: 'University Campus', address: '100 College Ave, Education District', type: 'education' },
    { name: 'Memorial Hospital', address: '200 Health St, Medical Center', type: 'medical' },
    { name: 'Sunrise Train Station', address: '150 Railway Ave, Transit Hub', type: 'transport' }
  ];

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
          <h1 className="text-4xl font-bold mb-4">Oh hello, Alex</h1>
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
          <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-4 h-64 relative overflow-hidden border">
            {/* Simulated map with street grid */}
            <div className="absolute inset-0">
              {/* Street grid lines */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-16 left-0 right-0 h-px bg-border"></div>
                <div className="absolute top-32 left-0 right-0 h-px bg-border"></div>
                <div className="absolute top-48 left-0 right-0 h-px bg-border"></div>
                <div className="absolute left-16 top-0 bottom-0 w-px bg-border"></div>
                <div className="absolute left-32 top-0 bottom-0 w-px bg-border"></div>
                <div className="absolute left-48 top-0 bottom-0 w-px bg-border"></div>
                <div className="absolute left-64 top-0 bottom-0 w-px bg-border"></div>
              </div>
            </div>
            
            {/* Current location marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-4 h-4 bg-primary rounded-full animate-pulse shadow-glow"></div>
              <div className="w-8 h-8 border-2 border-primary rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping opacity-75"></div>
            </div>
            
            {/* Street labels */}
            <div className="absolute top-4 left-4 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">Derby Rd</div>
            <div className="absolute top-4 right-4 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">Castle</div>
            <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">Tyrell Rd</div>
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">Pearce St</div>
            <div className="absolute top-1/2 left-4 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded transform -rotate-90">Chamberlain Rd</div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t">
          <div className="flex justify-around py-4">
            <button className="flex flex-col items-center space-y-1">
              <Car className="w-6 h-6 text-primary" />
              <span className="text-xs text-primary">Rides</span>
            </button>
            <button className="flex flex-col items-center space-y-1">
              <Calendar className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Trips</span>
            </button>
            <button className="flex flex-col items-center space-y-1">
              <User className="w-6 h-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">You</span>
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
            <div>
              <p className="text-sm text-muted-foreground">Start</p>
              <p className="font-medium">Downtown</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-warning rounded-full mr-4"></div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Destination</p>
              <input
                type="text"
                placeholder="Where to?"
                className="bg-transparent text-foreground placeholder-muted-foreground focus:outline-none w-full"
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Destination Suggestions */}
        <div className="space-y-3">
          {destinations
            .filter(dest => 
              selectedDestination === '' || 
              dest.name.toLowerCase().includes(selectedDestination.toLowerCase()) ||
              dest.address.toLowerCase().includes(selectedDestination.toLowerCase())
            )
            .map((dest, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedDestination(dest.name);
                  setCurrentView('booking');
                }}
                className="w-full flex items-center space-x-4 p-4 hover:bg-secondary rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  {dest.type === 'business' && <MapPin className="w-5 h-5 text-primary-foreground" />}
                  {dest.type === 'shopping' && <MapPin className="w-5 h-5 text-primary-foreground" />}
                  {dest.type === 'airport' && <Navigation className="w-5 h-5 text-primary-foreground" />}
                  {dest.type === 'recreation' && <MapPin className="w-5 h-5 text-primary-foreground" />}
                  {dest.type === 'education' && <MapPin className="w-5 h-5 text-primary-foreground" />}
                  {dest.type === 'medical' && <MapPin className="w-5 h-5 text-primary-foreground" />}
                  {dest.type === 'transport' && <Car className="w-5 h-5 text-primary-foreground" />}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{dest.name}</p>
                  <p className="text-sm text-muted-foreground">{dest.address}</p>
                </div>
              </button>
            ))}
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
          onClick={() => {
            alert('Ride booked! Your driver will arrive in 11 minutes.');
            setCurrentView('home');
          }}
        >
          Select Standard
        </Button>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {currentView === 'home' && <HomeScreen />}
      {currentView === 'search' && <SearchScreen />}
      {currentView === 'booking' && <BookingScreen />}
    </div>
  );
};

export default RiderApp;