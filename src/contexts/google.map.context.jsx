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

  const loaderOptions = useMemo(
    () => ({
      id: 'script-loader',
      googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
      libraries,
      version: 'weekly',
      region: 'AO',   // 🇦🇴 Bias map tiles
      language: 'pt', // Portuguese labels
    }),
    []
  );

  logger.debug('Initializing Google Maps loader', loaderOptions);

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
    } else {
      logger.warn('⚠️ Places API not available yet');
    }
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
