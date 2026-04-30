import { Wand2 } from 'lucide-react'
import styles from './Effects.module.css'
import Slider from './Slider'

export default function Effects({ settings, onChange }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        <Wand2 size={24} className={styles.icon} strokeWidth={1.5} />
        Advanced Effects
      </h2>
      
      <div className={styles.grid}>
        <Slider
          label="Bass"
          value={settings.bass}
          min={-12}
          max={12}
          step={1}
          onChange={(value) => onChange('bass', value)}
          format={(value) => `${value} dB`}
        />
        
        <Slider
          label="Treble"
          value={settings.treble}
          min={-12}
          max={12}
          step={1}
          onChange={(value) => onChange('treble', value)}
          format={(value) => `${value} dB`}
        />
        
        <Slider
          label="Reverb"
          value={settings.reverb}
          min={0}
          max={100}
          step={1}
          onChange={(value) => onChange('reverb', value)}
          format={(value) => `${value}%`}
        />
        
        <Slider
          label="Stereo Width"
          value={settings.stereo}
          min={0}
          max={200}
          step={10}
          onChange={(value) => onChange('stereo', value)}
          format={(value) => `${value}%`}
        />
      </div>
    </div>
  )
}
