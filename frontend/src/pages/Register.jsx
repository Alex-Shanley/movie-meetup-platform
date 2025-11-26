import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.username?.[0] ||
          err.response?.data?.email?.[0] ||
          'Registration failed'
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left side - movie collage (same as login) */}
        <div className="login-art-side">
          <div className="login-art">
            <div className="login-art-overlay" />
          </div>
        </div>

        {/* Right side - Register card */}
        <div className="login-form-side">
          <div className="login-form-content">
            {/* Intro */}
            <div className="login-intro">
              <h1 className="login-title">Register Now!</h1>
              <p className="login-subtitle">Create an account with your details below</p>
            </div>

            {/* Error message */}
            {error && <div className="login-error">{error}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="register-name-row">
                <div className="form-field">
                  <label htmlFor="first_name" className="form-label">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className="form-input"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="last_name" className="form-label">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    className="form-input"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  placeholder="Shanley"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={formData.email}
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

              <div className="form-field">
                <label htmlFor="password2" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  className="form-input"
                  placeholder="********"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-signin">Register</button>
            </form>

            {/* Link to login */}
            <p className="signup-link">
              Have an account ? <Link to="/login">Log in here</Link>
            </p>

            {/* Brand footer */}
            <div className="login-brand">
              <span className="login-brand-caption">Powered by</span>
              <a
                href="https://www.figma.com/design/OFSfbqftZqJYJQRjxW40Fj/Movie-geek?node-id=36-698"
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

export default Register;
