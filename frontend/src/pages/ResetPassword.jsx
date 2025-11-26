import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ error: '', success: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ error: '', success: '' });
    setIsSubmitting(true);

    try {
      // TODO: Wire this up to your real password reset endpoint.
      await new Promise((resolve) => setTimeout(resolve, 600));

      setStatus({
        error: '',
        success: 'Check your inbox for a link to reset your password.',
      });
    } catch (err) {
      setStatus({
        success: '',
        error:
          err.response?.data?.detail ||
          'We were unable to send a reset link. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left side - movie collage (same as login/register) */}
        <div className="login-art-side">
          <div className="login-art">
            <div className="login-art-overlay" />
          </div>
        </div>

        {/* Right side - Reset Password card */}
        <div className="login-form-side">
          <div className="login-form-content">
            {/* Intro */}
            <div className="login-intro reset-intro">
              <h1 className="login-title reset-title">Reset password</h1>
              <p className="login-subtitle reset-subtitle">
                Enter the email associated with your account and we&apos;ll send you a link
                to reset your password.
              </p>
            </div>

            {/* Status messages */}
            {status.error && <div className="login-error">{status.error}</div>}
            {status.success && <div className="login-success">{status.success}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-field">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-signin btn-reset"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            {/* Back to login */}
            <p className="signup-link reset-footer-link">
              Remember your password? <Link to="/login">Back to login</Link>
            </p>

            {/* Brand footer */}
            <div className="login-brand">
              <span className="login-brand-caption">Powered by</span>
              <a
                href="https://www.figma.com/design/OFSfbqftZqJYJQRjxW40Fj/Movie-geek?node-id=41-693"
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

export default ResetPassword;
