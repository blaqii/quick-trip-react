import React from 'react';
import { useMapSettings } from '@/contexts/MapContext';
import GoogleMap from '@/components/GoogleMap';
import MapboxMap from '@/components/MapboxMap';

interface UniversalMapProps {
  height?: string;
  showUserLocation?: boolean;
  pickup?: google.maps.LatLngLiteral;
  destination?: google.maps.LatLngLiteral;
  onLocationSelect?: (location: google.maps.LatLngLiteral) => void;
  followUserLocation?: boolean;
  className?: string;
}

const UniversalMap: React.FC<UniversalMapProps> = (props) => {
  const { useMapbox } = useMapSettings();

  if (useMapbox) {
    return <MapboxMap {...props} />;
  }

  return <GoogleMap {...props} />;
};

export default UniversalMap;