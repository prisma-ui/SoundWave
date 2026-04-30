import { useRef, useState } from 'react'
import { Upload, AlertCircle, CheckCircle } from 'lucide-react'
import styles from './UploadArea.module.css'

// SUPPORTED AUDIO FORMATS
const SUPPORTED_FORMATS = {
  'audio/mpeg': { ext: 'mp3', label: 'MP3' },
  'audio/wav': { ext: 'wav', label: 'WAV' },
  'audio/flac': { ext: 'flac', label: 'FLAC' },
  'audio/ogg': { ext: 'ogg', label: 'OGG' },
  'audio/x-wav': { ext: 'wav', label: 'WAV' },
  'audio/x-flac': { ext: 'flac', label: 'FLAC' },
}

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB

export default function UploadArea({ onUpload, isLoading, uploadCount }) {
  const fileInputRef = useRef(null)
  const [validationAlert, setValidationAlert] = useState(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file) => {
    // ✅ VALIDATION 1: Check if file type is supported
    if (!SUPPORTED_FORMATS[file.type]) {
      setValidationAlert({
        type: 'error',
        title: 'Invalid Format',
        message: `"${file.name}" is not a supported audio format.`,
        details: `Received: ${file.type || 'unknown type'} | Supported: MP3, WAV, FLAC, OGG`,
        file: file.name,
      })
      return
    }

    // ✅ VALIDATION 2: Check file size
    if (file.size > MAX_FILE_SIZE) {
      setValidationAlert({
        type: 'error',
        title: 'File Too Large',
        message: `"${file.name}" exceeds maximum file size.`,
        details: `File size: ${(file.size / 1024 / 1024).toFixed(2)} MB | Max: 500 MB`,
        file: file.name,
      })
      return
    }

    // ✅ VALIDATION 3: Check upload limit
    if (uploadCount.remaining <= 0) {
      setValidationAlert({
        type: 'error',
        title: 'Upload Limit Reached',
        message: 'You have reached your upload limit for today.',
        details: `Used: ${uploadCount.uploads}/${uploadCount.limit} | Try again in 24 hours`,
        file: file.name,
      })
      return
    }

    // ✅ All validations passed
    setValidationAlert({
      type: 'success',
      title: 'File Validated',
      message: `"${file.name}" is ready to upload.`,
      details: `Format: ${SUPPORTED_FORMATS[file.type].label} | Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`,
      file: file.name,
    })

    setTimeout(() => {
      onUpload(file)
      setValidationAlert(null)
    }, 1000)
  }

  const handleInputChange = (e) => {
    if (e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        <Upload size={24} className={styles.icon} strokeWidth={1.5} />
        Upload Audio
      </h2>
      
      <div 
        className={styles.uploadArea}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className={styles.iconWrapper}>
          <Upload size={48} className={styles.uploadIcon} strokeWidth={1.5} />
        </div>
        <p className={styles.mainText}>Click to upload or drag & drop</p>
        <p className={styles.subText}>MP3, WAV, FLAC, OGG (max 500MB)</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleInputChange}
        disabled={isLoading}
        style={{ display: 'none' }}
      />

      {/* ✅ FILE VALIDATION ALERT */}
      {validationAlert && (
        <div className={`${styles.alert} ${styles[validationAlert.type]}`}>
          <div className={styles.alertHeader}>
            {validationAlert.type === 'error' ? (
              <AlertCircle size={20} className={styles.alertIcon} />
            ) : (
              <CheckCircle size={20} className={styles.alertIcon} />
            )}
            <h3>{validationAlert.title}</h3>
          </div>
          <p className={styles.alertMessage}>{validationAlert.message}</p>
          <p className={styles.alertDetails}>{validationAlert.details}</p>
        </div>
      )}

      <div className={styles.uploadInfo}>
        <div className={styles.stat}>
          <span className={styles.label}>Uploads Used:</span>
          <span className={styles.value}>{uploadCount.uploads}/{uploadCount.limit}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>Remaining:</span>
          <span className={`${styles.value} ${uploadCount.remaining === 0 ? styles.limitReached : ''}`}>
            {uploadCount.remaining}
          </span>
        </div>
      </div>

      {isLoading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Uploading...</span>
        </div>
      )}
    </div>
  )
}
