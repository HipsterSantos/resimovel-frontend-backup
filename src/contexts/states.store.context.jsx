import React, {
  createContext,
  useReducer,
  useCallback,
  useContext,
  useMemo,
  useEffect
} from 'react';
import { menus } from '../helpers/menus';
import Logger from '../helpers/logging';
import { GoogleMapsContext } from '../contexts/google.map.context'; // ✅ CONSUME, NOT LOAD

const log = new Logger('state.store.context.jsx');
const MAX_HISTORY = 20;

/* ============================
   Initial State
============================ */

const initialState = {

    createImovelDraft: {
    step: 0,
    // Step 1
    houseType: null,
    houseTraitType: null,
    businessType: 'venda',

    fullAddress: '',
    street: '',
    houseNumber: '',
    zipCode: '',
    location: { lat: null, lng: null },

    // Step 2+
    name: '',
    phone: '',
    contactPreference: 'phone,email,sms',

    // Step 3
    houseStatus: [],
    otherTraits: [],
    // area:null,
    area: {
      built: '',
      usable: '',
      gross: '',
    },
    price: '',
    description:'',

    // Step 4+
    media: {
      photos: [],
      videos: [],
      licenseId: '',
    },

    // Step 5
    plan: null,
  },

  session: {
    isLoggedIn: false,
    user: null,
    token: null,
  },

  ui: {
    openLogin: false,
    openSignup: false,
    openCreateImovel: false,
  },

  menu: {
    divsToOpen: Array(
      menus.landingPage.filter(item => item.type === 'text' && item.submenus).length
    ).fill(false),
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

  modal: {
    login: { open: false },
    signup: { open: false },
    onBoarding: { open: true },
    passwordRecover: { open: false },
    createImovel: { open: false },
    searchingOnMap: { open: false },
  },

  history: [],
  future: [],
};

/* ============================
   Action Types
============================ */

const ACTIONS = {
  UPDATE: 'UPDATE',
  RESET: 'RESET',
  UNDO: 'UNDO',
  REDO: 'REDO',
  LOGOUT: 'LOGOUT',

  SET_PROPERTY: 'SET_PROPERTY',
  SET_HOUSES: 'SET_HOUSES',
  SET_SESSION: 'SET_SESSION',
  SET_LOCATION: 'SET_LOCATION',
  SET_SUGGESTIONS: 'SET_SUGGESTIONS',
  SET_MAP_INSTANCE: 'SET_MAP_INSTANCE',
  SET_MODAL: 'SET_MODAL',
  //new ones
  SET_CREATE_IMOVEL_FIELD: 'SET_CREATE_IMOVEL_FIELD',
  SET_CREATE_IMOVEL_STEP: 'SET_CREATE_IMOVEL_STEP',
  
  UPDATE_TRAFFIC_DATA: 'UPDATE_TRAFFIC_DATA',
  UPDATE_SEARCH_DETAILS: 'UPDATE_SEARCH_DETAILS',
  UPDATE_SEARCH_INPUT: 'UPDATE_SEARCH_INPUT',
  UPDATE_CREATE_IMOVEL: 'UPDATE_CREATE_IMOVEL',

  TOGGLE_MODAL: 'TOGGLE_MODAL',
};

/* ============================
   Reducer (PURE)
============================ */

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE:
      return {
        ...state,
        history: [...state.history, state].slice(-MAX_HISTORY),
        future: [],
        ...payload,
      };

    case ACTIONS.RESET:
      return initialState;

    case ACTIONS.UNDO: {
      if (!state.history.length) return state;
      const previous = state.history[state.history.length - 1];
      return {
        ...previous,
        history: state.history.slice(0, -1),
        future: [state, ...state.future],
      };
    }

    case ACTIONS.REDO: {
      if (!state.future.length) return state;
      const [next, ...restFuture] = state.future;
      return {
        ...next,
        history: [...state.history, state],
        future: restFuture,
      };
    }

    case ACTIONS.SET_PROPERTY:
      return {
        ...state,
        [payload.key]: {
          ...state[payload.key],
          ...payload.value,
        },
      };
      //update create imovel draft 

      case ACTIONS.SET_CREATE_IMOVEL_FIELD:
        return {
          ...state,
          createImovelDraft: {
            ...state.createImovelDraft,
            [payload.field]: payload.value,
          },
        };

      case ACTIONS.SET_CREATE_IMOVEL_STEP:
        return {
          ...state,
          createImovelDraft: {
            ...state.createImovelDraft,
            step: payload,
          },
        };

      case ACTIONS.UPDATE_CREATE_IMOVEL:
        return {
          ...state,
          createImovelDraft: {
            ...state.createImovelDraft,
            ...payload,
          },
        };

    case ACTIONS.UPDATE_TRAFFIC_DATA:
      return {
        ...state,
        trafficData: { ...state.trafficData, ...payload },
      };

    case ACTIONS.SET_HOUSES:
      return { ...state, houses: payload };

    case ACTIONS.SET_SESSION:
      return {
        ...state,
        session: {
          isLoggedIn: !!payload.token,
          user: payload.user ?? null,
          token: payload.token ?? null,
        },
      };

    case ACTIONS.LOGOUT:
      return {
        ...state,
        session: { isLoggedIn: false, user: null, token: null },
      };

    case ACTIONS.SET_LOCATION:
      return {
        ...state,
        searchBarFilter: {
          ...state.searchBarFilter,
          location: payload,
        },
      };

    case ACTIONS.SET_SUGGESTIONS:
      return {
        ...state,
        searchBarFilter: {
          ...state.searchBarFilter,
          suggestions: payload,
        },
      };

    case ACTIONS.SET_MAP_INSTANCE:
      return {
        ...state,
        googleMapStatus: {
          ...state.googleMapStatus,
          ...payload,
        },
      };

    case ACTIONS.UPDATE_SEARCH_DETAILS:
      return {
        ...state,
        searchBarFilter: {
          ...state.searchBarFilter,
          details: payload,
        },
      };

    case ACTIONS.UPDATE_SEARCH_INPUT:
      return {
        ...state,
        searchBarFilter: {
          ...state.searchBarFilter,
          searchInput: payload,
        },
      };

    case ACTIONS.SET_MODAL:
      return {
        ...state,
        modal: { ...state.modal, ...payload },
      };

    case ACTIONS.TOGGLE_MODAL: {
      const closed = Object.keys(state.modal).reduce((acc, key) => {
        acc[key] = { open: false };
        return acc;
      }, {});
      return {
        ...state,
        modal: { ...closed, [payload.modalName]: { open: true } },
      };
    }

    default:
      return state;
  }
};

