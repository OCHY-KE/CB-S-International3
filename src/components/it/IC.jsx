import React, { useEffect } from 'react'
import { Edit3, Trash2, Clock, MapPin, MessageCircle, ChevronDown, Eye, X } from 'lucide-react'
import MarkdownContent from '../../components/MarkdownContent'
import styles from '../../styles/IC.module.css'

const WHATSAPP_NUMBER = '25722774952'

const ItineraryCard = ({ pkg, isExpanded, onToggleExpand, onEdit, onDelete, onOpenSlideshow }) => {
  const firstImage = pkg.featured_image || pkg.days?.[0]?.media?.images?.[0] || '/placeholder-safari.jpg'

  // Lock background scroll when popup modal is active
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isExpanded])

  // Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        onToggleExpand()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded, onToggleExpand])

  const handleWhatsAppBooking = (pkgTitle, duration) => {
    const textMessage = `Hello! I would like to book or request details regarding the *${pkgTitle}* (${duration}) itinerary package.`
    const encodedText = encodeURIComponent(textMessage)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank')
  }

  return (
    <>
      <article className={styles.card}>
        <div className={styles.cardCover}>
          <img src={firstImage} alt={pkg.title} className={styles.coverImage} />
          <div className={styles.coverOverlay} />
          <span className={styles.categoryBadge}>{pkg.category}</span>
          
          <div className={styles.cardActions}>
            <button className={styles.iconBtn} onClick={onEdit} title="Edit Package">
              <Edit3 size={16} />
            </button>
            <button className={`${styles.iconBtn} ${styles.delete}`} onClick={onDelete} title="Delete Package">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className={styles.cardMain}>
          <h3 className={styles.pkgTitle}>{pkg.title}</h3>

          <div className={styles.metaInfo}>
            <div className={styles.metaItem}>
              <Clock size={14} /> <span>{pkg.duration}</span>
            </div>
            <div className={styles.metaItem}>
              <MapPin size={14} /> <span>{pkg.days?.length || 0} Key Destinations</span>
            </div>
          </div>

          <p className={styles.routePreview}>{pkg.route}</p>

          <div className={styles.actionButtonGroup}>
            <button 
              className={styles.whatsappBtn}
              onClick={() => handleWhatsAppBooking(pkg.title, pkg.duration)}
            >
              <MessageCircle size={18} />
              <span>Book Package</span>
            </button>

            <button className={styles.viewDetailsBtn} onClick={onToggleExpand}>
              <span>View Details</span>
              <ChevronDown size={18} />
            </button>
          </div>
        </div>
      </article>

      {/* POPUP MODAL OVERLAY */}
      {isExpanded && (
        <div className={styles.modalBackdrop} onClick={onToggleExpand}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header Bar */}
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.categoryBadgeModal}>{pkg.category}</span>
                <h3 className={styles.modalTitle}>{pkg.title}</h3>
              </div>
              <button className={styles.closeBtn} onClick={onToggleExpand} title="Close">
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className={styles.modalBody}>
              <div className={styles.metaInfoModal}>
                <div className={styles.metaItem}>
                  <Clock size={16} /> <span>{pkg.duration}</span>
                </div>
                <div className={styles.metaItem}>
                  <MapPin size={16} /> <span>{pkg.days?.length || 0} Key Destinations</span>
                </div>
              </div>

              <div className={styles.timelineSection}>
                <div className={styles.timelineHeader}>
                  <h4>Day-by-Day Journey</h4>
                  <span className={styles.dayCounter}>{pkg.days?.length || 0} Total Days</span>
                </div>
                
                <div className={styles.timeline}>
                  {pkg.days?.map((dayItem) => (
                    <div key={dayItem.day} className={styles.timelineItem}>
                      <div className={styles.dayCircle}>
                        <span>{dayItem.day}</span>
                      </div>
                      <div className={styles.dayContent}>
                        <h5>{dayItem.location || `Day ${dayItem.day}`}</h5>
                        <MarkdownContent>{dayItem.activity}</MarkdownContent>

                        {dayItem.media && (dayItem.media.images?.length > 0 || dayItem.media.video) && (
                          <div className={styles.mediaGallery}>
                            {dayItem.media.images?.map((imgUrl, index) => (
                              <div 
                                key={index} 
                                className={styles.imageWrapper}
                                onClick={() => onOpenSlideshow(dayItem.media.images, index)}
                              >
                                <img src={imgUrl} alt={`${dayItem.location} detail ${index + 1}`} />
                                <span className={styles.zoomHint}><Eye size={12} /> View</span>
                              </div>
                            ))}

                            {dayItem.media.video && (
                              <div className={styles.videoWrapper}>
                                <video src={dayItem.media.video} controls poster={dayItem.media.images?.[0]}>
                                  Your browser does not support video playback.
                                </video>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className={styles.modalFooter}>
              <button 
                className={styles.whatsappBtn}
                onClick={() => handleWhatsAppBooking(pkg.title, pkg.duration)}
              >
                <MessageCircle size={18} />
                <span>Book This Package</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

export default ItineraryCard