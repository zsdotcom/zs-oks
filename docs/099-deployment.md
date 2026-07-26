# 099 — Deployment (Docker, Vercel, Netlify)

**Date:** July 26, 2026

---

## 1. Overview

This document covers deployment options for Open Knowledge Studio: Docker containers, Vercel, and Netlify.

---

## 2. Docker Deployment

### Dockerfile

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Build and run

```bash
# Build the image
docker build -t open-knowledge-studio .

# Run the container
docker run -p 8080:80 open-knowledge-studio
```

Open http://localhost:8080 in your browser.

### Docker Compose (optional)

```yaml
# docker-compose.yml
services:
  web:
    build: .
    ports:
      - "8080:80"
```

```bash
docker compose up
```

---

## 3. Vercel Deployment

### Step-by-step

1. Go to https://vercel.com
2. Click **Sign Up** (or **Log In**) — use your GitHub account
3. Click **Add New... → Project**
4. Under **Import Git Repository**, find and select `codeandbrain/open-knowledge-studio`
5. Click **Import**
6. **Framework Preset:** Vite (should auto-detect)
7. **Build Command:** `npm run build`
8. **Output Directory:** `dist`
9. **Install Command:** `npm ci`
10. (Optional) Click **Environment Variables** to add:
    - `VITE_GEMINI_API_KEY`
    - `VITE_GOOGLE_OAUTH_CLIENT_ID`
    - `VITE_OPENAI_API_KEY`
11. Click **Deploy**
12. Wait for deployment to complete — you will receive a URL like `https://open-knowledge-studio.vercel.app`

### Vercel configuration file

Create `vercel.json` in the project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "framework": "vite"
}
```

---

## 4. Netlify Deployment

### Step-by-step

1. Go to https://app.netlify.com
2. Click **Sign up** (or **Log in**) — use your GitHub account
3. Click **Add new site → Import an existing project**
4. Click **Deploy with GitHub**
5. Authorize Netlify to access your repositories
6. Search for and select `codeandbrain/open-knowledge-studio`
7. **Branch to deploy:** `main`
8. **Build command:** `npm run build`
9. **Publish directory:** `dist`
10. Click **Show advanced** → **Environment variables** to add any needed `VITE_*` variables
11. Click **Deploy site**

### netlify.toml configuration

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

### Post-deployment

- Your site will be available at `https://<random-name>.netlify.app`
- You can configure a custom domain under **Site settings → Domain management**
- To set environment variables later: **Site settings → Build & deploy → Environment**

---

## 5. Environment Variables Reference

| Variable | Required | Description |
| :--- | :--- | :--- |
| `VITE_GEMINI_API_KEY` | No | Google Gemini API key |
| `VITE_GOOGLE_OAUTH_CLIENT_ID` | No | Google OAuth Client ID |
| `VITE_OPENAI_API_KEY` | No | OpenAI API key |
| `VITE_ANTHROPIC_API_KEY` | No | Anthropic API key |
| `VITE_DEEPSEEK_API_KEY` | No | DeepSeek API key |
| `VITE_GROQ_API_KEY` | No | Groq API key |

---

## 6. Comparison

| Feature | Docker | Vercel | Netlify |
| :--- | :--- | :--- | :--- |
| Setup complexity | Medium | Low | Low |
| Custom domain | Yes | Yes (paid) | Yes (free) |
| Server-side features | Full control | Serverless functions | Edge functions |
| Free tier | N/A | Generous | Generous |
| Best for | Self-hosted / private | Quick deploys | Static sites + forms |
