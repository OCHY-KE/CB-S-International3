import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaFacebookF, 
  FaInstagram, 
  FaTripadvisor 
} from 'react-icons/fa'; // Install react-icons
import styles from '../styles/Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Top CTA Bar with a Safari Pattern Background */}
      <div className={styles.ctaBar}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <span className={styles.ctaSubtitle}>Start Your Journey</span>
            <h3>Ready for your next African adventure?</h3>
            <p>Defining safari frontiers with authentic experiences and luxury service.</p>
          </div>
          <a href="https://wa.me/254722774952" className={styles.whatsappBtn}>
            <FaWhatsapp /> Chat with a Safari Expert
          </a>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.footerGrid}>
          {/* Column 1: Brand & Socials */}
          <div className={styles.brandCol}>
            <img 
              src="https://res.cloudinary.com/cioghqt5/image/upload/v1786973128/cbsi1.ico" 
              alt="CB SI Logo" 
              className={styles.logo} 
            />
            <p className={styles.description}>
              Strengthened by valuable experience, CB&SI combines luxury, style, 
              service, and authenticity to provide unique, exciting adventures across the wild heart of Africa.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com/cbsisafaris" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://instagram.com/cbsisafaris" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://tripadvisor.com" target="_blank" rel="noopener noreferrer" aria-label="TripAdvisor"><FaTripadvisor /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.linksCol}>
            <h4>Explore</h4>
            <ul className={styles.list}>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/gallery">Safari Gallery</Link></li>
              <li><Link to="/contact">Plan Your Trip</Link></li>
              <li><Link to="/login">Client Portal</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className={styles.contactCol}>
            <h4>Contact Us</h4>
            <div className={styles.contactItem}>
              <FaPhoneAlt className={styles.icon} />
              <div>
                <p>Call or WhatsApp:</p>
                <a href="tel:+254722774952">+254 722 774 952</a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.icon} />
              <div>
                <p>Email us:</p>
                <a href="mailto:safariscbsi@gmail.com">safariscbsi@gmail.com</a>
              </div>
            </div>
            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.icon} />
              <div>
                <p>Our Head Office:</p>
                <address>P.O. Box 26247-00100, GPO<br />Nairobi, Kenya</address>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            <p>&copy; {currentYear} Conference Bookings & Safaris International.</p>
          </div>
          
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
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;