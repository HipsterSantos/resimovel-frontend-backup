import React from 'react'
import './style.scss'
import styled from 'styled-components';
import { Typography } from '@mui/material';
import MiniLandingPageBanner from '@svg/mini-landing-page-banner';
import ResimovelLogo from '@svg/resimove.logo';
import StartInTheText from '@svg/stars-in-text';

const Main = styled.div`
width: inherit;
padding: 0 1em;
margin-bottom: 1em;
`;

const Left = styled.div`
    margin-top: 13vh;
    margin-bottom: auto;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
`;

const Right = styled.div``;

const Center = styled.div`
    margin: auto;
    margin-top: -11vh;
    /* margin-bottom: auto; */
    scale: .7;
    width: 100%;
    margin-left: -4vw;
`;

const ContainerRows = styled.div`
    width: 100%;
    justify-content: space-around;
`;

export default function BeRealEstateLandingPage(){
    return (
    <Main className='be-realestate-container'>
        <div className='logo-section'>
            <ResimovelLogo/><span>Resimóvel</span>
        </div>
        <ContainerRows className='container-rows'>
            <Left className='left'>
                <Typography 
                variant='h3'
                sx={{
                    fontFamily:'gotham-bold',
                    width: '30vw',
                    color: '#414141'
                }}
                >
                    Seja um Corrector ou Imobiliaria com a Resimóvel<StartInTheText/>
                </Typography>

                <Typography sx={{
                    fontFamily:'gotham-light',
                    fontSize:'1rem',
                    width:'25vw',
                    textAlign:'left',
                    marginTop:'1em'
                    }}>
                    Da busca à posse, sua jornada imobiliária é nossa missão, Conectamos você ao lar ideal...
                </Typography>
                <div className='be-realstate'>
                    <button className='active'>
                        Ser um corrector
                    </button>
                    <button>
                        Sou uma imobiliaria
                    </button>
                </div>
            </Left>
            <Center className='center'>
                <MiniLandingPageBanner/>
            </Center>
            <Right className='right'>
                <Typography 
                variant='h3'
                sx={{
                    fontFamily: 'gotham-bold',
                    color: '#414141',
                    marginBottom:'1em'
                }}>
                    Vantagens
                </Typography>
                <div className='step-one'>
                        <Typography variant='p'>01</Typography>
                        <Typography 
                        variant='h6'
                        className='medium-text'
                        >
                            Profissionais do Setor
                        </Typography>
                        <Typography className='light'>
                            Facilitamos o contato com empresas imobiliários
                            correctores e outros prorissionais do setor.
                        </Typography>
                </div>
                <div className='step-one'>
                        <Typography variant='p'>02</Typography>
                        <Typography 
                        variant='h6'
                        className='medium-text'
                        >
                            Flexibilidade de Pesquisa a Qualquer Hora
                        </Typography>
                        <Typography className='light'>
                            Permitimos que os usuários pesquisem e explorem prooriedades a qualquer hora do dia.
                        </Typography>
                </div>
                <div className='step-one'>
                        <Typography variant='p'>03</Typography>
                        <Typography 
                        variant='h6'
                        className='medium-text'
                        >
                           Segurança e Privacidade
                        </Typography>
                        <Typography className='light'>
                            Garantimos a seguranca das intormacões pessoais e financeiras dos usuarios.
                        </Typography>
                </div>

            </Right>
        </ContainerRows>
    </Main>)
}
