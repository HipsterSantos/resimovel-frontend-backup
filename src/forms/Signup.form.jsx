import * as React from 'react';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import CustomInput from '../components/custom-input';
import GoogeLogo from '@svg/google-logo';
import styled from 'styled-components';
import './style.scss';
import { useStore } from '../contexts/states.store.context';
import { useMutation, gql } from '@apollo/client';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
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
  display: flex;
  & > *:nth-child(1) {
    margin-right: 1em;
  }
`;

const SIGNUP_MUTATION = gql`
  mutation signup($userInput: UserInput!) {
    signup(userInput: $userInput) {
      success
      message
      token
      user {
        id
        name
        email
        phone
        verifiedEmail
        photoUrl
        authWith
      }
      errors
      dev {
        tempEmail
        note
      }
    }
  }
`;

export default function SignupForm(props) {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const [signupMutation, { loading: signupLoading }] = useMutation(SIGNUP_MUTATION);

  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    fullAddress: '',
    password: '',
    notifyMeThrough: [],
  });

  const [errors, setErrors] = React.useState({
    name: '',
    email: '',
    phone: '',
    password: '', 
    general: '',
  });

  // ────────────────────────────────────────────────
  // Validation
  // ────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};
    let valid = true;

    if (!form.name.trim()) {
      newErrors.name = 'Nome completo é obrigatório';
      valid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email é obrigatório';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Formato de email inválido';
      valid = false;
    }

    if (!form.password) {
      newErrors.password = 'Senha é obrigatória';
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
      valid = false;
    }

    // Phone is optional, but if filled → basic check
    if (form.phone && !/^\+?\d{6,15}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Número de telefone inválido';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ────────────────────────────────────────────────
  // Normal Signup (email + password)
  // ────────────────────────────────────────────────
  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setErrors((prev) => ({ ...prev, general: '' }));
      console.log('Signup input:', form);
      debugger
      const { data } = await signupMutation({
        variables: {
          userInput: {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            phone: form.phone.trim() || undefined,
            street: form.street.trim() || undefined,
            fullAddress: form.fullAddress.trim() || undefined,
            notifyMeThrough: form.notifyMeThrough.length > 0 ? form.notifyMeThrough : ['email'],
          },
        },
      });

      const res = data?.signup;
      debugger
      if (!res?.success) {
        const errorText =
          res?.errors?.length > 0
            ? res.errors.join(' • ')
            : res?.message || 'Não foi possível criar a conta';
        setErrors((prev) => ({ ...prev, general: errorText }));
        toast.error(errorText);
        return;
      }

      // Success feedback
      toast.success(res.message || 'Cadastro realizado com sucesso!');

      // If token returned → auto-login
      if (res.token) {
        localStorage.setItem('authToken', res.token);
        const normalizedUser = {
          ...res.user,
          photo: res.user?.photo || res.user?.photoUrl || res.user?.picture || null,
        };

        dispatch({
          type: 'SET_SESSION',
          payload: { token: res.token, user: normalizedUser },
        });
        localStorage.setItem('authUser', JSON.stringify(normalizedUser));

        dispatch({
          type: 'SET_MODAL',
          payload: {
            login: { open: false },
            signup: { open: false },
            onBoarding: { open: false },
            passwordRecover: { open: false },
            createImovel: { open: false },
            searchingOnMap: { open: false },
          },
        });
        navigate('/');
      } else {
        // Needs OTP verification
        toast.info('Verifique o código enviado ao seu email (e SMS se aplicável)');
        // Optionally: open OTP modal / page here
        dispatch({
          type: 'TOGGLE_MODAL',
          payload: { modalName: 'signup' },
        });
      }

      // Optional: clear form after success
      setForm({
        name: '',
        email: '',
        phone: '',
        street: '',
        fullAddress: '',
        password: '',
      });
    } catch (err) {
      const msg =
        err.graphQLErrors?.[0]?.message ||
        'Erro ao criar conta. Por favor tente novamente.';
      setErrors((prev) => ({ ...prev, general: msg }));
      toast.error(msg);
      console.error('Signup failed:', err);
    }
  };

  // ────────────────────────────────────────────────
  // Google Signup
  // ────────────────────────────────────────────────
  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Não foi possível obter informações do Google');
        }

        const googleUser = await response.json();

        // Prepare payload for backend - only include fields that have values
        const userInput = {
          name: googleUser.name || googleUser.given_name || 'Usuário Google',
          email: googleUser.email,
          googleId: googleUser.id,
          notifyMeThrough: ['email'],
        };

        // Add Google profile picture if available
        if (googleUser.picture) {
          userInput.photoUrl = googleUser.picture;
        }

        console.log('Google userInput being sent:', userInput);

        const { data } = await signupMutation({
          variables: { userInput },
        });

        console.log('Signup response:', data);

        const res = data?.signup;

        if (!res?.success) {
          const errorText =
            res?.errors?.length > 0
              ? res.errors.join(' • ')
              : res?.message || 'Falha ao criar conta com Google';
          toast.error(errorText);
          return;
        }

        toast.success(res.message || 'Conta criada com sucesso via Google!');

        if (res.token) {
          localStorage.setItem('authToken', res.token);
          const normalizedUser = {
            ...res.user,
            photo: res.user?.photo || res.user?.photoUrl || res.user?.picture || null,
          };

          dispatch({
            type: 'SET_SESSION',
            payload: { token: res.token, user: normalizedUser },
          });
          localStorage.setItem('authUser', JSON.stringify(normalizedUser));

          dispatch({
            type: 'SET_MODAL',
            payload: {
              login: { open: false },
              signup: { open: false },
              onBoarding: { open: false },
              passwordRecover: { open: false },
              createImovel: { open: false },
              searchingOnMap: { open: false },
            },
          });
          navigate('/');
        } else {
          toast.info('Verifique seu email para completar o cadastro');
        }
      } catch (err) {
        console.log('error -- ',err)
        debugger
        console.error('Google signup detailed error:', {
          message: err.message,
          graphQLErrors: err.graphQLErrors,
          networkError: err.networkError,
          fullError: err,
        });
        toast.error('Não foi possível cadastrar com Google. Tente novamente.');
      }
    },
    onError: () => {
      toast.error('Falha na autenticação com Google');
    },
    flow: 'implicit',
  });

  const handleChange = (prop) => (event) => {
    setForm((prev) => ({
      ...prev,
      [prop]: event.target.value,
    }));

    // Clear error when user starts typing
    if (errors[prop]) {
      setErrors((prev) => ({ ...prev, [prop]: '' }));
    }
  };

  const handleNotificationChange = (option) => {
    setForm((prev) => {
      const updated = [...prev.notifyMeThrough];
      if (updated.includes(option)) {
        return {
          ...prev,
          notifyMeThrough: updated.filter((item) => item !== option),
        };
      } else {
        return {
          ...prev,
          notifyMeThrough: [...updated, option],
        };
      }
    });
  };

  return (
    <React.Fragment>
      <Form>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'gotham-bold',
            textAlign: 'center',
            marginTop: '.8em',
            marginBottom: '.6em',
            fontSize: '2rem',
          }}
        >
          Criar uma conta
        </Typography>

        <Typography
          sx={{
            fontSize: '.7rem',
            fontFamily: 'gotham-light',
            textAlign: 'center',
            marginBottom: '.7em',
          }}
        >
          Acesse sua conta e faça sua reserva, anuncie imóveis
        </Typography>

        <CustomInput
          type="text"
          placeholder="Nome completo"
          property="name"
          label="Nome"
          value={form.name}
          onChange={handleChange('name')}
          error={!!errors.name}
          helperText={errors.name}
        />

        <MultipleField className="multiple-field controller">
          <CustomInput
            type="email"
            value={form.email}
            placeholder="example@server.domain"
            property="email"
            label="Email"
            width={50}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
          />

          <CustomInput
            type="tel"
            value={form.phone}
            placeholder="+244 9XX XXX XXX"
            property="phone"
            label="Telefone"
            width={50}
            onChange={handleChange('phone')}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </MultipleField>

        <MultipleField className="multiple-field controller">
          <CustomInput
            type="text"
            value={form.street}
            placeholder="Rua N23"
            label="Rua"
            property="street"
            width={50}
            onChange={handleChange('street')}
            error={!!errors.street}
            helperText={errors.street}
          />

          <CustomInput
            type="text"
            value={form.fullAddress}
            placeholder="Bairro, Cidade, País"
            property="fullAddress"
            label="Localização completa"
            width={50}
            onChange={handleChange('fullAddress')}
            error={!!errors.fullAddress}
            helperText={errors.fullAddress}
          />
        </MultipleField>

        <CustomInput
          type="password"
          value={form.password}
          placeholder="Mínimo 6 caracteres"
          property="password"
          label="Palavra-passe"
          onChange={handleChange('password')}
          error={!!errors.password}
          helperText={errors.password}
        />

        <NotificationPreferences>
          <Typography sx={{ fontSize: '.85rem', fontFamily: 'gotham-medium', marginBottom: '.5em' }}>
            Como deseja ser notificado?
          </Typography>
          <CheckboxContainer>
            <label>
              <input
                type="checkbox"
                checked={form.notifyMeThrough.includes('email')}
                onChange={() => handleNotificationChange('email')}
              />
              <span>Email</span>
            </label>
            {form.phone && (
              <label>
                <input
                  type="checkbox"
                  checked={form.notifyMeThrough.includes('both')}
                  onChange={() => handleNotificationChange('both')}
                />
                <span>Email e SMS</span>
              </label>
            )}
          </CheckboxContainer>
        </NotificationPreferences>

        {errors.general && (
          <Typography color="error" sx={{ textAlign: 'center', mt: 1 }}>
            {errors.general}
          </Typography>
        )}

        <SubmitButton className="submit-login-google">
          <button
            type="button"
            onClick={handleSignup}
            disabled={signupLoading}
          >
            {signupLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <LogoAndText className="google-logo" onClick={() => !signupLoading && googleSignup()}>
            <GoogeLogo />
            <span>Cadastrar com Google</span>
          </LogoAndText>
        </SubmitButton>

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
          Já tenho uma conta,{' '}
          <span className="highlight-yellow underline">Logar</span>
        </Typography>
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

const NotificationPreferences = styled.div`
  margin: 1.5em 0 1em 0;
  padding: 1em;
  background: #f7f8fa;
  border-radius: 0.5em;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8em;

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-family: gotham-light;
    font-size: 0.9rem;

    input[type='checkbox'] {
      margin-right: 0.8em;
      cursor: pointer;
      width: 18px;
      height: 18px;
    }

    span {
      color: #404040;
    }

    &:hover span {
      color: #d9f070;
    }
  }
`;
