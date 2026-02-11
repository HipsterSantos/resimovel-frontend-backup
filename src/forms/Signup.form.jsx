import * as React from 'react';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import CustomInput from '../components/custom-input';
import GoogeLogo from '@svg/google-logo';
import styled from 'styled-components';
import './style.scss'
import { useStore } from '../contexts/states.store.context';
import axios from 'axios';
import { useMutation, gql } from '@apollo/client';
import { useGoogleLogin } from '@react-oauth/google';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Form = styled.form`
font-family: gotham-light !important;
width: 40vw;
margin-top: -1em;
border-radius: 1em;
box-shadow: 1px 2px 30px rgba(0,0,0,.1);
padding: 2em;
background: #fff;
margin-top: -3em;
    padding-top: .4em;

`;

const MultipleField = styled.div`
  display:flex;
  &>*:nth-child(1){
    margin-right: 1em;
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($userInput: UserInput!) {
    signup(userInput: $userInput) {
     
      token
      message
    }
  }
`;



export default function SignupForm(props) {
  const { state,dispatch } = useStore();
  const [signupMutation] = useMutation(SIGNUP_MUTATION);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const [value,setValue] = React.useState({
  name: '',
  email: '',
  phone: '',
  street: '',
  fullAddress: '',
  password: '',
})

const handleSignup = ()=>{
  setLoading(true);
  setErrorMsg('');
    signupMutation({
      variables:{
            "userInput": {
              "name": value.name.trim() || "someting useulf",
              "email": value.email.trim() || "somng@gmail.com",
              "password": value.password.trim() || "sober",
              "phone":value.phone.trim() || "893929332",
              "street":value.street.trim() || "3892",
              "neighborhood":value.fullAddress.trim() || "i92893923"
        }
      }
    }).then((result)=>{
      console.log('\nresult-',result)
      debugger
    })
    .catch((error)=>{
      debugger
      const msg = error.graphQLErrors?.[0]?.message || "Erro ao criar conta";
      setErrorMsg(msg);
      console.error(error,msg);
    })  
}

const handleSignupWithGoogle = ()=>{

}
  

const handleChange = (prop) => (event) => {
  setValue((prevValue) => ({
    ...prevValue,
    [prop]: event.target.value, // Use event.target.value instead of event
  }));
};

React.useEffect(()=>{
    console.log('\n-- value--',value)
},[value])

  
  return (
    <React.Fragment>
      <Form>
        <Typography variant='h4' sx={{
            fontFamily: 'gotham-bold',
            textAlign: 'center',
            marginTop: '.8em',
            marginBottom: '.6em',
            fontSize: '2rem',
          }}>
        Criar uma conta
        </Typography>
        <Typography sx={{
            fontSize: '.7rem',
            fontFamily: 'gotham-light',
            textAlign: 'center',
            marginBottom: '.7em',
          }}>
        Accesse sua conta e faça sua reserve , anuncie imóveis
        </Typography>
          <CustomInput
            type="text"
            placeholder="Nome completo"
            property="name"
            label="Nome"
            value={value.name}
            onChange={handleChange('name')}
            />
          <MultipleField className='multiple-field controller'>
            <CustomInput
              type="email"
              value={value['email']}
              placeholder="example@server.domain"
              property="email"
              label="Email"
              width={50}
              onChange={handleChange('email')}
              />
            <CustomInput
              type="phone"
              value={value.phone}
              placeholder="+244929177373 ou 929177373"
              property="phone"
              label="Telefone"
              width={50}
              onChange={handleChange('phone')}
              />
          </MultipleField>
          <MultipleField className='multiple-field controller'>
            <CustomInput
              type="text"
              value={value.street}
              placeholder="Rua N23"
              label="Rua"
              property="street"
              width={50}
              onChange={handleChange('street')}
              />
            <CustomInput
              type="text"
              value={value.location}
              placeholder="Aveiro,Rua 34"
              property="fullAddress"
              label="Localização completa"
              width={50}
              onChange={handleChange('fullAddress')}
              />
          </MultipleField>
          <CustomInput
            type="password"
            value={value.password}
            placeholder="Nome completo"
            property="password"
            label="Palavra-passe"
            onChange={handleChange('password')}
          />
        <Typography
          sx={{
            fontSize: '.8rem',
            fontFamily: 'gotham-medium',
            textAlign: 'center',
            marginBottom: '.7em',
            cursor: 'pointer',
          }}
          onClick={() => {
            dispatch({
              type: 'TOGGLE_MODAL',
              payload: { modalName: 'login' },
            });
          }}
        >
          Ja tenho uma conta,{' '}
          <span className="highlight-yellow underline">Logar</span>
        </Typography>
        <SubmitButton className="submit-login-google">
          <button 
              type="button" 
              onClick={handleSignup}
              disabled={loading}
              >
              {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
          <LogoAndText className="google-logo">
            <GoogeLogo />
            <span>Cadastrar com google</span>
          </LogoAndText>
        </SubmitButton>
      </Form>
    </React.Fragment>
  );
}
const SubmitButton = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
  & > button {
    border: none;
    width: 50%;
    align-self: center;
    padding: 1em 0;
    border-radius: 0.5em;
    background: #d9f070;
  }
`;

const LogoAndText = styled.div`
  text-align: center;
  align-self: center;
  display: flex;
  margin-top: 1em;
  & > * {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 0.8em;
  }
`;
