import React, { useState, useEffect, useCallback } from 'react'
import { 
  Plus, Trash2, Clock, MapPin, X, Edit3, ChevronDown, Save, Loader, 
  Image as ImageIcon, Video as VideoIcon, ChevronLeft, ChevronRight, MessageCircle 
} from 'lucide-react'
import { supabase } from '../supabaseClient'
import Uploader from '../components/Uploader'
import styles from '../styles/ItinerariesAdmin.module.css'

const WHATSAPP_NUMBER = '254700000000'

const ItinerariesAdmin = () => {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [expandedPkg, setExpandedPkg] = useState(null)

  // Slideshow State
  const [activeSlideshow, setActiveSlideshow] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0
  })

  // Default Form Data Blank Model
  const defaultFormState = {
    title: '',
    duration: '',
    category: 'Safari & Adventure',
    route: '',
    days: [{ day: 1, location: '', activity: '', media: { images: [], video: '' } }]
  }

  const [formData, setFormData] = useState(defaultFormState)

  // Fetch packages from Supabase
  const fetchPackages = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching packages:', error.message)
    } else {
      setPackages(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  // Lock body scroll when overlay modals are open
  useEffect(() => {
    if (isModalOpen || activeSlideshow.isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen, activeSlideshow.isOpen])

  // Slideshow Navigation Actions
  const closeSlideshow = useCallback(() => {
    setActiveSlideshow({ isOpen: false, images: [], currentIndex: 0 })
  }, [])

  const nextSlide = useCallback(() => {
    setActiveSlideshow((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }))
  }, [])

  const prevSlide = useCallback(() => {
    setActiveSlideshow((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }))
  }, [])

  // Keyboard Navigation for Slideshow
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeSlideshow.isOpen) return
      if (e.key === 'Escape') closeSlideshow()
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeSlideshow.isOpen, closeSlideshow, nextSlide, prevSlide])

  const toggleExpand = (id) => {
    setExpandedPkg((prev) => (prev === id ? null : id))
  }

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setEditingId(pkg.id)
      setFormData({
        title: pkg.title || '',
        duration: pkg.duration || '',
        category: pkg.category || 'Safari & Adventure',
        route: pkg.route || '',
        days: pkg.days && pkg.days.length > 0 
          ? (typeof structuredClone === 'function' ? structuredClone(pkg.days) : JSON.parse(JSON.stringify(pkg.days)))
          : defaultFormState.days
      })
    } else {
      setEditingId(null)
      setFormData(defaultFormState)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setFormData(defaultFormState)
  }

  // WhatsApp Redirect Handler
  const handleWhatsAppBooking = (pkgTitle, duration) => {
    const textMessage = `Hello! I would like to book or request more details regarding the *${pkgTitle}* (${duration}) itinerary package.`
    const encodedText = encodeURIComponent(textMessage)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank')
  }

  const openSlideshow = (images, startIndex = 0) => {
    setActiveSlideshow({ isOpen: true, images, currentIndex: startIndex })
  }

  // Day Form Builders
  const handleAddDay = () => {
    setFormData((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        { day: prev.days.length + 1, location: '', activity: '', media: { images: [], video: '' } }
      ]
    }))
  }

  const handleRemoveDay = (index) => {
    const updatedDays = formData.days
      .filter((_, i) => i !== index)
      .map((d, idx) => ({ ...d, day: idx + 1 }))
    setFormData((prev) => ({ ...prev, days: updatedDays }))
  }

  const handleDayChange = (index, field, value) => {
    const updatedDays = [...formData.days]
    updatedDays[index] = { ...updatedDays[index], [field]: value }
    setFormData((prev) => ({ ...prev, days: updatedDays }))
  }

  // Media Management
  const handleImageUploaded = (index, fileData) => {
    const updatedDays = [...formData.days]
    const currentImages = updatedDays[index].media?.images || []
    updatedDays[index].media = {
      ...updatedDays[index].media,
      images: [...currentImages, fileData.url]
    }
    setFormData((prev) => ({ ...prev, days: updatedDays }))
  }

  const handleVideoUploaded = (index, fileData) => {
    const updatedDays = [...formData.days]
    updatedDays[index].media = {
      ...updatedDays[index].media,
      video: fileData.url
    }
    setFormData((prev) => ({ ...prev, days: updatedDays }))
  }

  const handleRemoveImage = (dayIdx, imgIdx) => {
    const updatedDays = [...formData.days]
    updatedDays[dayIdx].media.images = updatedDays[dayIdx].media.images.filter((_, i) => i !== imgIdx)
    setFormData((prev) => ({ ...prev, days: updatedDays }))
  }

  const handleRemoveVideo = (dayIdx) => {
    const updatedDays = [...formData.days]
    updatedDays[dayIdx].media.video = ''
    setFormData((prev) => ({ ...prev, days: updatedDays }))
  }

  // Database Actions
  const handleSavePackage = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.duration) return

    setIsSaving(true)
    let result

    if (editingId) {
      result = await supabase
        .from('itineraries')
        .update(formData)
        .eq('id', editingId)
    } else {
      result = await supabase
        .from('itineraries')
        .insert([formData])
    }

    setIsSaving(false)

    if (result.error) {
      console.error('Error saving itinerary:', result.error.message)
      alert('Failed to save itinerary. Check console for details.')
    } else {
      handleCloseModal()
      fetchPackages()
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this itinerary package?')) return

    const { error } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting package:', error.message)
      alert('Failed to delete itinerary.')
    } else {
      fetchPackages()
    }
  }

  return (
    <div className={styles.sectionContainer}>
      {/* Tab Inner Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <h2>Safari Itineraries</h2>
          <p>Create and manage multi-day travel packages with photos & videos</p>
        </div>
        <button className={styles.addButton} onClick={() => handleOpenModal()}>
          <Plus size={18} />
          <span>New Package</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className={styles.loadingState}>
          <Loader className={styles.spinner} size={32} />
          <p>Loading itineraries...</p>
        </div>
      ) : (
        <div className={styles.packageGrid}>
          {packages.map((pkg) => (
            <div key={pkg.id} className={`${styles.card} ${expandedPkg === pkg.id ? styles.expanded : ''}`}>
              <div className={styles.cardMain}>
                <div className={styles.cardHeader}>
                  <span className={styles.categoryBadge}>{pkg.category}</span>
                  <div className={styles.cardActions}>
                    <button className={styles.iconBtn} onClick={() => handleOpenModal(pkg)} title="Edit Package">
                      <Edit3 size={16} />
                    </button>
                    <button className={`${styles.iconBtn} ${styles.delete}`} onClick={() => handleDelete(pkg.id)} title="Delete Package">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h3 className={styles.pkgTitle}>{pkg.title}</h3>

                <div className={styles.metaInfo}>
                  <div className={styles.metaItem}>
                    <Clock size={14} /> <span>{pkg.duration}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <MapPin size={14} /> <span>{pkg.days?.length || 0} Stops</span>
                  </div>
                </div>

                <p className={styles.routePreview}>{pkg.route}</p>

                <div className={styles.actionButtonGroup}>
                  <button 
                    className={styles.whatsappBtn}
                    onClick={() => handleWhatsAppBooking(pkg.title, pkg.duration)}
                  >
                    <MessageCircle size={18} />
                    <span>Book via WhatsApp</span>
                  </button>

                  <button 
                    className={styles.viewDetailsBtn} 
                    onClick={() => toggleExpand(pkg.id)}
                  >
                    {expandedPkg === pkg.id ? 'Close Timeline' : 'View Full Itinerary'}
                    <ChevronDown className={expandedPkg === pkg.id ? styles.rotate : ''} size={18} />
                  </button>
                </div>
              </div>

              {expandedPkg === pkg.id && (
                <div className={styles.timelineSection}>
                  <h4>Day-by-Day Schedule & Media</h4>
                  <div className={styles.timeline}>
                    {pkg.days?.map((dayItem) => (
                      <div key={dayItem.day} className={styles.timelineItem}>
                        <div className={styles.dayCircle}>{dayItem.day}</div>
                        <div className={styles.dayContent}>
                          <h5>{dayItem.location || `Day ${dayItem.day}`}</h5>
                          <p>{dayItem.activity}</p>

                          {dayItem.media && (dayItem.media.images?.length > 0 || dayItem.media.video) && (
                            <div className={styles.mediaGallery}>
                              {dayItem.media.images?.map((imgUrl, index) => (
                                <div 
                                  key={index} 
                                  className={styles.imageWrapper}
                                  onClick={() => openSlideshow(dayItem.media.images, index)}
                                >
                                  <img src={imgUrl} alt={`${dayItem.location} detail ${index + 1}`} />
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
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create/Edit Package */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? 'Edit Safari Package' : 'Create New Safari Package'}</h2>
              <button onClick={handleCloseModal} className={styles.closeBtn}><X size={20} /></button>
            </div>

            <form className={styles.form} onSubmit={handleSavePackage}>
              <div className={styles.inputGroup}>
                <label>Package Name</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. KENTANGA 15 DAYS" 
                  required
                />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Duration</label>
                  <input 
                    type="text" 
                    value={formData.duration} 
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 15 Days / 14 Nights" 
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>Safari & Adventure</option>
                    <option>Luxury Safari</option>
                    <option>Mid-Range Safari</option>
                    <option>Corporate Retreat</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Route Overview</label>
                <input 
                  type="text" 
                  value={formData.route} 
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                  placeholder="e.g. Nairobi - Samburu - Mara - Serengeti - Nairobi" 
                />
              </div>

              <div className={styles.daysBuilder}>
                <div className={styles.daysHeader}>
                  <h3>Itinerary Days & Media</h3>
                  <button type="button" onClick={handleAddDay} className={styles.addDayBtn}>
                    <Plus size={16} /> Add Day
                  </button>
                </div>

                {formData.days.map((day, idx) => (
                  <div key={idx} className={styles.dayCardInput}>
                    <div className={styles.dayInputHeader}>
                      <span>Day {day.day}</span>
                      {formData.days.length > 1 && (
                        <button type="button" onClick={() => handleRemoveDay(idx)} className={styles.removeDayBtn}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className={styles.inputRow}>
                      <input 
                        type="text" 
                        placeholder="Location (e.g. Samburu)" 
                        value={day.location}
                        onChange={(e) => handleDayChange(idx, 'location', e.target.value)}
                      />
                    </div>

                    <textarea 
                      placeholder="Activity description..." 
                      value={day.activity}
                      onChange={(e) => handleDayChange(idx, 'activity', e.target.value)}
                      rows={2}
                    />

                    {/* Media Uploaders & Previews */}
                    <div className={styles.uploaderSection}>
                      <div className={styles.uploadBlock}>
                        <label><ImageIcon size={14} /> Upload Photos</label>
                        <Uploader 
                          bucket="CBSI"
                          folder={`Itineraries/Day_${day.day}/Images`}
                          allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                          maxSizeMB={10}
                          label="Upload Image"
                          onUploadSuccess={(fileData) => handleImageUploaded(idx, fileData)}
                        />
                        {day.media?.images?.length > 0 && (
                          <div className={styles.mediaPreviewList}>
                            {day.media.images.map((img, imgIdx) => (
                              <div key={imgIdx} className={styles.previewThumb}>
                                <img src={img} alt="preview" />
                                <button type="button" onClick={() => handleRemoveImage(idx, imgIdx)}><X size={12} /></button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className={styles.uploadBlock}>
                        <label><VideoIcon size={14} /> Upload Video</label>
                        <Uploader 
                          bucket="CBSI"
                          folder={`Itineraries/Day_${day.day}/Videos`}
                          allowedTypes={['video/mp4', 'video/quicktime', 'video/webm']}
                          maxSizeMB={100}
                          label="Upload Video"
                          onUploadSuccess={(fileData) => handleVideoUploaded(idx, fileData)}
                        />
                        {day.media?.video && (
                          <div className={styles.previewVideo}>
                            <video src={day.media.video} controls />
                            <button type="button" onClick={() => handleRemoveVideo(idx)}><X size={12} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                {isSaving ? <Loader className={styles.spinner} size={18} /> : <Save size={18} />}
                <span>{editingId ? 'Update Package' : 'Save Package'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Fullscreen Slideshow */}
      {activeSlideshow.isOpen && (
        <div className={styles.slideshowOverlay} onClick={closeSlideshow}>
          <button className={styles.slideshowClose} onClick={closeSlideshow}>
            <X size={28} />
          </button>
          
          {activeSlideshow.images.length > 1 && (
            <>
              <button 
                className={`${styles.slideNavBtn} ${styles.prev}`} 
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                className={`${styles.slideNavBtn} ${styles.next}`} 
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div className={styles.slideshowContainer} onClick={(e) => e.stopPropagation()}>
            <img 
              src={activeSlideshow.images[activeSlideshow.currentIndex]} 
              alt={`Slide ${activeSlideshow.currentIndex + 1}`} 
            />
            <span className={styles.slideCounter}>
              {activeSlideshow.currentIndex + 1} / {activeSlideshow.images.length}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ItinerariesAdmin