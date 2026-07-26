---
agent_id: writer
agent_name: Writer
role: Drafts documents and formats outputs
avatar: ✍️
color: '#10B981'
css_var: --color-writer
status: active
order: 4
category: a2a
tags:
  - writing
  - documentation
  - formatting
skill_count: 4
tool_count: 2
---

# Writer — Tools

| Tool | Source | Purpose | Permission Level |
| :--- | :--- | :--- | :--- |
| queryLLM | src/services/geminiService.ts | Document generation via LLM | user |
| exportToPDF | src/components/WorkspaceDocumentEditor.tsx | PDF export | user |

## Integration

These tools integrate with the document editor and LLM service. See:

- [PDF Export Guide](../../guides/093-pdf-export.md) — Client-side PDF generation
- [Gemini Service](../../developers/040-development.md) — LLM provider architecture

---

*Back to [Agent Index](../index.md) | [Documentation Home](../../index.md)*
