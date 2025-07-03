import React, { useState } from 'react';
import { Car, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DriverApp from './DriverApp';
import RiderApp from './RiderApp';

const AppModeSwitch = () => {
  const [mode, setMode] = useState<'driver' | 'rider'>('rider');

  return (
    <div className="relative min-h-screen bg-background">
      {/* Mode Switch Button */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-card/90 backdrop-blur-sm border rounded-xl p-1 flex">
          <Button
            variant={mode === 'rider' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('rider')}
            className="flex items-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>Rider</span>
          </Button>
          <Button
            variant={mode === 'driver' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('driver')}
            className="flex items-center space-x-2"
          >
            <Car className="w-4 h-4" />
            <span>Driver</span>
          </Button>
        </div>
      </div>

      {/* Mode indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-card/90 backdrop-blur-sm border rounded-lg px-3 py-2">
          <span className="text-sm font-medium text-muted-foreground">
            {mode === 'driver' ? 'Driver Mode' : 'Rider Mode'}
          </span>
        </div>
      </div>

      {/* App Content */}
      <div className="transition-all duration-300 ease-in-out">
        {mode === 'driver' ? <DriverApp /> : <RiderApp />}
      </div>
    </div>
  );
};

export default AppModeSwitch;