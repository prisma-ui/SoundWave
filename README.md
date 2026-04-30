# 🎵 SoundWave - Professional Audio Processing Studio

A modern, full-stack audio processing application built with **React + Vite** (frontend) and **Express.js** (backend). Features professional audio effects, sound profiles, equalizer, and more.

## ✨ Features

### Audio Processing
- ✅ Upload audio files (MP3, WAV, FLAC, OGG) - max 500MB
- ✅ Real-time waveform visualization (WaveSurfer.js)
- ✅ Audio playback with controls (Play/Pause, Skip, Timeline)
- ✅ File metadata display (name, duration, size)

### Sound Profiles
- 🎵 **Normal** - Default flat response
- 🚀 **Nightcore** - Increased pitch & speed for energetic feel
- 🎶 **Smooth** - Warm sound with boosted mids and lows
- 🐿️ **Chipmunk** - High pitch effect for fun tone
- 🔊 **Bass Boost** - Deep bass enhancement
- 💫 **Slow-Mo** - Ethereal and dreamy effect

### Sound Controls
- **Pitch Control** - Adjust pitch independently (-12 to +12 semitones)
- **Speed Control** - Control playback speed (0.5x to 2x)
- **Volume Control** - Adjust volume (0-100%)
- **Bass & Treble** - Fine-tune frequency response (-12 to +12 dB)
- **Reverb Effect** - Add spatial reverb (0-100%)
- **Stereo Width** - Expand or compress stereo field (0-200%)

### 5-Band Equalizer
Professional-grade equalizer with control over:
- 60 Hz (Sub-bass)
- 250 Hz (Bass)
- 1 kHz (Midrange)
- 4 kHz (Upper-midrange)
- 16 kHz (Treble)

### Quick Presets
- 🎙️ **Podcast** - Optimized for voice clarity
- 🎤 **Hip-Hop** - Boosted bass and punch
- 🎸 **Pop** - Balanced and bright
- ⚡ **EDM** - Enhanced bass and treble

### Additional Features
- 🔄 Rate limiting (5 uploads per IP per 24 hours)
- 📊 Upload counter with remaining limit display
- 💾 Download processed audio as WAV
- 🌙 Dark theme with neon accents
- 📱 Fully responsive design
- ⚡ Fast performance with Vite

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **WaveSurfer.js** - Audio visualization
- **Axios** - HTTP client
- **CSS Modules** - Scoped styling

### Backend
- **Express.js** - Web framework
- **Multer** - File upload handling
- **Cors** - Cross-origin requests
- **Node.js 18.x** - Runtime

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git

## 🚀 Quick Start (Local Development)

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd soundwave

# Install all dependencies
npm run install-all
```

### 2. Start Development Servers

```bash
# Terminal 1: Start both client and server (concurrently)
npm run dev

# Or start separately:
# Terminal 1 - Backend (port 5000)
cd server && npm run dev

# Terminal 2 - Frontend (port 3000)
cd client && npm run dev
```

### 3. Access Application

Open your browser and navigate to:
```
http://localhost:3000
```

The frontend will proxy API requests to `http://localhost:5000/api`

## 📦 Build for Production

```bash
# Build both client and server
npm run build

# Or build separately
cd client && npm run build  # Creates dist/ folder
cd server && npm run build  # Creates dist/ folder
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SoundWave audio processor"
   git branch -M main
   git remote add origin https://github.com/username/soundwave.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Select your GitHub repository
   - Vercel will auto-detect Vite project
   - Click "Deploy"
   - Your site is live!

3. **Via Vercel CLI** (Alternative)
   ```bash
   npm install -g vercel
   vercel
   # Follow prompts and confirm deployment
   ```

### Deploy to Render

1. **Push to GitHub** (same as above)

2. **Deploy on Render**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Fill in deployment settings:
     - **Name**: soundwave
     - **Environment**: Node
     - **Build Command**: `npm run build`
     - **Start Command**: `node server/dist/index.js`
   - Click "Create Web Service"
   - Wait ~5 minutes for deployment

3. **Environment Variables** (if needed)
   - Add in Render dashboard: Environment
   - `PORT=5000`
   - `NODE_ENV=production`

## 🏗️ Project Structure

```
soundwave/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.jsx          # Main app component
│   │   ├── App.module.css   # App styles
│   │   ├── index.css        # Global styles
│   │   └── main.jsx         # React entry point
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Frontend dependencies
│
├── server/                    # Express backend
│   ├── src/
│   │   └── index.js         # Server entry point
│   ├── uploads/             # Uploaded audio files (temp)
│   ├── processed/           # Processed audio files (temp)
│   └── package.json         # Backend dependencies
│
├── package.json             # Root package (workspaces)
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── vercel.json             # Vercel config
├── render.yaml             # Render config
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and modify:

