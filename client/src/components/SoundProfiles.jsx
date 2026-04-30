import { Zap, Mic, Volume2, Headphones } from 'lucide-react'
import styles from './SoundProfiles.module.css'

const PROFILES = {
  normal: 'Default flat response',
  nightcore: 'Increased pitch and speed',
  smooth: 'Warm and smooth sound',
  chipmunk: 'High pitch effect',
  bass: 'Deep bass boost',
  slow: 'Ethereal dreamy tone'
}

const PRESETS = [
  { key: 'podcast', label: 'Podcast', icon: Mic, description: 'Optimized for voice clarity' },
  { key: 'hiphop', label: 'Hip-Hop', icon: Volume2, description: 'Boosted bass and punch' },
  { key: 'pop', label: 'Pop', icon: Zap, description: 'Balanced and bright' },
  { key: 'edm', label: 'EDM', icon: Headphones, description: 'Enhanced bass and treble' }
]

export default function SoundProfiles({ currentProfile, onApply, onApplyPreset }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        <Headphones size={24} className={styles.icon} strokeWidth={1.5} />
        Sound Profiles
      </h2>
      
      <div className={styles.profiles}>
        {Object.entries(PROFILES).map(([key, desc]) => (
          <button
            key={key}
            className={`${styles.profileBtn} ${currentProfile === key ? styles.active : ''}`}
            onClick={() => onApply(key)}
            title={desc}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.description}>
        <strong>Profile:</strong>
        <p>{PROFILES[currentProfile]}</p>
      </div>

      <h3 className={styles.presetsTitle}>Quick Presets</h3>
      <div className={styles.presets}>
        {PRESETS.map(({ key, label, icon: Icon, description }) => (
          <button
            key={key}
            className={styles.presetBtn}
            onClick={() => onApplyPreset(key)}
            title={description}
          >
            <Icon size={20} className={styles.presetIcon} strokeWidth={1.5} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
