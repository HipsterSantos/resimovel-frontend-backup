import React, { useState,useRef } from 'react';
import styled from 'styled-components'
import CloseIcon from '@mui/icons-material/Close';
import ChevronIcon from '@svg/chevron';
import { Typography } from '@mui/material';
import './style.scss'
const ModerInputContainer = styled.div`
  display:flex;
  position: relative !important;
  flex-direction: column;
  margin-bottom: 1em;
  width: ${(props)=>props.width+'%'??'100%'};
`;
const ModerInput  = styled.div`
  display: flex;
  height: 6.5vh;
  background: #F7F8FA;
  padding: 0 0.8em;
  border-radius: 0.4em;
`;

const Input = styled.input`
    font-family: gotham-light !important;
    width: 100%;
    outline: none;
    background: transparent;
    height: inherit;
    border: none;
`;
const Icon = styled.span`
  margin-left: auto;
  margin-top: auto;
  margin-bottom: auto;
  scale: .6;
  color: #A7A7AF;
  cursor: pointer;  
`;

const FieldName = styled.p`
  margin-bottom: 0.8em;
  font-size: 0.8rem;
  text-indent: 0.4em;
  font-family:gotham-medium;
`;
const Paper = styled.div`
width: 100%;
display: block;
position: relative;
top: ${props=>props.positionTop?props.positionTop:0} ;
box-shadow: 1px 23px 30px rgba(0, 0, 0, .3);
overflow-x: hidden !important;
border-radius: .7em;
max-height: 30vh;
line-height: 1.6;
 z-index: 800;
 background: white;

// &::-webkit-scrollbar {
//   width: 5px;
// }

// &::-webkit-scrollbar-track {
//   background-color: transparent;
// }

// &::-webkit-scrollbar-thumb {
//   background-color: #D9EE78;
//   border-radius: 6px;
//}
&>*.houseOption{
  padding: .7em 2.3em;
}

`;

export default function CustomDropdown({
    property,
    name,
    showTitle=true, 
    value="",
    positionTop,
    onSelect,
    ...props
  }){

    const [values, setValues] = React.useState({
        [property]: value,
      })
    const [searchValue, setSearchValue] = React.useState('')
    const [filteredTraits, setFilteredTraits] = useState(props.data);

    console.log('testing-data--', props?.data)

    const {current: currentValue = {} }= useRef({})

    const [openPaper,setOpenPaper] = useState(false);
      
    console.log('open-paper--',openPaper)

      
    const handleChange =(prop) => (event) => {
        const term = event.target.value.toLowerCase();
        setSearchValue(term);
        setValues(oldValue=>({
          ...oldValue,
          [prop]: term
        }))
        //if  autocomplete is true then  enable, open papper
        props.autoComplete && setOpenPaper(e=>true)
        if (term === '') {// if we have input value empty close paper
          setOpenPaper(e=>false)
          setFilteredTraits(props.data); // reset filter data back to its primary vallue
        } else {
          const filtered = props.data.filter((item) =>
            item?.label.toLowerCase().includes(term)
          );
          setFilteredTraits(filtered);
          onSelect(filtered)
        }
    };

    // props.returnValue(values)
    const handleClick = (index) =>{
      let destructured;
      console.log('\n\n-picked-value--',currentValue[index].innerText)
      setSearchValue(currentValue[index].innerText)
      setOpenPaper(e=>!e)
      onSelect({
          target:{
            value: props.data.find( (item) => 
                item.label.toLowerCase().includes(currentValue[index].innerText.toLowerCase())
                )
            }
       })
      // debugger
    }


    return (
        <ModerInputContainer 
            className={`modern-input-${property}`}
            width={props.width}
            >
          {showTitle && <FieldName className='field-name'>{property}</FieldName>}
          <ModerInput className='container-input-logo'>
              <Icon>
                {props.leftIcon && (<>{props.leftIcon}</>)}
              </Icon>
              <Input 
                type={props.type || 'text'} 
                placeholder={props?.placeholder}
                value={searchValue}
                onChange={handleChange(props.name)}                
              />
              <Icon onClick={()=>{
                //if rightIconClick and have closico empty value
                props.rightIcon && 
                  handleChange(props.name)({target:{value:''}});
                !props.rightIcon && 
                  setOpenPaper(e=>!e)

                }}>
               {!props?.rightIcon?<ChevronIcon color="#A7A7AF"/>:(<>{props.rightIcon}</>)}
              </Icon>
          </ModerInput>
          <Paper 
            className="dropdown-paper-body"
            positionTop={positionTop}
            style={{display: openPaper?'block':'none'}}
          >
            { filteredTraits && 
                filteredTraits.map((value,index)=>(
                  <Typography 
                    key={index} 
                    className="houseOption"
                    onClick={()=>{handleClick(index)}}
                    ref={(el)=>{ if (el) currentValue[index] = el}}
                    name={value?.label || value?.name}
                    >
                    {value?.label}
                  </Typography>)
              )
            }
          </Paper>
        </ModerInputContainer>
    )
}