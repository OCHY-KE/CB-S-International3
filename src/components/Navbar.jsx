import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  X
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import styles from '../styles/Navbar.module.css';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Itineraries', path: '/itineraries' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' }
];

const WHATSAPP_PHONE = '254722774952';
const CALL_PHONE = '+254722774952';

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Fetch initial auth session and listen for real-time login/logout changes
  useEffect(() => {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleNavClick = () => setIsMenuOpen(false);

  const handleLaunchBuilder = () => {
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('custom-builder-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate('/#custom-builder-section');
    setTimeout(() => {
      const el = document.getElementById('custom-builder-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleWhatsAppChat = () => {
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello CBSI Safaris! I would like to inquire about safari booking.')}`, '_blank');
    setIsMenuOpen(false);
  };

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

        {/* Backdrop for mobile drawer */}
        {isMenuOpen && (
          <div 
            className={styles.mobileBackdrop} 
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          {/* Mobile Drawer Top Bar */}
          <div className={styles.mobileDrawerHeader}>
            <div className={styles.drawerBrand}>
              <img
                src="https://res.cloudinary.com/cioghqt5/image/upload/v1787046490/cbsis_original.jpg"
                alt="CBSI"
                className={styles.drawerLogo}
              />
              <span className={styles.drawerBrandText}>CBSI SAFARIS</span>
            </div>
            <button 
              className={styles.drawerCloseBtn}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

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
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Quick Action Highlight for Custom Safari Builder in Drawer */}
          <div className={styles.drawerBuilderCard}>
            <div className={styles.builderCardContent}>
              <div className={styles.builderBadge}>
                <Sparkles size={13} />
                <span>100% Bespoke</span>
              </div>
              <h4 className={styles.builderTitle}>Tailor-Made Safari</h4>
              <p className={styles.builderSubtitle}>Calculate live estimate & pick your favorite parks</p>
            </div>
            <button 
              type="button"
              className={styles.builderLaunchBtn}
              onClick={handleLaunchBuilder}
            >
              Design Trip
            </button>
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
                <span>My Profile ({user.email.split('@')[0]})</span>
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
                Explorer Login
              </button>
            )}

            <button 
              className={styles.ctaButton} 
              onClick={() => { navigate('/contact'); setIsMenuOpen(false); }}
            >
              Book a Consultation
            </button>
          </div>

          {/* Mobile Direct Contact Quick Bar in Drawer */}
          <div className={styles.mobileContactStrip}>
            <button 
              type="button" 
              className={styles.mobileWaBtn}
              onClick={handleWhatsAppChat}
            >
              <MessageCircle size={18} />
              <span>WhatsApp</span>
            </button>

            <a 
              href={`tel:${CALL_PHONE}`} 
              className={styles.mobileCallBtn}
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone size={18} />
              <span>Call Us</span>
            </a>
          </div>

          {/* Mobile Drawer Footer */}
          <div className={styles.mobileDrawerFooter}>
            <div className={styles.mobileTrustBadge}>
              <ShieldCheck size={14} />
              <span>Official KATO Tour Operator • Nairobi, Kenya</span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;