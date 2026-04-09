# Kandil360 EMR -- Deployment Guide

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Firebase Project Setup](#2-firebase-project-setup)
3. [Environment Variables](#3-environment-variables)
4. [Local Development](#4-local-development)
5. [Production Build](#5-production-build)
6. [Netlify Deployment](#6-netlify-deployment)
7. [Railway Deployment (Future Backend)](#7-railway-deployment)
8. [Custom Domain Setup](#8-custom-domain-setup)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| npm | 9+ | Package manager |
| Git | 2.0+ | Version control |
| Firebase account | -- | Authentication (and future database) |
| Netlify account | -- | Static site hosting (recommended) |

---

## 2. Firebase Project Setup

### 2a. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project**
3. Enter a project name (e.g., `kandil360-production`)
4. Disable Google Analytics (optional, not required)
5. Click **Create project**

### 2b. Enable Google Authentication

1. In the Firebase Console, navigate to **Authentication** > **Sign-in method**
2. Click **Google** provider
3. Toggle **Enable**
4. Set a project support email
5. Click **Save**

### 2c. Register a Web App

1. Navigate to **Project Settings** (gear icon)
2. Under **Your apps**, click the web icon (`</>`)
3. Enter a nickname (e.g., `kandil360-web`)
4. Do NOT enable Firebase Hosting (we use Netlify)
5. Click **Register app**
6. Copy the `firebaseConfig` object -- you will need these values

The config looks like:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 2d. Configure Authorized Domains

1. In **Authentication** > **Settings** > **Authorized domains**
2. Add your deployment domain (e.g., `kandil360.netlify.app`, `app.kandil360.com`)
3. `localhost` is authorized by default for development

### 2e. Enable Cloud Firestore (Optional, for Phase 3)

1. Navigate to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development) or **production mode** (with security rules)
4. Select a region close to your users
5. Click **Enable**

### Firestore Security Rules (Production)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /patients/{patientId}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 3. Environment Variables

### Option A: Direct Configuration (Current)

Update `src/firebase.js` directly with your Firebase config values. This is the current approach used in development.

### Option B: Environment Variables (Recommended for Production)

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

Then update `src/firebase.js` to read from environment:

```js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

**Important**: Add `.env` to your `.gitignore` to prevent committing secrets.

---

## 4. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The development server starts at `http://localhost:5173` with hot module replacement.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |

---

## 5. Production Build

```bash
# Build for production
npm run build
```

This creates an optimized build in the `dist/` directory:
- JavaScript is minified and tree-shaken
- CSS is purged and minified via Tailwind
- Assets are hashed for cache busting
- Output is a static SPA (single HTML file + assets)

### Verify the Build

```bash
# Preview the production build locally
npm run preview
```

This serves the `dist/` folder at `http://localhost:4173`.

---

## 6. Netlify Deployment

### Option A: Git-Connected (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Log in to [Netlify](https://app.netlify.com)
3. Click **Add new site** > **Import an existing project**
4. Connect your Git provider and select the repository
5. Configure build settings:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Node version | `18` (set in environment) |

6. Add environment variables under **Site settings** > **Environment variables**
7. Click **Deploy site**

### Option B: Manual Deploy

```bash
# Build locally
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### SPA Routing Configuration

Create `public/_redirects` (or verify it exists):

```
/*    /index.html   200
```

This ensures client-side routing works correctly -- all paths serve the SPA shell, and React Router handles navigation.

### Alternative: `netlify.toml`

Create `netlify.toml` in the project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 7. Railway Deployment

For the future Express.js backend server (Phase 3+):

### Setup

1. Sign up at [Railway](https://railway.app)
2. Create a new project
3. Connect your backend repository (or use a monorepo with the `/server` directory)
4. Railway auto-detects Node.js projects

### Configuration

| Setting | Value |
|---------|-------|
| Start command | `npm start` (or `node server.js`) |
| Port | Railway assigns automatically via `PORT` env var |

### Environment Variables

Add the same Firebase config values plus:

```
PORT=3000
NODE_ENV=production
FIREBASE_SERVICE_ACCOUNT_KEY=<base64-encoded service account JSON>
```

### Backend Architecture (Planned)

```
server/
  index.js              # Express server entry
  routes/
    patients.js         # /api/patients routes
    auth.js             # /api/auth routes
    audit.js            # /api/audit routes
  middleware/
    auth.js             # Firebase token verification
  services/
    firestore.js        # Firestore CRUD operations
```

---

## 8. Custom Domain Setup

### Netlify

1. Go to **Site settings** > **Domain management**
2. Click **Add custom domain**
3. Enter your domain (e.g., `app.kandil360.com`)
4. Update your DNS:
   - Add a `CNAME` record pointing to `your-site.netlify.app`
   - Or use Netlify DNS for automatic configuration
5. Enable HTTPS (automatic via Let's Encrypt)

### Firebase Authorized Domain

After adding a custom domain, add it to Firebase:

1. Firebase Console > **Authentication** > **Settings** > **Authorized domains**
2. Add `app.kandil360.com` (your custom domain)

---

## 9. Troubleshooting

### Build Fails

```bash
# Clear caches and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Authentication Errors

- **Popup blocked**: Ensure your domain is in Firebase authorized domains
- **Google Sign-In fails**: Verify the Google provider is enabled in Firebase Auth
- **CORS errors**: Check that `authDomain` in firebase config matches your project

### Blank Page After Deploy

- Check that the `_redirects` file or `netlify.toml` is configured for SPA routing
- Verify the build output in `dist/` contains `index.html`
- Check browser console for JavaScript errors

### localStorage Not Persisting

- localStorage is browser-specific and domain-specific
- Data does not sync across devices (this is by design for the current phase)
- Clearing browser data will reset all user-created entries
- Seed data is always restored from the JavaScript bundle

### Firebase Quota Limits

Firebase free tier (Spark plan) includes:
- 10K authentications per month
- 50K Firestore reads per day
- 20K Firestore writes per day
- 1 GiB Firestore storage

For production with multiple users, upgrade to the Blaze (pay-as-you-go) plan.
