import React from 'react';
import './Footer.css'; // Importing CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src="./src/assets/2.png" alt="Police FPS" className="logo-img" />
        </div>
        <div className="footer-text">
          <p>© 2025 Online Traffic Fine Payment System. All rights reserved.</p>
          <p>Designed for a seamless and secure experience.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

