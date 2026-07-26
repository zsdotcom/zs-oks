# 098 — CI/CD Pipeline (GitHub Actions)

**Date:** July 26, 2026

---

## 1. Overview

This document describes the CI/CD pipeline using GitHub Actions for automated testing, type checking, building, and deployment.

## 2. GitHub Actions Workflow

### Prerequisites

| Item | Required | How to obtain |
| :--- | :--- | :--- |
| GitHub account | ✅ | Sign up at https://github.com/signup |
| Git repository | ✅ | Already configured at `https://github.com/codeandbrain/open-knowledge-studio` |
| GitHub token (for deployments) | Optional | Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → Select `repo` scope → Copy token |

### Workflow files (already included in repository)

Two workflow files are already present in the repository:

| File | Purpose |
| :--- | :--- |
| `.github/workflows/ci.yml` | CI: type checking, unit tests, E2E tests, bundle analysis |
| `.github/workflows/deploy.yml` | Deploy to GitHub Pages |

These workflows use `node-version-file: .nvmrc` (which specifies `26`), pinning to **Node.js 26.x** and **npm 11.x**.

### 2.1 Main CI Workflow

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  typecheck-and-test:
    name: TypeCheck & Test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v7

      - name: Setup Node.js
        uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: typecheck-and-test

    steps:
      - uses: actions/checkout@v7

      - name: Setup Node.js
        uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install chromium

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

  bundle-analysis:
    name: Bundle Analysis
    runs-on: ubuntu-latest
    needs: typecheck-and-test

    steps:
      - uses: actions/checkout@v7

      - name: Setup Node.js
        uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build with analysis
        run: npm run analyze

      - name: Upload bundle stats
        uses: actions/upload-artifact@v4
        with:
          name: bundle-stats
          path: dist/stats.html
          retention-days: 30
```

### 2.2 Deploy to GitHub Pages (Optional)

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v7

      - name: Setup Node.js
        uses: actions/setup-node@v7
        with:
          node-version-file: .nvmrc
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 2.3 Environment Variables for CI

The following environment variables can be set in the GitHub repository:

1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Add each secret:

| Secret Name | Description | Required |
| :--- | :--- | :--- |
| `VITE_GEMINI_API_KEY` | Google Gemini API key | No (tests mock the API) |
| `VITE_GOOGLE_OAUTH_CLIENT_ID` | Google OAuth client ID | No |
| `VITE_OPENAI_API_KEY` | OpenAI API key | No |

To create a Gemini API key:
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key and add as a GitHub secret

To create a Google OAuth client ID:
1. Go to https://console.cloud.google.com/apis/credentials
2. Click **Create Credentials → OAuth client ID**
3. Select **Web application**
4. Add `http://localhost:3000` and your production URL to Authorized JavaScript origins
5. Copy the Client ID and add as a GitHub secret

## 3. Local CI Simulation

Run the same checks locally before pushing:

```bash
npm run typecheck    # TypeScript type checking
npm test             # Unit + integration tests
npm run test:e2e     # E2E tests (requires dev server)
npm run build        # Production build
npm run analyze      # Bundle analysis
```

## 4. Required GitHub Secrets

| Secret | Purpose | Where to get |
| :--- | :--- | :--- |
| None required for basic CI | Typecheck + test + build work without secrets | — |

Optional secrets are listed in section 2.3 above.
