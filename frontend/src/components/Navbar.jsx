import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
    navigate('/');
  };

  const handleNavLinkClick = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={handleNavLinkClick}>
          Movie<span>Geek</span>
        </Link>

        <button
          type="button"
          className={`nav-toggle${isMenuOpen ? ' open' : ''}`}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>

        <ul className={`nav-menu${isMenuOpen ? ' nav-menu-open' : ''}`}>
          <li>
            <Link to="/" onClick={handleNavLinkClick}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/movies" onClick={handleNavLinkClick}>
              Movies
            </Link>
          </li>
          <li>
            <Link to="/meetups" onClick={handleNavLinkClick}>
              Meetups
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/dashboard" onClick={handleNavLinkClick}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/meetups/create" onClick={handleNavLinkClick}>
                  Create Meetup
                </Link>
              </li>
              <li>
                <span className="nav-user">Hi, {user?.username}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={handleNavLinkClick}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={handleNavLinkClick}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
