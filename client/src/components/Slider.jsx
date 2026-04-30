import styles from './Slider.module.css'

export default function Slider({ label, value, min, max, step, onChange, format }) {
  return (
    <div className={styles.sliderGroup}>
      <div className={styles.header}>
        <label className={styles.label}>{label}</label>
        <span className={styles.value}>{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={styles.slider}
      />
    </div>
  )
}
