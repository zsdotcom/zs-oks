# 050 — Setup & Installation Guide

This document provides step-by-step instructions for setting up the **Open Knowledge Studio v1.0** development environment.

---

## 1. Prerequisites

| Requirement | Version | Description |
| :--- | :--- | :--- |
| **Node.js** | v22.0.0+ (tested v26) | JavaScript runtime |
| **npm** | v10.0.0+ (tested v11) | Package manager |
| **Git** | v2.0.0+ | Version control |

---

## 2. Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/codeandbrain/open-knowledge-studio.git
cd open-knowledge-studio
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Add your API keys:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
VITE_GOOGLE_OAUTH_CLIENT_ID=your_google_client_id_here
```

> **Security Warning:** Never commit your `.env` file. It is already in `.gitignore`.

---

## 3. Running the Application

### Development Mode

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Production Build

```bash
npm run build      # tsc --noEmit && vite build
npm run preview    # serve dist/ locally
```

---

## 4. Running Tests

```bash
npm test               # Unit + integration
npm run test:watch     # Watch mode
npm run test:coverage  # V8 coverage report
npm run test:bench     # Performance benchmarks
```

---

## 5. Troubleshooting

### Issue: "Module not found" errors

**Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install`.

### Issue: IndexedDB quota exceeded

**Solution:** Clear browser site data for the domain (`Settings > Privacy and security > Site settings` in Chrome).

### Issue: Google OAuth not working

**Solution:** Ensure `VITE_GOOGLE_OAUTH_CLIENT_ID` is set in `.env` and the redirect URI is configured in Google Cloud Console.
