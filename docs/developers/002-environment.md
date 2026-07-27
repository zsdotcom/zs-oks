---
title: "020 — Environment Variables & API Keys"
category: "developers"
order: 20
tags: ["environment", "api-keys", "configuration", "secrets"]
last_updated: "2026-07-26"
---

# 020 — Environment Variables & API Keys

Complete reference for all environment variables used by Open Knowledge Studio.

---

## 1. Complete Variable Reference

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `VITE_GEMINI_API_KEY` | No | — | Google Gemini API key (Coordinator & Writer agents) |
| `VITE_GROQ_API_KEY` | No | — | Groq API key (Researcher agent, fast inference) |
| `VITE_OPENAI_API_KEY` | No | — | OpenAI API key (GPT-4o-mini, GPT-4o) |
| `VITE_ANTHROPIC_API_KEY` | No | — | Anthropic API key (Claude 3.5 Sonnet) |
| `VITE_DEEPSEEK_API_KEY` | No | — | DeepSeek API key (fallback provider) |
| `VITE_CEREBRAS_API_KEY` | No | — | Cerebras API key (high-speed inference) |
| `VITE_OPENROUTER_API_KEY` | No | — | OpenRouter unified API key (multi-model access) |
| `VITE_GOOGLE_OAUTH_CLIENT_ID` | No | — | Google OAuth 2.0 Client ID (Drive/Docs integration) |
| `VITE_GITHUB_TOKEN` | No | — | GitHub personal access token (repository integration) |

> **All variables are optional.** The app works with any combination of providers.

---

## 2. API Key Sources

### 2.1 Google Gemini API Key

**Free tier:** 15 RPM, 1M TPM, 1500 RPD

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key

### 2.2 Groq API Key

**Free tier:** 30 RPM, 6K TPM

1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Sign in (create account if needed)
3. Click **Create API Key**
4. Copy the key

### 2.3 OpenAI API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account
3. Click **Create new secret key**
4. Copy the key

### 2.4 Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign in or create an account
3. Navigate to **API Keys**
4. Click **Create Key**
5. Copy the key

### 2.5 DeepSeek API Key

**Free tier:** 5 RPM

1. Go to [platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys)
2. Sign in or create an account
3. Click **Create API Key**
4. Copy the key

### 2.6 Cerebras API Key

**Free tier:** 15 RPM

1. Go to [cloud.cerebras.ai](https://cloud.cerebras.ai/)
2. Sign in or create an account
3. Navigate to **API Keys**
4. Click **Create Key**
5. Copy the key

### 2.7 OpenRouter API Key

1. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign in (GitHub or Google account)
3. Click **Create Key**
4. Copy the key

### 2.8 Google OAuth Client ID

1. Go to [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Create a project (or select existing)
3. Click **Create Credentials → OAuth Client ID**
4. Select **Web Application**
5. Add `http://localhost:3000` and your production URL to **Authorized JavaScript origins**
6. Click **Create**
7. Copy the **Client ID**

### 2.9 GitHub Token

**Free tier:** Unlimited for public repos; included with GitHub Free plan.

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Select scopes: `repo` (for private repos), `public_repo` (for public repos)
4. Click **Generate token**
5. Copy the token

### 2.10 GitHub OAuth Client ID (Device Flow)

Used by `githubAuthService.ts` for device-flow authentication in the app.

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set **Authorization callback URL** to `http://localhost:3000`
4. Copy the **Client ID**

---

## 3. CSP (Content Security Policy)

The dev server CSP in `vite.config.ts` `connect-src` controls which API domains the app can reach. If enabling a new external API, add its domain to the `connect-src` directive.

Currently allowed: OpenStreetMap tiles, LLM provider APIs (Gemini, OpenAI, Anthropic, DeepSeek, Groq, OpenRouter, Cerebras, GitHub, Cloudflare), jsDelivr CDN, BD FHIR endpoints (`tr.ocl.dghs.gov.bd`, `icd11.dghs.gov.bd`, `fhir.dghs.gov.bd`, `sandbox.fhir.dghs.gov.bd`), GitHub API, WHO GHO/data.who.int, CDC Socrata, Delphi CMU, Open-Meteo, HDX.

---

## 4. Configuration Methods

### Method 1: `.env` File (Development)

```bash
cp .env.example .env
```

Edit `.env` with your keys. Loaded at build time by Vite.

### Method 2: Settings Panel UI (Runtime)

1. Open the app
2. Click **Settings** (gear icon in sidebar)
3. Navigate to **AI Providers** tab
4. Enter API keys in the input fields
5. Keys are stored in IndexedDB (persist across sessions)

### Method 3: Production Platform

Set environment variables in your deployment platform's UI:

- **GitHub Actions:** Settings → Secrets and variables → Actions
- **Vercel:** Project Settings → Environment Variables
- **Netlify:** Site Settings → Build & deploy → Environment
- **Docker:** Pass via `-e VITE_GEMINI_API_KEY=xxx`

---

## 5. How VITE_* Variables Work

Vite exposes all `VITE_*` environment variables to client-side code at build time via `import.meta.env`:

```typescript
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

However, Open Knowledge Studio reads API keys at **runtime** in this priority:

1. **Settings Panel** (IndexedDB) — highest priority
2. **`import.meta.env`** (`.env` file) — fallback

This means users can enter keys through the UI without touching `.env`.

---

## 6. Security Best Practices

| Practice | Detail |
| :--- | :--- |
| **Never commit `.env`** | Already in `.gitignore` — verify with `git status` |
| **Use environment-specific `.env` files** | `.env.development`, `.env.production` for different environments |
| **Rotate keys regularly** | Regenerate keys every 90 days |
| **Use the Settings Panel for production** | Users can enter keys at runtime without access to `.env` |
| **Limit key scopes** | Use read-only keys where possible |
| **Monitor key usage** | Check each provider's dashboard for unexpected usage |
| **Use GitHub secrets for CI/CD** | Never hardcode keys in workflow files |

---

## 7. Verification

Verify your configuration is working:

```bash
# Check that .env exists and has content
cat .env

# Start the app
npm run dev
```

Open the app and go to **Settings → AI Providers**. If keys are configured, provider status shows **Connected**. You can also send a test message in the chat panel.

---

## See Also

- [5-Minute Quick Start](000-quickstart.md) — Get up and running fast
- [Free Resource Inventory](../free-resources.md) — Free CSP domains, CDN libraries, API sources
- [Complete Setup & Installation](001-setup.md) — Full environment setup
- [Non-Coder Guide](003-non-coder-guide.md) — Step-by-step key configuration
- [Development Guidelines](004-development.md) — Coding standards
- [CI/CD Pipeline](008-ci-cd.md) — GitHub secrets configuration

---

*Back to [Documentation Home](../index.md)*
