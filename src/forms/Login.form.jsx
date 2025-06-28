import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import GoogleLogo from '@svg/google-logo';
import { useStore } from '../contexts/states.store.context';
import { useMutation, gql } from '@apollo/client';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

// GraphQL Mutation for Login
const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String, $googleId: String) {
    login(email: $email, password: $password, googleId: $googleId) {
      user {
        id
        name
        email
        verifiedEmail
      }
      token
      message
      success
    }
  }
`;

const SEND_OTP_MUTATION = gql`
  mutation sendOTP($email: String!, $phone: String) {
    sendOTP(email: $email, phone: $phone) {
      success
      message
    }
  }
`;

const VERIFY_OTP_MUTATION = gql`
  mutation verifyOTP($email: String!, $otp: String!) {
    verifyOTP(email: $email, otp: $otp) {
      user {
        id
        name
        email
        verifiedEmail
      }
      token
      message
      success
    }
  }
`;

// Styled Components (unchanged)
const Form = styled.form`
  font-family: gotham-light !important;
  width: 30vw;
  margin-top: -1em;
  border-radius: 1em;
  box-shadow: 1px 2px 30px rgba(0, 0, 0, 0.1);
  padding: 2em;
  background: #fff;
`;

const ModerInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1em;
`;

const ModerInput = styled.div`
  display: flex;
  height: 6.5vh;
  background: #f7f8fa;
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
  scale: 0.6;
  color: #a7a7af;
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

const ErrorMessage = styled.span`
  color: red;
  font-size: 0.8rem;
  margin-top: 0.5em;
  display: block;
  text-align: center;
