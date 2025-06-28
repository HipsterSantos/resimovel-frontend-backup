import React,{useState,useEffect, lazy} from 'react';
import { Box, Button, TextField, Typography } from '@mui/material'
import styled from 'styled-components'
import './style.scss'
import BuyOrRentButton from '../buy-or-rent-button';
import Search from '@svg/search';
import StoreSolid from '@svg/store.solid';
import PoundSolid from '@svg/pound';
import Close from '@svg/close';
import MapMarkerSolid from '@svg/map-marker';
import { Link,useNavigate } from 'react-router-dom';
import CustomInput from '../custom-input';
import CustomDropdown from '../custom-dropdown';
import GoogleMapDropdown from '../google-map-dropdown ';
import { useStore } from '../../contexts/states.store.context';


const DrawInMap = lazy( ()=> import('../../forms/DrawInMap'))
const SearbarContainer = styled.div`    
    display:flex;
    flex-direction: column;
    
`;
const HouseLocation = styled.div`
    display: flex;
    height: 6vh;
    margin-top: 1em;
`;
const HouseTraits = styled.div`
    display: flex;
    margin-top: 1em;
    justify-content: space-between;
    & > * div{
        margin-right: .5em;
    }
`;

const SearchButton = styled.div`
    margin-left: 1em;
    text-align: center;
    padding: 0.75em 0.8em;
    margin-top: auto;
    margin-bottom: auto;
    width: inherit;
    border-radius: 13%;
    background: #D9F070;
    justify-self: center;
    display: flex;
    flex-direction: column;
    cursor: pointer;

`;



const typeOfImoveis = [
    {
      name: 'casas_apartamento',
      label: 'Casas e apartamentos',
      types: [
        'Apartamento',
        'Casas e moradias',
        'Quintas e casas rústicas',
        'Duplex',
        'Penthouses',
        'Casas e moradias',
        'Quintas e casas rústicas',
        'Duplex',
        'Penthouses',
        'Casas e moradias',
        'Quintas e casas rústicas',
        'Duplex',
        'Penthouses',
        'Casas e moradias',
        'Quintas e casas rústicas',
        'Duplex',
        'Penthouses',
      ]
    },
    {
      name: 'escritiorios',
      label: 'Escritórios'
    },
    {
      name: 'escritiorios',
      label: 'Escritórios'
    },
    {
      name: 'escritiorios',
      label: 'Escritórios'
    },
    {
      name: 'escritiorios',
      label: 'Escritórios'
    },
    {
      name: 'escritiorios',
      label: 'Escritórios'
    },
    {
      name: 'escritiorios',
      label: 'Escritórios'
    },
    {
      name: 'espaços_comercias',
      label: 'Espaços comerciais ou Armazéns',
      type: [
        'Espaço comercial',
        'Armazén',
        'Hotelaria'
      ]
    },
    {
      name: 'Garagens',
      label: 'Garagens',
      type: []
    }
  ]


const SearchBar = styled.div``;
export default function SearchBarComponent(props){
  const { state, dispatch } = useStore();  
  const [searchString, setSearchString] = useState();
  const [[buyHouse,rentHouse],setBuyOrRent] = useState([true,false])
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [houseType, setHouseType] = useState('');
  const [price, setPrice] = useState('');
  const [tipology,setTipology] = useState('');
  
  //handlers
  const handleOpen = () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { modalName: 'searchingOnMap' }
  });
  }
  const handleClose = () => {
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { modalName: null }, // Close all modals
  });
  }
  const onSelectOperation = () => setBuyOrRent(([r, b]) => [b, r]);

  const handleSearch = () => {
    // Determine operation type: 'comprar' or 'arrendar'
    const operation = buyHouse ? 'comprar' : 'arrendar';

    // Construct the dynamic URL based on user inputs
    let searchPath = `/imovel/${operation}`;

    if (location) {
        searchPath += `/${location.replace(/\s+/g, '-')}`;
    }
    if (houseType) {
        searchPath += `?type=${encodeURIComponent(houseType)}`;
    }
    if (tipology) {
        searchPath += `?tipology=${encodeURIComponent(tipology)}`;
    }
    if (price) {
        searchPath += `${houseType ? '&' : '?'}price=${encodeURIComponent(price)}`;
    }
    navigate(searchPath);
};

    return (
        <SearbarContainer className='searchbar-container'>
              <p style={{'marginTop':'1em'}}>Filtrado(30)</p>
              <HouseLocation>
                  <Box className="buttons-here">
                      <button 
                        className={`buy-btn ${ buyHouse && 'selected change-border-radius-right'}`}
                        onClick={()=>{onSelectOperation()}}>Comprar</button>
                      <button 
                      className={`rent-btn ${ rentHouse && 'selected change-border-radius-left'}`}
                      onClick={()=>{onSelectOperation()}}
                      >Arrendar</button>
                  </Box>
                  <GoogleMapDropdown
                      leftIcon={<MapMarkerSolid/>}
                      rightIcon={<Close/>}
                      positionTop={10}
                      width={100}
                      type="text"
                      showTitle={false}
                      autoComplete={true}
                      property="address"
                      name="search_full_address"
                      value={location}
                      onSelect={(selected)=>setLocation(selected.target.value.description)}
                      placeholder="Luanda (Nova Vida, Talatona, Kilamba Kiaxi...)"
                  />
                  <SearchButton onClick={handleSearch}>
                      <Search/>
                  </SearchButton>
              </HouseLocation>
              <HouseTraits>
                  <Box>
                      <CustomInput 
                          leftIcon={<StoreSolid/>}
                          property="Tipológia" 
                          name="tipology" 
                          placeholder="T1, T2, T3..."
                          value={tipology}
                          onChange={setTipology}
                          />
                  </Box>
                  <Box>
                      <CustomInput 
                          leftIcon={<StoreSolid/>}
                          property="Preço" 
                          name="price" 
                          placeholder="200.000.00 AOA"
                          value={price}
                          onChange={setPrice}
                      />
                    
                  </Box>
                  <Box>
                      <CustomInput 
                          leftIcon={<StoreSolid/>}
                          property="Tipo de imóvel" 
                          name="house_type" 
                          placeholder="Apartamento"
                          value={houseType}
                          onChange={setHouseType}
                      />
                  
                  </Box>
                  <div className='click-to-open-map' onClick={handleOpen}>
                      <Button className="open-map-btn">ABRIR MAPA</Button>
                  </div>
                  <DrawInMap open={state.modal.searchingOnMap.open} onClose={handleClose}/>
              </HouseTraits>
        </SearbarContainer>
   )
}
