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
  background: #f7f8fa;
  padding: 0 0.8em;
  border-radius: 0.4em;
`;

const Input = styled.input`
  font-family: gotham-light;
  width: 100%;
  outline: none;
  background: transparent;
  height: inherit;
  border: none;
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
`;

const Paper = styled.div`
  width: 100%;
  display: block;
  position: absolute;
  top: ${(props) => props.positionTop ?? 0};
  box-shadow: 1px 23px 30px rgba(0, 0, 0, 0.3);
  overflow-x: hidden;
  border-radius: 0.7em;
  max-height: 30vh;
  line-height: 1.6;
  z-index: 800;
  background: white;
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
      {showTitle && <FieldName>{property}</FieldName>}

      <ModerInput>
        <Icon>{leftIcon}</Icon>

        <Input
          type={type}
          placeholder={placeholder}
          value={search || state.searchBarFilter.searchInput || ''}
          onChange={handleInputChange}
          disabled={!isLoaded || !!loadError}
        />

        <Icon>{rightIcon || <ChevronIcon />}</Icon>
      </ModerInput>

      {openPaper && (
        <Paper positionTop={positionTop}>
          {suggestions.map((s, i) => (
            <Typography
              key={i}
              onClick={() => handleSelectSuggestion(s)}
            >
              {s.description}
            </Typography>
          ))}
        </Paper>
      )}
    </ModerInputContainer>
  );
}