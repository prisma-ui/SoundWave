# 🚀 SoundWave - Deployment & Setup Guide

Panduan lengkap untuk setup, test lokal, dan deploy ke Vercel/Render.

## 📦 Apa yang Anda Dapat

✅ **Full-Stack React + Express Application**
- Frontend: React 18 + Vite + CSS Modules
- Backend: Express.js dengan file upload handling
- Semua fitur audio processing bekerja 100%
- Responsive design (mobile + desktop)
- Dark theme dengan neon accents

✅ **Complete Features**
- Upload audio (MP3, WAV, FLAC, OGG)
- 6 sound profiles + 4 quick presets
- Pitch & Speed control
- 5-Band Equalizer
- Bass, Treble, Reverb, Stereo Width effects
- WaveSurfer.js waveform visualization
- Download processed audio
- Rate limiting (5 uploads per IP/24h)
- Real-time status messages

✅ **Siap Production**
- Vercel & Render configuration included
- Environment variable templates
- Build optimization
- API error handling
- Auto cleanup temp files

---

## 🎯 Step 1: Extract & Setup Lokal

### 1a. Extract ZIP File

```bash
# Extract soundwave-app.zip
unzip soundwave-app.zip

# Navigate ke project
cd soundwave-app

# List project structure
ls -la
```

Struktur yang akan Anda lihat:
```
soundwave-app/
├── client/              # React frontend
├── server/              # Express backend
├── package.json         # Root workspace
├── .env.example        # Environment template
├── README.md           # Full documentation
├── vercel.json         # Vercel config
└── render.yaml         # Render config
```

### 1b. Install Dependencies

```bash
# Install all dependencies (client + server + root)
npm run install-all

# Atau manual:
npm install                    # Root dependencies
cd client && npm install       # Client dependencies
cd ../server && npm install    # Server dependencies
cd ..                          # Back to root
```

### 1c. Start Local Development

**Option A: Start Both (Recommended)**
```bash
npm run dev

# Server akan run di: http://localhost:5000
# Client akan run di: http://localhost:3000
# Browser auto-open http://localhost:3000
```

**Option B: Start Separately**
```bash
# Terminal 1 - Backend Server
cd server && npm run dev

# Terminal 2 - Frontend Client
cd client && npm run dev
```

### 1d. Test Application

Buka browser: `http://localhost:3000`

Lakukan testing:
1. ✅ Upload file audio (test dengan file MP3/WAV yang kecil)
2. ✅ Klik play button - waveform harus muncul
3. ✅ Coba klik sound profile (Normal, Nightcore, dll)
4. ✅ Adjust sliders (Pitch, Speed, Volume)
5. ✅ Ubah EQ bands (semua 5 band)
6. ✅ Klik "Process Audio" button
7. ✅ Download hasil processing

Jika semua berfungsi ✅, siap untuk deploy!

---

## 🌐 Step 2: Prepare untuk GitHub

### 2a. Setup Git Repository

```bash
# Initialize git (jika belum ada)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: SoundWave audio processor"

# Create main branch
git branch -M main
```

### 2b. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `soundwave`
3. Description: `Professional Audio Processing Studio`
4. Make it **Public** (untuk deploy gratis)
5. Click "Create repository"

### 2c. Push ke GitHub

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/soundwave.git

# Push to GitHub
git push -u origin main