/* ============================
   Context
============================ */

export const StoreContext = createContext(null);

/* ============================
   Provider
============================ */

export default function StoreProvider({ children }) {
  const { isLoaded, loadError, mapInstance } = useContext(GoogleMapsContext); // ✅ SAFE
  const [state, dispatch] = useReducer(reducer, initialState);

  /* Restore session on app boot */
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('authUser');
    if (token) {
      let user = null;
      try {
        user = userStr ? JSON.parse(userStr) : null;
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
      dispatch({
        type: ACTIONS.SET_SESSION,
        payload: { token, user },
      });
    }
  }, []);

  /* React to Google Maps availability */
  useEffect(() => {
    if (!isLoaded || !mapInstance) return;

    dispatch({
      type: ACTIONS.SET_MAP_INSTANCE,
      payload: { isLoaded, loadError, mapInstance },
    });

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        dispatch({
          type: ACTIONS.SET_LOCATION,
          payload: { lat: coords.latitude, lng: coords.longitude },
        });
        log.info(`Location loaded: ${coords.latitude}, ${coords.longitude}`);
      },
      err => console.error(err)
    );
  }, [isLoaded, loadError, mapInstance]);

  const dispatchAsync = useCallback(async (asyncFn, onError) => {
    try {
      const result = await asyncFn();
      dispatch({ type: ACTIONS.UPDATE, payload: result });
    } catch (err) {
      onError?.(err);
      console.error(err);
    }
  }, []);

  const contextValue = useMemo(
    () => ({ state, dispatch, dispatchAsync }),
    [state, dispatch, dispatchAsync]
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}

/* ============================
   Hooks & Actions
============================ */

export const useStore = () => useContext(StoreContext);

export const updateState = payload => ({ type: ACTIONS.UPDATE, payload });
export const resetState = () => ({ type: ACTIONS.RESET });
export const undoState = () => ({ type: ACTIONS.UNDO });
export const redoState = () => ({ type: ACTIONS.REDO });

export const setProperty = (key, value) => ({
  type: ACTIONS.SET_PROPERTY,
  payload: { key, value },
});

export const updateTrafficData = payload => ({
  type: ACTIONS.UPDATE_TRAFFIC_DATA,
  payload,
});

export const setHouses = payload => ({
  type: ACTIONS.SET_HOUSES,
  payload,
});

export const setSession = payload => {
  localStorage.setItem('authToken', payload.token);
  if (payload.user) {
    localStorage.setItem('authUser', JSON.stringify(payload.user));
  }
  return { type: ACTIONS.SET_SESSION, payload };
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  return { type: ACTIONS.LOGOUT };
};

export const setLocation = payload => ({
  type: ACTIONS.SET_LOCATION,
  payload,
});

export const setSuggestions = payload => ({
  type: ACTIONS.SET_SUGGESTIONS,
  payload,
});

export const setMapInstance = payload => ({
  type: ACTIONS.SET_MAP_INSTANCE,
  payload,
});

export const setDetails = payload => ({
  type: ACTIONS.UPDATE_SEARCH_DETAILS,
  payload,
});

export const toggleModal = modalName => ({
  type: ACTIONS.TOGGLE_MODAL,
  payload: { modalName },
});

// update create imovel draft
export const updateCreateImovel = payload => ({
  type: ACTIONS.UPDATE_CREATE_IMOVEL,
  payload,
});

export const setCreateImovelField = (field, value) => ({
  type: ACTIONS.SET_CREATE_IMOVEL_FIELD,
  payload: { field, value },
});

export const setCreateImovelStep = step => ({
  type: ACTIONS.SET_CREATE_IMOVEL_STEP,
  payload: step,
});
