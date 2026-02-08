import React from 'react';
import './styles.css';
import styled from 'styled-components';
import HouseCover from '@img/backbone-visual.jpg'
import InzoLogo from '@img/inzo-imoveis.png'

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



export default function Card(props:any){
    return (
        <CardContainer className="card-container main-card-container">
            <CardHeader>
                <CardMedia className='card-media-img' src={HouseCover || props?.img}/>
                <CardOverlapText className='card-overlap-text-bg'>
                    {props?.houseType || "Apartamento"}
                </CardOverlapText>
                
                <CardOverlapText className='card-overlap-type-business'>
                    {props?.businessType || "Arrendar"}
                </CardOverlapText>
                
                {/* <CardOverlapText className='card-overlap-type-business reduced-the-price'>
                    Reduziu o preço
                </CardOverlapText> */}

                <CardOverlapText className='card-overlap-type-business to-release'>
                    {props?.toRelease || "A estrear"}
                </CardOverlapText>
                
                <CardOverlapText className='card-overlap-type-left-arrow'>
                    {"<"}
                </CardOverlapText>
                
                <CardOverlapText className='card-overlap-type-right-arrow'>
                    {">"}
                </CardOverlapText>
            </CardHeader>
            <CardBody className='card-body-container'>
                <h3 className="card-title">{props?.title || "Moradia Duplex em SP"}</h3>
                <p className="card-description">{props?.description || "Aluguel de apartamento mobiliado, de 65 m² com 2 quartos, 2 banheiros e 1 vaga na garagem em Itaim Bibi."}</p>
                <p className="card-house-traits">
                    <span>{props?.bedrooms || 3} Quartos</span>
                    <span>{props?.parkingSpaces || 3} Vagas</span>
                    <span>{props?.parkingType || "Estacionamento"}</span>
                </p>
                <h3 className="card-house-location">{props?.address || "Rua Fiandeiras, Itaim Bibi · São Paulo"}</h3>
                <CardFooter className='card-footer'>
                    <CardMedia className="partner-img" width={30} src={props?.partnerLogo || InzoLogo}/>
                    <h3 className="card-price">{props?.price || "250,000Kz"}</h3>
                </CardFooter>
            </CardBody>
            
        </CardContainer>
    )
}