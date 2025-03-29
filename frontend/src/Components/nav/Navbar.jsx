import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react'; // Importing the profile icon from lucide-react
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="logo">
          <img src="./src/assets/2.png" alt="Logo" />
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="auth-buttons">
          <Link to="/profile" className="profile-link">
            <User size={24} className="profile-icon" /> {/* Profile icon from lucide-react */}
          </Link>
          <Link to="/login">
            <button className="sign-in">Sign In</button>
          </Link>
          <Link to="/signup">
            <button className="sign-up">Sign Up</button>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;