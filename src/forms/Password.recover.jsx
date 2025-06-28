import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import CustomInput from '../components/custom-input';
import GoogeLogo from '@svg/google-logo';
import { useStore } from '../contexts/states.store.context';

const Form = styled.form`
font-family: gotham-light !important;
width: 30vw;
margin-top: -1em;
border-radius: 1em;
box-shadow: 1px 2px 30px rgba(0,0,0,.1);
padding: 2em;
background: #fff;

`;

const ModerInputContainer = styled.div`
  display:flex;
  flex-direction: column;
  margin-bottom: 1em;
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
`;

const SubmitButton = styled.div`
 display: flex;
 flex-direction: column;
 margin-bottom: 1em;
 &>button{
  border: none;
  width: 50%;
  align-self: center;
  padding: 1em 0;
  border-radius: .5em;
  background: #D9F070;
  
 }
`;

const LogoAndText = styled.div`
  text-align: center;
  align-self: center;
  display:flex;
  margin-top: 1em;
  &>*{
    margin-top: auto;
    margin-bottom: auto;
    margin-left: .8em;
  }
`;

export default function PasswordRecoverForm(props) {
  const {state,dispatch} = useStore()
  const [value, setValue] = React.useState({
    email: '',
    password: ''
  })
  const handleChange = (prop)=>(event)=>{
    setValue(oldValue=>({
      ...oldValue,
      [prop]: event.target.value
    }))
  }

  return (
    <React.Fragment>
      <Form>
        <Typography 
        variant='h4'
        sx={{
          fontFamily:'gotham-bold',
          textAlign: 'center',
          marginTop: '.8em',
          marginBottom: '.6em',
          fontSize: '3rem'
        }}
        >
          Login
        </Typography>
        <Typography sx={{
          fontSize:'.7rem',
          fontFamily:'gotham-light',
          textAlign: 'center',
          marginBottom: '.7em'
        }}>
        Accesse sua conta e faça sua reserva , anuncie imóveis
        </Typography>
       
        <ModerInputContainer className="modern-input">
          <FieldName className='field-name'>Email</FieldName>
          <ModerInput className='container-input-logo'>
              <Input type="email" placeholder="example@server.domain"
              onChange={handleChange('email')}
              />
              <Icon>
                <CloseIcon/>
              </Icon>
          </ModerInput>
        </ModerInputContainer>
        <ModerInputContainer className="modern-input">
          <FieldName className='field-name'>Palavra passe</FieldName>
          <ModerInput className='container-input-logo'>
              <Input type="password" placeholder="password deve conter8 digitos no minimo"
              onChange={handleChange('email')}
              />
              <Icon>
                <CloseIcon/>
              </Icon>
          </ModerInput>
        </ModerInputContainer>
       <Typography sx={{
          fontSize:'.8rem',
          fontFamily:'gotham-light',
          textAlign: 'center',
          marginBottom: '.7em',
          textDecoration: 'underline',
          cursor: 'pointer'
        }}>
       Esqueci minha senha
       </Typography>
       <Typography sx={{
          fontSize:'.8rem',
          fontFamily:'gotham-medium',
          textAlign: 'center',
          marginBottom: '.7em',
          cursor: 'pointer'
        }}
        onClick={()=>{
          dispatch({
            type: 'activeModal',
            payload: 1 
          })
        }}
        >
       Ainda não tenho uma conta,<span className='highlight-yellow underline' >Criar uma conta</span>
       </Typography>
       <SubmitButton className="submit-login-google">
        <button>Continuar</button>
        <LogoAndText className='google-logo'>
          <GoogeLogo/><span>Logar com google</span>
        </LogoAndText>
       </SubmitButton>
      </Form>
    </React.Fragment>
  );
}
