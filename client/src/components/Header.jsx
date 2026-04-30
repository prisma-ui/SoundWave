import { Music } from 'lucide-react'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.titleWrapper}>
            <Music size={40} className={styles.icon} strokeWidth={1.5} />
            <h1 className={styles.title}>SoundWave</h1>
          </div>
          <p className={styles.subtitle}>Professional Audio Processing Studio</p>
          <p className={styles.limit}>Upload Limit: 5 per IP (24h)</p>
        </div>
      </div>
    </header>
  )
}
