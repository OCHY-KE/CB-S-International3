import React from 'react'
import { ShieldAlert, Lock, AlertTriangle, Globe, CheckCircle2 } from 'lucide-react'
import styles from '../../styles/AdminPage.module.css'

export default function SecurityModal({ onDismiss, onLeave }) {
  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="security-warning-title">
      <div className={styles.securityModal}>
        <div className={styles.modalIconHeader}>
          <div className={styles.warningIconWrapper}>
            <ShieldAlert size={36} />
          </div>
          <div className={styles.securityBadgePill}>
            <Lock size={12} />
            <span>Confidential Administrative Area</span>
          </div>
        </div>

        <div className={styles.modalContent}>
          <h2 id="security-warning-title" className={styles.modalTitle}>
            Restricted Access Warning
          </h2>
          <p className={styles.modalDescription}>
            You are accessing the <strong>private, secure administrative portal</strong> of Conference Bookings & Safaris International.
          </p>
          
          <div className={styles.warningNoticeBox}>
            <AlertTriangle size={18} className={styles.noticeIcon} />
            <p>
              If you are <strong>not an authorized administrator</strong> or do not have explicit permission to access this console, <strong>please leave immediately and return to the public website</strong>.
            </p>
          </div>

          <p className={styles.legalDisclaimer}>
            All session activities, modifications, and administrative operations are securely recorded and audited for compliance.
          </p>
        </div>

        <div className={styles.modalActionButtons}>
          <button
            type="button"
            className={styles.leavePublicBtn}
            onClick={onLeave}
          >
            <Globe size={16} />
            <span>Leave to Public Site</span>
          </button>

          <button
            type="button"
            className={styles.acknowledgeBtn}
            onClick={onDismiss}
          >
            <CheckCircle2 size={16} />
            <span>I Am Authorized — Proceed</span>
          </button>
        </div>
      </div>
    </div>
  )
}