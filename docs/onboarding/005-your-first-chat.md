# 005 — Your First Chat

Now that you have a provider and a project, let's have your first conversation with AI.

## Step-by-Step

- [ ] **1. Go to Chat** — Click the **Chat** tab in the header navigation (first tab, message icon).

- [ ] **2. Type a message** — In the input field at the bottom, type a question. Try something like:

  > What are the key features of Open Knowledge Studio?

- [ ] **3. Send it** — Press **Enter** or click the **Send** button (arrow icon).

- [ ] **4. See the response** — The AI will respond in the chat area. Each message shows:
  - The provider and model used
  - Timestamp
  - The response text with formatting

- [ ] **5. Start a new session** — Click **New Chat** (+ icon) in the chat header to start a fresh conversation.

- [ ] **6. Switch sessions** — Click the **sessions button** (message icon with lines) to show your chat history. Click any session to resume it.

- [ ] **7. Delete a session** — Use the delete button next to any session name.

## Chat Features

| Feature | How to Use |
|---------|------------|
| **Markdown rendering** | Type Markdown (bold, lists, tables, etc.) and it renders live |
| **Code blocks** | Wrap code in triple backticks \`\`\` for syntax-highlighted blocks |
| **KaTeX math** | Use `$inline$` or `$$display$$` for mathematical formulas |
| **Mermaid diagrams** | Wrap diagram code in \`\`\`mermaid code fences |
| **URL grounding** | Add URL groups in Settings to give the AI web context |
| **Active files** | Files marked active in the knowledge base are included in context |

## Example Prompts

Here are some prompts to try:

- "Explain what A2A agents are and how they work together"
- "Create a Mermaid flowchart showing the data flow in this app"
- "List all the built-in tools available and what they do"
- "What public health data sources can I access?"

## Tips

- Chat sessions are saved automatically and persisted in IndexedDB
- You can reference files in your knowledge base — the AI will read active files
- Use the **NL Query** tab for structured data queries against your knowledge base
- Enable **thinking mode** in settings for more detailed, step-by-step reasoning

---

**Next step:** [006 — Using A2A Agents](./006-using-agents.md)
