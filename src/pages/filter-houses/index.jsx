import React, { useState } from "react";
import styled from 'styled-components'
import CustomInput from "../../components/custom-input";
import { Box, Card, Typography } from "@mui/material";
import { GoogleMap,LoadScript, DrawingManager } from '@react-google-maps/api';
import { useStore } from "../../contexts/states.store.context";
import MapMarkerSolid from '@svg/map-marker';
import Close from '@svg/close';
import InzoLogo from '@img/inzo-imoveis.png'
import HouseCover from '@img/backbone-visual.jpg'
import GoogleMapDropdown from "../../components/google-map-dropdown ";
import './style.scss'
import { houseTraits } from "../../helpers";
import FilterIcon from "../../../public/svg/apply-filter";
import DrawOnMapIcon from "../../../public/svg/draw-on-map";

const Main = styled.div`
width: 100%;
font-family: 'gotham-light' !important;
font-weigh: 200;
`;

const FilterBar = styled.div`
display: flex;
    margin-top: auto;
    margin-bottom: auto;
    background: #F0F1F1;
`;


const OutlinedButton = styled.div``;
const ApplyFilterBar = styled.div``;

const FiltersAppliedContainer = styled.div``;

const HeadlineAndCounterFilter = styled.div``;

const IconButton = styled.div``;

const RangeInput = styled.div``;
const RoundedInput = styled.input``;

const BuyAndSellButtons = styled.div`
    display: flex;
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 1em;

`;
const Button = styled.button`
    border: none;
    background: #e6e6e6;
    color: #fff;
    padding: .8em 1em;
    border-radius: .8em;
    margin-right: 1em;
    &.active{
        background: #000;
    }
`;

const HouseTypeFilter = styled.div`
        margin-left: 2em;
        margin-right: auto;
        margin-bottom: auto;
        margin-top: auto;
        flex-wrap: wrap;
        width: 90vw;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: scroll;
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;
        &>*.btn-filter{
            padding: .9em 1em !important;
            color: #000;
            background-color: #fff !important;
            border: none;
            border-radius: 1em;
            margin-right: 1em;
            margin-top: auto !important;
            margin-bottom: auto !important;
            &>*.selected{
                background-color: #000;
                color: #fff;
            }
            &:hover{
                transition: all ease-out .4s;
                background-color: #000;
                // color: #fff;
        }
}
`;

const SearchHouseBar = styled.div`
    display: flex;    
    width: 45%;
    margin-right: 2em;
    margin-top:1em;
    padding-left:1em;

`;
const RowOne = styled.div``;
const RowTwo = styled.div`
    margin-top: 1em;
    display: flex;
`;

const CardList = styled.div`
    margin-top: 1em;
    display: flex;
`;
const MapContainer = styled.div`
    width:100%;
    flex:3;
`;


const CardContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    width: 32%;
    height: auto;
    position: relative;
    border-radius: 1.1em;
    box-shadow: 1px 2px 70px rgba(0, 0, 0, .2);
    padding: .5em !important;
    background: #fff;

`;

const CardHeader = styled.div``;

const CardMedia = styled.img`
    object-fit: cover;
    width: 100%;
    height: 25vh;
    border-radius: 1em;
    &:hover ~ .card-body-container .card-overlap-type-left-arrow{
        opacity: 1;
        background: linear-gradient(-85deg, rgba(0, 0, 0, 0) 12%, rgba(0, 0, 0, 0.4) 84%);
    }
`;

const CardBody = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 1.5em;
    position: relative;
    padding: .5em 1em;
    background: #F7F7F7;
    margin-top: .5em;
    line-height: 1.5;
`;


const CardBodyContent = styled.div`
 display: flex;
 flex-direction: column;
`; 

const SplitFragment = styled.div`
    display: ${props=> props?.split && 'flex' || 'block'};
    flex-direction: ${props=> props?.orientation || 'row'};
`;

