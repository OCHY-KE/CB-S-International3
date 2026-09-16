import React, { useRef } from 'react'
import { LayoutDashboard, Compass, Film, Building2 } from 'lucide-react'
import styles from '../../styles/AT.module.css'

export default function AdminTabs({ activeTab, onTabChange }) {
  const scrollRef = useRef(null)

  const tabs = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'itineraries',
      label: 'Safari Itineraries',
      icon: Compass,
    },
    {
      id: 'gallery',
      label: 'Gallery Studio',
      icon: Film,
    },
    {
      id: 'conferences',
      label: 'Conferences',
      icon: Building2,
    },
  ]

  // Automatically scroll active tab into view on click
  const handleTabClick = (tabId, e) => {
    onTabChange(tabId)
    e.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    })
  }

  return (
    <nav className={styles.tabBar} aria-label="Admin Navigation Tabs">
      <div 
        ref={scrollRef}
        className={styles.scrollContainer} 
        role="tablist" 
        aria-orientation="horizontal"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={(e) => handleTabClick(tab.id, e)}
              className={`${styles.tabButton} ${isActive ? styles.activeTab : styles.inactiveTab}`}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}