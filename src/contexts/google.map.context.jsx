// GoogleMapProvider.jsx
import React, {
  useState,
  createContext,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { Logger } from '../helpers/logging';

const logger = new Logger('GoogleMapProvider');

const libraries = ['places', 'drawing'];

// 🇦🇴 Angola config
const LUANDA_CENTER = {
  lat: -8.8399876,
  lng: 13.2894368,
};

const ANGOLA_BOUNDS = {
  north: -4.3,
  south: -18.0,
  west: 11.6,
  east: 24.1,
};

export const GoogleMapsContext = createContext({
  isLoaded: false,
  loadError: null,
  mapInstance: null,
  setMapInstance: () => {},

  // 👇 exposed config
  defaultCenter: LUANDA_CENTER,
  countryCode: 'AO',
  bounds: ANGOLA_BOUNDS,
});

export default function GoogleMapProvider({ children }) {
  const loadStartRef = useRef(performance.now());

  const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

  // Log API key status on component mount
  useEffect(() => {
    const keyStatus = apiKey 
      ? `✅ API Key loaded (${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)})` 
      : '❌ API Key NOT found in environment';
    
    logger.info('Google Maps API Key Status', { 
      hasKey: !!apiKey,
      keyLength: apiKey?.length || 0,
      message: keyStatus,
      env: import.meta.env.MODE
    });

    if (!apiKey) {
      logger.critical('CRITICAL: Google Maps API Key is missing!', {
        expectedEnvVar: 'VITE_GOOGLE_MAP_API_KEY',
        currentValue: apiKey,
        message: 'Please check your .env file has VITE_GOOGLE_MAP_API_KEY=your_api_key'
      });
    }
  }, [apiKey]);

  const loaderOptions = useMemo(
    () => ({
      id: 'script-loader',
      googleMapsApiKey: apiKey,
      libraries,
      version: 'weekly',
      region: 'AO',   // 🇦🇴 Bias map tiles
      language: 'pt', // Portuguese labels
    }),
    [apiKey]
  );

  logger.debug('Initializing Google Maps loader', {
    ...loaderOptions,
    googleMapsApiKey: loaderOptions.googleMapsApiKey ? 'present' : 'MISSING'
  });

  const { isLoaded, loadError } = useJsApiLoader(loaderOptions);
  const [mapInstance, setMapInstance] = useState(null);

  /* ----------------------------------
     Load lifecycle logs
  ---------------------------------- */

  useEffect(() => {
    if (!isLoaded && !loadError) {
      logger.info('⏳ Loading Google Maps (Angola config)...');
    }
  }, [isLoaded, loadError]);

  useEffect(() => {
    if (loadError) {
      logger.error('❌ Google Maps failed to load', loadError);
    }
  }, [loadError]);

  useEffect(() => {
    if (!isLoaded) return;

    const loadTime = Math.round(performance.now() - loadStartRef.current);

    logger.info(`✅ Google Maps loaded in ${loadTime}ms`);
    logger.debug('🌍 Region: Angola (AO)');
    logger.debug('📍 Default center: Luanda', LUANDA_CENTER);

    if (window.google?.maps?.places) {
      logger.debug('🧠 Places API available');
      
      // Test Places services
      try {
        const testService = new window.google.maps.places.AutocompleteService();
        const testPlaces = new window.google.maps.places.PlacesService(document.createElement('div'));
        logger.success('✅ Both AutocompleteService and PlacesService can be instantiated', {
          hasAutocomplete: !!testService,
          hasPlaces: !!testPlaces,
        });
      } catch (err) {
        logger.error('⚠️ Error initializing test services', { error: err.message });
      }
    } else {
      logger.error('❌ Places API not available - check that libraries: ["places"] is in useJsApiLoader config');
    }

    // Log window.google structure
    logger.debug('window.google structure:', {
      hasGoogle: !!window.google,
      hasMaps: !!window.google?.maps,
      hasPlaces: !!window.google?.maps?.places,
    });
  }, [isLoaded]);

  /* ----------------------------------
     Context value
  ---------------------------------- */

  return (
    <GoogleMapsContext.Provider
      value={{
        isLoaded,
        loadError,
        mapInstance,
        setMapInstance,

        defaultCenter: LUANDA_CENTER,
        countryCode: 'AO',
        bounds: ANGOLA_BOUNDS,
      }}
    >
      {children}
    </GoogleMapsContext.Provider>
  );
}
