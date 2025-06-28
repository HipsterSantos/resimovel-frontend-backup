import React from 'react';
import styled from 'styled-components';
import './style.scss'
import { Typography } from '@mui/material';

const Main  = styled.div`

`;

export default function TrafficInformation(){
 return (<Main className="trafic-information-container">
    <div className='rowOne'>
        <Typography variant='h4'>
        Dados de trafigo
        </Typography>
        <Typography>
            Dezembro 2023
            {new Date().toDateString()}
        </Typography>
    </div>
    <div className='rowTwo row-card'>
        <Typography variant='h4'>
        Visitas
        </Typography>
        <Typography>
        3.4
        <span>3.4
            milhões
        </span>
        </Typography>
    </div>
    <div className='rowThree row-card'>
        <Typography variant='h4'>
        Total(aluguel)
        </Typography>
        <Typography>
            3.4mil
        </Typography>
    </div>
    <div className='rowFour row-card'>
        <Typography variant='h4'>
        Paises que mais visitam Resimovel
        </Typography>
        <div className='rowFour-states'>
            <ul>
                <li>Angola(78)</li>
                <li>Namibia(348)</li>
                <li>Portugal(378)</li>
            </ul>
            <ul>
                <li>Dubai(1348)</li>
                <li>Uganda(38)</li>
                <li>UK(1348)</li>
            </ul>
        </div>
    </div>
 </Main>)   
}