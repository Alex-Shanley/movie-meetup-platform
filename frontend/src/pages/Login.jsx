import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '', remember: false });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left side - Movie collage */}
        <div className="login-art-side">
          <div className="login-art">
            <div className="login-art-overlay" />
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="login-form-side">
          <div className="login-form-content">
            {/* Intro */}
            <div className="login-intro">
              <h1 className="login-title">Welcome back</h1>
              <p className="login-subtitle">Sign in with your details below</p>
            </div>

            {/* Error Message */}
            {error && <div className="login-error">{error}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-field">
                <label htmlFor="username" className="form-label">Email address</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  placeholder="name@company.com"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="login-options-row">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-password">Forgot password</Link>
              </div>

              <button type="submit" className="btn btn-primary btn-signin">Log in</button>
            </form>

            {/* Google Sign In */}
            <div className="social-signin">
              <button className="social-btn social-btn-google" type="button">
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                  <path d="M27.44 14.32c0-1.12-.1-2.2-.28-3.24H14v6.13h7.54c-.32 1.74-1.31 3.22-2.79 4.21v3.54h4.51c2.64-2.43 4.16-6.01 4.16-10.24z" fill="#4285F4"/>
                  <path d="M14 28c3.78 0 6.95-1.25 9.27-3.39l-4.51-3.54c-1.26.84-2.87 1.34-4.76 1.34-3.66 0-6.76-2.47-7.87-5.79H1.46v3.65C3.76 25.03 8.44 28 14 28z" fill="#34A853"/>
                  <path d="M6.13 16.62c-.28-.84-.44-1.73-.44-2.65s.16-1.81.44-2.65V7.67H1.46C.53 9.51 0 11.68 0 14s.53 4.49 1.46 6.33l4.67-3.71z" fill="#FBBC04"/>
                  <path d="M14 5.53c2.07 0 3.93.71 5.39 2.11l4.04-4.04C21.01 1.35 17.84 0 14 0 8.44 0 3.76 2.97 1.46 7.67l4.67 3.65C7.24 8 10.34 5.53 14 5.53z" fill="#EA4335"/>
                </svg>
                <span>Log in with Google</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="signup-link">
              Don't have an account ? <Link to="/register">Sign up here</Link>
            </p>

            {/* Brand footer */}
            <div className="login-brand">
              <span className="login-brand-caption">Powered by</span>
              <a
                href="https://www.figma.com/design/OFSfbqftZqJYJQRjxW40Fj/Movie-geek?node-id=30-1459&t=bw1pbJVy2bFZqqLd-4"
                target="_blank"
                rel="noopener noreferrer"
                className="login-brand-logo"
              >
                Movie<span>Geek</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
