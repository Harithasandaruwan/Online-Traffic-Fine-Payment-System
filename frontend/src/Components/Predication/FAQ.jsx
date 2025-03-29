import React, { useState } from "react";
import { motion } from "framer-motion";
import "./FAQ.css";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { question: "How can I check my pending fines?", answer: "You can check by entering your vehicle or driver's license number on our homepage." },
    { question: "What payment methods do you accept?", answer: "We accept credit/debit cards, mobile banking, and e-wallets." },
    { question: "How long does it take for a payment to reflect?", answer: "Payments are processed instantly, but it may take up to 24 hours in some cases." },
  ];

  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {faq.question} <span>{openIndex === index ? "−" : "+"}</span>
            </button>

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={openIndex === index ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="faq-answer-wrapper"
            >
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="faq-answer"
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
