import React, { useState } from 'react';
import { MessageCircle, Phone, Sparkles, X, ChevronUp, Mail } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import styles from '../styles/MobileQuickContact.module.css';

const WHATSAPP_PHONE = '254722774952';
const CALL_PHONE = '+254722774952';

export const MobileQuickContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Hide in admin or auth
  const isAdminOrAuth = 
    location.pathname.startsWith('/admin') || 
    location.pathname === '/login' || 
    location.pathname === '/create-account' || 
    location.pathname === '/admin-login';

  if (isAdminOrAuth) return null;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('Hello CBSI Safaris! I would like to inquire about booking a safari.')}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className={styles.floatingContainer}>
      {/* Expanded Menu Options */}
      {isOpen && (
        <div className={styles.speedDialMenu}>
          <button 
            type="button" 
            className={`${styles.speedDialBtn} ${styles.waBtn}`}
            onClick={handleWhatsApp}
            title="Chat on WhatsApp"
          >
            <span className={styles.btnTooltip}>WhatsApp Chat</span>
            <MessageCircle size={18} />
          </button>

          <a 
            href={`tel:${CALL_PHONE}`}
            className={`${styles.speedDialBtn} ${styles.callBtn}`}
            onClick={() => setIsOpen(false)}
            title="Call +254 722 774952"
          >
            <span className={styles.btnTooltip}>Call Safari Desk</span>
            <Phone size={18} />
          </a>

          <a 
            href="mailto:info@cbsisafaris.com"
            className={`${styles.speedDialBtn} ${styles.mailBtn}`}
            onClick={() => setIsOpen(false)}
            title="Email Consultation"
          >
            <span className={styles.btnTooltip}>Email Inquiry</span>
            <Mail size={18} />
          </a>
        </div>
      )}

      {/* Main Floating Trigger Pill / Circle */}
      <button
        type="button"
        id="mobile-speed-dial-trigger"
        className={`${styles.mainTrigger} ${isOpen ? styles.triggerActive : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="24/7 Safari Concierge"
      >
        <span className={styles.livePulse}></span>
        {isOpen ? <X size={20} /> : <MessageCircle size={22} />}
        <span className={styles.triggerLabel}>24/7 Concierge</span>
      </button>
    </div>
  );
};

export default MobileQuickContact;