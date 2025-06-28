import  React,{ useRef, useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import GoogeLogo from '@svg/google-logo';
import Line from '@svg/Line';
import './style.scss';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useMutation, gql } from '@apollo/client';
import { toast } from 'react-toastify';
import { toggleModal, useStore } from '../contexts/states.store.context';

const OnBoardingContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 35vw;
    padding: 5em 2em;
    border-radius: 1em;
    box-shadow: 1px 2px 20px rgba(0,0,0,.1);
    background: #fff;
    align-items: center;
    line-height;  1;
`;

const ActionButtons = styled.div`
    display: flex;
    margin: 2em 0;
    &>button{
        border: none;
        padding: .8em 1.5em;
        width: 10vw;
        color: #404040;
        &.selected{
            background:#D9F172;
        }
    }
`;

const LogoAndContent = styled.div`
display:flex;
margin-bottom: 1em;
cursor: pointer;
&>*{
    margin-top:auto;
    margin-bottom: auto;
}
& span{
    margin-left: 1em;
}
`;

const OtherOptions = styled.div`
display:flex;
margin-bottom: 1em;
&>*{
    margin-top: auto;
    margin-bottom: auto;
    
}
& > span{
    font-size: .8rem;
}
& > svg.left{
    margin-right: .5em;
}
& > svg.right{
    margin-left: .5em; 
}
`;


const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!, $googleId: String) {
    login(email: $email, password: $password, googleId: $googleId) {
      user {
        id
        name
        email
        photo
      }
      token
      message
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($userInput: UserInput!) {
    signup(userInput: $userInput) {
      user {
        id
        name
        email
        photo
      }
      token
      message
    }
  }
`;


export default function OnBoardingForm(props) {
  const { state, dispatch } = useStore();
  const [value, setValue] = React.useState({
    signup: false,
    login: false
  })

  const label = ['Criar conta','logar']
  // [
  //   props.currentAction === Object.keys(value)[0]?0:1
  // ]
  const [[login,signup],setLoginSignup] = useState([true,false])
  const [userInfo,setUserInfo] = useState(null);
  const [userGoogleProfile,setUserGoogleProfile] = useState(null);
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [signupMutation] = useMutation(SIGNUP_MUTATION);

  function handleLoginSignupChange(){
    setLoginSignup( ()=>[signup,login])
  }
  const handleChange = (prop)=>(event)=>{
    setValue(oldValue=>({
      ...oldValue,
      [prop]: event.target.value
    }))
  }
  const onGoogleSuccess = (data)=>{
    setUserInfo(data)
  }
  const onGoogleError = (error)=>{
    setUserInfo(null)
  }

  const handleToggleMode = () => {
    // Dispatch the toggleModal action to switch between login and signup modals
    dispatch({
      type: 'TOGGLE_MODAL',
      payload: { modalName: login ? 'login' : 'signup' },
    });
  };

  const handleGoogleAuth = () =>useGoogleLogin({
    onSuccess: onGoogleSuccess,
    onError: onGoogleError
  })


  useEffect(()=>{
    console.log(`\n-label${label}`)
    // debugger
    if(userInfo){

        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userInfo.access_token}`,{
          headers:{
            Authorization: `Bearer ${userInfo.access_token}`,
            Accept: 'application/json'
          }
        })
        .then(res=>{
          console.log('on--success--',res)
          setUserGoogleProfile(res.data)
          handleGoogleSignupOrLogin(res.data);
        })
        .catch(error =>{
          console.log('on-error--',error)
        })
  }
    

  },[
    userInfo
  ])

  const handleGoogleSignupOrLogin = async (googleProfile) => {
    try {
      const mutation = login ? loginMutation : signupMutation;
      const variables = login
        ? { 
          googleId: googleProfile.id,
          email: googleProfile.email, 
          password: 'google_oauth'
         }
        : 
        {
            userInput: {
              googleId: googleProfile.id,
              name: googleProfile.name,
              email: googleProfile.email,
              password: 'google_oauth',
            },
        };

      const { data } = await mutation({ variables });

      const token = data[login ? 'login' : 'signup'].token;
      const user = data[login ? 'login' : 'signup'].user;
      if (token) {
        // Store token in localStorage
        localStorage.setItem('authToken', token);
        dispatch({ type: 'SET_SESSION', payload: { isLoggedIn: true, user } });
        dispatch({
          type: 'TOGGLE_MODAL',
          payload: { modalName: null }, // Close all modals
        });
        setLoggedUser(user);
        toast.success(`${data[login ? 'login' : 'signup'].message}`, {
          position: "top-right",
          autoClose: 5000, // 5 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // Close the modal
        dispatch({ type: 'closeModal' });
      }
    } catch (error) {
      console.log('Error in Google Authentication:', error);
      toast.error(`${error.message}`, {
        position: "top-right",
        autoClose: 5000, // 5 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // debugger
    }
  };

  const handleEmailAuth = () => {
    handleToggleMode()
  };

  return (
    <OnBoardingContainer className='onboarding-container'>
      <Typography variant='h4' sx={{fontSize: '1.5rem',fontFamily: 'gotham-medium',textAlign: 'center',paddingTop: '1em'}}>
        {login? 'Entrar na sua conta' : 'Criar uma conta'}
      </Typography>
      <Typography sx={{fontSize: '.8rem',fontFamily: 'gotham-light',textAlign: 'center'}}>
        {login ? 'Acesse sua conta e faça sua reserva, anuncie imóveis' : 'Crie sua conta para começar a anunciar imóveis'}
      </Typography>
      <ActionButtons className='current-action' onClick={()=>{
        dispatch({
          type: 'activeModal',
          payload: 0
        })
      }}>
        <button className={signup && 'selected'} onClick={()=>{handleLoginSignupChange()}}> Criar conta</button>
        <button className={login && 'selected'} onClick={()=>{handleLoginSignupChange()}}>Login</button>
      </ActionButtons>
      <LogoAndContent className='login-with-google'
          onClick={handleGoogleAuth()}
          >
          <GoogeLogo/>
          <span>{login? label[1]: label[0]} com google</span>
      </LogoAndContent>
      <OtherOptions className='other-option'>
        <Line className='left'/><span>Ou</span><Line className='right'/>
      </OtherOptions>
      <Typography sx={{cursor: 'pointer'}} onClick={handleEmailAuth}>
        {login? label[1]: label[0]} com <span className='highlight-yellow'>Email</span>
      </Typography>
      <Typography sx={{
        marginTop: '5em',
        fontFamily: 'gotham-light',
        fontSize: '.8rem',
        textAlign: 'center'
      }}>
      Criando uma conta, eu concordo em ler os <span className='highlight-black'>Termos de serviços</span>
      e confirmo ter lido as <span className='highlight-black'>politicas de privacidade</span> tanto quanto seu termos
      </Typography>
    </OnBoardingContainer>
  );
}
