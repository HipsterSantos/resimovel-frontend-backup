import React, {useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ChevronIcon from '@mui/icons-material/ChevronRight';
import { Typography } from '@mui/material';

import { useStore } from '../../contexts/states.store.context';
import { GoogleMapsContext } from '../../contexts/google.map.context';
import Logger from '../../helpers/logging';

const ModerInputContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  margin-bottom: 1em;
  width: ${(props) => props.width + '%' ?? '100%'};
`;

const ModerInput = styled.div`
  display: flex;
  height: 6.5vh;
  background: ${(props) => props.hasError ? '#FFF5F5' : '#f7f8fa'};
  padding: 0 0.8em;
  border-radius: 0.4em;
  border: ${(props) => props.hasError ? '1px solid #FF6B6B' : 'none'};
  transition: all 0.2s ease;
`;

const Input = styled.input`
  font-family: gotham-light;
  width: 100%;
  outline: none;
  background: transparent;
  height: inherit;
  border: none;
  padding: 0 0.4em;
  
  &::placeholder {
    color: #a7a7af;
  }
`;

const Icon = styled.span`
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  scale: 0.6;
  color: #a7a7af;
  cursor: pointer;
`;

const FieldName = styled.p`
  margin-bottom: 0.8em;
  font-size: 0.8rem;
  text-indent: 0.4em;
  font-family: gotham-medium;
  color: ${(props) => props.hasError ? '#FF6B6B' : 'inherit'};
`;

const ErrorMessage = styled.p`
  margin-top: 0.4em;
  margin-bottom: 0;
  font-size: 0.75rem;
  color: #FF6B6B;
  text-indent: 0.4em;
  font-family: gotham-light;
`;

const SuggestionItem = styled(Typography)`
  padding: 1em 1.2em !important;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.15s ease;
  
  &:hover {
    background-color: #f7f8fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Paper = styled.div`
  width: 100%;
  display: block;
  position: absolute;
  top: ${(props) => props.positionTop ?? '4'} em;
  left: 0;
  right: 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 0.7em;
  max-height: 40vh;
  line-height: 1.6;
  z-index: 1000;
  background: white;
  border: 1px solid #e0e0e0;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
    
    &:hover {
      background: #555;
    }
  }
`;

const logger = new Logger('GoogleMapDropdown.jsx');

export default function GoogleMapDropdown({
  property,
  showTitle = true,
  positionTop,
  onSelect,
  width,
  leftIcon,
  rightIcon,
  type,
  placeholder,
  error = false,
  helperText = '',
  required = false,
  value = '',
}) {
  const { state, dispatch } = useStore();
  const { isLoaded, loadError } = useContext(GoogleMapsContext);

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [openPaper, setOpenPaper] = useState(false);
  const [apiError, setApiError] = useState(null);

  const autoCompleteService = useRef(null);
  const placesService = useRef(null);
  const sessionToken = useRef(null);

  // Log component mount and API key status
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;
    const keyStatus = apiKey 
      ? `✅ Key loaded (${apiKey.substring(0, 10)}...)` 
      : '❌ Key NOT found';
    
    logger.info('GoogleMapDropdown Mounted', {
      hasApiKey: !!apiKey,
      contextIsLoaded: isLoaded,
      contextLoadError: loadError,
      message: keyStatus
    });

    return () => {
      logger.debug('GoogleMapDropdown Unmounted');
    };
  }, [isLoaded, loadError]);

  /* ============================
     MAPS + PLACES BOOTSTRAP
  ============================ */

  useEffect(() => {
    logger.info('Maps context state', { isLoaded, loadError });

    if (loadError) {
      const errorMsg = `Google Maps Load Error: ${loadError.message || JSON.stringify(loadError)}`;
      logger.error('Google Maps loadError', { error: loadError, message: errorMsg });
      setApiError(errorMsg);
      return;
    }

    if (!isLoaded) {
      logger.debug('⏳ Waiting for Google Maps script...');
      setApiError(null);
      return;
    }

    // Check all required APIs
    const checks = {
      'window.google': !!window.google,
      'window.google.maps': !!window.google?.maps,
      'window.google.maps.places': !!window.google?.maps?.places,
      'AutocompleteService': !!window.google?.maps?.places?.AutocompleteService,
      'PlacesService': !!window.google?.maps?.places?.PlacesService,
    };

    const allChecksPass = Object.values(checks).every(v => v);

    logger.debug('API availability checks', checks);

    if (!allChecksPass) {
      Object.entries(checks).forEach(([name, available]) => {
        if (!available) {
          logger.error(`❌ ${name} is missing`);
        }
      });
      setApiError('Google Maps Places API not fully loaded');
      return;
    }

    logger.info('✅ Google Maps + Places fully available');

    if (!autoCompleteService.current) {
      try {
        autoCompleteService.current =
          new window.google.maps.places.AutocompleteService();

        placesService.current =
          new window.google.maps.places.PlacesService(
            document.createElement('div')
          );

        // Generate session token for better performance
        if (window.google.maps.places.AutocompleteSessionToken) {
          sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
          logger.debug('✅ Session token created for Places API');
        }

        logger.success('✅ Places services initialized');
        setApiError(null);
      } catch (err) {
        logger.error('Failed to initialize Places services', { error: err.message, stack: err.stack });
        setApiError(`Initialization failed: ${err.message}`);
      }
    }
  }, [isLoaded, loadError]);

  /* ============================
     INPUT HANDLER
  ============================ */

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearch(value);

    dispatch({
      type: 'UPDATE_SEARCH_INPUT',
      payload: value,
    });

    logger.debug('User input', { input: value, length: value.length });

    if (!value.trim()) {
      setSuggestions([]);
      setOpenPaper(false);
      logger.debug('Input empty → cleared suggestions');
      return;
    }

    if (!autoCompleteService.current) {
      const errorMsg = 'AutocompleteService not initialized - Google Maps may not have loaded properly';
      logger.error(errorMsg, {
        serviceExists: !!autoCompleteService.current,
        isLoaded,
        loadError,
        apiError
      });
      setApiError(errorMsg);
      return;
    }

    // Build request with session token
    const request = {
      input: value,
      types: ['geocode'],
      componentRestrictions: { country: 'AO' },
      sessionToken: sessionToken.current,
    };

    logger.debug('Autocomplete request', request);

    try {
      autoCompleteService.current.getPlacePredictions(
        request,
        (predictions, status) => {
          // Get human-readable status name
          const statusName = window.google?.maps?.places?.PlacesServiceStatus?.[status] || 'UNKNOWN_STATUS';
          
          logger.debug('Autocomplete callback received', {
            status,
            statusName,
            predictionsCount: predictions?.length || 0,
          });

          // Check different status codes
          if (status === 'OK' && predictions && predictions.length > 0) {
            logger.debug('✅ Predictions received successfully', { 
              count: predictions.length,
              firstPrediction: predictions[0]?.description
            });
            setSuggestions(predictions);
            setOpenPaper(true);
            setApiError(null);
          } else if (status === 'ZERO_RESULTS') {
            logger.debug('No results found for input', { input: value });
            setSuggestions([]);
            // Keep paper open to show "Nenhuma sugestão encontrada"
            setOpenPaper(true);
            setApiError(null);
          } else {
            // Map status codes to human-readable messages
            const statusMessages = {
              'INVALID_REQUEST': 'Invalid search request - please check your input',
              'NOT_OK': 'API request failed',
              'OVER_QUERY_LIMIT': 'Too many requests - please try again in a moment',
              'REQUEST_DENIED': 'API Key error - please contact support',
              'UNKNOWN_ERROR': 'An unexpected error occurred',
            };

            const errorMsg = statusMessages[status] || `API Error (${status})`;
            
            logger.error('❌ Autocomplete failed', {
              status,
              statusName,
              message: errorMsg,
              request: {
                ...request,
                sessionToken: sessionToken.current ? 'present' : 'missing'
              }
            });
            
            setSuggestions([]);
            setOpenPaper(false);
            setApiError(`Search failed: ${errorMsg}`);

            // If request was denied, it might be an API key issue
            if (status === 'REQUEST_DENIED') {
              logger.critical('API Key Issue Detected', {
                apiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY ? 'present' : 'missing',
                message: 'Please ensure the Google Maps API key is valid and has Places API enabled'
              });
            }
          }
        }
      );
    } catch (err) {
      logger.error('🚨 Exception in getPlacePredictions', {
        error: err.message,
        stack: err.stack,
        name: err.name,
      });
      setSuggestions([]);
      setOpenPaper(false);
      setApiError(`Error: ${err.message}`);
    }
  };

  /* ============================
     SELECT HANDLER
  ============================ */

  const handleSelectSuggestion = (suggestion) => {
    logger.info('Suggestion selected', { description: suggestion.description, placeId: suggestion.place_id });

    setSearch(suggestion.description);
    setOpenPaper(false);

    dispatch({
      type: 'UPDATE_SEARCH_INPUT',
      payload: suggestion.description,
    });

    onSelect?.({ target: { value: suggestion } });

    if (!placesService.current) {
      logger.warn('PlacesService not available for place details');
      return;
    }

    placesService.current?.getDetails(
      { 
        placeId: suggestion.place_id,
        sessionToken: sessionToken.current,
        fields: ['geometry', 'formatted_address', 'name', 'place_id']
      },
      (result, status) => {
        logger.debug('Place details response', { 
          status,
          hasGeometry: !!result?.geometry,
          address: result?.formatted_address
        });

        if (status === 'OK') {
          dispatch({
            type: 'UPDATE_SEARCH_DETAILS',
            payload: result,
          });
          
          // Generate new session token after first request
          if (window.google?.maps?.places?.AutocompleteSessionToken) {
            sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
          }
        } else {
          logger.warn('Place details request failed', { status });
        }
      }
    );
  };

  /* ============================
     RENDER
  ============================ */

  return (
    <ModerInputContainer width={width}>
      {showTitle && (
        <FieldName hasError={error || !!apiError}>
          {property}
          {required && <span style={{ color: '#FF6B6B' }}>*</span>}
        </FieldName>
      )}

      <ModerInput hasError={error || !!apiError}>
        <Icon>{leftIcon}</Icon>

        <Input
          type={type}
          placeholder={placeholder}
          value={search || state.searchBarFilter?.searchInput || value || ''}
          onChange={handleInputChange}
          disabled={!isLoaded || !!loadError || !!apiError}
          title={apiError ? `API Error: ${apiError}` : 'Search for a location'}
        />

        <Icon>{rightIcon || <ChevronIcon />}</Icon>
      </ModerInput>

      {(error || apiError) && (
        <ErrorMessage>{error ? helperText : apiError}</ErrorMessage>
      )}

      {openPaper && !apiError && (
        <Paper positionTop={positionTop ||'4em'}>
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <SuggestionItem
                key={i}
                onClick={() => handleSelectSuggestion(s)}
                variant="body2"
              >
                {s.description}
              </SuggestionItem>
            ))
          ) : (
            <SuggestionItem variant="body2" sx={{ textAlign: 'center', color: '#999', cursor: 'default' }}>
              Nenhuma sugestão encontrada
            </SuggestionItem>
          )}
        </Paper>
      )}

      {apiError && (
        <Typography sx={{ 
          fontSize: '0.75rem', 
          color: '#FF6B6B', 
          textIndent: '0.4em',
          marginTop: '0.4em'
        }}>
          ⚠️ {apiError}
        </Typography>
      )}
    </ModerInputContainer>
  );
}