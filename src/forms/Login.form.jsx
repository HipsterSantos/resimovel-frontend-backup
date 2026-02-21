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

// ────────────────────────────────────────────────
// GraphQL Mutations
// ────────────────────────────────────────────────
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String, $googleId: String) {
    login(email: $email, password: $password, googleId: $googleId) {
      success
      message
      token
      user {
        id
        name
        email
        phone
        verifiedEmail
      }
      errors
    }
  }
`;

const VERIFY_OTP_MUTATION = gql`
  mutation VerifyOTP($email: String!, $otp: String!) {
    verifyOTP(email: $email, otp: $otp) {
      success
      message
      token
      user {
        id
        name
        email
        phone
        verifiedEmail
      }
      errors
    }
  }
`;

// ────────────────────────────────────────────────
// Styled Components (unchanged)
// ────────────────────────────────────────────────
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
    general: '',
  });

  const [showOTP, setShowOTP] = React.useState(false);

  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [verifyOTPMutation, { loading: verifyLoading }] = useMutation(VERIFY_OTP_MUTATION);

  const isLoading = loginLoading || verifyLoading;

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '', general: '' }));
  };

  const validateLogin = () => {
    const newErrors = { email: '', password: '', otp: '', general: '' };
    let valid = true;

    if (!formValues.email.trim()) {
      newErrors.email = 'Email é obrigatório';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = 'Email inválido';
      valid = false;
    }

    if (!formValues.googleId && !formValues.password) {
      newErrors.password = 'Senha é obrigatória';
      valid = false;
    } else if (!formValues.googleId && formValues.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validateOTP = () => {
    const newErrors = { ...errors };
    let valid = true;

    if (!formValues.otp.trim()) {
      newErrors.otp = 'OTP é obrigatório';
      valid = false;
    } else if (!/^\d{6}$/.test(formValues.otp)) {
      newErrors.otp = 'OTP deve ter exatamente 6 dígitos';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const processAuthResponse = (responseData, mutationName = 'login') => {
    const result = responseData?.[mutationName];

    if (!result) {
      throw new Error('Resposta inválida do servidor');
    }

    // Show backend-provided errors if any
    if (result.errors?.length > 0) {
      setErrors((prev) => ({ ...prev, general: result.errors.join(' • ') }));
      toast.error(result.errors.join(' • '));
      return false;
    }

    if (!result.success) {
      setErrors((prev) => ({ ...prev, general: result.message || 'Falha na autenticação' }));
      toast.error(result.message || 'Falha na autenticação');

      // Detect need for OTP verification
      if (
        result.message?.toLowerCase().includes('verif') ||
        result.message?.toLowerCase().includes('otp') ||
        result.message?.toLowerCase().includes('não verificad')
      ) {
        setShowOTP(true);
        toast.info('Por favor insira o código OTP enviado');
      }

      return false;
    }

    // Success path
    if (result.token) {
      localStorage.setItem('authToken', result.token);

      const userData = result.user || { email: formValues.email };

      dispatch({
        type: 'SET_SESSION',
        payload: { isLoggedIn: true, user: userData },
      });

      dispatch({
        type: 'TOGGLE_MODAL',
        payload: { modalName: 'login' },
      });

      toast.success(result.message || 'Bem-vindo!');
      navigate('/');
      return true;
    }

    return false;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    try {
      const { data } = await loginMutation({
        variables: {
          email: formValues.email.trim(),
          password: formValues.password || undefined,
          googleId: formValues.googleId || undefined,
        },
      });

      processAuthResponse(data);
    } catch (err) {
      const msg =
        err.graphQLErrors?.[0]?.message ||
        err.networkError?.result?.errors?.[0]?.message ||
        'Erro ao tentar entrar. Verifique sua conexão.';
      
      setErrors((prev) => ({ ...prev, general: msg }));
      toast.error(msg);
      console.error('Login error:', err);
    }
  };

  const handleVerifyOTP = async () => {
    if (!validateOTP()) return;

    try {
      const { data } = await verifyOTPMutation({
        variables: {
          email: formValues.email.trim(),
          otp: formValues.otp.trim(),
        },
      });

      processAuthResponse(data, 'verifyOTP');
    } catch (err) {
      const msg =
        err.graphQLErrors?.[0]?.message ||
        err.networkError?.result?.errors?.[0]?.message ||
        'Erro ao verificar o código. Tente novamente.';
      
      setErrors((prev) => ({ ...prev, otp: msg }));
      toast.error(msg);
      console.error('Verify OTP error:', err);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        if (!res.ok) throw new Error('Falha ao obter informações do Google');

        const googleUser = await res.json();

        console.log('Google user info:', googleUser);

        // Call login mutation directly with Google credentials
        // No form validation needed - backend handles everything
        const { data } = await loginMutation({
          variables: {
            email: googleUser.email,
            password: undefined,
            googleId: googleUser.id,
          },
        });

        console.log('Google login response:', data);

        // Process the authentication response
        const result = data?.login;

        if (!result) {
          throw new Error('Resposta inválida do servidor');
        }

        // Show errors if any
        if (result.errors?.length > 0) {
          toast.error(result.errors.join(' • '));
          console.error('Login errors:', result.errors);
          return;
        }

        // Check if login was successful
        if (!result.success) {
          // Backend may indicate no account found or other issues
          const errorMsg = result.message || 'Falha na autenticação com Google';
          toast.error(errorMsg);
          console.error('Login failed:', errorMsg);
          return;
        }

        // Success: User is authenticated
        if (result.token && result.user) {
          localStorage.setItem('authToken', result.token);

          dispatch({
            type: 'SET_SESSION',
            payload: { 
              isLoggedIn: true, 
              user: {
                ...result.user,
                photoUrl: googleUser.picture, // Use Google profile picture
              }
            },
          });

          // Close the modal
          dispatch({
            type: 'TOGGLE_MODAL',
            payload: { modalName: 'login' },
          });

          toast.success(result.message || 'Bem-vindo!');
          navigate('/');
          return;
        }

        // No token returned - something went wrong
        toast.error('Não foi possível autenticar com Google');
      } catch (err) {
        console.error('Google login error:', err);
        const errorMsg = err.graphQLErrors?.[0]?.message || 
                         err.message || 
                         'Não foi possível autenticar com Google. Tente novamente.';
        toast.error(errorMsg);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast.error('Falha na autenticação com Google. Tente novamente.');
    },
    flow: 'implicit',
  });

  return (
    <React.Fragment>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Typography variant="h4" sx={{ fontFamily: 'gotham-bold', textAlign: 'center', mb: 1 }}>
          Login
        </Typography>

        <Typography sx={{ fontSize: '0.9rem', textAlign: 'center', mb: 3, color: 'text.secondary' }}>
          Acesse sua conta para reservar ou anunciar imóveis
        </Typography>

        {/* Email */}
        <ModerInputContainer>
          <FieldName>Email</FieldName>
          <ModerInput>
            <Input
              type="email"
              placeholder="exemplo@dominio.com"
              value={formValues.email}
              onChange={handleChange('email')}
              disabled={isLoading}
            />
            {formValues.email && <Icon onClick={() => handleChange('email')({ target: { value: '' } })}><CloseIcon /></Icon>}
          </ModerInput>
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </ModerInputContainer>

        {/* Password – hidden when Google is used */}
        {!formValues.googleId && (
          <ModerInputContainer>
            <FieldName>Palavra-passe</FieldName>
            <ModerInput>
              <Input
                type="password"
                placeholder="••••••••"
                value={formValues.password}
                onChange={handleChange('password')}
                disabled={isLoading}
              />
              {formValues.password && <Icon onClick={() => handleChange('password')({ target: { value: '' } })}><CloseIcon /></Icon>}
            </ModerInput>
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </ModerInputContainer>
        )}

        {/* OTP field – shown when required */}
        {showOTP && (
          <ModerInputContainer>
            <FieldName>Código OTP (6 dígitos)</FieldName>
            <ModerInput>
              <Input
                type="text"
                placeholder="123456"
                value={formValues.otp}
                onChange={handleChange('otp')}
                maxLength={6}
                disabled={isLoading}
              />
              {formValues.otp && <Icon onClick={() => handleChange('otp')({ target: { value: '' } })}><CloseIcon /></Icon>}
            </ModerInput>
            {errors.otp && <ErrorMessage>{errors.otp}</ErrorMessage>}
          </ModerInputContainer>
        )}

        {/* General / backend errors */}
        {errors.general && <ErrorMessage>{errors.general}</ErrorMessage>}

        {isLoading && <Typography sx={{ textAlign: 'center', mt: 2 }}>Aguarde...</Typography>}

        {/* Links */}
        <Typography
          sx={{ fontSize: '0.85rem', textAlign: 'center', my: 1.5, color: 'primary.main', cursor: 'pointer' }}
          onClick={() => {
            dispatch({ type: 'TOGGLE_MODAL', payload: { modalName: 'passwordRecover' } });
          }}
        >
          Esqueci a palavra-passe
        </Typography>

        <Typography
          sx={{ fontSize: '0.85rem', textAlign: 'center', mb: 2, cursor: 'pointer' }}
          onClick={() => {
            dispatch({ type: 'TOGGLE_MODAL', payload: { modalName: 'signup' } });
          }}
        >
          Não tem conta? <strong style={{ color: '#d9f070' }}>Criar conta</strong>
        </Typography>

        {/* Actions */}
        <SubmitButton>
          <Button
            variant="contained"
            fullWidth
            onClick={showOTP ? handleVerifyOTP : handleLogin}
            disabled={isLoading}
            sx={{ py: 1.5, fontWeight: 'bold' }}
          >
            {isLoading ? 'A processar...' : showOTP ? 'Verificar Código' : 'Entrar'}
          </Button>

          <LogoAndText onClick={() => !isLoading && handleGoogleLogin()}>
            <GoogleLogo />
            <span>Entrar com Google</span>
          </LogoAndText>
        </SubmitButton>
      </Form>
    </React.Fragment>
  );
}