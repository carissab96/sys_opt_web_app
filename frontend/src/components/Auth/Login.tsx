
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import './login.css';

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isLoading = useAppSelector((state: { auth: { loading: any; }; }) => state.auth.loading);
  const isAuthenticated = useAppSelector((state: { auth: { isAuthenticated: any; }; }) => state.auth.isAuthenticated);
  const authError = useAppSelector((state: { auth: { error: any; }; }) => state.auth.error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await dispatch(login({ username, password })).unwrap();
      console.log('Login result:', result); // Debug log
      
      if (result.access) { // If we got a token
        console.log('Login successful, attempting navigation...'); // Debug log
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err); // Debug log
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  // Add effect to handle successful login
  React.useEffect(() => {
    if (isAuthenticated) {
      console.log('Auth state changed to authenticated, navigating...'); // Debug log
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        
        {isLoading && <div className="loading">Logging in...</div>}
        {error && <div className="error-message">{error}</div>}
        {authError && <div className="error-message">{authError}</div>}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-info" style={{ fontSize: '12px', color: '#666' }}>
            Auth State: {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </div>
        )}
      </form>
    </div>
  );
};