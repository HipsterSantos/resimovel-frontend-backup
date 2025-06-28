import React, { createContext, useReducer, useCallback, useContext, useMemo, useEffect } from 'react';
import { menus } from '../helpers/menus';
import { useJsApiLoader } from '@react-google-maps/api';
import Logger from '../helpers/logging';
import { Password } from '@mui/icons-material';

const libraries = ['places', 'drawing'];
const log = new Logger('state.store.context.jsx');

// Initial State
const initialState = {
  session: {
    isLoggedIn: false,
    user: null,
  },
  ui: {
    openLogin: false,
    openSignup: false,
    openCreateImovel: false,
  },
  menu: {
    divsToOpen: Array(menus.landingPage.filter(item => item.type === 'text' && item.submenus).length).fill(false),
  },
  searchBarFilter: {
    buy: false,
    sell: false,
    totalFound: 0,
    searchInput: '',
    typology: '',
    priceRange: [],
    houseType: '',
    openMap: false,
    location: { lat: null, lng: null },
    value: null,
    suggestions: [],
    details: {},
  },
  listHouse: {
    toBuy: false,
    toSell: false,
    all: true,
  },
  googleMapStatus: {
    isLoaded: false,
    loadError: null,
    mapInstance: null,
  },
  houses: [],
  trafficData: {
    visits: 0,
    totalRent: 0,
    countries: 0,
  },
  howTo: Array(4).fill({ title: '', description: '', image: '' }),
  history: [],
  future: [],
  modal:{
    login:{
      open:false
    },
    signup:{
      open:false
    },
    onBoarding:{
      open: true
    },
    passwordRecover:{
      open:false
    },
    createImovel:{
      open:false
    },
    searchingOnMap:{
      open:false
    }
  },
};

// Action Types
const ACTIONS = {
  UPDATE: 'UPDATE',
  RESET: 'RESET',
  UNDO: 'UNDO',
  REDO: 'REDO',
  SET_PROPERTY: 'SET_PROPERTY',
  UPDATE_TRAFFIC_DATA: 'UPDATE_TRAFFIC_DATA',
  SET_HOUSES: 'SET_HOUSES',
  SET_SESSION: 'SET_SESSION',
  SET_LOCATION: 'SET_LOCATION',
  SET_SUGGESTIONS: 'SET_SUGGESTIONS',
  SET_MAP_INSTANCE: 'SET_MAP_INSTANCE',
  UPDATE_SEARCH_DETAILS: 'UPDATE_SEARCH_DETAILS',
  SET_MODAL: 'SET_MODAL',
  TOGGLE_MODAL: 'TOGGLE_MODAL',
};

// Reducer
const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE:
      return {
        ...state,
        history: [...state.history, state],
        ...payload,
        future: [],
      };
    case ACTIONS.RESET:
      return initialState;
    case ACTIONS.UNDO:
      if (state.history.length === 0) return state;
      const previousState = state.history.pop();
      return {
        ...previousState,
        future: [state, ...state.future],
      };
    case ACTIONS.REDO:
      if (state.future.length === 0) return state;
      const nextState = state.future.shift();
      return {
        ...nextState,
        history: [...state.history, state],
      };
    case ACTIONS.SET_PROPERTY: {
      const { key, value } = payload;
      return {
        ...state,
        [key]: value,
      };
    }
    case ACTIONS.UPDATE_TRAFFIC_DATA: {
      return {
        ...state,
        trafficData: {
          ...state.trafficData,
          ...payload,
        },
      };
    }
    case ACTIONS.SET_HOUSES: {
      return {
        ...state,
        houses: payload,
      };
    }
    case ACTIONS.SET_SESSION: {
      return {
        ...state,
        session: payload,
      };
    }
    case ACTIONS.SET_LOCATION: {
      return {
        ...state,
        searchBarFilter: {
          ...state.searchBarFilter,
          location: payload,
        },
      };
    }
    case ACTIONS.SET_SUGGESTIONS: {
      return {
        ...state,
        searchBarFilter: {
          ...state.searchBarFilter,
          suggestions: payload,
        },
      };
    }
    case ACTIONS.SET_MAP_INSTANCE: {
      return {
        ...state,
        googleMapStatus: {
          ...state.googleMapStatus,
          ...payload,
        },
      };
    }
    case ACTIONS.UPDATE_SEARCH_DETAILS: {
      return {
        ...state,
        searchBarFilter: {
          ...state.searchBarFilter,
          details: payload,
        },
      };
    }
    case ACTIONS.UPDATE_SEARCH_INPUT: {
      return {
        ...state,
        searchBarFilter: {
          ...state.searchBarFilter,
          searchInput: payload,
        },
      };
    }
    case ACTIONS.SET_MODAL: {
      return {
        ...state,
        modal:{
          ...state.modal,
          ...payload
        }
      };
    }

    case ACTIONS.TOGGLE_MODAL: {
      const { modalName } = payload;
      // Close all modals
      const closedModals = Object.keys(state.modal).reduce((acc, key) => {
        acc[key] = { open: false };
        return acc;
      }, {});
      // Open the specified modal
      return {
        ...state,
        modal: {
          ...closedModals,
          [modalName]: { open: true },
        },
      };
    }

    default:
      console.warn(`Unhandled action type: ${type}`);
      return state;
  }
};

