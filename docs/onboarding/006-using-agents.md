# 006 — Using A2A Agents

Open Knowledge Studio has 12 built-in A2A (Agent-to-Agent) agents that work together to help you research, analyze, write, and review.

## The Agent Team

| Agent | Role | Best For |
|-------|------|----------|
| 🎯 **Coordinator** | Orchestrates workflows and delegates tasks | Complex multi-step projects |
| 🔬 **Researcher** | Searches and synthesizes information | Literature reviews, fact-finding |
| 📊 **Data Analyst** | Processes data and generates statistics | Data analysis, charts, calculations |
| ✍️ **Writer** | Drafts documents and formats outputs | Reports, papers, documentation |
| 🔍 **Reviewer** | Quality checks and peer review | Proofreading, validation |
| 📚 **Librarian** | Maintains memory and manages knowledge | Organization, memory management |
| 🛡️ **Security Analyst** | Analyzes code and configurations | Security audits, vulnerability checks |
| 🔎 **Code Reviewer** | Reviews code quality and style | Code review, best practices |
| 📋 **Planning Agent** | Decomposes tasks and creates plans | Task planning, project decomposition |
| 🧪 **Testing Agent** | Generates and validates test cases | Test generation, quality assurance |
| ⚡ **Code Generator** | Generates code from specifications | Coding, API specs, SQL queries |
| 🏛️ **Knowledge Curator** | Organizes and interlinks knowledge | Knowledge graphs, cross-references |

## Step-by-Step

- [ ] **1. Open Settings → Agents tab** — Click the **gear icon**, then select the **Agents** tab.

- [ ] **2. See all agents** — You'll see cards for all 12 agents with their status (active/inactive).

- [ ] **3. Run a debate** — Click **Run A2A Debate**, enter a topic, and all active agents will respond independently. Try:

  > What are the key considerations for outbreak response in urban settings?

- [ ] **4. Run an orchestrated workflow** — Click **Orchestrated Workflow**. The Coordinator decomposes the task, assigns it to specialists, and synthesizes the results.

- [ ] **5. Run a sequential workflow** — Click **Sequential Workflow**. Agents work in a chain: Researcher → Writer → Reviewer → Coordinator.

- [ ] **6. Edit an agent** — Click **Edit** on any agent card to change:
  - System prompt
  - Provider/model override
  - Skills and tools
  - Memory type and turn depth

- [ ] **7. Toggle agents on/off** — Use the toggle switch to activate/deactivate agents.

- [ ] **8. Create a custom agent** — Click **Create Agent** to design your own agent with:
  - Custom name, avatar, color
  - Custom system prompt
  - Specific skills and tools
  - Dedicated provider and model

## Agent System Prompt Tips

- Keep prompts focused on one role
- List specific tools the agent should use
- Define output format expectations
- Include quality criteria and confidence thresholds

## Monitoring Agents

Go to the **Dashboard** tab → **Agent Metrics** to see:
- Per-agent latency and token usage
- Success/error rates
- Response quality trends

---

**Next step:** [007 — Using Tools & MCP Servers](./007-using-tools.md)
