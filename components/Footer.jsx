import React from 'react';

const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="eyebrow">Defining safari frontiers</span>
          <h2>Ready for your next African adventure?</h2>
        </div>
        
        <div className="footer-details">
          <div className="contact-item">
            <strong>Call or WhatsApp us:</strong>
            <a href="tel:+254722774952">+254 722 774 952</a>
          </div>
          <div className="contact-item">
            <strong>Email:</strong>
            <a href="mailto:safariscbsi@gmail.com">safariscbsi@gmail.com</a>
          </div>
          <div className="contact-item">
            <strong>Location:</strong>
            <p>P.O. Box 26247-00100, GPO Nairobi-Kenya</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;