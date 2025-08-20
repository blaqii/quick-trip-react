import React, { useState, useEffect } from 'react';
import { Navigation, Phone, MessageSquare, AlertTriangle, ChevronLeft, MapPin, Clock, ArrowUp, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UniversalMap from '@/components/UniversalMap';

interface DriverNavigationProps {
  trip: any;
  onBack: () => void;
  onCompleteTrip: () => void;
}

const DriverNavigation: React.FC<DriverNavigationProps> = ({ trip, onBack, onCompleteTrip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [eta, setEta] = useState(8);
  const [distance, setDistance] = useState(1.2);

  // Simulation of navigation steps
  const navigationSteps = [
    { instruction: "Head south on Main St", direction: "straight", distance: "200m" },
    { instruction: "Turn right onto Oak Avenue", direction: "right", distance: "500m" },
    { instruction: "Continue straight for 2 blocks", direction: "straight", distance: "800m" },
    { instruction: "Turn left onto Pine Street", direction: "left", distance: "300m" },
    { instruction: "Destination will be on your right", direction: "right", distance: "100m" }
  ];

  // Simulate progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEta(prev => Math.max(0, prev - 0.1));
      setDistance(prev => Math.max(0, prev - 0.05));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'left': return <ArrowLeft className="w-5 h-5" />;
      case 'right': return <ArrowRight className="w-5 h-5" />;
      default: return <ArrowUp className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-gradient-card p-4 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-bold">Navigation</h1>
            <p className="text-sm text-muted-foreground">Drive to pickup location</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Trip Info */}
        <div className="bg-card rounded-xl p-4 border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold">
                {trip?.riderName?.charAt(0) || 'R'}
              </span>
            </div>
            <div className="flex-1">
              <p className="font-medium">{trip?.riderName}</p>
              <p className="text-sm text-muted-foreground">★ 4.9 • ${trip?.fare}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-success">
                <Clock className="w-4 h-4" />
                <span className="font-bold">{eta.toFixed(0)} min</span>
              </div>
              <p className="text-sm text-muted-foreground">{distance.toFixed(1)} km</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1">
        <UniversalMap 
          height="60vh" 
          showUserLocation={true}
          className="w-full"
        />
        
        {/* Navigation Overlay */}
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-primary/95 backdrop-blur-sm rounded-xl p-4 text-primary-foreground shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                {getDirectionIcon(navigationSteps[currentStep]?.direction)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">{navigationSteps[currentStep]?.instruction}</p>
                <p className="text-sm opacity-90">in {navigationSteps[currentStep]?.distance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Speed and Status */}
        <div className="absolute top-4 right-4">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
            <div className="text-center">
              <p className="text-2xl font-bold">35</p>
              <p className="text-xs text-muted-foreground">km/h</p>
            </div>
          </div>
        </div>

        {/* Route Progress */}
        <div className="absolute bottom-20 left-4 right-4">
          <div className="bg-card/95 backdrop-blur-sm rounded-xl p-4 border shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Route to Pickup</h3>
              <Button variant="outline" size="sm">
                <Navigation className="w-4 h-4 mr-2" />
                Recalculate
              </Button>
            </div>
            
            {/* Route Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Pickup Location</p>
                  <p className="font-medium text-sm">{trip?.pickup}</p>
                </div>
              </div>
              
              <div className="w-px h-4 bg-border ml-1.5"></div>
              
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Final Destination</p>
                  <p className="font-medium text-sm">{trip?.destination}</p>
                </div>
              </div>
            </div>

            {/* Warning */}
            {eta < 2 && (
              <div className="flex items-center space-x-2 mt-3 p-2 bg-warning/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <p className="text-sm text-warning font-medium">
                  Arriving soon - Call rider if needed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 bg-card border-t">
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {/* Handle emergency */}}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Emergency
          </Button>
          <Button 
            className="flex-1"
            onClick={onCompleteTrip}
            disabled={distance > 0.1}
          >
            {distance > 0.1 ? 'Arriving...' : 'Arrived - Start Trip'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverNavigation;