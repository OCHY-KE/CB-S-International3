import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Gallery.module.css';

const galleryData = [
  { id: 1, category: 'Wildlife', title: 'Majestic Lion', img: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=800' },
  { id: 2, category: 'Landscapes', title: 'Savannah Sunset', img: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800' },
  { id: 3, category: 'Lodges', title: 'Luxury Tent', img: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=800' },
  { id: 4, category: 'Wildlife', title: 'Elephants Crossing', img: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=800' },
  { id: 5, category: 'Wildlife', title: 'Leopard in Tree', img: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&q=80&w=800' },
  { id: 6, category: 'Landscapes', title: 'Mount Kilimanjaro', img: 'https://images.unsplash.com/photo-1589182397057-b163ce479c83?auto=format&fit=crop&q=80&w=800' },
];

const categories = ['All', 'Wildlife', 'Landscapes', 'Lodges'];

const Gallery = () => {
  const [filter, setFilter] = useState('All');

  const filteredImages = filter === 'All' 
    ? galleryData 
    : galleryData.filter(item => item.category === filter);

  return (
    <section className={styles.gallerySection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.topTitle}>Our Portfolio</span>
          <h2 className={styles.galleryTitle}>Experience the Adventure</h2>
          <div className={styles.underline}></div>
          <p className={styles.gallerySubtitle}>
            A curated glimpse into the breathtaking wild world of CBSI Safaris.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className={styles.filterButtons}>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid with Animation */}
        <motion.div layout className={styles.galleryGrid}>
          <AnimatePresence mode='popLayout'>
            {filteredImages.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={styles.galleryItem}
              >
                <div className={styles.imageWrapper}>
                  <img src={item.img} alt={item.title} className={styles.galleryImg} />
                  <div className={styles.galleryOverlay}>
                    <div className={styles.overlayContent}>
                      <span className={styles.itemCategory}>{item.category}</span>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <button className={styles.viewBtn}>View Details</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;