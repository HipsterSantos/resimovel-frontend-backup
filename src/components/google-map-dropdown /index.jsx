import React, {useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ChevronIcon from '@mui/icons-material/ChevronRight';
import { Typography } from '@mui/material';

import { useStore } from '../../contexts/states.store.context';

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

export default function GoogleMapDropdown({
  property,
  name,
  showTitle = true,
  value = '',
  positionTop,
  onSelect,
  data = [],
  autoComplete = true,
  width,
  leftIcon,
  rightIcon,
  type,
  placeholder,
}) {
  const { state, dispatch } = useStore();
  const { isLoaded } = state.googleMapStatus;
  const { searchBarFilter } = state;
  const [search,setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([]);
  const [openPaper, setOpenPaper] = useState(false);
  const [country, setCountry] = useState('AO');
  const [details, setDetails] = useState(null);

  const inputRef = useRef(null);
  const autoCompleteService = useRef(null);
  const placeService = useRef(null);
  console.log('\n=isloaded', isLoaded)
  console.log('\n=state', state)
  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autoCompleteService.current = new window.google.maps.places.AutocompleteService();
      placeService.current = new window.google.maps.places.PlacesService(document.createElement('div'));
      getCurrentLocation();
      // debugger
    }
  }, [isLoaded]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAy5Ti-l_JVm2Iw4yKF1zhivOi98Vo69So`)
            .then(response => response.json())
            .then(data => {
              const countryComponent = data.results[0].address_components.find(component => component.types.includes('country'));
              setCountry(countryComponent ? countryComponent.short_name : 'AO');
            })
            .catch(() => {
              setCountry('AO');
            });
        },
        () => {
          setCountry('AO');
        }
      );
    } else {
      setCountry('AO');
    }
  };

  const handleInputChange = (event) => {
    const input = event.target.value;
    setSearch(input)
    dispatch({ type: 'UPDATE_SEARCH_INPUT', payload: input });

    if (input === '') {
      setOpenPaper(false);
      setSuggestions([]);
      return;
    }

    if (autoCompleteService.current) {
      autoCompleteService.current.getPlacePredictions(
        {
          input,
          componentRestrictions: { country },
          types: ['geocode'],
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(predictions);
            setOpenPaper(true);
            // debugger
          } else {
            setSuggestions([]);
          }
        }
      );
    }
  };

  const handleSelectSuggestion = (suggestion) => {

    dispatch({ type: 'UPDATE_SEARCH_INPUT', payload: suggestion.description });
    setOpenPaper(false);

    if (onSelect) {
      onSelect({
        target: {
          value: suggestion,
        },
      });
      // debugger
    }
    if (placeService.current) {
      placeService.current.getDetails({ placeId: suggestion.place_id }, (result, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setDetails(result);
          dispatch({ type: 'UPDATE_SEARCH_DETAILS', payload: result });
        }
      });
      debugger
    }
  };

  return (
    <ModerInputContainer className={`modern-input-${name}`} width={width}>
      {showTitle && <FieldName>{property}</FieldName>}
      <ModerInput>
        <Icon>{leftIcon}</Icon>
        <Input
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          value={search || searchBarFilter.searchInput || ''}
          onChange={handleInputChange}
        />
        <Icon
          onClick={() => {
            setOpenPaper(!openPaper);
            if (rightIcon) {
              dispatch({ type: 'UPDATE_SEARCH_INPUT', payload: '' });
            }
          }}
        >
          {rightIcon || <ChevronIcon color="#A7A7AF" />}
        </Icon>
      </ModerInput>
      <Paper className="dropdown-paper-body" positionTop={positionTop} style={{ display: openPaper ? 'block' : 'none' }}>
        {suggestions.map((suggestion, index) => (
          <Typography
            key={index}
            className="houseOption"
            onClick={() => handleSelectSuggestion(suggestion)}
          >
            {suggestion.description}
          </Typography>
        ))}
      </Paper>
    </ModerInputContainer>
  );
}
