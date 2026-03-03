import React from 'react';
import styled from 'styled-components';
import HeroSection from '../hero';
import { Typography } from '@mui/material';
// import 'style.scss';

const Main = styled.main`

`;
const Box = styled.main`
    display: flex;
    padding: 2em;
`;

const LeftSide = styled.div`
    flex: 50%;
`;
const RightSide = styled.div`
flex: 50%;
`;

const AboutusContainer = ()=>{
    return(<Main>
       <h3>About Us</h3> 
    </Main>);
}

const Services = ()=>{
    return (<Main>
        <h3>Services</h3>
        <p>Our services include:</p>
        <ul>
            <li>Property Management</li>
            <li>Rental Services</li>
            <li>Sales Consultation</li>
        </ul>
    </Main>);
}

const FAQs=()=>{
    return(<Main>

        <h3>FAQs</h3>
    </Main>);
}

const Contact = ()=>{
    return(<Main>
        Contact
    </Main>);
}

const MapaDoSite = ()=>{
    return(<Main>
        Mapa do Site
    </Main> );
}

const  componentsToRedner = {
    aboutus: <AboutusContainer/>,
    services: <Services/>,
    faqs: <FAQs/>,
    contact: <Contact/>,
    mapadoSite: <MapaDoSite/>
}

export default function AboutUs() {
    const usefulLinks = [
        'Sobre Nós',
        'Termos de Uso',
        'Política de Privacidade',
        'Contato',
    ]
    const [activeComponent, setActiveComponent] = React.useState('aboutus');

    return (

        <Main>
            <HeroSection removeBar removeAds></HeroSection>
            <Box className="main">
                <LeftSide className="left-side">
                    <Typography variant="h3" sx={{ fontFamily: 'gotham-bold', mb: 2 }}>
                        Link uteis
                    </Typography>
                    <div className="list-items">
                        {
                            usefulLinks.map((link, index) => (
                                <Typography key={index} onClick={() => 
                                    setActiveComponent(link.toLowerCase().replace(/\s/g, ''))
                                } variant="body1" sx={{ fontFamily: 'gotham-light', mb: 1 }}>
                                    {link}
                                </Typography>
                            ))  
                        }
                    </div>
                </LeftSide>
                <RightSide className='right-side'>
                    <Typography variant="h3" sx={{ fontFamily: 'gotham-bold', mb: 2 }}>
                        Contato
                    </Typography>
                    <div className="active-component-to-render">
                        {componentsToRedner[activeComponent]}
                    </div>

                </RightSide>
            </Box>
        </Main>
    )
}

