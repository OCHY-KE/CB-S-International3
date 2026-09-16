import React, { useState } from 'react'
import { X, Plus, Trash2, Image as ImageIcon, Video as VideoIcon, Loader, CheckCircle } from 'lucide-react'
import Uploader from '../../components/Uploader'
import styles from '../../styles/IM.module.css'

const ItineraryModal = ({ editingId, formData, setFormData, isSaving, onClose, onSave }) => {
  const [activeFormTab, setActiveFormTab] = useState('details') // 'details' | 'days' | 'preview'

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

  const handleImageUploaded = (index, fileData) => {
    const updatedDays = [...formData.days]
    const currentImages = updatedDays[index].media?.images || []
    updatedDays[index].media = {
      ...updatedDays[index].media,
      images: [...currentImages, fileData.url]
    }
    
    let updatedFeatured = formData.featured_image
    if (!updatedFeatured) {
      updatedFeatured = fileData.url
    }

    setFormData((prev) => ({ 
      ...prev, 
      featured_image: updatedFeatured,
      days: updatedDays 
    }))
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

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleBlock}>
            <h2>{editingId ? 'Edit Safari Expedition' : 'Create New Expedition'}</h2>
            <p>Configure package details, itinerary steps, and media assets</p>
          </div>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <div className={styles.formNavTabs}>
          <button 
            type="button" 
            className={activeFormTab === 'details' ? styles.activeFormTab : ''}
            onClick={() => setActiveFormTab('details')}
          >
            1. Overview & Setup
          </button>
          <button 
            type="button" 
            className={activeFormTab === 'days' ? styles.activeFormTab : ''}
            onClick={() => setActiveFormTab('days')}
          >
            2. Itinerary Builder ({formData.days.length})
          </button>
          <button 
            type="button" 
            className={activeFormTab === 'preview' ? styles.activeFormTab : ''}
            onClick={() => setActiveFormTab('preview')}
          >
            3. Live Preview
          </button>
        </div>

        <form className={styles.form} onSubmit={onSave}>
          {activeFormTab === 'details' && (
            <div className={styles.tabPanel}>
              <div className={styles.inputGroup}>
                <label>Package Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 15-DAY KENYA & TANZANIA GRAND SAFARI" 
                  required
                />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Duration String</label>
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
                  placeholder="e.g. Nairobi - Samburu - Lake Nakuru - Masai Mara - Serengeti - Ngorongoro" 
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Main Cover Image URL (Optional)</label>
                <input 
                  type="url" 
                  value={formData.featured_image} 
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="https://..." 
                />
                <small>Auto-populated from uploaded day photos if left blank.</small>
              </div>

              <button 
                type="button" 
                className={styles.nextStepBtn} 
                onClick={() => setActiveFormTab('days')}
              >
                Continue to Itinerary Builder
              </button>
            </div>
          )}

          {activeFormTab === 'days' && (
            <div className={styles.tabPanel}>
              <div className={styles.daysBuilder}>
                <div className={styles.daysHeader}>
                  <h3>Daily Schedule & Media Attachments</h3>
                  <button type="button" onClick={handleAddDay} className={styles.addDayBtn}>
                    <Plus size={16} /> Add Day
                  </button>
                </div>

                {formData.days.map((day, idx) => (
                  <div key={idx} className={styles.dayCardInput}>
                    <div className={styles.dayInputHeader}>
                      <span className={styles.dayIndexPill}>Day {day.day}</span>
                      {formData.days.length > 1 && (
                        <button type="button" onClick={() => handleRemoveDay(idx)} className={styles.removeDayBtn}>
                          <Trash2 size={14} /> Remove
                        </button>
                      )}
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Location / Highlight</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Samburu Game Reserve" 
                        value={day.location}
                        onChange={(e) => handleDayChange(idx, 'location', e.target.value)}
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Activities & Summary (Markdown supported)</label>
                      <textarea 
                        placeholder="Detail morning game drives, lodge transfers, evening dinner..." 
                        value={day.activity}
                        onChange={(e) => handleDayChange(idx, 'activity', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className={styles.uploaderSection}>
                      <div className={styles.uploadBlock}>
                        <label><ImageIcon size={14} /> Add Day Photos</label>
                        <Uploader 
                          bucket="CBSI"
                          folder={`Itineraries/Day_${day.day}/Images`}
                          allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
                          maxSizeMB={10}
                          label="Upload Photos"
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
                        <label><VideoIcon size={14} /> Add Day Clip</label>
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

              <div className={styles.formNavFooter}>
                <button type="button" className={styles.prevStepBtn} onClick={() => setActiveFormTab('details')}>
                  Back
                </button>
                <button type="button" className={styles.nextStepBtn} onClick={() => setActiveFormTab('preview')}>
                  Preview Full Package
                </button>
              </div>
            </div>
          )}

          {activeFormTab === 'preview' && (
            <div className={styles.tabPanel}>
              <div className={styles.livePreviewCard}>
                <div className={styles.previewHeader}>
                  <span className={styles.categoryBadge}>{formData.category}</span>
                  <h3>{formData.title || 'Untitled Safari Package'}</h3>
                  <p className={styles.routePreview}>{formData.route || 'No route defined yet'}</p>
                </div>

                <div className={styles.timeline}>
                  {formData.days.map((day) => (
                    <div key={day.day} className={styles.timelineItem}>
                      <div className={styles.dayCircle}><span>{day.day}</span></div>
                      <div className={styles.dayContent}>
                        <h5>{day.location || `Day ${day.day}`}</h5>
                        <p>{day.activity || 'No activities specified.'}</p>
                        {day.media?.images?.length > 0 && (
                          <div className={styles.mediaGallery}>
                            {day.media.images.map((img, i) => (
                              <div key={i} className={styles.imageWrapper}>
                                <img src={img} alt="preview" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                {isSaving ? <Loader className={styles.spinner} size={18} /> : <CheckCircle size={18} />}
                <span>{editingId ? 'Publish Changes' : 'Publish Package'}</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ItineraryModal