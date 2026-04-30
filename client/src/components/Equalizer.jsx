import { Sliders, RotateCcw } from 'lucide-react'
import styles from './Equalizer.module.css'

const BANDS = [
  { freq: 60, label: '60 Hz' },
  { freq: 250, label: '250 Hz' },
  { freq: 1000, label: '1k Hz' },
  { freq: 4000, label: '4k Hz' },
  { freq: 16000, label: '16k Hz' }
]

export default function Equalizer({ settings, onChange }) {
  const handleReset = () => {
    BANDS.forEach(band => {
      onChange(band.freq, 0)
    })
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Sliders size={24} className={styles.icon} strokeWidth={1.5} />
          5-Band Equalizer
        </h2>
        <button className={styles.resetBtn} onClick={handleReset}>
          <RotateCcw size={18} strokeWidth={2} />
          Reset
        </button>
      </div>
      
      <div className={styles.eqGrid}>
        {BANDS.map(band => (
          <div key={band.freq} className={styles.eqSlider}>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={settings[band.freq] || 0}
              onChange={(e) => onChange(band.freq, parseInt(e.target.value))}
              className={styles.slider}
            />
            <label className={styles.label}>{band.label}</label>
            <span className={styles.value}>{settings[band.freq] || 0} dB</span>
          </div>
        ))}
      </div>
    </div>
  )
}
