import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-text">Mahabaleshwar</span>
          </div>
          <p>Curating the world's most beautiful hill station experiences.</p>
        </div>

        <div className="footer-links">
          <div className="link-group">
            <h4>Explore</h4>
            <a href="#villas">Villas</a>
            <a href="#hotels">Hotels</a>
            <a href="#cabins">Cabins</a>
          </div>
          <div className="link-group">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#careers">Careers</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="link-group">
            <h4>Support</h4>
            <a href="#help">Help Center</a>
            <a href="#safety">Safety Info</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Mahableshwar Stays. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
