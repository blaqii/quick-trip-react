import React, { useState } from 'react';
import { Car, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DriverApp from './DriverApp';
import RiderApp from './RiderApp';

const AppModeSwitch = () => {
  const [mode, setMode] = useState<'driver' | 'rider'>('rider');

  return (
    <div className="relative min-h-screen bg-background">
      {/* App Content */}
      <div className="transition-all duration-300 ease-in-out">
        {mode === 'driver' ? (
          <DriverApp onModeSwitch={setMode} />
        ) : (
          <RiderApp onModeSwitch={setMode} />
        )}
      </div>
    </div>
  );
};

export default AppModeSwitch;