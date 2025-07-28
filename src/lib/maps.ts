import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCGCnBRrmkoyuXQUiXoqTtzSwblknv6LuM';

export const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry'],
});

let isGoogleMapsLoaded = false;

// Initialize Google Maps
export const initializeGoogleMaps = async () => {
  if (!isGoogleMapsLoaded) {
    await loader.load();
    isGoogleMapsLoaded = true;
  }
  return google.maps;
};

// Get user's current location
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    });
  });
};

// Calculate distance between two points
export const calculateDistance = (
  origin: google.maps.LatLngLiteral,
  destination: google.maps.LatLngLiteral
): number => {
  if (!isGoogleMapsLoaded) return 0;
  
  const originLatLng = new google.maps.LatLng(origin.lat, origin.lng);
  const destLatLng = new google.maps.LatLng(destination.lat, destination.lng);
  
  return google.maps.geometry.spherical.computeDistanceBetween(originLatLng, destLatLng);
};

// Calculate fare based on distance
export const calculateFare = (distanceInMeters: number): number => {
  const baseFare = 3.99;
  const perKmRate = 1.25;
  const distanceInKm = distanceInMeters / 1000;
  
  return Number((baseFare + (distanceInKm * perKmRate)).toFixed(2));
};