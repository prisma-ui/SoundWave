import { Gauge } from 'lucide-react'
import styles from './Controls.module.css'
import Slider from './Slider'

export default function Controls({ settings, onChange }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        <Gauge size={24} className={styles.icon} strokeWidth={1.5} />
        Pitch & Speed Control
      </h2>
      
      <div className={styles.grid}>
        <Slider
          label="Speed"
          value={settings.speed}
          min={0.5}
          max={2}
          step={0.1}
          onChange={(value) => onChange('speed', value)}
          format={(value) => `${value.toFixed(2)}x`}
        />
        
        <Slider
          label="Pitch"
          value={settings.pitch}
          min={-12}
          max={12}
          step={1}
          onChange={(value) => onChange('pitch', value)}
          format={(value) => `${value} st`}
        />
        
        <Slider
          label="Volume"
          value={settings.volume}
          min={0}
          max={100}
          step={1}
          onChange={(value) => onChange('volume', value)}
          format={(value) => `${value}%`}
        />
      </div>
    </div>
  )
}
