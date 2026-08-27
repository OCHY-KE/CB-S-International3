import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { supabase } from '../supabaseClient';
import styles from '../styles/Navbar.module.css';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' },
  { label: 'Itineraries', path: '/itineraries'}
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch initial auth session and listen for real-time login/logout changes
  useEffect(() => {
    // 1. Initial check
    const checkUserSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          setUser(data.session.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching auth session:', err);
      }
    };
    checkUserSession();

    // 2. Real-time auth listener (catches login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleNavClick = () => setIsMenuOpen(false);

  return (
    <header className={`${styles.siteHeader} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContainer}>
        <div className={styles.brandWrap} onClick={() => { navigate('/'); setIsMenuOpen(false); }}>
          <img
            src="https://res.cloudinary.com/cioghqt5/image/upload/v1787046490/cbsis_original.jpg"
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
            {user ? (
              <button
                id="navbar-profile-btn"
                className={`${styles.profileButton} ${location.pathname === '/profile' ? styles.profileButtonActive : ''}`}
                onClick={() => {
                  navigate('/profile');
                  setIsMenuOpen(false);
                }}
                title={`Explorer Account: ${user.email}`}
              >
                <User size={16} className={styles.profileIcon} />
                <span>Profile</span>
              </button>
            ) : (
              <button
                id="navbar-login-btn"
                className={styles.textButton}
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
              >
                Login
              </button>
            )}

            <button className={styles.ctaButton} onClick={() => { navigate('/contact'); setIsMenuOpen(false); }}>
              Book a consultation
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;