# 050 — Setup & Installation Guide

This document provides step-by-step instructions for setting up the **Open Knowledge Studio v1.0** development environment.

---

## 1. Prerequisites

Before you begin, ensure you have the following installed on your machine:

| Requirement | Version | Description |
| :--- | :--- | :--- |
| **Node.js** | v22.0.0+ | JavaScript runtime |
| **npm** | v10.0.0+ | Package manager |
| **Git** | v2.0.0+ | Version control |

---

## 2. Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/open-knowledge-studio.git
cd open-knowledge-studio
```

### Step 2: Install Dependencies

Run the following command to install all necessary development and runtime dependencies:

```bash
npm install
```

> **Note:** The project is designed to have minimal dependencies. If you are prompted to install additional packages during development, please review them against the `docs/100-dependency-removal-notes.md` guidelines.

### Step 3: Configure Environment Variables

Copy the example environment file to create your local configuration:

```bash
cp .env.example .env
```

Open `.env` in your text editor and add your API keys:

```env
# Google Gemini API Key (Required for Coordinator & Writer agents)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Groq API Key (Required for Researcher agent)
VITE_GROQ_API_KEY=your_groq_api_key_here

# Google Cloud Client ID (Optional, for Drive/Docs integration)
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

> **Security Warning:** Never commit your `.env` file to the repository. It is already included in `.gitignore`.

---

## 3. Running the Application

### Development Mode

Start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Production Build

To build the application for production, run:

```bash
npm run build
```

This will generate an optimized `dist/` folder containing the static assets.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

---

## 4. Running Tests

The project includes a comprehensive test suite for the 6-tier memory architecture.

### Unit & Integration Tests

```bash
npm test
```

### Watch Mode

To run tests in watch mode (automatically re-runs on file changes):

```bash
npm run test:watch
```

### Coverage Report

To generate a V8 code coverage report:

```bash
npm run test:coverage
```

### Performance Benchmarks

To run performance benchmarks (e.g., IndexedDB write throughput, vector search latency):

```bash
npm run test:bench
```

---

## 5. Troubleshooting

### Issue: "Module not found" errors during `npm run dev`

**Solution:** Delete the `node_modules` folder and the `package-lock.json` file, then run `npm install` again.

### Issue: IndexedDB quota exceeded

**Solution:** Clear your browser's site data for `localhost` or the deployed domain. In Chrome: `Settings > Privacy and security > Site settings > View permissions and data stored across sites`.

### Issue: Transformers.js fails to download models

**Solution:** Ensure you have a stable internet connection during the first run. Subsequent runs will cache the models locally. If you are offline, you may need to manually place the models in the `public/models/` directory.
