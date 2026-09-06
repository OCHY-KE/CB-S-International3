import React, { useState, useEffect,} from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../../styles/H.module.css';

const images = [
  "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=2000",
  "https://cccevikzhxeyxsjvomzg.supabase.co/storage/v1/object/public/CBSI/Media/elephant_1787353876793.webp?auto=format&fit=crop&q=80&w=2000",
  "https://cccevikzhxeyxsjvomzg.supabase.co/storage/v1/object/public/CBSI/Media/IMG-20260817-WA0032_1788011397586.jpg?auto=format&fit=crop&q=80&w=2000",
  "https://cccevikzhxeyxsjvomzg.supabase.co/storage/v1/object/public/CBSI/Media/IMG_20260830_093052_1788071547437.jpg?auto=format&fit=crop&q=80&w=2000",
  "https://cccevikzhxeyxsjvomzg.supabase.co/storage/v1/object/public/CBSI/Media/WhatsApp_Image_2026-08-17_at_1.42.34_PM_1788009853215.jpeg?auto=format&fit=crop&q=80&w=2000",
  "https://cccevikzhxeyxsjvomzg.supabase.co/storage/v1/object/public/CBSI/Media/IMG-20260817-WA0063_1788075289678.jpg?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1521651201144-634f700b36ef?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1516646255117-f9f933680173?auto=format&fit=crop&q=80&w=2000",
  "https://res.cloudinary.com/cioghqt5/image/upload/v1788092215/1773965203593_Panorama-with-elephants-safari-jeep-Maasai-Mara.jpg?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&q=80&w=2000",
  "https://res.cloudinary.com/cioghqt5/image/upload/v1788093016/Chania-Falls-in-Thika-Kenya.jpg?auto=format&fit=crop&q=80&w=2000",
  "https://res.cloudinary.com/cioghqt5/image/upload/v1788093674/Kit-Mikayi.JPG.jpg?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=2000",
  "https://res.cloudinary.com/cioghqt5/image/upload/v1788094001/leopard-tortoise-stigmochelys-pardalis-africa-kenya-tanzania-large-attractively-marked-found-savannas-leopard-tortoise-186994027.jpg?auto=format&fit=crop&q=80&w=2000",
  "https://res.cloudinary.com/cioghqt5/image/upload/v1788096139/313173.jpg?auto=format&fit=crop&q=80&w=2000",
  "https://res.cloudinary.com/cioghqt5/image/upload/v1788094166/7234068808_f1b5fe1f34_k.jpg?auto=format&fit=crop&q=80&w=2000",
  "https://res.cloudinary.com/cioghqt5/image/upload/v1788094395/013025_ED_giraffe-zebra_feat.jpg?auto=format&fit=crop&q=80&w=2000",
  "https://res.cloudinary.com/cioghqt5/image/upload/v1788094468/roan-antelope-12b.jpg?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=2000",
  "https://res.cloudinary.com/cioghqt5/image/upload/v1788092214/elephant-in-masaimara.jpg?auto=format&fit=crop&q=80&w=2000",
  "https://res.cloudinary.com/cioghqt5/image/upload/v1787301219/BlackRHINO.webp?auto=format&fit=crop&q=80&w=2000",
  "https://res.cloudinary.com/cioghqt5/image/upload/v1788093014/Waterfalls-in-Kenya.jpg?auto=format&fit=crop&q=80&w=2000",
  "https://res.cloudinary.com/cioghqt5/image/upload/v1788095632/Olokorienito-dam.jpg?auto=format&fit=crop&q=80&w=2000",
  "https://res.cloudinary.com/cioghqt5/image/upload/v1788096204/swamp.png?auto=format&fit=crop&q=80&w=2000",
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  const zoomIn = index % 2 === 0;

  return (
    <section className={styles.hero}>
      <div className={styles.heroBgWrapper}>
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className={styles.slideContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "linear" }}
          >
            <motion.img
              src={images[index]}
              initial={{ scale: zoomIn ? 1.1 : 1.3, x: zoomIn ? "-2%" : "2%" }}
              animate={{ scale: zoomIn ? 1.3 : 1.1, x: zoomIn ? "2%" : "-2%" }}
              transition={{ duration: 9, ease: "linear" }}
              className={styles.heroSlideImage}
              alt="Safari Background"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className={styles.filmGrain}></div>
      <div className={styles.heroOverlay}></div>
      
      <div className={styles.heroContent}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.badgePill}
        >
          <Compass size={14} className={styles.goldIcon} />
          <span>Defining Safari Frontiers</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={styles.heroTitle}
        >
          Your Inspired <br />
          <span className={styles.heroTitleGold}>African Travel Champion</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={styles.heroTagline}
        >
          Experience the soul of East Africa through tailor-made journeys. 
          We combine luxury and authenticity to share our deep-seated commitment 
          to Kenya’s wildlife, culture, and biodiversity.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className={styles.heroActions}
        >
          <Link to="/itineraries" className={styles.primaryBtn}>
            Explore Itineraries
          </Link>
          <Link to="/about" className={styles.secondaryBtn}>
            Our Story
          </Link>
        </motion.div>
      </div>

      <div className={styles.slideCounter}>
        <span className={styles.currentIndex}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.counterDivider}>/</span> 
        {String(images.length).padStart(2, '0')}
      </div>

     
    </section>
  );
};

export default Hero;