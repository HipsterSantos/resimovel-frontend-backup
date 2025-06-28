import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components'
import BuyOrRentButton from '../../components/buy-or-rent-button';
import './style.scss';
import Search from '@svg/search';
import MapMarkerSolid from '@svg/map-marker';
import InzoLogo from '@img/inzo-imoveis.png'
import HouseCover from '@img/backbone-visual.jpg'


const Main = styled.div`
    display: flex;
    flex-direction: column;
    padding: 2em 2em;
    font-family: gotham-light !important;
    background: #F7F7F7;
    border-bottom: 1px solid #ddd;

`;



export default function RecentHouses(){
    const [ filterBtns, setFilter] = useState([
        {
            label: 'Todos',
            selected: true,
            class: 'all'
        },
        {
            label: 'Comprar',
            selected: false,
            class: 'buy'
        },
        {
            label: 'Arrendar',
            selected: false,
            class: 'rent'
        },

    ])

    const handleFilter = (index)=>{
        setFilter(prevOptions=>
            prevOptions.map((item,itemIndex)=>({
                ...item,
                selected: itemIndex == index
            }))
        )
    }
    return (<Main>
        <Box className="recent-house-container">
            <Typography variant="h4">
            Imóveis em destaque
            aguardam você...
            </Typography>
            <div className='buy-rent-button'>
                {filterBtns.map((item,index)=>(
                    <button 
                        className={`${item.class} ${item.selected && 'selected'}`}
                        onClick={()=>handleFilter(index)}>
                            {item.label}
                    </button>
                    ))
                }
            </div>

        </Box>
        <Box className="cards-container">
            {[1,2,3,4].map(()=>(
                <CardContainer className="card-container main-card-container">
                    <CardMedia className='card-media-img' src={HouseCover}/>
                    <CardBody className='card-body-container'>
                        
                        <CardOverlapText className='card-overlap-text-bg'>
                            Apartamento
                        </CardOverlapText>
                        
                        <CardOverlapText className='card-overlap-type-business'>
                            Arrendar
                        </CardOverlapText>
                        
                        <CardOverlapText className='card-overlap-type-left-arrow'>
                            {"<"}
                        </CardOverlapText>
                        
                        <CardOverlapText className='card-overlap-type-right-arrow'>
                            {">"}
                        </CardOverlapText>

                        <CardBodyContent className='card-body-content-container'> 
                            
                            <SplitFragment split={true} className='house-name'>
                                <Typography>
                                    <h3> Condominio Alvalade </h3>
                                </Typography>
                                <Typography>
                                      <h4> T3 </h4>
                                </Typography>
                            </SplitFragment>

                            <SplitFragment split={true} className='house-traits-location'>
                                    <Typography className='first-text'>
                                        <span>
                                            <MapMarkerSolid/>
                                        </span> Av, Santa Madalena
                                    </Typography>
                                    <Typography className='second-text'>
                                        
                                    </Typography>
                            </SplitFragment>

                            <SplitFragment split={true} className='house-traits-sizing'>
                                    <Typography>
                                        <span>
                                            <MapMarkerSolid/>
                                        </span> Estacionamento
                                    </Typography>
                                    <Typography>
                                       
                                    </Typography>
                            </SplitFragment>


                        </CardBodyContent>
                    </CardBody>

                    <CardFooter className='card-footer'>
                            <Typography>
                                <h3>
                                250,000Kz
                                    </h3>
                            </Typography>
                            <CardMedia className="partner-img" width={30} src={InzoLogo}/>

                    </CardFooter>

                </CardContainer>

            ))}
        </Box>
        <Box className='scroll-to-see-more'>
                <Typography>Ver todos</Typography>
        </Box>
    </Main>)   
}

const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    position: relative;
    border-radius: .5em;
    box-shadow: 1px 2px 70px rgba(0,0,0,.2)

`;

const CardMedia = styled.img`
    height: ${props=> props?.height+'%' || '30vh'};
    object-fit: cover;
    width: ${props=> props?.width+'%' || '100%'};
    border-radius: .5em .5em 0 0;
    &:hover ~ .card-body-container .card-overlap-type-left-arrow{
        opacity: 1;
        background: linear-gradient(-85deg, rgba(0, 0, 0, 0) 12%, rgba(0, 0, 0, 0.4) 84%);
    }
`;

const CardBody = styled.div`
    display: flex;
    flex-direction: column;
    position:relative;
    padding: .5em;
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
    card-overlap-text-bg:8;

    &.card-overlap-text-bg{
        border-radius: .5em .5em 0 0;
        align-self: center;
        text-align: center;
        background: #fff;
        padding: 0.2em 1.8em;
        position: absolute;
        top: -3.5vh;
        left: 4vw;

    }
    &.card-overlap-type-business{
        position: absolute;
        top: -31vh;
        font-weight: bold;
        color: #fff;
        background: rgba(169, 54, 55,.7);
        padding: .5em .7em;
        border-radius: .6em;
        z-index: var(--card-overlap-type-business)
        
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
        top: -34vh;
        background: transparent;
        width: 20%;
        transition: all .4s ease-in;
        height: 34vh;
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
        font-size: 20pt;
        color: #fff;
        top: -34vh;
        background: transparent;
        width: 20%;
        transition: all .4s ease-in;
        height: 34vh;
        text-align: center;
        left: 35vh;
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
