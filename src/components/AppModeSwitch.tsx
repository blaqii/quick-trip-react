import React, { useState } from 'react';
import { Car, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from './AuthForm';
import DriverApp from './DriverApp';
import RiderApp from './RiderApp';

const AppModeSwitch = () => {
  const { currentUser, userProfile } = useAuth();
  const [mode, setMode] = useState<'driver' | 'rider'>('rider');

  // If not authenticated, show auth form
  if (!currentUser || !userProfile) {
    return <AuthForm userType={mode} />;
  }

  // If authenticated, show the appropriate app based on user profile
  const userType = userProfile.userType;

  return (
    <div className="relative min-h-screen bg-background">
      {/* App Content */}
      <div className="transition-all duration-300 ease-in-out">
        {userType === 'driver' ? (
          <DriverApp onModeSwitch={setMode} />
        ) : (
          <RiderApp onModeSwitch={setMode} />
        )}
      </div>
    </div>
  );
};

export default AppModeSwitch;