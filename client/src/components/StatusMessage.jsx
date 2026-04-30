import styles from './StatusMessage.module.css'

export default function StatusMessage({ message, type = 'info' }) {
  return (
    <div className={`${styles.status} ${styles[type]}`}>
      <span className={styles.message}>{message}</span>
    </div>
  )
}