# Verify
git remote -v
```

---

## 🚀 Step 3A: Deploy ke Vercel (EASIEST)

### 3A.1 Via Vercel Dashboard (Recommended)

1. **Login ke Vercel**
   - Go to https://vercel.com
   - Click "Sign Up" atau login dengan GitHub

2. **Connect GitHub**
   - Click "New Project"
   - Click "Select a Git Repository"
   - Authorize Vercel access to GitHub
   - Select your GitHub account
   - Find `soundwave` repository
   - Click "Import"

3. **Configure Project**
   - **Project Name**: soundwave (or custom name)
   - **Framework**: Vite
   - **Root Directory**: ./client (IMPORTANT!)
   - **Build Command**: `npm run build -w client`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

4. **Environment Variables** (Optional)
   - Add jika perlu custom API URL
   - Tapi biasanya tidak perlu untuk setup ini

5. **Deploy**
   - Click "Deploy"
   - Tunggu build process (~2-3 menit)
   - ✅ Selesai! Lihat URL deployment

### 3A.2 Via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from project root
vercel

# Follow prompts:
# ? Set up and deploy "~/soundwave"? y
# ? Which scope do you want to deploy to? (Select your account)
# ? Link to existing project? n
# ? What's your project's name? soundwave
# ? In which directory is your code located? ./
# ? Want to modify these settings before deploying? y

# On settings page:
# - Build Command: npm run build -w client
# - Output Directory: client/dist
# - Install Command: npm install

# Confirm deploy
```

### 3A.3 Post-Deployment

```bash
# Production URL akan seperti:
# https://soundwave.vercel.app
# atau
# https://soundwave-abc123.vercel.app

# Untuk custom domain:
# - Go to Project Settings → Domains
# - Add your custom domain
# - Follow DNS instructions
```

---

## 🚀 Step 3B: Deploy ke Render

### 3B.1 Setup Backend Service

1. **Login ke Render**
   - Go to https://render.com
   - Sign up / login dengan GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub
   - Find `soundwave` repository
   - Click "Connect"

3. **Configure Backend**
   - **Name**: `soundwave-api` (atau custom)
   - **Environment**: Node
   - **Region**: Pilih yang paling dekat
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Branch**: main
   - **Root Directory**: `server` (atau kosongkan jika di root)

4. **Environment Variables**
   ```
   KEY: PORT
   VALUE: 5000
   
   KEY: NODE_ENV
   VALUE: production
   ```

