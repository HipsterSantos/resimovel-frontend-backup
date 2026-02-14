import React, {
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import styled from 'styled-components';
import ChevronIcon from '@mui/icons-material/ChevronRight';
import { Typography } from '@mui/material';

import { useStore } from '../../contexts/states.store.context';
import { GoogleMapsContext } from '../../contexts/google.map.context';
import { Logger } from '../../helpers/logging';

const logger = new Logger('GoogleMapDropdown');


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

export default function GoogleMapDropdown(props) {
  const {
    property,
    name,
    showTitle = true,
    positionTop,
    onSelect,
    width,
    leftIcon,
    rightIcon,
    type,
    placeholder,
  } = props;

  const { state, dispatch } = useStore();
  const { isLoaded, loadError } = useContext(GoogleMapsContext);

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [openPaper, setOpenPaper] = useState(false);

  const inputRef = useRef(null);
  const autoCompleteService = useRef(null);
  const placesService = useRef(null);

  /* ----------------------------------
     Init Google Places Services
  ---------------------------------- */

  useEffect(() => {
    if (!isLoaded) {
      logger.debug('Waiting for Google Maps to load...');
      return;
    }

    if (!window.google?.maps?.places) {
      logger.warn('Google Maps loaded, but Places library not ready yet');
      return;
    }

    if (!autoCompleteService.current) {
      autoCompleteService.current =
        new window.google.maps.places.AutocompleteService();

      placesService.current =
        new window.google.maps.places.PlacesService(
          document.createElement('div')
        );

      logger.info('Google Places services initialized');
    }
  }, [isLoaded]);

  /* ----------------------------------
     Input change
  ---------------------------------- */

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    dispatch({ type: 'UPDATE_SEARCH_INPUT', payload: value });

    if (!value || !autoCompleteService.current) {
      setSuggestions([]);
      setOpenPaper(false);
      return;
    }

    autoCompleteService.current.getPlacePredictions(
      {
        input: value,
        types: ['geocode'],
      },
      (predictions, status) => {
        if (
          status ===
          window.google.maps.places.PlacesServiceStatus.OK
        ) {
          setSuggestions(predictions);
          setOpenPaper(true);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  /* ----------------------------------
     Select suggestion
  ---------------------------------- */

  const handleSelectSuggestion = (suggestion) => {
    setSearch(suggestion.description);
    setOpenPaper(false);

    dispatch({
      type: 'UPDATE_SEARCH_INPUT',
      payload: suggestion.description,
    });

    onSelect?.({
      target: { value: suggestion },
    });

    placesService.current?.getDetails(
      { placeId: suggestion.place_id },
      (result, status) => {
        if (
          status ===
          window.google.maps.places.PlacesServiceStatus.OK
        ) {
          dispatch({
            type: 'UPDATE_SEARCH_DETAILS',
            payload: result,
          });
          logger.debug('Place details loaded', result);
        }
      }
    );
  };

  /* ============================
     Render
  ============================ */

  return (
    <ModerInputContainer width={width}>
      {showTitle && <FieldName>{property}</FieldName>}

      <ModerInput>
        <Icon>{leftIcon}</Icon>

        <Input
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          value={search || state.searchBarFilter.searchInput || ''}
          onChange={handleInputChange}
          disabled={!isLoaded || !!loadError}
        />

        <Icon onClick={() => setOpenPaper(false)}>
          {rightIcon || <ChevronIcon />}
        </Icon>
      </ModerInput>

      {openPaper && (
        <Paper positionTop={positionTop}>
          {suggestions.map((s, i) => (
            <Typography key={i} onClick={() => handleSelectSuggestion(s)}>
              {s.description}
            </Typography>
          ))}
        </Paper>
      )}
    </ModerInputContainer>
  );
}