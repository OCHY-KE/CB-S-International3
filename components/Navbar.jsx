import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from '../src/styles/Navbar.module.css';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => setIsMenuOpen(false);

  return (
    <header className={`${styles.siteHeader} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContainer}>
        <div className={styles.brandWrap} onClick={() => { navigate('/'); setIsMenuOpen(false); }}>
          <img
            src="https://res.cloudinary.com/cioghqt5/image/upload/v1787043861/copy_of_copy_of_cbsi1.ico"
            alt="CB SI Logo"
            className={styles.brandLogo}
          />
          <div className={styles.brandCopy}>
            <p className={styles.brandName}>
              Conference Bookings &
            </p>
            <p className={styles.brandName}>Safaris International</p>
            <span className={styles.brandTag}>defining safari frontiers</span>
          </div>
        </div>

        <button
          className={`${styles.mobileToggle} ${isMenuOpen ? styles.active : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className={styles.hamburger}></span>
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <div className={styles.navLinks}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive || (item.path === '/' && location.pathname === '/') ? styles.activeLink : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className={styles.navActions}>
            <button className={styles.textButton} onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>
              Login
            </button>
            <button className={styles.ctaButton} onClick={() => { navigate('/about'); setIsMenuOpen(false); }}>
              Book a consultation
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;