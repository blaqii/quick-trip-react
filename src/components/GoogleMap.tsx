import React, { useEffect, useRef, useState } from 'react';
import { initializeGoogleMaps, getCurrentLocation } from '@/lib/maps';

interface GoogleMapProps {
  height?: string;
  showUserLocation?: boolean;
  pickup?: google.maps.LatLngLiteral;
  destination?: google.maps.LatLngLiteral;
  onLocationSelect?: (location: google.maps.LatLngLiteral) => void;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  height = '300px',
  showUserLocation = true,
  pickup,
  destination,
  onLocationSelect,
  className = '',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const google = await initializeGoogleMaps();
        
        if (!mapRef.current) return;

        // Default to San Francisco if location not available
        const defaultCenter = { lat: 37.7749, lng: -122.4194 };
        let center = defaultCenter;

        // Try to get user's location
        if (showUserLocation) {
          try {
            const position = await getCurrentLocation();
            center = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(center);
          } catch (error) {
            console.log('Location access denied, using default location');
          }
        }

        const mapInstance = new google.Map(mapRef.current, {
          center,
          zoom: 14,
          styles: [
            {
              featureType: 'all',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#6c757d' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#f8f9fa' }],
            },
          ],
        });

        setMap(mapInstance);

        // Add click listener for location selection
        if (onLocationSelect) {
          mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              onLocationSelect({
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
              });
            }
          });
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();
  }, [showUserLocation, onLocationSelect]);

  // Add markers when pickup/destination change
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    // Note: In a real app, you'd want to keep track of markers to remove them properly

    // Add user location marker
    if (userLocation) {
      new google.maps.Marker({
        position: userLocation,
        map,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#3B82F6"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(24, 24),
        },
      });
    }

    // Add pickup marker
    if (pickup) {
      new google.maps.Marker({
        position: pickup,
        map,
        title: 'Pickup Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#10B981"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
        },
      });
    }

    // Add destination marker
    if (destination) {
      new google.maps.Marker({
        position: destination,
        map,
        title: 'Destination',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EF4444"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
        },
      });
    }

    // Draw route if both pickup and destination exist
    if (pickup && destination) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: '#3B82F6',
          strokeWeight: 4,
        },
        suppressMarkers: true, // We're using custom markers
      });

      directionsRenderer.setMap(map);

      directionsService.route(
        {
          origin: pickup,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK' && result) {
            directionsRenderer.setDirections(result);
          }
        }
      );
    }
  }, [map, userLocation, pickup, destination]);

  return (
    <div
      ref={mapRef}
      style={{ height }}
      className={`w-full rounded-lg ${className}`}
    />
  );
};

export default GoogleMap;