```env
# Server settings
PORT=5000
NODE_ENV=development

# Upload limits
UPLOAD_LIMIT=5
```

### Vite Proxy

The dev server proxies `/api` requests to the backend:

```javascript
// In client/vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true
  }
}
```

## 📡 API Endpoints

All endpoints are at `/api/*`

### Upload Audio
```
POST /api/upload
Content-Type: multipart/form-data
Body: { audio: File }
Response: { id, fileName, fileSize, uploads, remaining }
```

### Process Audio
```
POST /api/process
Content-Type: application/json
Body: { filePath, speed, pitch, volume, bass, treble, reverb, eq }
Response: { id, path, settings }
```

### Download File
```
GET /api/download/:fileId
Response: Audio file (wav)
```

### Apply Profile
```
POST /api/profile
Body: { profile: "normal|nightcore|smooth|chipmunk|bass|slow" }
Response: { profile, settings }
```

### Apply Preset
```
POST /api/preset
Body: { preset: "podcast|hiphop|pop|edm" }
Response: { preset, settings }
```

### Upload Count
```
GET /api/upload-count
Response: { uploads, remaining, limit }
```

### Health Check
```
GET /api/health
Response: { status, message }
```

## 🎨 Customization

### Change Color Scheme

Edit CSS variables in `client/src/index.css`:

```css
:root {
  --accent-primary: #00d4ff;    /* Cyan */
  --accent-secondary: #ff006e;  /* Magenta */
  /* ... other colors ... */
}
```

### Add New Sound Profile

1. Edit `server/src/index.js`:
```javascript
const profiles = {
  myprofile: { speed: 1.2, pitch: 2, bass: 5, treble: 1 },
  // ...
};
```

2. Edit `client/src/components/SoundProfiles.jsx`:
```javascript
const PROFILES = {
  myprofile: 'My custom profile description',
  // ...
};
```

### Increase Upload Limit

Edit `server/src/index.js`:
```javascript
const UPLOAD_LIMIT = 10;  // Change from 5 to 10
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Build Fails
```bash
# Clear dependencies and reinstall
rm -rf node_modules client/node_modules server/node_modules
npm run install-all

# Clear Vite cache
rm -rf client/dist
```

### Uploads Not Working
- Check server is running on port 5000
- Check uploads/ directory exists and is writable
- Check API proxy in vite.config.js

### Deployment Issues
- Check build logs in platform dashboard
- Ensure Node.js version is 18.x
- Verify all environment variables are set

## 📊 Performance Tips

- **Lazy load audio** - Only decode what's needed
- **Compress uploads** - Encourage users to compress audio first
- **Cache profiles** - Profiles are computed once and reused
- **Cleanup temp files** - Old uploads are auto-deleted every hour

## 📝 License

MIT License - Feel free to use and modify

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review API endpoint details

---

**Created with ❤️** - Enjoy processing audio! 🎵

## 🚀 Next Steps After Deployment

1. ✅ Test all features in production
2. ✅ Monitor performance metrics
3. ✅ Set up custom domain (optional)
4. ✅ Enable HTTPS (automatic on Vercel/Render)
5. ✅ Share with users!

Happy audio processing! 🎧
