import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import styles from './App.module.css'
import Header from './components/Header'
import UploadArea from './components/UploadArea'
import Player from './components/Player'
import SoundProfiles from './components/SoundProfiles'
import Controls from './components/Controls'
import Equalizer from './components/Equalizer'
import Effects from './components/Effects'
import DownloadSection from './components/DownloadSection'
import StatusMessage from './components/StatusMessage'

const API_BASE = '/api'

export default function App() {
  const [audioFile, setAudioFile] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState(null)
  const [uploadCount, setUploadCount] = useState({ uploads: 0, remaining: 5, limit: 5 })
  const [settings, setSettings] = useState({
    speed: 1,
    pitch: 0,
    volume: 100,
    bass: 0,
    treble: 0,
    reverb: 0,
    stereo: 100,
    eq: { 60: 0, 250: 0, 1000: 0, 4000: 0, 16000: 0 }
  })
  const [currentProfile, setCurrentProfile] = useState('normal')
  const [processedFileId, setProcessedFileId] = useState(null)

  // Fetch upload count on mount
  useEffect(() => {
    fetchUploadCount()
  }, [])

  const fetchUploadCount = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/upload-count`)
      setUploadCount(data)
    } catch (error) {
      console.error('Failed to fetch upload count:', error)
    }
  }

  const showStatus = (message, type = 'info') => {
    setStatus({ message, type })
    setTimeout(() => setStatus(null), 4000)
  }

  const handleFileUpload = async (file) => {
    if (uploadCount.remaining === 0) {
      showStatus('Upload limit reached (5 per IP/24h)', 'error')
      return
    }

    setIsProcessing(true)
    const formData = new FormData()
    formData.append('audio', file)

    try {
      const { data } = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setAudioFile(data)
      setAudioBlob(file)
      setUploadCount(prev => ({
        ...prev,
        uploads: data.uploads,
        remaining: data.remaining
      }))
      showStatus('Audio uploaded successfully!', 'success')
    } catch (error) {
      showStatus(error.response?.data?.error || 'Upload failed', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApplyProfile = async (profile) => {
    setCurrentProfile(profile)
    try {
      const { data } = await axios.post(`${API_BASE}/profile`, { profile })
      setSettings(prev => ({
        ...prev,
        ...data.settings
      }))
      showStatus(`Profile "${profile}" applied!`, 'success')
    } catch (error) {
      showStatus('Failed to apply profile', 'error')
    }
  }

  const handleApplyPreset = async (preset) => {
    try {
      const { data } = await axios.post(`${API_BASE}/preset`, { preset })
      setSettings(prev => ({
        ...prev,
        ...data.settings
      }))
      showStatus(`Preset "${preset}" applied!`, 'success')
    } catch (error) {
      showStatus('Failed to apply preset', 'error')
    }
  }

  const handleProcessAudio = async () => {
    if (!audioFile) {
      showStatus('Please upload an audio file first', 'error')
      return
    }

    setIsProcessing(true)
    try {
      const { data } = await axios.post(`${API_BASE}/process`, {
        filePath: audioFile.path,
        ...settings
      })

      setProcessedFileId(data.id)
      showStatus('Audio processed successfully!', 'success')
    } catch (error) {
      showStatus(error.response?.data?.error || 'Processing failed', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = async () => {
    if (!processedFileId) {
      showStatus('Please process audio first', 'error')
      return
    }

    try {
      const response = await axios.get(`${API_BASE}/download/${processedFileId}`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = 'soundwave-processed.wav'
      link.click()
      window.URL.revokeObjectURL(url)
      showStatus('Download started!', 'success')
    } catch (error) {
      showStatus('Download failed', 'error')
    }
  }

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleEQChange = (band, value) => {
    setSettings(prev => ({
      ...prev,
      eq: {
        ...prev.eq,
        [band]: value
      }
    }))
  }

  return (
    <div className={styles.app}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.grid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            <UploadArea 
              onUpload={handleFileUpload}
              isLoading={isProcessing}
              uploadCount={uploadCount}
            />
            
            {audioFile && (
              <>
                <Player audioFile={audioFile} audioBlob={audioBlob} />
                
                <div className={styles.buttonGroup}>
                  <button 
                    className={styles.primaryBtn}
                    onClick={handleProcessAudio}
                    disabled={isProcessing}
                  >
                    {isProcessing ? '⏳ Processing...' : '⚡ Process Audio'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            <SoundProfiles 
              currentProfile={currentProfile}
              onApply={handleApplyProfile}
              onApplyPreset={handleApplyPreset}
            />
          </div>
        </div>

        {/* Controls Section */}
        {audioFile && (
          <>
            <Controls 
              settings={settings}
              onChange={handleSettingsChange}
            />
            
            <Equalizer 
              settings={settings.eq}
              onChange={handleEQChange}
            />
            
            <Effects 
              settings={settings}
              onChange={handleSettingsChange}
            />

            {processedFileId && (
              <DownloadSection onDownload={handleDownload} />
            )}
          </>
        )}
      </main>

      {status && (
        <StatusMessage 
          message={status.message}
          type={status.type}
        />
      )}
    </div>
  )
}
