---
title: "030 — Guide for Non-Coder Developers"
category: "developers"
order: 30
tags: ["guide", "non-coder", "beginner", "setup"]
last_updated: "2026-07-26"
---

# 030 — Guide for Non-Coder Developers

This guide is written for **people who are not software developers**. If you can use a web browser and a text editor, you can get Open Knowledge Studio running on your computer. Follow each step carefully.

---

## 1. Install Node.js and npm

Node.js is a program that lets the app run on your computer. npm is a tool that downloads the parts the app needs.

### Step-by-step:

1. Open your web browser and go to **[nodejs.org](https://nodejs.org)**
2. You will see a big green button that says **"Download Node.js"** — click it (choose the LTS version)
3. Once the download finishes, open the downloaded file
4. A setup window will appear:
   - Click **Next** several times (the default settings are fine)
   - If asked about "Tools for Native Modules," you can uncheck that box
   - Click **Install**
   - Click **Finish** when done
5. **Verify the installation:**
   - **Windows:** Press the Windows key, type `cmd`, and press Enter. In the black window that appears, type `node --version` and press Enter. You should see `v26.x.x`
   - **Mac:** Press Command+Space, type `Terminal`, and press Enter. Type `node --version` and press Enter
   - **Linux:** Open Terminal and type `node --version`

> If you see a number like `v26.5.0`, Node.js is installed correctly. If you see an error message, try restarting your computer and checking again.

---

## 2. Clone the Repository (Download the Code)

"Cloning" means downloading the project code to your computer.

### Option A: Using GitHub Desktop (Easier)

1. Go to **[desktop.github.com](https://desktop.github.com)** and download GitHub Desktop
2. Install it (open the downloaded file and follow the prompts)
3. Open GitHub Desktop and sign in with your GitHub account (create one at github.com if needed)
4. Click **File → Clone Repository**
5. Click the **URL** tab
6. In the "Repository URL" field, type: `https://github.com/codeandbrain/open-knowledge-studio.git`
7. In the "Local Path" field, choose where to save it (like your Desktop or Documents folder)
8. Click **Clone**
9. Wait for the download to finish

### Option B: Using Terminal (Git)

1. Open Terminal (Mac/Linux) or Command Prompt (Windows)
2. Type the following and press Enter after each line:

```bash
git clone https://github.com/codeandbrain/open-knowledge-studio.git
```

3. Wait for the download to finish

---

## 3. Install Dependencies

This step downloads the helper packages the app needs.

1. Open Terminal/Command Prompt
2. Navigate to the project folder. Type:

```bash
cd open-knowledge-studio
```

3. Install dependencies:

```bash
npm install
```

4. Wait. You will see a lot of text scrolling by. This is normal. It may take 30-60 seconds.
5. When it finishes, you will see your cursor blinking again. There will be no error messages if everything worked.

---

## 4. Get API Keys from AI Providers

API keys are like passwords that let the app talk to AI services. You need at least one to use the AI features.

### Getting a Google Gemini API Key (Recommended — Free)

1. Go to **[aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**
2. Sign in with your Google account (Gmail, YouTube, etc.)
3. Click the button that says **"Create API Key"**
4. A popup will appear — choose **"Create API key in new project"**
5. Your new API key will appear (it looks like a long string of letters and numbers, starting with "AIza...")
6. Click the **copy** icon next to the key
7. **Save this key somewhere safe** — you will need it in the next step

### Getting a Groq API Key (Optional — Also Free)

1. Go to **[console.groq.com/keys](https://console.groq.com/keys)**
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Give it a name like "Open Knowledge Studio"
5. Copy the key that appears

### Getting an OpenAI API Key (Optional — Paid)

1. Go to **[platform.openai.com/api-keys](https://platform.openai.com/api-keys)**
2. Sign in to your OpenAI account (create one if needed)
3. Click **"Create new secret key"**
4. Copy the key

### Getting an Anthropic API Key (Optional — Paid)

1. Go to **[console.anthropic.com](https://console.anthropic.com/)**
2. Sign in or create an account
3. Go to **API Keys**
4. Click **Create Key**
5. Copy the key

---

## 5. Configure the .env File

The `.env` file is a text file where you store your API keys. It's like a digital keychain.

### Step-by-step:

1. **Navigate to the project folder** on your computer:
   - **Windows:** Open File Explorer, go to `Documents` or wherever you saved the project, find the `open-knowledge-studio` folder
   - **Mac:** Open Finder, go to your chosen folder, find `open-knowledge-studio`
   - **Linux:** Open your file manager

2. Inside the `open-knowledge-studio` folder, find a file named **`.env.example`**

3. **Make a copy of this file:**
   - Right-click on `.env.example`
   - Click **Copy**
   - Right-click in the empty space and click **Paste**
   - **Rename the copy** to just **`.env`** (remove the `.example` part)

4. **Open the `.env` file** with a text editor:
   - Double-click the `.env` file
   - If your computer asks which program to use, choose **Notepad** (Windows), **TextEdit** (Mac), or any simple text editor

5. **Add your API keys.** The file will look like this:

```
# ─── Google Gemini API Key ───
VITE_GEMINI_API_KEY=

# ─── Groq API Key ───
VITE_GROQ_API_KEY=

# ─── OpenAI API Key ───
VITE_OPENAI_API_KEY=
```

6. **Edit each line** by pasting your key after the `=` sign. For example:

```
VITE_GEMINI_API_KEY=AIzaSyB...your-key-here
```

Make sure there are no spaces before or after the key.

7. **Save the file** (Ctrl+S on Windows, Command+S on Mac)

> **Important:** Do not share this file with anyone. It contains your private API keys.

---

## 6. Run the Application

Now you are ready to start the app.

1. **Open Terminal/Command Prompt**
2. **Go to the project folder:**

```bash
cd open-knowledge-studio
```

3. **Start the app:**

```bash
npm run dev
```

4. You will see output like this:

```
VITE v6.x.x  ready in 200ms
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```

5. **Open your web browser** (Chrome, Firefox, Edge, or Safari)
6. In the address bar at the top, type: **`http://localhost:3000`**
7. Press Enter

You should see the Open Knowledge Studio interface!

> **Keep the Terminal/Command Prompt window open.** If you close it, the app will stop. To stop the app later, press **Ctrl+C** in the Terminal.

---

## 7. Access the Settings Panel

The Settings panel is where you can configure AI providers, manage your account, and adjust preferences.

1. Look at the left side of the screen. You will see a sidebar with icons
2. Find the **gear icon** (⚙️ Settings) near the bottom
3. Click the gear icon
4. The Settings panel will open on the right side of the screen

---

## 8. Configure AI Providers Through the UI

You can also add API keys through the app itself, which is easier than editing the `.env` file. The advantage is you can see exactly what you're doing.

1. Open the **Settings** panel (click the gear icon in the sidebar)
2. You will see tabs at the top: **AI Providers**, **Workspace**, **API Keys**, etc.
3. Click on **"AI Providers"** tab
4. You will see a list of AI providers:
   - **Gemini** (Google)
   - **Groq** (fast, free)
   - **OpenAI** (GPT-4)
   - **Anthropic** (Claude)
   - **DeepSeek**
   - **OpenRouter**
5. For each provider you have a key for:
   - Click the **"+ Add Key"** or **configure** button
   - A text field will appear
   - Paste your API key into the field
   - Click **Save** or **Apply**
   - The status should change to **Connected**

6. You can also configure:
   - **Default model** (e.g., `gemini-3.5-flash`, `gpt-4o-mini`)
   - **Temperature** (controls creativity: 0 = factual, 1 = creative, default 0.7)
   - **Max tokens** (response length limit)

---

## 9. Test Everything Works

### Test 1: Send a Chat Message

1. Look at the main chat area in the center of the screen
2. At the bottom, there is a text input field
3. Type: **"Hello! What can you help me with?"**
4. Press Enter or click the send button (➤ or ✈️ icon)
5. The AI should respond within a few seconds

If you see a response, **everything is working!**

### Test 2: Try the Smart Router

The app automatically chooses the best AI provider. To test:

1. Type: **"What AI providers are available right now?"**
2. The response should indicate which provider is being used

### Test 3: Search Knowledge Base

1. Look at the sidebar on the left
2. Click the **Search** icon (magnifying glass)
3. Type a keyword like "health" or "research"
4. Results should appear (or indicate no results found)

### Test 4: Check Memory

1. Open **Settings** (gear icon)
2. Look for **Storage** or **Memory** information
3. You should see IndexedDB usage statistics

---

## What If Something Goes Wrong?

| Problem | Solution |
| :--- | :--- |
| **Browser says "Can't connect to localhost:3000"** | Make sure the Terminal is still open and running `npm run dev`. Re-open it if closed. |
| **"Module not found" errors** | Run `npm install` again in the project folder |
| **No response from AI** | Check your API key in the Settings panel. Make sure you copied the entire key. |
| **Blank white screen** | Try a different browser (Chrome works best). Press F12 and check the Console tab for error messages. |
| **App is slow** | This is normal on first load. The app downloads some AI models in the background. |
| **"Gemini API error"** | Your API key may be invalid or expired. Go back to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) to get a new one. |

---

## Key Terms Explained

| Term | Meaning |
| :--- | :--- |
| **Terminal / Command Prompt** | A text-based way to control your computer. On Mac/Linux it's called Terminal. On Windows it's called Command Prompt or PowerShell. |
| **Clone** | Downloading a copy of the code from GitHub to your computer |
| **Dependencies** | Helper packages that the app needs to work |
| **API Key** | A password that lets the app use a service (like Google's AI) |
| **.env file** | A text file where you store your API keys |
| **localhost** | A special address that refers to your own computer |
| **npm** | Node Package Manager — a tool that downloads and manages dependencies |
| **IndexedDB** | A database built into your browser that stores your data locally |

---

## See Also

- [5-Minute Quick Start](000-quickstart.md) — For experienced developers
- [Complete Setup & Installation](010-setup.md) — Detailed technical setup
- [Environment Variables & API Keys](020-environment.md) — All API keys reference
- [Development Guidelines](040-development.md) — For when you're ready to code

---

*Back to [Documentation Home](../index.md)*
