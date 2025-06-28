import React, { Suspense } from 'react';
import styled from 'styled-components'
import LoaderComponent from '../../components/loader';
import Logger from '../../helpers/logging';
import { useStore } from '../../contexts/states.store.context';

const HeroSection = React.lazy(() => import('../../pages/hero'));
const TrafficInformation = React.lazy(() => import('../../pages/trafic-info'));
const RecentHouses = React.lazy(() => import('../../pages/recent-houses'));
const StepsToJoin = React.lazy(() => import('../../pages/how-to-section'));
const AdsSection = React.lazy(() => import('../../pages/ads-section'));
const BeRealEstateLandingPage = React.lazy(() => import('../../pages/be-realestate'));
const Faqs = React.lazy(() => import('../../pages/faqs'));
const FilterByNeighborhood = React.lazy(() => import('../../pages/search-by-neighborhood'));

const PartenersSection =  React.lazy(() => import('../../pages/parteners'));

const Main  = styled.div`
    display:flex;
    flex-direction: column;
    width: 100%;
    height: auto;
`;
const log = new Logger('ladning-page.jsx');


export default function LandingPage(){
    const {state,} = useStore();
    log.info(`Globa-State ${state}`)
    return (
        <Suspense fallback={<LoaderComponent/>}>
            <Main>
                <HeroSection/>
                <RecentHouses/>
                <TrafficInformation/>
                <StepsToJoin/>
                <AdsSection/>
                <BeRealEstateLandingPage/>
                <AdsSection/>
                <Faqs/>
                <FilterByNeighborhood/>
                <PartenersSection/>
            </Main>
        </Suspense>
    )
}