import React, { useState, useEffect } from 'react';
import styles from '../src/styles/Navbar.module.css';

const navItems = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'about' },
];

function Navbar({ currentPage, onPageChange }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect for modern feel
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, page) => {
    e.preventDefault();
    onPageChange(page);
    setIsMenuOpen(false);
  };

  return (
    <header className={`${styles.siteHeader} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContainer}>
        {/* Brand Section */}
        <div className={styles.brandWrap} onClick={() => onPageChange('home')}>
          <img 
            src="https://res.cloudinary.com/cioghqt5/image/upload/v1786973128/cbsi1.ico" 
            alt="CB SI Logo" 
            className={styles.brandLogo} 
          />
          <div className={styles.brandCopy}>
            <p className={styles.brandName}>
              Conference Bookings <span>&</span>
            </p>
            <p className={styles.brandName}>Safaris International</p>
            <span className={styles.brandTag}>defining safari frontiers</span>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={`${styles.mobileToggle} ${isMenuOpen ? styles.active : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className={styles.hamburger}></span>
        </button>

        {/* Navigation */}
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <div className={styles.navLinks}>
            {navItems.map((item) => (
              <a
                key={item.page}
                href={`#${item.page}`}
                onClick={(e) => handleNavClick(e, item.page)}
                className={`${styles.navLink} ${currentPage === item.page ? styles.activeLink : ''}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className={styles.navActions}>
            <button className={styles.textButton} onClick={() => onPageChange('user-login')}>
              User Login
            </button>
            <button className={styles.textButton} onClick={() => onPageChange('admin-login')}>
              Admin Login
            </button>
            <a className={styles.ctaButton} href="#contact">
              Book a consultation
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;