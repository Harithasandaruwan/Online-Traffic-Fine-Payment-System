import React from "react";
import "./Services.css";
import Navbar from '../nav/Navbar';
import Footer from '../nav/Footer';
import FAQ from "./FAQ"; // Import the FAQ component

const Services = () => {
  return (
    <div>
      {/* Upper Purple Header */}
      <div className="header">
        <p>Welcome to the Online Traffic Fine Payment System</p>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Services Section */}
      <div className="services-container">
        <h1>Our Services</h1>
        <p>
          "We offer a fast and convenient way to check, pay, and manage your
          traffic fines. Avoid long queues and settle your payments securely
          from the comfort of your home."
        </p>

        <div className="service-grid">
          <div className="service-card">
            <h2>Traffic Fine Inquiry</h2>
            <p>
              Check your pending fines by entering your vehicle/license number.
            </p>
            <button>Check Fine</button>
          </div>

          <div className="service-card">
            <h2>Online Fine Payment</h2>
            <p>
              Pay your fines securely via credit/debit cards, or mobile banking.
            </p>
            <button>Pay Fine Now</button>
          </div>

          <div className="service-card">
            <h2>Appeal & Dispute</h2>
            <p>Submit an appeal for incorrect fines and track the process.</p>
            <button>Submit Appeal</button>
          </div>

          <div className="service-card">
            <h2>Payment History</h2>
            <p>View and download receipts of your past fine payments.</p>
            <button>View History</button>
          </div>

          <div className="service-card">
            <h2>Traffic Rules & Penalties</h2>
            <p>
              Stay updated on traffic laws, penalties, and road safety rules.
            </p>
            <button>Read Rules</button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Services;