`;

export default function LoginForm() {
  const { dispatch } = useStore();
  const navigate = useNavigate();
  const [loginMutation, {loading: loginLoading, error: loginError }] = useMutation(LOGIN_MUTATION, {
    onError: (err) => console.error('Login mutation error:', err),
  });
  const [sendOTPMutation, { loading: otpLoading, error: otpError }] = useMutation(SEND_OTP_MUTATION, {
    onError: (err) => console.error('Send OTP mutation error:', err),
  });
  const [verifyOTPMutation, { loading: verifyLoading, error: verifyError }] = useMutation(VERIFY_OTP_MUTATION, {
    onError: (err) => console.error('Verify OTP mutation error:', err),
  });
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

  // Log Apollo errors for debugging
  React.useEffect(() => {
    if (loginError) toast.error(`Login error: ${loginError.message}`);
    if (otpError) toast.error(`Send OTP error: ${otpError.message}`);
    if (verifyError) toast.error(`Verify OTP error: ${verifyError.message}`);
  }, [loginError, otpError, verifyError]);

  const handleChange = (prop) => (event) => {
    setFormValues((old) => ({ ...old, [prop]: event.target.value }));
    setErrors((old) => ({ ...old, [prop]: '', login: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', password: '', otp: '', login: '' };

    if (!formValues.email) {
      newErrors.email = 'Email é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    if (!formValues.googleId && !formValues.password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (!formValues.googleId && formValues.password.length < 8) {
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
      isValid = false;
    }

    if (showOTP && !formValues.otp) {
      newErrors.otp = 'OTP é obrigatório';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      console.log('Sending login mutation:', formValues); // Debug log
      const { data } = await loginMutation({
        variables: {
          email: formValues.email,
          password: formValues.password,
          googleId: formValues.googleId,
        },
      });
      console.log('Login response:', data); // Debug log
      // debugger
      if (!data?.login?.success) {
        if (data?.login?.message?.includes('verify your email')) {
          setShowOTP(true);
          toast.info('Por favor, insira o OTP enviado para seu email/SMS');
          return;
        }
        // throw new Error(data?.login?.message || 'Erro desconhecido no login');
        // debugger
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
        // debugger
        navigate('/'); // Uncomment to redirect after login
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
      console.log('Sending verify OTP mutation:', formValues); // Debug log
      const { data } = await verifyOTPMutation({
        variables: {
          email: formValues.email,
          otp: formValues.otp,
        },
      });

      console.log('Verify OTP response:', data); // Debug log
      if (!data?.verifyOTP?.success) {
        throw new Error(data?.verifyOTP?.message || 'Erro desconhecido na verificação do OTP');
      }

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
      navigate('/'); // Uncomment to redirect after OTP verification
    } catch (error) {
      console.error('OTP verification error:', error);
      setErrors((old) => ({ ...old, otp: error.message }));
      toast.error(error.message);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google login token response:', tokenResponse); // Debug log
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then((res) => res.json());

        console.log('Google user info:', userInfo); // Debug log
        setFormValues((old) => ({
          ...old,
          email: userInfo.email,
          googleId: userInfo.id,
        }));
        await handleLogin();
      } catch (error) {
        console.error('Google login fetch error:', error);
        toast.error('Falha ao buscar informações do Google');
      }
    },
    onError: () => {
      console.error('Google login failed');
      toast.error('Falha no login com Google');
    },
  });

  return (
    <React.Fragment>
      <Form>
        <Typography variant="h4" sx={{ fontFamily: 'gotham-bold', textAlign: 'center', marginTop: '.8em', marginBottom: '.6em', fontSize: '3rem' }}>
          Login
        </Typography>
        <Typography sx={{ fontSize: '.7rem', fontFamily: 'gotham-light', textAlign: 'center', marginBottom: '.7em' }}>
          Accesse sua conta e faça sua reserva, anuncie imóveis
        </Typography>

        <ModerInputContainer className="modern-input">
          <FieldName className="field-name">Email</FieldName>
          <ModerInput className="container-input-logo">
            <Input type="email" placeholder="example@server.domain" value={formValues.email} onChange={handleChange('email')} />
            <Icon><CloseIcon /></Icon>
          </ModerInput>
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </ModerInputContainer>

        {!formValues.googleId && (
          <ModerInputContainer className="modern-input">
            <FieldName className="field-name">Palavra passe</FieldName>
            <ModerInput className="container-input-logo">
              <Input type="password" placeholder="mínimo 8 caracteres" value={formValues.password} onChange={handleChange('password')} />
              <Icon><CloseIcon /></Icon>
            </ModerInput>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </ModerInputContainer>
        )}

        {showOTP && (
          <ModerInputContainer className="modern-input">
            <FieldName className="field-name">OTP</FieldName>
            <ModerInput className="container-input-logo">
              <Input type="text" placeholder="Digite o OTP de 6 dígitos" value={formValues.otp} onChange={handleChange('otp')} />
              <Icon><CloseIcon /></Icon>
            </ModerInput>
            {errors.otp && <ErrorMessage>{errors.otp}</ErrorMessage>}
          </ModerInputContainer>
        )}

        {errors.login && <ErrorMessage>{errors.login}</ErrorMessage>}
        {(loginLoading || otpLoading || verifyLoading) && <Typography>Carregando...</Typography>}

        <Typography
          sx={{ fontSize: '.8rem', fontFamily: 'gotham-light', textAlign: 'center', marginBottom: '.7em', textDecoration: 'underline', cursor: 'pointer' }}
          onClick={() => {
            dispatch({ type: 'TOGGLE_MODAL', payload: { modalName: 'passwordRecover' } });
            navigate('/auth/password-recover');
          }}
        >
          Esqueci minha senha
        </Typography>

        <Typography
          sx={{ fontSize: '.8rem', fontFamily: 'gotham-medium', textAlign: 'center', marginBottom: '.7em', cursor: 'pointer' }}
          onClick={() => {
            dispatch({ type: 'TOGGLE_MODAL', payload: { modalName: 'signup' } });
            navigate('/auth/signup');
          }}
        >
          Ainda não tenho uma conta, <span className="highlight-yellow underline">Criar uma conta</span>
        </Typography>

        <SubmitButton>
          <Button
            onClick={showOTP ? handleVerifyOTP : handleLogin}
            disabled={loginLoading || otpLoading || verifyLoading}
          >
            {showOTP ? 'Verificar OTP' : 'Entrar'}
          </Button>
          <LogoAndText className="google-logo" onClick={() => handleGoogleLogin()}>
            <GoogleLogo />
            <span>Logar com Google</span>
          </LogoAndText>
        </SubmitButton>
      </Form>
    </React.Fragment>
  );
}