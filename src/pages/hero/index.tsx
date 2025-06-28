import React, { Component } from 'react'
import styled from 'styled-components';
import HeroImg from '@img/hero-background.jpg' 
import { Box, Typography } from '@mui/material';
import SearchBarComponent from '../../components/search-bar';

import './style.scss'
import HeroAds from '@svg/hero.ads';

const HeroContainer = styled.div`
        
    width: inherit;
    height: 72vh;
    background: url(${HeroImg})no-repeat;
    object-fit: contain;
    background-size: cover;
    background-attachment: local;
    background-origin: content-box;
    background-position: 0vw;

`;

const Overlay = styled.div`

    width: inherit !important;
    height: inherit;
    display: flex;
    background: linear-gradient(56deg, #000000a8, transparent);
`;


export default function HeroSection (){
 return (
 <HeroContainer>
    <Overlay className='overlay-container'>
        <Box 
        className='content-only-box'
        sx={{
            display:'flex',
            flexDirection: 'column',
            padding: '2em',
            paddingLeft: '4em'
        }}>
            <Box className="content-side-box">
                <Typography variant="h3">
                A melhor maneira de ter a sua casa
                </Typography>
                <Typography>
                Descubra a experiência única de encontrar o lar dos seus sonhos conosco.
                </Typography>
                <Typography variant="h5">
                Filtre casas ,pela localização, 
                topologia ou tipo e por preço
                </Typography>
            </Box>
            <SearchBarComponent/>
        </Box>
        <Box className="ads-content-box">
            <div className='card-ads'>
                <HeroAds/>
            </div>
        </Box>
    </Overlay>
 </HeroContainer>)   
}
