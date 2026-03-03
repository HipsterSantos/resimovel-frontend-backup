// src/routing.js
import { createBrowserRouter } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LandingPage from '../containers/landing-page';
import FilterHouses from '../pages/filter-houses';
import HouseDetails from '../pages/HouseDetails';
import Dashboard from '../containers/dashboard';
import NotFound from '../pages/NotFound';
import PrivateRoute from './private.route';
import AboutUs from '../pages/AboutUs/index';

// Lazy load MenuComponent and FooterSection
const MenuComponent = lazy(() => import('../components/menu'));
const FooterSection = lazy(() => import('../pages/footer'));

// Layout component to include MenuComponent, content, and FooterSection
const Layout = ({ children }) => (
  <>
    <Suspense fallback={<div>Loading Menu...</div>}>
      <MenuComponent />
    </Suspense>
    {children}
    <Suspense fallback={<div>Loading Footer...</div>}>
      <FooterSection />
    </Suspense>
  </>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><LandingPage /></Layout>,
  },
  {
    path: '/sobre-nos',
    element: <Layout><AboutUs/></Layout>,
  },
  {
    path: '/:type_operation/imovel/:location',
    element: <Layout><FilterHouses /></Layout>,
  },
  {
    path: '/imovel/:id/:type_operation/:house_slug',
    element: <Layout><HouseDetails /></Layout>,
  },
  {
    path: '/imovel/:id/:type_operation',
    element: <Layout><FilterHouses /></Layout>,
  },
  {
    path: '/imovel/:type_operation',
    element: <Layout><FilterHouses /></Layout>,
  },
  {
    path: '/auth/login',
    element: <Layout><LandingPage /></Layout>, // Modal handled by MenuComponent
  },
  {
    path: '/auth/signup',
    element: <Layout><LandingPage /></Layout>,
  },
  {
    path: '/auth/password-recover',
    element: <Layout><LandingPage /></Layout>,
  },
  {
    path: '/Dashboard',
    element: <PrivateRoute />,
    children: [
      {
        path: '',
        element: <Layout><Dashboard /></Layout>,
      },
      {
        path: 'settings',
        element: <Layout><Dashboard /></Layout>,
      },
      {
        path: 'profile',
        element: <Layout><Dashboard /></Layout>,
      },
      {
        path: 'approve',
        element: <Layout><Dashboard /></Layout>,
      },
      {
        path: 'account/individual-broker',
        element: <Layout><Dashboard /></Layout>,
      },
      {
        path: 'account/real-state-broker',
        element: <Layout><Dashboard /></Layout>,
      },
    ],
  },
  {
    path: '*',
    element: <Layout><NotFound /></Layout>,
  },
]);