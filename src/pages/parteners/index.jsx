import { Typography } from '@mui/material';
import './style.scss';
import styled from 'styled-components';
import ImozinhaLogo from '/img/imozinha.png'
import EnzoLogo from '/img/inzo-imoveis.png'

const Main = styled.div`
    display: flex;
    width: inherit;
`;
const PartenersLogo = styled.div`
    display:flex;
    justify-content: space-between;
    width: 40vw;
`;

const Img = styled.img``;

export default function PartenersSection(){
    return (
    <Main className='parteners-section-container'>
        <Typography variant='h2'>Parceiros</Typography>
        <Typography variant='p'>Confiado por mais de <strong>+3mil imobiliárias</strong> e <strong>+2mil correctores profissionais</strong> em todo pais</Typography>
        <PartenersLogo>
            <Img width="103" height="103" src={ImozinhaLogo}/>
            <Img width="119" heigth="70" src={EnzoLogo}/>
            
            <Img width="103" height="103" src={ImozinhaLogo}/>
            <Img width="119" heigth="70" src={EnzoLogo}/>
            
        </PartenersLogo>
    </Main>)
}
