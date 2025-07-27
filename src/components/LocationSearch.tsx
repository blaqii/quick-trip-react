import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Car } from 'lucide-react';
import { initializeGoogleMaps } from '@/lib/maps';

interface LocationSuggestion {
  name: string;
  address: string;
  type: string;
  placeId: string;
  location?: google.maps.LatLngLiteral;
}

interface LocationSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (location: LocationSuggestion) => void;
  placeholder?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = "Where to?"
}) => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        await initializeGoogleMaps();
        autocompleteService.current = new google.maps.places.AutocompleteService();
        
        // Create a dummy div for PlacesService (required by Google Maps API)
        const dummyDiv = document.createElement('div');
        placesService.current = new google.maps.places.PlacesService(dummyDiv);
      } catch (error) {
        console.error('Failed to initialize Google Maps services:', error);
      }
    };

    initializeServices();
  }, []);

  const getPlaceType = (types: string[]): string => {
    const typeMap: { [key: string]: string } = {
      'airport': 'airport',
      'hospital': 'medical',
      'university': 'education',
      'school': 'education',
      'shopping_mall': 'shopping',
      'store': 'shopping',
      'transit_station': 'transport',
      'subway_station': 'transport',
      'train_station': 'transport',
      'bus_station': 'transport',
      'establishment': 'business',
      'point_of_interest': 'recreation'
    };

    for (const type of types) {
      if (typeMap[type]) {
        return typeMap[type];
      }
    }
    return 'business';
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'airport':
      case 'transport':
        return <Navigation className="w-5 h-5 text-primary-foreground" />;
      case 'shopping':
      case 'business':
      case 'education':
      case 'medical':
      case 'recreation':
      default:
        return <MapPin className="w-5 h-5 text-primary-foreground" />;
    }
  };

  const searchPlaces = async (query: string) => {
    if (!query.trim() || !autocompleteService.current) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const request: google.maps.places.AutocompletionRequest = {
        input: query,
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'us' } // Restrict to US for better results
      };

      autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          // Get detailed information for each prediction
          const detailedSuggestions = predictions.slice(0, 8).map(async (prediction) => {
            return new Promise<LocationSuggestion>((resolve) => {
              if (!placesService.current) {
                resolve({
                  name: prediction.structured_formatting.main_text,
                  address: prediction.structured_formatting.secondary_text || '',
                  type: getPlaceType(prediction.types),
                  placeId: prediction.place_id
                });
                return;
              }

              placesService.current.getDetails(
                {
                  placeId: prediction.place_id,
                  fields: ['name', 'formatted_address', 'types', 'geometry']
                },
                (place, status) => {
                  if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                    resolve({
                      name: place.name || prediction.structured_formatting.main_text,
                      address: place.formatted_address || prediction.structured_formatting.secondary_text || '',
                      type: getPlaceType(place.types || prediction.types),
                      placeId: prediction.place_id,
                      location: place.geometry?.location ? {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                      } : undefined
                    });
                  } else {
                    resolve({
                      name: prediction.structured_formatting.main_text,
                      address: prediction.structured_formatting.secondary_text || '',
                      type: getPlaceType(prediction.types),
                      placeId: prediction.place_id
                    });
                  }
                }
              );
            });
          });

          Promise.all(detailedSuggestions).then(setSuggestions);
        } else {
          setSuggestions([]);
        }
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error searching places:', error);
      setSuggestions([]);
      setIsLoading(false);
    }
  };

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Clear previous timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Debounce the search
    debounceTimeoutRef.current = setTimeout(() => {
      searchPlaces(newValue);
    }, 300);
  };

  const handleSelect = (suggestion: LocationSuggestion) => {
    onChange(suggestion.name);
    onSelect(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="bg-transparent text-foreground placeholder-muted-foreground focus:outline-none w-full"
        value={value}
        onChange={handleInputChange}
      />
      
      {/* Suggestions Dropdown */}
      {(suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-background border rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.placeId}
                  onClick={() => handleSelect(suggestion)}
                  className="w-full flex items-center space-x-4 p-3 hover:bg-secondary rounded-lg transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    {getIconForType(suggestion.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{suggestion.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{suggestion.address}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;