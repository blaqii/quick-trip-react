import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_PUBLIC_TOKEN } from '@/lib/constants';
import MapContainer from '@/components/map/MapContainer';

interface MapboxMapProps {
  height?: string;
  showUserLocation?: boolean;
  pickup?: google.maps.LatLngLiteral;
  destination?: google.maps.LatLngLiteral;
  onLocationSelect?: (location: google.maps.LatLngLiteral) => void;
  followUserLocation?: boolean;
  className?: string;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  height = '400px',
  showUserLocation = false,
  pickup,
  destination,
  onLocationSelect,
  followUserLocation = false,
  className
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const pickupMarker = useRef<mapboxgl.Marker | null>(null);
  const destinationMarker = useRef<mapboxgl.Marker | null>(null);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize Mapbox
    mapboxgl.accessToken = MAPBOX_PUBLIC_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40], // Default center
      zoom: 13,
      interactive: !followUserLocation // Disable interaction if following user
    });

    // Add navigation controls if not following user
    if (!followUserLocation) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    // Handle map clicks for location selection
    if (onLocationSelect && !followUserLocation) {
      map.current.on('click', (e) => {
        onLocationSelect({
          lat: e.lngLat.lat,
          lng: e.lngLat.lng
        });
      });
    }

    // Get user location if needed
    if (showUserLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = [longitude, latitude] as [number, number];
          
          // Center map on user location
          map.current?.setCenter(userLocation);
          
          // Add user location marker
          if (userMarker.current) {
            userMarker.current.remove();
          }
          
          userMarker.current = new mapboxgl.Marker({ color: '#3b82f6' })
            .setLngLat(userLocation)
            .addTo(map.current!);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      map.current?.remove();
    };
  }, [showUserLocation, onLocationSelect, followUserLocation]);

  // Follow user location continuously
  useEffect(() => {
    if (followUserLocation && showUserLocation && map.current) {
      watchId.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLocation = [longitude, latitude] as [number, number];
          
          // Update map center
          map.current?.easeTo({
            center: userLocation,
            duration: 1000
          });
          
          // Update user marker
          if (userMarker.current) {
            userMarker.current.setLngLat(userLocation);
          } else {
            userMarker.current = new mapboxgl.Marker({ color: '#3b82f6' })
              .setLngLat(userLocation)
              .addTo(map.current!);
          }
        },
        (error) => {
          console.error('Error watching user location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    }

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [followUserLocation, showUserLocation]);

  // Handle pickup marker
  useEffect(() => {
    if (!map.current) return;

    if (pickup) {
      if (pickupMarker.current) {
        pickupMarker.current.remove();
      }
      
      pickupMarker.current = new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat([pickup.lng, pickup.lat])
        .addTo(map.current);
    } else if (pickupMarker.current) {
      pickupMarker.current.remove();
      pickupMarker.current = null;
    }
  }, [pickup]);

  // Handle destination marker
  useEffect(() => {
    if (!map.current) return;

    if (destination) {
      if (destinationMarker.current) {
        destinationMarker.current.remove();
      }
      
      destinationMarker.current = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([destination.lng, destination.lat])
        .addTo(map.current);
    } else if (destinationMarker.current) {
      destinationMarker.current.remove();
      destinationMarker.current = null;
    }
  }, [destination]);

  // Draw route between pickup and destination
  useEffect(() => {
    if (!map.current || !pickup || !destination) return;

    const getRoute = async () => {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?steps=true&geometries=geojson&access_token=${MAPBOX_PUBLIC_TOKEN}`
      );
      const json = await query.json();
      const data = json.routes[0];
      const route = data.geometry.coordinates;

      const geojson = {
        type: 'Feature' as const,
        properties: {},
        geometry: {
          type: 'LineString' as const,
          coordinates: route
        }
      };

      // Remove existing route
      if (map.current?.getSource('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }

      // Add route
      map.current?.addSource('route', {
        type: 'geojson',
        data: geojson
      });

      map.current?.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });

      // Fit map to route
      const coordinates = route;
      const bounds = coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: [number, number]) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      map.current?.fitBounds(bounds, {
        padding: 20
      });
    };

    getRoute();
  }, [pickup, destination]);

  return (
    <MapContainer 
      ref={mapContainer} 
      style={{ height }} 
      className={className}
    />
  );
};

export default MapboxMap;