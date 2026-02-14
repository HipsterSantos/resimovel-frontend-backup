import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import './App.css';
import { router } from './routing';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderComponent from './components/loader';
import StoreProvider from './contexts/states.store.context';
import GoogleMapProvider from './contexts/google.map.context';
import { ApolloProvider } from '@apollo/client';
import Client from './helpers/graphql';
import { Logger } from './helpers/logging';

const MenuComponent = React.lazy(() => import('./components/menu'));
const FooterSection = React.lazy(() => import('./pages/footer'));

// Environment Variables with Default Fallbacks
const clientId =
  import.meta.env.VITE_CLIENT_ID ||
  '1040714255038-4cn9igdoip6lin1l9bt05o92m9hjvv0e.apps.googleusercontent.com';

const javascriptOrigins =
  import.meta.env.VITE_JAVASCRIPT_ORIGINS?.split(',') ||
  'http://localhost,http://localhost:5173,https://frontend-2-c1eg.vercel.app';

const logger = new Logger('App.jsx');

logger.info(`Client ID: ${clientId}`);
logger.warning(`JavaScript Origins: ${javascriptOrigins}`);

function App() {
  if (!clientId) {
    console.error('❌ Missing Google OAuth client ID!');
    return <div>Error: Missing Google OAuth Configuration.</div>;
  }

  return (
    <ApolloProvider client={Client}>
      <GoogleMapProvider> {/* ✅ SINGLE Google Maps loader */}
        <StoreProvider>
          <GoogleOAuthProvider clientId={clientId}>
            <Suspense fallback={<LoaderComponent />}>
              <RouterProvider router={router} />
              <ToastContainer autoClose={3000} />
            </Suspense>
          </GoogleOAuthProvider>
        </StoreProvider>
      </GoogleMapProvider>
    </ApolloProvider>
  );
}

export default App;
