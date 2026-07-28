# Open Knowledge Studio v2.0

> A private AI research lab that runs entirely in your browser — no servers, no installation headaches, no technical expertise required.

---

## ✦ What Is This? (Plain English)

Imagine having a team of **12 AI assistants** working for you inside your web browser. They can:

- **Research any topic** on the web and summarize findings
- **Write documents, reports, and articles**
- **Analyze data** and create charts
- **Review and improve your work**
- **Remember everything** across sessions (like having a perfect memory)
- **Generate code** if you ever need it

Everything stays **on your computer** — your data never leaves your browser. No subscription, no cloud, no backend.

---

## ✦ Quick Start (For Everyone)

### Before You Start
You'll need:
- A computer (Windows, Mac, or Linux)
- About 5 minutes

### Step 1: Download the project
Open your terminal (search "Terminal" on your computer), then type:
```bash
git clone https://github.com/zsdotcom/zs-oks.git
cd zs-oks
```

### Step 2: Run the setup wizard
**Linux or Mac:**
```bash
./scripts/setup.sh
```
**Windows (PowerShell):**
```powershell
.\scripts\setup.ps1
```

The setup script will:
1. Check what tools your computer already has
2. Install anything that's missing (Node.js, Git, etc.)
3. Download all project files
4. Install recommended VS Code extensions
5. Verify everything works correctly

### Step 3: Start the app
```bash
npm run dev
```
Open your browser and go to: **http://localhost:3000**

---

## ✦ What's Inside?

| Feature | What It Does |
|---------|-------------|
| **12 AI Agents** | A team of specialized assistants (Researcher, Writer, Analyst, etc.) |
| **6 Types of Memory** | The app remembers everything across sessions |
| **10 AI Providers** | Works with Gemini, OpenAI, Anthropic, and 7 more |
| **Zero Backend** | Everything runs in your browser — no servers needed |
| **Offline First** | Works without internet (except AI features) |
| **Vector Search** | Finds information based on meaning, not just keywords |
| **Export Anywhere** | PDF, HTML, DOCX export with a single click |

---

## ✦ Quick Commands Reference

| What You Want | Type This |
|---------------|-----------|
| Start the app | `npm run dev` |
| Check for errors | `npm run typecheck` |
| Run all tests | `npm test` |
| Build for publishing | `npm run build` |
| Preview the built app | `npm run preview` |

---

## ✦ The 12 AI Agents

| Agent | Color | What They Do |
|-------|-------|-------------|
| **Coordinator** | 🟣 | Organizes tasks, delegates to other agents |
| **Researcher** | 🔵 | Searches the web, finds information |
| **Data Analyst** | 🟡 | Crunches numbers, makes charts |
| **Writer** | 🟢 | Drafts documents, reports, articles |
| **Reviewer** | 🔴 | Checks quality, catches mistakes |
| **Librarian** | 🟤 | Organizes knowledge, finds references |
| **Security Analyst** | 🔴 | Checks for security issues |
| **Code Reviewer** | 🔵 | Reviews any code for quality |
| **Planner** | 🟢 | Breaks big tasks into steps |
| **Tester** | 🟡 | Creates and runs tests |
| **Code Generator** | 🟠 | Writes code from descriptions |
| **Knowledge Curator** | 🟤 | Connects related information |

---

## ✦ Need Help?

- **Full documentation:** [`docs/index.md`](docs/index.md) (written for all skill levels)
- **No-coder guide:** [`docs/developers/003-non-coder-guide.md`](docs/developers/003-non-coder-guide.md)
- **Setup help:** [`docs/developers/000-quickstart.md`](docs/developers/000-quickstart.md)
- **API keys guide:** [`docs/developers/002-environment.md`](docs/developers/002-environment.md)

---

## ✦ Technical Details (For Developers)

| Category | Technology | Version |
|:---------|:-----------|:--------|
| Runtime | React | 19 |
| Build | Vite | 8 |
| Language | TypeScript | 7 |
| CSS | Tailwind | 4 |
| Test | Vitest + Playwright | Latest |
| ML | Transformers.js | CDN-loaded |
| Search | Orama JS | CDN-loaded |

---

## ✦ License

**MIT** — Free to use, modify, and share.

Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) at [ZarishSphere Foundation](https://zarishsphere.com).
