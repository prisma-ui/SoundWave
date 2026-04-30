import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Setup uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
const processedDir = path.join(__dirname, 'processed');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${uuidv4()}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/ogg', 'audio/x-wav'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Rate limiting per IP
const uploadCounts = new Map();
const UPLOAD_LIMIT = 5;
const RESET_TIME = 24 * 60 * 60 * 1000;

function getClientIP(req) {
  return req.ip || req.connection.remoteAddress || 'unknown';
}

function checkUploadLimit(ip) {
  if (!uploadCounts.has(ip)) {
    uploadCounts.set(ip, { count: 0, timestamp: Date.now() });
  }
  
  const record = uploadCounts.get(ip);
  const now = Date.now();
  
  if (now - record.timestamp > RESET_TIME) {
    record.count = 0;
    record.timestamp = now;
  }
  
  if (record.count >= UPLOAD_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get upload count
app.get('/api/upload-count', (req, res) => {
  const ip = getClientIP(req);
  const record = uploadCounts.get(ip);
  const count = record ? record.count : 0;
  const remaining = Math.max(0, UPLOAD_LIMIT - count);
  
  res.json({
    uploads: count,
    remaining: remaining,
    limit: UPLOAD_LIMIT
  });
});

// Upload audio file
app.post('/api/upload', upload.single('audio'), (req, res) => {
  try {
    const ip = getClientIP(req);
    
    if (!checkUploadLimit(ip)) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(429).json({ error: 'Upload limit reached (5 per IP/24h)' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = uuidv4();
    const audioPath = req.file.path;

    // Get file metadata
    const stats = fs.statSync(audioPath);
    const fileName = req.file.originalname;
    const fileSize = stats.size;

    res.json({
      id: fileId,
      fileName: fileName,
      fileSize: fileSize,
      path: audioPath,
      uploads: uploadCounts.get(ip).count,
      remaining: UPLOAD_LIMIT - uploadCounts.get(ip).count
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Process audio dengan effects
app.post('/api/process', express.json(), (req, res) => {
  try {
    const { 
      filePath, 
      speed = 1, 
      pitch = 0, 
      volume = 100,
      bass = 0,
      treble = 0,
      reverb = 0,
      eq = { 60: 0, 250: 0, 1000: 0, 4000: 0, 16000: 0 }
    } = req.body;

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'File not found' });
    }

    // Simulate processing (dalam real scenario, gunakan FFmpeg)
    const processedId = uuidv4();
    const processedPath = path.join(processedDir, `${processedId}.wav`);

    // Create dummy processed file (dalam production, gunakan ffmpeg-fluent untuk real processing)
    fs.copyFileSync(filePath, processedPath);

    res.json({
      id: processedId,
      path: processedPath,
      settings: {
        speed,
        pitch,
        volume,
        bass,
        treble,
        reverb,
        eq
      },
      message: 'Audio processed successfully'
    });
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});

// Download processed audio
app.get('/api/download/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(processedDir, `${fileId}.wav`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, 'soundwave-processed.wav', (err) => {
      if (err) console.error('Download error:', err);
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Get audio waveform data (simplified)
app.post('/api/waveform', express.json(), (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(400).json({ error: 'File not found' });
    }

    // Generate simplified waveform data
    const samples = Array(100).fill(0).map(() => Math.random() * 100);

    res.json({
      samples: samples,
      duration: 180, // dummy duration in seconds
      sampleRate: 44100
    });
  } catch (error) {
    console.error('Waveform error:', error);
    res.status(500).json({ error: 'Failed to generate waveform' });
  }
});

// Apply sound profile
app.post('/api/profile', express.json(), (req, res) => {
  try {
    const { profile } = req.body;

    const profiles = {
      normal: { speed: 1, pitch: 0, bass: 0, treble: 0 },
      nightcore: { speed: 1.2, pitch: 3, bass: 5, treble: 3 },
      smooth: { speed: 1, pitch: 0, bass: 3, treble: -2 },
      chipmunk: { speed: 1.1, pitch: 7, bass: -2, treble: 4 },
      bass: { speed: 1, pitch: 0, bass: 10, treble: -3 },
      slow: { speed: 0.8, pitch: -2, bass: 0, treble: 0 }
    };

    const result = profiles[profile] || profiles.normal;

    res.json({
      profile: profile,
      settings: result
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to apply profile' });
  }
});

// Apply preset
app.post('/api/preset', express.json(), (req, res) => {
  try {
    const { preset } = req.body;

    const presets = {
      podcast: { speed: 1, pitch: 0, bass: 2, treble: 3, reverb: 10 },
      hiphop: { speed: 1, pitch: 0, bass: 8, treble: 2, reverb: 5 },
      pop: { speed: 1, pitch: 1, bass: 3, treble: 4, reverb: 15 },
      edm: { speed: 1.05, pitch: 0, bass: 10, treble: 5, reverb: 20 }
    };

    const result = presets[preset] || {};

    res.json({
      preset: preset,
      settings: result
    });
  } catch (error) {
    console.error('Preset error:', error);
    res.status(500).json({ error: 'Failed to apply preset' });
  }
});

// Cleanup old files (run every hour)
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  
  [uploadsDir, processedDir].forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtimeMs < oneHourAgo) {
        fs.unlinkSync(filePath);
      }
    });
  });
}, 60 * 60 * 1000);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
});