// Context
export const StoreContext = createContext(initialState);

// Store Provider
export default function StoreProvider({ children }) {
    const loaderOptions = useMemo(() => ({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY ||'AIzaSyAy5Ti-l_JVm2Iw4yKF1zhivOi98Vo69So',
        libraries,
        }), []);
    const { isLoaded, loadError } = useJsApiLoader(loaderOptions);
    log.info(`\n==isLoaded - ${isLoaded} loadError - ${loadError}`);
    const [state, dispatch] = useReducer(reducer, {
        ...initialState
    });

    useEffect(() => {
        if (isLoaded) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude: lat, longitude: lng } = position.coords;
              
              dispatch({
                type: ACTIONS.SET_LOCATION,
                payload: { lat, lng },
              });
    
              log.warning(` lat - ${lat} lng - ${lng}`);
    
              // Ensure window.google.maps is available
              const geocoder = new window.google.maps.Geocoder();
              dispatch({ type: 'SET_MAP_INSTANCE', payload: {
                mapInstance: window.google.maps,
                isLoaded,
                loadError,
              } });

              geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results[0]) {
                  const addressComponents = results[0].address_components;
                  const fullAddress = results[0].formatted_address;
    
                  const locationDetails = {
                    lat,
                    lng,
                    address: fullAddress,
                    city: getAddressComponent(addressComponents, 'locality'),
                    state: getAddressComponent(addressComponents, 'administrative_area_level_1'),
                    country: getAddressComponent(addressComponents, 'country'),
                  };
    
                  dispatch(setLocation(locationDetails));
                  log.info(` location-details - ${JSON.stringify(locationDetails)}`);
                } else {
                  console.error('Geocoder failed:', status);
                }
              });
            },
            (error) => console.error('Geolocation error:', error)
          );
        }
      }, [isLoaded]);
    
      const getAddressComponent = (components, type) =>
        components.find((component) => component.types.includes(type))?.long_name || '';
    
  const dispatchAsync = useCallback(async (asyncFunction) => {
    const result = await asyncFunction();
    dispatch({ type: ACTIONS.UPDATE, payload: result });
  }, []);

  const contextValue = useMemo(
    () => ({ state, dispatch, dispatchAsync }),
    [state, dispatch, dispatchAsync]
  );

  return (
    <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>
  );
}

// Custom Hook
export const useStore = () => useContext(StoreContext);

// Action Creators
export const updateState = (payload) => ({ type: ACTIONS.UPDATE, payload });
export const resetState = () => ({ type: ACTIONS.RESET });
export const undoState = () => ({ type: ACTIONS.UNDO });
export const redoState = () => ({ type: ACTIONS.REDO });
export const setProperty = (key, value) => ({ type: ACTIONS.SET_PROPERTY, payload: { key, value } });
export const updateTrafficData = (payload) => ({ type: ACTIONS.UPDATE_TRAFFIC_DATA, payload });
export const setHouses = (payload) => ({ type: ACTIONS.SET_HOUSES, payload });
export const setSession = (payload) => ({ type: ACTIONS.SET_SESSION, payload });
export const setLocation = (payload) => ({ type: ACTIONS.SET_LOCATION, payload });
export const setSuggestions = (payload) => ({ type: ACTIONS.SET_SUGGESTIONS, payload });
export const setMapInstance = (payload) => ({ type: ACTIONS.SET_MAP_INSTANCE, payload });
export const setDetails = (payload) => ({ type: ACTIONS.UPDATE_SEARCH_DETAILS, payload });
export const toggleModal = (modalName) => ({
  type: ACTIONS.TOGGLE_MODAL,
  payload: { modalName },
});