import React, { useState, useRef, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import styles from '../styles/Uploader.module.css';

const Uploader = ({ 
  onUploadSuccess, 
  bucket = 'CBSI', 
  folder = 'Media',
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  maxSizeMB = 50,
  label = "Upload File"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const formatFileTypeLabel = (type) => {
    const ext = type.split('/')[1] || type;
    if (ext === 'quicktime') return 'MOV';
    return ext.toUpperCase();
  };

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(`Invalid type. Allowed: ${allowedTypes.map(formatFileTypeLabel).join(', ')}`);
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMessage(`File too large (Max ${maxSizeMB}MB).`);
      return false;
    }
    return true;
  };

  const uploadFile = async (file) => {
    if (!file) return;
    if (!validateFile(file)) {
      setStatus('error');
      return;
    }

    setStatus('uploading');
    setErrorMessage('');
    setUploadProgress(20);

    try {
      const fileExt = file.name.split('.').pop();
      const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${rawName}_${Date.now()}.${fileExt}`;
      
      // Clean leading and trailing slashes from folder path
      const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
      const filePath = cleanFolder ? `${cleanFolder}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (error) throw error;

      setUploadProgress(80);

      // Get public URL directly from Supabase API output
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const publicUrl = urlData?.publicUrl;

      setUploadProgress(100);
      
      timeoutRef.current = setTimeout(() => {
        setStatus('success');
        if (onUploadSuccess) {
          onUploadSuccess({
            url: publicUrl,
            path: data.path,
            name: file.name,
            size: file.size
          });
        }
      }, 400);

    } catch (error) {
      console.error('Supabase Upload Error:', error);
      setErrorMessage(error.message || 'Upload failed');
      setStatus('error');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === 'uploading') return;
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (status === 'uploading') return;
    const file = e.dataTransfer.files[0];
    uploadFile(file);
  };

  const reset = (e) => {
    if (e) e.stopPropagation();
    setStatus('idle');
    setErrorMessage('');
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={styles.uploaderWrapper}>
      <div 
        className={`
          ${styles.dropZone} 
          ${isDragging ? styles.dragging : ''} 
          ${status === 'uploading' ? styles.disabled : ''}
          ${status === 'error' ? styles.errorZone : ''}
          ${status === 'success' ? styles.successZone : ''}
        `}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => status !== 'uploading' && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => uploadFile(e.target.files[0])}
          style={{ display: 'none' }}
          accept={allowedTypes.join(',')}
        />

        <div className={styles.content}>
          {status === 'idle' && (
            <>
              <div className={styles.iconCircle}><Upload size={24} /></div>
              <p className={styles.mainText}><strong>{label}</strong> or drag and drop</p>
              <p className={styles.subText}>
                {allowedTypes.map(formatFileTypeLabel).join(', ')} (max {maxSizeMB}MB)
              </p>
            </>
          )}

          {status === 'uploading' && (
            <div className={styles.statusWrapper}>
              <Loader2 size={32} className={styles.spinner} />
              <p className={styles.statusText}>Uploading... {uploadProgress}%</p>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className={styles.statusWrapper}>
              <CheckCircle size={40} className={styles.successIcon} />
              <p className={styles.statusText}>Upload Complete!</p>
              <button className={styles.resetBtn} onClick={reset}>Upload another</button>
            </div>
          )}

          {status === 'error' && (
            <div className={styles.statusWrapper}>
              <AlertCircle size={40} className={styles.errorIcon} />
              <p className={styles.errorText}>{errorMessage}</p>
              <button className={styles.resetBtn} onClick={reset}>Try again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Uploader;