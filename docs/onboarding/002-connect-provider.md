# 002 — Connect an AI Provider

The app needs an AI provider to generate responses, analyze data, and power agents. You can use any of the 10 supported providers.

## Available Providers

| Provider | Free Tier | Best For |
|----------|-----------|----------|
| **Google Gemini** | 5-15 RPM, 1M tokens | General purpose, fast |
| **Groq** | 30 RPM, 128K tokens | Open-source models, fast inference |
| **OpenAI** | $5 trial credit | GPT-4o, advanced reasoning |
| **Anthropic** | $5 trial credit | Claude, long context |
| **DeepSeek** | 10M token trial | Reasoning, coding |
| **GitHub Models** | 15 RPM, free GPT-4o | Developer workflow |
| **OpenRouter** | 20 RPM, 20+ models | Multi-model access |
| **Cloudflare** | 10K neurons/day | Edge computing |
| **Cerebras** | 30 RPM, 1M tokens/day | High-speed inference |
| **Ollama** | Unlimited (local) | Local, private, free |

## Step-by-Step

- [ ] **1. Open Settings** — Click the **gear icon** in the top-right of the header bar.

- [ ] **2. Go to the Provider tab** — The first tab shows provider configuration.

- [ ] **3. Choose a provider** — Click a provider card. **Groq** is a great free option to start with (no credit card needed).

- [ ] **4. Get your API key**:
  - **Groq**: Go to [console.groq.com/keys](https://console.groq.com/keys) → Sign up → Create API key
  - **Gemini**: Go to [aistudio.google.com](https://aistudio.google.com) → Get API key
  - **GitHub Models**: Go to [github.com/settings/tokens](https://github.com/settings/tokens) → Generate token with `models` scope

- [ ] **5. Enter your API key** — Paste the key in the **API Key** field.

- [ ] **6. Select a model** — Pick the model from the dropdown. Recommended defaults are pre-selected.

- [ ] **7. Adjust settings**:
  - **Temperature**: 0.7 for creative, 0.2 for precise
  - **Thinking**: Enable for deep reasoning (Gemini)
  - **Search Grounding**: Enable for web-connected answers (Gemini)

- [ ] **8. Test the connection** — Click **Test Connection**. You should see a success message.

- [ ] **9. Set as default** — The provider is now saved as your default.

## Using Environment Variables

For development, you can set API keys in a `.env` file:

```bash
VITE_GROQ_API_KEY=gsk_your_key_here
VITE_GEMINI_API_KEY=AIza_your_key_here
```

These are loaded automatically when the app starts.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Failed to connect" | Check your API key is correct and active |
| "Rate limited" | Wait a moment and retry |
| Provider not responding | Try a different provider or model |
| Key not saving | Make sure you click the save/test button |

---

**Next step:** [003 — Create Your First Project](./003-create-project.md)
