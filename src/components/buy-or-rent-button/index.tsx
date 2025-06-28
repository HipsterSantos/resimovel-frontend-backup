/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '@mui/material'
// import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from 'react';
import styled from 'styled-components'
import './style.scss';

const CustomButton  = styled.button`
padding: 1.5em;
border-radius: 0;
background: #F7F7F7;
color: #000;
text-align: center;
`;
export default function BuyOrRentButton(){
    return (
        <Box  sx={{
            display: 'flex',
            width: '200px',
            background: '#F7F7F7'
        }}>
            <CustomButton className={['custom-btn','btn-clicked','clicked']}>
                Comprar
            </CustomButton>
            <CustomButton className={['custom-btn','rent-btn']}>
                Arrendar
            </CustomButton>
        </Box>
    )
}
