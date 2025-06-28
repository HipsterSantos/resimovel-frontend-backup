import React from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { gql } from '@apollo/client';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import GoogleLogo from '@svg/google-logo';
import { useStore } from '../contexts/states.store.context';

// GraphQL Mutations
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String, $googleId: String) {
    login(email: $email, password: $password, googleId: $googleId) {
      user { id name email verifiedEmail }
      token
      message
      success
    }
  }
`;

const SEND_OTP_MUTATION = gql`
  mutation SendOTP($email: String!, $phone: String) {
    sendOTP(email: $email, phone: $phone) {
      success
      message
    }
  }
`;

const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOTP($email: String!, $otp: String!) {
    verifyOTP(email: $email, otp: $otp) {
      user { id name email verifiedEmail }
      token
      message
      success
    }
  }
`;

// Styled Components (unchanged from your version, omitted for brevity)

export default function LoginForm() {
  const { dispatch } = useStore();
  const navigate = useNavigate();
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [sendOTPMutation] = useMutation(SEND_OTP_MUTATION);
  const [verifyOTPMutation] = useMutation(VERIFY_OTP_MUTATION);
  const [formValues, setFormValues] = React.useState({
    email: '',
    password: '',
    googleId: '',
    otp: '',
  });
  const [errors, setErrors] = React.useState({
    email: '',
    password: '',
    otp: '',
    login: '',
  });
  const [showOTP, setShowOTP] = React.useState(false);

  const handleChange = (prop) => (event) => {
    setFormValues((old) => ({ ...old, [prop]: event.target.value }));
    setErrors((old) => ({ ...old, [prop]: '', login: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', otp: '', login: '' };

    if (!formValues.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formValues.googleId && !formValues.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!formValues.googleId && formValues.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (showOTP && !formValues.otp) {
      newErrors.otp = 'OTP is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const { data } = await loginMutation({
        variables: {
          email: formValues.email,
          password: formValues.password,
          googleId: formValues.googleId,
        },
      });

      if (!data.login.success) {
        if (data.login.message.includes('verify your email')) {
          setShowOTP(true);
          toast.info('Please enter the OTP sent to your email/SMS');
          return;
        }
        throw new Error(data.login.message);
      }

      if (data.login.token) {
        localStorage.setItem('authToken', data.login.token);
        dispatch({
          type: 'SET_SESSION',
          payload: { isLoggedIn: true, user: data.login.user },
        });
        dispatch({
          type: 'TOGGLE_MODAL',
          payload: { modalName: 'login' },
        });
        toast.success(data.login.message);
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors((old) => ({ ...old, login: error.message }));
      toast.error(error.message);
    }
  };

  const handleVerifyOTP = async () => {
    if (!validateForm()) return;

    try {
      const { data } = await verifyOTPMutation({
        variables: {
          email: formValues.email,
          otp: formValues.otp,
        },
      });

      if (!data.verifyOTP.success) throw new Error(data.verifyOTP.message);

      localStorage.setItem('authToken', data.verifyOTP.token);
      dispatch({
        type: 'SET_SESSION',
        payload: { isLoggedIn: true, user: data.verifyOTP.user },
      });
      dispatch({
        type: 'TOGGLE_MODAL',
        payload: { modalName: 'login' },
      });
      toast.success(data.verifyOTP.message);
      navigate('/');
    } catch (error) {
      console.error('OTP verification error:', error);
      setErrors((old) => ({ ...old, otp: error.message }));
      toast.error(error.message);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      }).then((res) => res.json());

      setFormValues((old) => ({
        ...old,
        email: userInfo.email,
        googleId: userInfo.id,
      }));
      await handleLogin();
    },
    onError: () => toast.error('Google login failed'),
  });

  return (
    <React.Fragment>
      <Form>  {/* Removed onSubmit from Form */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'gotham-bold',
            textAlign: 'center',
            marginTop: '.8em',
            marginBottom: '.6em',
            fontSize: '3rem',
          }}
        >
          Login
        </Typography>
        <Typography
          sx={{
            fontSize: '.7rem',
            fontFamily: 'gotham-light',
            textAlign: 'center',
            marginBottom: '.7em',
          }}
        >
          Accesse sua conta e faça sua reserva, anuncie imóveis
        </Typography>
  
        <ModerInputContainer className="modern-input">
          <FieldName className="field-name">Email</FieldName>
          <ModerInput className="container-input-logo">
            <Input
              type="email"
              placeholder="example@server.domain"
              value={formValues.email}
              onChange={handleChange('email')}
            />
            <Icon>
              <CloseIcon />
            </Icon>
          </ModerInput>
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </ModerInputContainer>
  
        {!formValues.googleId && (
          <ModerInputContainer className="modern-input">
            <FieldName className="field-name">Palavra passe</FieldName>
            <ModerInput className="container-input-logo">
              <Input
                type="password"
                placeholder="password deve conter 8 digitos no minimo"
                value={formValues.password}
                onChange={handleChange('password')}
              />
              <Icon>
                <CloseIcon />
              </Icon>
            </ModerInput>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </ModerInputContainer>
        )}
  
        {errors.login && <ErrorMessage>{errors.login}</ErrorMessage>}
  
        <Typography
          sx={{
            fontSize: '.8rem',
            fontFamily: 'gotham-light',
            textAlign: 'center',
            marginBottom: '.7em',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          onClick={() => {
            dispatch({
              type: 'TOGGLE_MODAL',
              payload: { modalName: 'passwordRecover' },
            });
          }}
        >
          Esqueci minha senha
        </Typography>
  
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
              payload: { modalName: 'signup' },
            });
          }}
        >
          Ainda não tenho uma conta,{' '}
          <span className="highlight-yellow underline">Criar uma conta</span>
        </Typography>
  
        <SubmitButton className="submit-login-google">
          <button onClick={handleLogin}>Entrar</button>  {/* Added onClick handler */}
          <LogoAndText className="google-logo" onClick={handleGoogleLogin}>
            <GoogeLogo />
            <span>Logar com google</span>
          </LogoAndText>
        </SubmitButton>
      </Form>
    </React.Fragment>
  );
}
