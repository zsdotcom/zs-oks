---
title: "000 — 5-Minute Quick Start"
category: "developers"
order: 0
tags: ["quickstart", "setup", "getting-started"]
last_updated: "2026-07-26"
---

# 000 — 5-Minute Quick Start

Get **Open Knowledge Studio** running locally in 5 minutes.

---

## 1. Prerequisites

| Tool | Version | Check Command |
| :--- | :--- | :--- |
| **Node.js** | v26.0+ | `node --version` |
| **npm** | v11.0+ | `npm --version` |
| **Git** | v2.0+ | `git --version` |

---

## 2. Clone & Install

```bash
git clone https://github.com/codeandbrain/open-knowledge-studio.git
cd open-knowledge-studio
npm install
```

---

## 3. Configure Environment

```bash
cp .env.example .env
```

Open `.env` in any text editor and add at least one API key (optional but recommended):

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free Gemini key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).

> **Security:** Never commit `.env`. It is excluded by `.gitignore`.

---

## 4. Start Dev Server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 5. Run Tests

```bash
npm test            # 74 tests across 6 files
npm run typecheck   # TypeScript type checking
```

---

## 6. Production Build

```bash
npm run build       # tsc --noEmit && vite build
npm run preview     # Serve dist/ locally
```

---

## What's Next?

| Topic | Guide |
| :--- | :--- |
| Full setup details | [Complete Setup & Installation](010-setup.md) |
| API keys reference | [Environment Variables](020-environment.md) |
| Non-coder guide | [Guide for Non-Developers](030-non-coder-guide.md) |
| Development standards | [Development Guidelines](040-development.md) |
| Deployment | [Deployment Guide](090-deployment.md) |

---

## See Also

- [Complete Setup & Installation](010-setup.md) — Prerequisites and detailed setup
- [Environment Variables & API Keys](020-environment.md) — All VITE_* vars and where to get keys
- [Development Guidelines](040-development.md) — Coding standards and contribution guide

---

*Back to [Documentation Home](../index.md)*
