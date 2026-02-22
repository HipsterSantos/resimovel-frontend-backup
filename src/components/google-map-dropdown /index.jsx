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
  top: ${(props) => props.positionTop ?? '100%'};
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

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

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

  const autoCompleteService = useRef(null);
  const placesService = useRef(null);

  /* ============================
     MAPS + PLACES BOOTSTRAP
  ============================ */

  useEffect(() => {
    logger.info('Maps context state', { isLoaded, loadError });

    if (loadError) {
      logger.error('Google Maps loadError', loadError);
      return;
    }

    if (!isLoaded) {
      logger.debug('⏳ Waiting for Google Maps script...');
      return;
    }

    if (!window.google) {
      logger.error('❌ window.google is missing');
      return;
    }

    if (!window.google.maps) {
      logger.error('❌ window.google.maps is missing');
      return;
    }

    if (!window.google.maps.places) {
      logger.error(
        '❌ Places library missing — check libraries:["places"]'
      );
      return;
    }

    logger.info('✅ Google Maps + Places available');

    if (!autoCompleteService.current) {
      autoCompleteService.current =
        new window.google.maps.places.AutocompleteService();

      placesService.current =
        new window.google.maps.places.PlacesService(
          document.createElement('div')
        );

      logger.success?.('✅ Places services initialized')
        ?? logger.info('Places services initialized');
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

    logger.debug('User input', value);

    if (!value.trim()) {
      setSuggestions([]);
      setOpenPaper(false);
      logger.debug('Input empty → cleared suggestions');
      return;
    }

    if (!autoCompleteService.current) {
      logger.error('❌ AutocompleteService not initialized');
      return;
    }

    const request = {
      input: value,
      types: ['geocode'],
      componentRestrictions: { country: 'AO' },
    };

    logger.debug('Autocomplete request payload', request);

    autoCompleteService.current.getPlacePredictions(
      request,
      (predictions, status) => {
        logger.debug('Autocomplete response', {
          status,
          predictionsCount: predictions?.length,
        });

        if (status === 'OK' && predictions?.length) {
          setSuggestions(predictions);
          setOpenPaper(true);
        } else {
          setSuggestions([]);
          setOpenPaper(false);

          logger.error('Autocomplete failed', {
            status,
            meaning: window.google.maps.places.PlacesServiceStatus[status],
          });
        }
      }
    );
  };

  /* ============================
     SELECT HANDLER
  ============================ */

  const handleSelectSuggestion = (suggestion) => {
    logger.info('Suggestion selected', suggestion);

    setSearch(suggestion.description);
    setOpenPaper(false);

    dispatch({
      type: 'UPDATE_SEARCH_INPUT',
      payload: suggestion.description,
    });

    onSelect?.({ target: { value: suggestion } });

    placesService.current?.getDetails(
      { placeId: suggestion.place_id },
      (result, status) => {
        logger.debug('Place details response', { status, result });

        if (status === 'OK') {
          dispatch({
            type: 'UPDATE_SEARCH_DETAILS',
            payload: result,
          });
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
        <FieldName hasError={error}>
          {property}
          {required && <span style={{ color: '#FF6B6B' }}>*</span>}
        </FieldName>
      )}

      <ModerInput hasError={error}>
        <Icon>{leftIcon}</Icon>

        <Input
          type={type}
          placeholder={placeholder}
          value={search || state.searchBarFilter?.searchInput || value || ''}
          onChange={handleInputChange}
          disabled={!isLoaded || !!loadError}
        />

        <Icon>{rightIcon || <ChevronIcon />}</Icon>
      </ModerInput>

      {error && helperText && (
        <ErrorMessage>{helperText}</ErrorMessage>
      )}

      {openPaper && (
        <Paper positionTop={positionTop || 'calc(100% + 0.5em)'}>
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
            <SuggestionItem variant="body2" sx={{ textAlign: 'center', color: '#999' }}>
              Nenhuma sugestão encontrada
            </SuggestionItem>
          )}
        </Paper>
      )}
    </ModerInputContainer>
  );
}