// GoogleMapProvider.jsx
import React, { useState, useEffect, createContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places', 'drawing'];

export const GoogleMapsContext = createContext({
  isLoaded: false,
  loadError: null,
  mapInstance: null,
});

export default function GoogleMapProvider({ children }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const [mapInstance, setMapInstance] = useState(null);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, mapInstance, setMapInstance }}>
      {children}
    </GoogleMapsContext.Provider>
  );
}