const CardOverlapText = styled.div`
    --card-overlap-type-business: 10;
    --card-overlap-type-left-arrow:9;
    --card-overlap-type-right-arrow: var(--card-overlap-type-left-arrow);
    --card-overlap-text-bg:8;

    &.card-overlap-text-bg{
        border-radius: .5em .5em 0 0;
        align-self: center;
        text-align: center;
        background: #fff;
        padding: 0.2em 1.8em;
        position: absolute;
        top: 23.5vh;
        left: 5.5vw;

    }
    &.card-overlap-type-business{
        position: absolute;
        top: 2.5vh;
        left: 1.5vw;
        font-size: .89rem;
        text-align: center;
        font-weight: 800;
        color: #000;
        background: rgb(240,240,242);
        padding: .5em .7em;
        border-radius: .8em;
        z-index: var(--card-overlap-type-business);

        &.reduced-the-price{
            background: #d9f070;
            left: 7vw;
        }
        &.to-release{
            background: #000;
            color: #fff;
            // right: 2vw;
            left: 7vw;
        }
        
    }
    &.card-overlap-type-left-arrow,&.card-overlap-type-right-arrow{
        cursor: pointer;
    }
    &.card-overlap-type-left-arrow{

        z-index: var(--card-overlap-type-left-arrow); 
        flex-direction:column;
        display: flex;
        justify-content: center;
        opacity: 0;
        bottom: 0;
        position: absolute;
        font-size: 20pt;
        color: #fff;
        top: 0;
        border-radius: .5em 0em 0em .5em;
        background: transparent;
        width: 20%;
        transition: all .2s ease-in;
        height: 100%;
        text-align: center;
        left: 0;
        right: 0;
        &:hover{
            opacity: 1;
            background: linear-gradient(-85deg, rgba(0, 0, 0, 0) 12%, rgba(0, 0, 0, 0.4) 84%);
        }

    }
    &.card-overlap-type-right-arrow{
        z-index: var(--card-overlap-type-left-arrow); 
        flex-direction:column;
        display: flex;
        justify-content: center;
        opacity: 0;
        bottom: 0;
        position: absolute;
        border-radius: 0 .5em .5em 0;
        font-size: 20pt;
        color: #fff;
        top: 0;
        background: transparent;
        width: 20%;
        transition: all .4s ease-in;
        height: 100%;
        text-align: center;
        // left: 0;
        right: 0;

        &:hover{
            opacity: 1;
            background: linear-gradient(85deg, rgba(0, 0, 0, 0) 12%, rgba(0, 0, 0, 0.4) 84%);
        }

    }
   

`;

const CardFooter = styled.div`
    display: flex;
    padding: .5em;
    &>*:nth-child(1), &>*:nth-child(2){
        margin-top: auto;
        margin-bottom: auto;
    }
    &>*:nth-child(1){
        margin-right: auto;
    }
    &>*:nth-child(2){
        margin-left:auto;
    }

`;
const Img = styled.img`
`;

