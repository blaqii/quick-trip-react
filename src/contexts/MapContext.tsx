import React, { createContext, useContext, useState, useEffect } from 'react';

interface MapContextType {
  useMapbox: boolean;
  setUseMapbox: (use: boolean) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMapSettings = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapSettings must be used within a MapProvider');
  }
  return context;
};

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [useMapbox, setUseMapboxState] = useState(false);

  // Load setting from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('useMapbox');
    if (saved !== null) {
      setUseMapboxState(JSON.parse(saved));
    }
  }, []);

  // Save setting to localStorage when it changes
  const setUseMapbox = (use: boolean) => {
    setUseMapboxState(use);
    localStorage.setItem('useMapbox', JSON.stringify(use));
  };

  const value = {
    useMapbox,
    setUseMapbox
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};