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
  background: ${(props) => props.hasError ? '#FFF5F5' : '#F7F8FA'};
  padding: 0 0.8em;
  border-radius: 0.4em;
  border: ${(props) => props.hasError ? '1px solid #FF6B6B' : 'none'};
  transition: all 0.2s ease;
`;

const Input = styled.input`
    font-family: gotham-light !important;
    width: 100%;
    outline: none;
    background: transparent;
    margin-left: .7em;
    height: inherit;
    border: none;
    
    &::placeholder {
      color: #A7A7AF;
    }
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
  font-family: gotham-medium;
  color: ${(props) => props.hasError ? '#FF6B6B' : 'inherit'};
`;

const ErrorMessage = styled.p`
  margin-top: 0.4em;
  margin-bottom: 0;
  font-size: 0.75rem;
  color: #FF6B6B;
  text-indent: 0.4em;
  font-family: gotham-light;
`;

export default function CustomInput({
  showTitle = true,
  property,
  onChange = () => {},
  value,
  leftIcon,
  rightIcon,
  label,
  type,
  placeholder,
  width,
  error = false,
  helperText = '',
  required = false,
  ...props
}){
    
    const handleChange = (event) => {
      onChange(event); // Pass the entire event to the parent
    };
  
    const handleClean = () => {
      onChange({ target: { value: '' } }); // Simulate an event to clear the input
    };

    const displayLabel = label || property;
    
  return (
        <ModerInputContainer 
            className={`modern-input-${property}`}
            width={props.width}
            >
          {showTitle && (
            <FieldName 
              className='field-name'
              hasError={error}
            >
              {displayLabel}
              {required && <span style={{ color: '#FF6B6B' }}>*</span>}
            </FieldName>
          )}
          <ModerInput className='container-input-logo' hasError={error}>
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
          {error && helperText && (
            <ErrorMessage>{helperText}</ErrorMessage>
          )}
        </ModerInputContainer>
    )
}