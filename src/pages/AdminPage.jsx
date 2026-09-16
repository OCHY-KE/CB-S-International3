import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { adminSignOut } from '../utils/auth'
import AdminHeader from '../components/admin/AdminHeader'
import AdminTabs from '../components/admin/AdminTabs'
import AdminOverview from '../components/admin/AdminOverview'
import SecurityModal from '../components/admin/SecurityModal'
import AdminGallery from './AdminGallery'
import ItinerariesAdmin from './ItinerariesAdmin'
import ConferenceAdmin from '../components/conf/ConferenceAdmin' // <-- 1. Import ConferenceAdmin
import styles from '../styles/AdminPage.module.css'

// 2. Add 'conferences' to valid tabs array
const VALID_TABS = ['overview', 'itineraries', 'gallery', 'conferences']

export default function AdminPage({ onBack }) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const rawTab = searchParams.get('tab')
  const activeTab = VALID_TABS.includes(rawTab) ? rawTab : 'overview'

  // Sync invalid tab query params back to default
  useEffect(() => {
    if (rawTab && !VALID_TABS.includes(rawTab)) {
      setSearchParams({ tab: 'overview' }, { replace: true })
    }
  }, [rawTab, setSearchParams])

  // Security warning state
  const [showSecurityWarning, setShowSecurityWarning] = useState(() => {
    try {
      const shouldShow = sessionStorage.getItem('cbsi_show_admin_security_warning') === 'true'
      const alreadyDismissed = sessionStorage.getItem('cbsi_admin_warning_dismissed') === 'true'
      return shouldShow && !alreadyDismissed
    } catch {
      return false
    }
  })

  // Lock background scroll when modal is active
  useEffect(() => {
    if (!showSecurityWarning) return

    const originalOverflow = document.body.style.overflow
    const originalTouchAction = document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.touchAction = originalTouchAction
    }
  }, [showSecurityWarning])

  const handleDismissWarning = () => {
    try {
      sessionStorage.removeItem('cbsi_show_admin_security_warning')
      sessionStorage.setItem('cbsi_admin_warning_dismissed', 'true')
    } catch {
      /* Safari Private Mode Catch */
    }
    setShowSecurityWarning(false)
  }

  const handleLeaveToPublic = async () => {
    try {
      sessionStorage.removeItem('cbsi_show_admin_security_warning')
      sessionStorage.removeItem('cbsi_admin_warning_dismissed')
    } catch {
      /* Storage clear error catch */
    }
    await adminSignOut()
    navigate('/', { replace: true })
  }

  const handleTabChange = useCallback((tab) => {
    setSearchParams({ tab })
  }, [setSearchParams])

  const handleDefaultBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate('/')
    }
  }

  return (
    <div className={styles.adminShell}>
      <AdminHeader onBack={handleDefaultBack} />
      
      <AdminTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <main className={styles.mainContent}>
        {activeTab === 'overview' && (
          <AdminOverview onTabChange={handleTabChange} />
        )}

        {activeTab === 'itineraries' && (
          <div className={styles.contentArea}>
            <ItinerariesAdmin />
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className={styles.contentArea}>
            <AdminGallery onBack={() => handleTabChange('overview')} />
          </div>
        )}

        {/* 3. Render ConferenceAdmin when activeTab is 'conferences' */}
        {activeTab === 'conferences' && (
          <div className={styles.contentArea}>
            <ConferenceAdmin />
          </div>
        )}
      </main>

      {showSecurityWarning && (
        <SecurityModal 
          onDismiss={handleDismissWarning} 
          onLeave={handleLeaveToPublic} 
        />
      )}
    </div>
  )
}