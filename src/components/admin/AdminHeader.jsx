import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Globe, ArrowLeft, LogOut } from 'lucide-react'
import { adminSignOut } from '../../utils/auth'
import styles from '../../styles/AH.module.css'

export default function AdminHeader({ onBack }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack()
    } else {
      navigate('/')
    }
  }

  const handleSignOut = async () => {
    await adminSignOut()
    navigate('/admin-login')
  }

  return (
    <header className={styles.adminHeader}>
      <div className={styles.brandInfo}>
        <div className={styles.eyebrow}>
          <ShieldCheck size={16} />
          <span>CBSI Management Console</span>
        </div>
        <h1>Conference Bookings & Safaris International</h1>
      </div>

      <div className={styles.headerActions}>
        <button 
          type="button" 
          className={styles.ctaButtonSecondary} 
          onClick={() => window.open('/', '_blank')}
          aria-label="View Live Site"
        >
          <Globe size={16} /> 
          <span>View Live Site</span>
        </button>
        
        <button 
          type="button" 
          className={styles.ctaButtonSecondary} 
          onClick={handleBack}
          aria-label="Back to Home"
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>
        
        <button 
          type="button" 
          className={styles.signOutButton} 
          onClick={handleSignOut}
          aria-label="Sign Out"
        >
          <LogOut size={16} /> 
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  )
}