---
title: "100 — Reference"
category: "project"
order: 100
tags: ["reference", "configuration", "api", "environment"]
last_updated: "2026-07-26"
---

# 100 — Reference

---

## Overview

This reference document lists all API keys, tokens, and credentials needed to configure Open Knowledge Studio.

---

## Credentials Table

| Service | What you need | Where to get it | Step-by-step |
| :--- | :--- | :--- | :--- |
| **Google Gemini** | API key | https://aistudio.google.com/app/apikey | 1. Go to URL. 2. Sign in with your Google account. 3. Click **Create API Key**. 4. Copy the key. |
| **Google OAuth** | Client ID | https://console.cloud.google.com/apis/credentials | 1. Create or select a project. 2. Enable Google Drive API, Google Docs API, and Google Sheets API. 3. Click **Create Credentials → OAuth client ID**. 4. Select **Web application**. 5. Add `http://localhost:3000` to **Authorized JavaScript origins**. 6. Add your production URL. 7. Click **Create**. 8. Copy the **Client ID**. |
| **OpenAI** | API key | https://platform.openai.com/api-keys | 1. Sign in at https://platform.openai.com. 2. Navigate to **API keys** in the sidebar. 3. Click **Create new secret key**. 4. Give it a name. 5. Copy the key immediately. |
| **Anthropic** | API key | https://console.anthropic.com/ | 1. Sign in at https://console.anthropic.com. 2. Go to **API Keys**. 3. Click **Create Key**. 4. Copy the key. |
| **DeepSeek** | API key | https://platform.deepseek.com/api_keys | 1. Sign in at https://platform.deepseek.com. 2. Go to **API Keys**. 3. Click **Create API Key**. 4. Copy the key. |
| **Groq** | API key | https://console.groq.com/keys | 1. Sign in at https://console.groq.com. 2. Go to **API Keys** in the sidebar. 3. Click **Create API Key**. 4. Copy the key. |
| **Ollama (local)** | None (local install) | https://ollama.ai | 1. Install Ollama from https://ollama.ai/download. 2. Run `ollama pull llama3` in terminal. 3. In Settings, set provider URL to `http://localhost:11434`. |
| **GitHub** | Personal Access Token | https://github.com/settings/tokens | 1. Go to GitHub **Settings → Developer settings → Personal access tokens → Tokens (classic)**. 2. Click **Generate new token → Generate new token (classic)**. 3. Select `repo` scope. 4. Click **Generate token**. 5. Copy the token immediately. |
| **Docker** | Docker Engine | https://docker.com | 1. Install Docker Desktop from https://docs.docker.com/get-docker/. 2. Ensure the Docker daemon is running (`docker info`). |
| **Vercel** | Vercel account | https://vercel.com | 1. Go to https://vercel.com. 2. Click **Sign Up** and use GitHub. 3. Import your repository. 4. Configure build settings (see `docs/developers/099-deployment.md`). |
| **Netlify** | Netlify account | https://netlify.com | 1. Go to https://app.netlify.com. 2. Click **Sign up** with GitHub. 3. Import your repository. 4. Configure build settings (see `docs/developers/099-deployment.md`). |

---

## .env File Format

Copy `.env.example` to `.env` and populate:

```bash
# Required for Google Gemini integration
VITE_GEMINI_API_KEY=

# Required for Google Workspace integration (Drive, Docs, Sheets, Gmail)
VITE_GOOGLE_OAUTH_CLIENT_ID=

# Optional — alternative LLM providers
VITE_OPENAI_API_KEY=
VITE_ANTHROPIC_API_KEY=
VITE_DEEPSEEK_API_KEY=
VITE_GROQ_API_KEY=

# Local provider (no key needed)
# Ollama: set http://localhost:11434 in Settings panel
```

---

## Environment Variable Prefix Convention

All environment variables exposed to the browser must use the `VITE_` prefix (Vite convention). Variables without `VITE_` are not available in client-side code.

| Variable | Used in | Purpose |
| :--- | :--- | :--- |
| `VITE_GEMINI_API_KEY` | `geminiService.ts` | Gemini/OpenAI/Anthropic/DeepSeek/Groq API calls |
| `VITE_GOOGLE_OAUTH_CLIENT_ID` | `googleAuthService.ts` | Google OAuth 2.0 flow |
| `VITE_OPENAI_API_KEY` | `geminiService.ts` | OpenAI API calls |
| `VITE_ANTHROPIC_API_KEY` | `geminiService.ts` | Anthropic API calls |
| `VITE_DEEPSEEK_API_KEY` | `geminiService.ts` | DeepSeek API calls |
| `VITE_GROQ_API_KEY` | `geminiService.ts` | Groq API calls |

---

## Security Notes

- **Never commit `.env` files** to version control. Only `.env.example` is committed.
- API keys are stored in IndexedDB when entered via the Settings panel, and scoped to the browser origin.
- For CI/CD, use **GitHub Secrets** (Settings → Secrets and variables → Actions) instead of `.env` files.
- Google OAuth Client ID is not a secret — it is safe to include in built assets and GitHub Secrets.

---

## See Also

- [Developer Guide: Setup & Installation](../developers/050-setup.md) — Environment setup instructions
- [Developer Guide: Deployment](../developers/099-deployment.md) — Docker, Vercel, and Netlify guides
- [Developer Guide: CI/CD Pipeline](../developers/098-cicd-pipeline.md) — GitHub Actions workflows
- [Developer Guide: Dependency Removal](../developers/100-dependency-removal.md) — CDN dynamic loading and native API alternatives

---

*Back to [Documentation Home](../index.md) | [Developer Docs](../developers/040-development.md) | [User Guides](../guides/060-agents.md)*
