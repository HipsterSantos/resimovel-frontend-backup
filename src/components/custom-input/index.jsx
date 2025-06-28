import React, { useEffect } from 'react';
import styled from 'styled-components'
import CloseIcon from '@mui/icons-material/Close';

const ModerInputContainer = styled.div`
  display:flex;
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
    margin-left: .7em;
    height: inherit;
    border: none;
`;
const Icon = styled.span`
  margin-left: auto;
  margin-top: ${props=>props.pt?props.pt:'auto'};
  margin-bottom: auto;
  scale: ${props=>props.scale?props.scale:'.6'};
  color: #A7A7AF;
  cursor: pointer;  
`;

const FieldName = styled.p`
  margin-bottom: 0.8em;
  font-size: 0.8rem;
  text-indent: 0.4em;
`;


export default function CustomInput({
  showTitle=true,
  property,
  onChange = () => {},
  value,
  leftIcon,
  rightIcon,
  label,
  type,
  placeholder,
  width,
  ...props
  }){
    
    const handleChange = (event) => {
      onChange(event); // Pass the entire event to the parent
    };
  
    const handleClean = () => {
      onChange({ target: { value: '' } }); // Simulate an event to clear the input
    };
    
  return (
        <ModerInputContainer 
            className={`modern-input-${property}`}
            width={props.width}
            >
          {showTitle && !label && <FieldName className='field-name'>{property}</FieldName>}
          {showTitle && label && <FieldName className='field-name'>{label}</FieldName>}
          <ModerInput className='container-input-logo'>
              { 
              leftIcon &&
                <Icon scale=".9" pt=".9em">{leftIcon}</Icon>
              }
              <Input               
                type={type} 
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
              />
              <Icon>
               {!rightIcon?<CloseIcon onClick={handleClean}/>:(<>{rightIcon}</>)}
              </Icon>
          </ModerInput>
        </ModerInputContainer>
    )
}