5. **Create & Deploy**
   - Click "Create Web Service"
   - Tunggu build (~5 menit)
   - Catat Backend URL (contoh: https://soundwave-api.onrender.com)

### 3B.2 Setup Frontend Service

1. **Create Another Web Service**
   - Click "New +" → "Web Service"
   - Select `soundwave` repository lagi
   - Click "Connect"

2. **Configure Frontend**
   - **Name**: `soundwave-app` (atau custom)
   - **Environment**: Node
   - **Build Command**: `npm run build -w client`
   - **Start Command**: `npm run preview -w client`
   - **Root Directory**: `.` (root)

3. **Environment Variables** (Optional)
   ```
   KEY: VITE_API_URL
   VALUE: https://soundwave-api.onrender.com/api
   ```

4. **Create & Deploy**
   - Click "Create Web Service"
   - Tunggu build (~5 menit)
   - Frontend URL (contoh: https://soundwave-app.onrender.com)

### 3B.3 Post-Deployment

```bash
# URLs Anda akan:
# Frontend: https://soundwave-app.onrender.com
# Backend: https://soundwave-api.onrender.com/api

# Test API:
curl https://soundwave-api.onrender.com/api/health
# Response: {"status":"ok","message":"Server is running"}
```

---

## ✅ Verification & Testing

### Test Deployment

1. **Visit Your URL**
   ```
   https://soundwave.vercel.app (Vercel)
   atau
   https://soundwave-app.onrender.com (Render)
   ```

2. **Test Functionality**
   - ✅ Upload audio file
   - ✅ Waveform appears
   - ✅ Player controls work
   - ✅ Sound profiles apply
   - ✅ Sliders adjust values
   - ✅ Process Audio button works
   - ✅ Download works

3. **Check Console**
   - Open DevTools (F12)
   - Go to Console tab
   - No red errors should appear

4. **Check Network**
   - Go to Network tab
   - Upload file
   - Check API requests are successful (200, 201 status)

---

## 🔧 Troubleshooting

### Deployment Failed on Vercel

**Check Build Logs:**
1. Go to Project → Deployments
2. Click failed deployment
3. Scroll down to "Build Logs"
4. Search for error message

**Common Issues:**
```
Error: Cannot find module 'express'
→ Make sure npm install runs
→ Check package.json exists in root

Error: ENOENT: no such file or directory
→ Check Root Directory setting
→ Should be ./ or empty for root

Error: Client build failed
→ Check client/package.json exists
→ Verify vite.config.js is correct
```

**Solution:**
```bash
# Clear Vercel cache
vercel env pull  # Pull env vars
vercel deploy --force  # Force redeploy
```

### Deployment Failed on Render

**Check Build Logs:**
1. Go to Service Dashboard
2. Click "Logs" tab
3. Look for error at bottom

**Common Issues:**
```
Error: npm ERR! ERESOLVE unable to resolve dependency tree
→ Delete package-lock.json
→ npm cache clean --force
→ Redeploy

Error: The service did not respond within the timeout period
→ Increase Build Timeout in settings
→ Optimize dependencies
```

**Solution:**
```bash
# Verify locally first
npm run build
npm start

# If working locally, issue is deployment config
# Check Environment variables
# Check Root Directory setting
```

### Upload Not Working in Production

**Check:**
1. Server is running
2. Backend API is responding
3. CORS is configured correctly
4. Uploads directory exists

**Test API:**
```bash
# Test backend
curl https://your-api.com/api/health

# Response should be:
{"status":"ok","message":"Server is running"}
```

### Large File Upload Timeouts

**Solution:**
```bash
# Edit server/src/index.js
# Increase upload limit in multer
limits: { fileSize: 1000 * 1024 * 1024 } // 1GB instead of 500MB
```

---

## 📊 Monitoring & Analytics

### Vercel Analytics
```
Project → Analytics
- Real-time requests
- Response times
- Error rates
- Usage metrics
```

### Render Metrics
```
Dashboard → Metrics
- CPU usage
- Memory usage
- Requests per minute
- Response time
```

---

## 🎨 Customization (After Deploy)

### Change App Name

Edit `client/src/components/Header.jsx`:
```jsx
<h1 className={styles.title}>🎵 Your App Name</h1>
```

Then redeploy:
```bash
git add .
git commit -m "Updated app name"
git push origin main
# Vercel/Render auto-redeploy
```

### Change Colors

Edit `client/src/index.css`:
```css
:root {
  --accent-primary: #your-color;
  --accent-secondary: #your-color;
}
```

### Add More Profiles

Edit `server/src/index.js` dan `client/src/components/SoundProfiles.jsx`

---

## 🆘 Getting Help

### Resources
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com

### If Something Goes Wrong
1. Check deployment logs
2. Verify local development works
3. Read error messages carefully
4. Try rebuild/redeploy
5. Clear cache and try again

---

## ✨ Next Steps

After successful deployment:

1. ✅ **Share URL**
   - Send to friends/colleagues
   - Post on social media
   - Add to portfolio

2. ✅ **Add Custom Domain** (Optional)
   - Register domain
   - Add to Vercel/Render
   - Point DNS

3. ✅ **Monitor Performance**
   - Check analytics
   - Optimize if needed
   - Scale if popular

4. ✅ **Keep Updated**
   - Monitor dependencies
   - Update when needed
   - Fix bugs if found

---

## 📝 Checklist

- [ ] Extracted ZIP file
- [ ] Ran `npm run install-all`
- [ ] Tested locally with `npm run dev`
- [ ] All features working locally
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel or Render
- [ ] Tested production URL
- [ ] All features working in production
- [ ] Shared with others
- [ ] Added custom domain (optional)

---

## 🎉 Selesai!

Anda sudah berhasil membuat dan deploy aplikasi audio processing profesional!

Enjoy your SoundWave application! 🎵

---

**Questions or Issues?**
- Check README.md untuk dokumentasi lengkap
- Review API endpoints documentation
- Check server/src/index.js untuk backend logic
- Check client/src/ untuk frontend components

Happy coding! ✨
