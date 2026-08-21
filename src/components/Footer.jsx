import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className={styles.footer}>
      {/* Top CTA Bar */}
      <div className={styles.ctaBar}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h3>Ready for your next African adventure?</h3>
            <p>Defining safari frontiers with authentic experiences.</p>
          </div>
          <a href="https://wa.me/254722774952" className={styles.whatsappBtn}>
            Chat on WhatsApp
          </a>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Column 1: Brand */}
          <div className={styles.brandCol}>
            <img 
              src="https://res.cloudinary.com/cioghqt5/image/upload/v1786973128/cbsi1.ico" 
              alt="CB SI Logo" 
              className={styles.logo} 
            />
            <p className={styles.description}>
              Strengthened by valuable experience, CB&SI combines luxury, style, 
              service, and authenticity to provide unique, exciting adventures.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.linksCol}>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/login">Client Portal</Link></li>
              <li><Link to="/admin-dashboard?tab=gallery">Admin Gallery Hub</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info (Direct from PDF) */}
          <div className={styles.contactCol}>
            <h4>For more information</h4>
            <div className={styles.contactItem}>
              <span className={styles.icon}>📞</span>
              <div>
                <p>Call or WhatsApp us:</p>
                <a href="tel:+254722774952">+254 722 774 952</a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.icon}>✉️</span>
              <div>
                <p>Email us:</p>
                <a href="mailto:safariscbsi@gmail.com">safariscbsi@gmail.com</a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.icon}>📍</span>
              <div>
                <p>Location:</p>
                <address>P.O. Box 26247-00100, GPO<br />Nairobi-Kenya</address>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p>&copy; {currentYear} Conference Bookings & Safaris International. All rights reserved.</p>
          <div className={styles.designerCredit}>
            <span>Designed by </span>
            <a 
              href="https://www.pefak56church.top/ict-team" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.designerLink}
            >
              PEFAK56 ICT TEAM
            </a>
          </div>
          <div className={styles.legalLinks}>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;