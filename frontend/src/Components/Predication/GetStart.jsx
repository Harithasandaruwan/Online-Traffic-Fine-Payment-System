import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../nav/Navbar';
import Footer from '../nav/Footer';
import './GetStart.css';

const images = [
  '/prediction_image/4.jpeg',
  '/prediction_image/5.jpeg',
  '/prediction_image/1.jpeg',
  '/prediction_image/3.jpeg'
];

function GetStart() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Upper Purple Header */}
      <div className="header">
        <p>Welcome to the Online Traffic Fine Payment System</p>
      </div>

      {/* Navigation Bar */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            Welcome to <span className="highlight">Online <br />
            Traffic Fine Payment System</span>
          </h1>
          <p>
            A secure and convenient way to check and pay your traffic fines online. <br />
            No more long queues—pay in just a few clicks!
          </p>
          <Link to="/signup">
            <button className="get-started">Get Started</button>
          </Link>
        </div>

        {/* Image Slideshow */}
        <div className="hero-image">
          <img src={images[currentImage]} alt="Police Officers" />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default GetStart;