export default function FilterHouses(props){
    const { state, dispatch } = useStore();
    const { isLoaded } = state.googleMapStatus;
    const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 }); // Default center
    const [drawingMode, setDrawingMode] = useState(null);
    const [map, setMap] = useState(null);
    const [location, setLocation] = useState('');

    const handleDrawingModeChange = (mode) => {
        setDrawingMode(mode);
      };

      const drawingModeOptions = {
        drawingMode: drawingMode || null,
        drawingControl: true,
        drawingControlOptions: {
          position: window?.google?.maps?.ControlPosition?.TOP_CENTER,
          drawingModes: [
            window?.google?.maps?.drawing?.OverlayType?.MARKER,
            window?.google?.maps?.drawing?.OverlayType?.CIRCLE,
            window?.google?.maps?.drawing?.OverlayType?.POLYLINE,
            window?.google?.maps?.drawing?.OverlayType?.POLYGON,
            window?.google?.maps?.drawing?.OverlayType?.RECTANGLE,
          ],
        },
      };
    return (
            <Main>
                <RowOne className="row-one-container">
                    <FilterBar className="filter-bar-container">
                        <BuyAndSellButtons className="buy-and-sell-btn">
                            <Button className="buying-btn active">Comprar</Button>
                            <Button className="renting-btn">Aluguel</Button>
                        </BuyAndSellButtons>
                        <HouseTypeFilter className="availables-house-types">
                        {
                            houseTraits.map((item,index)=>(
                                <button key={index} className={`btn-filter ${index==3 && 'selected'}`}>{item.label}</button>
                            ))
                        }
                        </HouseTypeFilter>
                        <SearchHouseBar className="searchbar-house-in-filte">
                            <GoogleMapDropdown
                            className="google-map-dropdown"
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
                        </SearchHouseBar>
                    </FilterBar>
                    <hr className="divider"/>
                    <ApplyFilterBar className="apply-filter-container">
                        <IconButton className="apply-filter-btn">
                            <FilterIcon/>
                            <p className="apply-filter-text">Aplicar filtro</p>
                        </IconButton>
                        <FiltersAppliedContainer className="filters-applied">
                            <OutlinedButton className="outlined-button">
                                <div className="text">
                                    <span className="text-1">de</span>
                                    <span className="text-2">100.000Kz</span>
                                    <span className="text-3"> a </span>
                                    <span className="text-4"> 400.000Kz </span>
                                </div>
                                <Close/>
                            </OutlinedButton>
                            <OutlinedButton className="outlined-button">
                                <div className="text">
                                    <span className="text-1">Mobiliado</span>
                                </div>
                                <Close/>
                            </OutlinedButton>
                            <OutlinedButton className="outlined-button">
                                <div className="text">
                                    <span className="text-1">T1,T2,T3,T4</span>
                                </div>
                                <Close/>
                            </OutlinedButton>
                        </FiltersAppliedContainer>
                        <p className="clean-filter">&nbsp; <span>Limpar filtro</span></p>
                    </ApplyFilterBar>
                    <HeadlineAndCounterFilter className="headline-found-research">
                        <div className="headlines">
                            <p className="title-type-of-house-1">
                                28732. Casas e apratamentos
                            </p>
                            <p className="title-type-of-house-2">
                                para alugar em Azeitão (São Lourenço e São Simão)
                            </p>
                        </div>
                        <IconButton className="apply-filter-btn draw-on-map">
                            <DrawOnMapIcon/>
                            <p className="apply-filter-text draw-on-map-text">Desenhar no mapa</p>
                        </IconButton>
                    </HeadlineAndCounterFilter>
                </RowOne>
                <RowTwo>
                    <Box className="cards-container" sx={{
                        flex: 6,
                        height:'100vh',
                        overflowY: 'scroll',
                        display: 'flex',
                        flexWrap: 'wrap',
                        padding: '1em .3em',
                        width: '100%',
                        gap: '1em'
                    }}>
                        {[1,3,2,2,32].map(()=>(
                            <CardContainer className="card-container main-card-container">
                                <CardHeader>
                                    <CardMedia className='card-media-img' src={HouseCover}/>
                                    <CardOverlapText className='card-overlap-text-bg'>
                                        Apartamento
                                    </CardOverlapText>
                                    
                                    <CardOverlapText className='card-overlap-type-business'>
                                        Arrendar
                                    </CardOverlapText>
                                    
                                    {/* <CardOverlapText className='card-overlap-type-business reduced-the-price'>
                                        Reduziu o preço
                                    </CardOverlapText> */}

                                    <CardOverlapText className='card-overlap-type-business to-release'>
                                        A estrear
                                    </CardOverlapText>
                                    
                                    <CardOverlapText className='card-overlap-type-left-arrow'>
                                        {"<"}
                                    </CardOverlapText>
                                    
                                    <CardOverlapText className='card-overlap-type-right-arrow'>
                                        {">"}
                                    </CardOverlapText>
                                </CardHeader>
                                <CardBody className='card-body-container'>
                                    <h3 className="card-title">Moradia Duplex em SP</h3>
                                    <p className="card-description">Aluguel de apartamento mobiliado, de 65 m² com 2 quartos, 2 banheiros e 1 vaga na garagem em Itaim Bibi.</p>
                                    <p className="card-house-traits">
                                        <span>3 Quartos</span>
                                        <span>3 Vagas</span>
                                        <span>Estancionamento</span>
                                    </p>
                                    <h3 className="card-house-location">Rua Fiandeiras, Itaim Bibi · 
                                    São Paulo</h3>
                                    <CardFooter className='card-footer'>
                                        <CardMedia className="partner-img" width={30} src={InzoLogo}/>
                                        <h3 className="card-price">250,000Kz</h3>
                                    </CardFooter>
                                </CardBody>
                                

                            </CardContainer>

                        ))}
                    </Box>
                    <MapContainer className='google-map-container'>
                    {isLoaded ? (
                    <GoogleMap
                        className="google-map"
                        mapContainerStyle={{ height: "100vh", width: "100%" }}
                        center={center}
                        zoom={15} // Adjust zoom level as needed
                        onLoad={(mapInstance) => setMap(mapInstance)}
                    >
                        <DrawingManager
                        key={drawingMode} // Force re-render on mode change
                        options={drawingModeOptions}
                        />
                    </GoogleMap>
                    ) : (
                    <div className="center-load-info">Carregando o mapa com sua localização exata</div>
                    )}
                    </MapContainer>
                </RowTwo>
            </Main>
    )
}