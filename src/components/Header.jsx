import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/components.css';

const Header = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking a link
  const closeMenu = () => {
    setMobileMenuOpen(false);
  };

  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo">
            Spirograph NFT
          </Link>
          <div className="logo-pattern"></div>
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="mobile-menu-toggle" 
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </span>
        </button>

        {/* Navigation links */}
        <nav className={`site-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/create" 
                className={`nav-link ${isActive('/create') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Create
              </Link>
            </li>
            <li>
              <Link 
                to="/collection" 
                className={`nav-link ${isActive('/collection') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                My Collection
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;