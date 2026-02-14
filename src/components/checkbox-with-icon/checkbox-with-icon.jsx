import React,{useState,useEffect} from "react"
import styled from 'styled-components'
import RightYellowChecked from "@svg/right-yellow-checked";
import RightRadioNonSelected from "@svg/right-radio-non-selected";
import { Typography } from "@mui/material";

const CheckBoxWithIconContainer = styled.div`
display: flex;
border: 2px solid ${props=>props.selected?'#D9F070':'#C2C2C2'};
border-radius: .4em;
width: ${props=>props.width?props.width+'%':'60%'};
padding: .3em;
margin-bottom: 1em;
cursor: pointer;
transition: all .2s ease-in;
// &>*:hover{
//  opacity:0;   
// }
`;
const Icon = styled.span`
padding: .5em .8em; 
margin-top: auto;
margin-bottom: auto;
border: ${props=>!props.border?'':'2px solid #C2C2C2'};
border-radius: .4em;
`;
const Body = styled.div`
margin-left: 1em;
margin-top: auto;
margin-bottom: auto;
margin-right: auto;
// padding-left: .5em;
`;

export default function CheckBoxWithIcon(props){
    const {width,selected,title,description,onClick} = props
    return (
        <CheckBoxWithIconContainer 
            width={width} 
            selected={selected}
            onClick={onClick}
            >
            <Icon border={true}>
                {props.icon}
            </Icon>
            <Body>
                <Typography sx={{
                    fontFamily: 'gotham-medium'
                }}>{title}</Typography>
                <Typography
                sx={{
                    fontFamily: 'gotham-light',
                    fontSize: '.8em'
                }}
                >{description}</Typography>
            </Body>
            <Icon border={false}>
            {selected?<RightYellowChecked/>:<RightRadioNonSelected/>}
            </Icon>
        </CheckBoxWithIconContainer>
    )
}