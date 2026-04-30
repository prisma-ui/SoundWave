import { useEffect, useRef, useState } from 'react'
import { SkipBack, Play, Pause, SkipForward } from 'lucide-react'
import WaveSurfer from 'wavesurfer.js'
import styles from './Player.module.css'

export default function Player({ audioFile, audioBlob }) {
  const waveformRef = useRef(null)
  const wavesurferRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!waveformRef.current || !audioBlob) return

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: 'rgb(0, 212, 255)',
      progressColor: 'rgb(255, 0, 110)',
      cursorColor: 'rgb(160, 174, 192)',
      height: 100,
      barWidth: 2,
      barGap: 3,
      responsive: true,
    })

    wavesurfer.loadBlob(audioBlob)

    wavesurfer.on('play', () => setIsPlaying(true))
    wavesurfer.on('pause', () => setIsPlaying(false))
    wavesurfer.on('audioprocess', () => setCurrentTime(wavesurfer.getCurrentTime()))
    wavesurfer.on('ready', () => setDuration(wavesurfer.getDuration()))

    wavesurferRef.current = wavesurfer

    return () => {
      wavesurfer.destroy()
    }
  }, [audioBlob])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    wavesurferRef.current?.playPause()
  }

  const handleSkip = (direction) => {
    const current = wavesurferRef.current?.getCurrentTime() || 0
    wavesurferRef.current?.setTime(current + direction * 10)
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        <Play size={24} className={styles.icon} strokeWidth={1.5} />
        Player
      </h2>
      
      {audioFile && (
        <div className={styles.fileInfo}>
          <p><strong>File:</strong> {audioFile.fileName}</p>
          <p><strong>Size:</strong> {(audioFile.fileSize / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}

      <div className={styles.waveform} ref={waveformRef} />

      <div className={styles.controls}>
        <button 
          className={styles.controlBtn}
          onClick={() => handleSkip(-1)}
          title="Skip back 10s"
        >
          <SkipBack size={20} strokeWidth={2} />
        </button>
        
        <button 
          className={styles.playBtn}
          onClick={handlePlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={24} strokeWidth={2} />
          ) : (
            <Play size={24} strokeWidth={2} />
          )}
        </button>
        
        <button 
          className={styles.controlBtn}
          onClick={() => handleSkip(1)}
          title="Skip forward 10s"
        >
          <SkipForward size={20} strokeWidth={2} />
        </button>

        <div className={styles.timeDisplay}>
          <span>{formatTime(currentTime)}</span>
          <span> / </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  )
}
