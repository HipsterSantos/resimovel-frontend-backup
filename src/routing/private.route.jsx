import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../contexts/states.store.context';

export default function PrivateRoute() {
  const { state } = useStore();
  const { isLoggedIn } = state.session || {}; // Adjust based on your store structure
  const authToken = localStorage.getItem('authToken');

  // Check if user is authenticated (either via store or token)
  const isAuthenticated = isLoggedIn || !!authToken;

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
}