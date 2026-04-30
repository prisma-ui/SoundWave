import { Download } from 'lucide-react'
import styles from './DownloadSection.module.css'

export default function DownloadSection({ onDownload }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        <Download size={24} className={styles.icon} strokeWidth={1.5} />
        Download Processed Audio
      </h2>
      
      <button className={styles.downloadBtn} onClick={onDownload}>
        <Download size={20} strokeWidth={2} />
        Download WAV (High Quality)
      </button>
      
      <p className={styles.info}>
        Your processed audio will be downloaded as a high-quality WAV file with all applied effects and settings.
      </p>
    </div>
  )
}
