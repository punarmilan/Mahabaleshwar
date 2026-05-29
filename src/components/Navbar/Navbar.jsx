import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Check for user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo">
          <span className="logo-text">Mahabaleshwar</span>
        </div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#explore">Explore</a>
          {user && user.role === 'owner' && <a href="#register">Host Your Stay</a>}
          {user ? (
            <div className="user-profile">
              <Link to="/dashboard" className="dashboard-link">Dashboard</Link>
              <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-outline logout-btn">Logout</button>
            </div>
          ) : (
            <Link to="/signin" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
