---
description: Build the project and verify it's ready for deployment
agent: build
---

Run the full CI pipeline in order:
1. `npm run typecheck` — TypeScript type checking
2. `npm test` — All 227 tests must pass
3. `npm run build` — Production build to `dist/`

If any step fails, fix the issue before proceeding. After successful build, summarize:
- Build output (file sizes, gzip sizes)
- Any warnings or deprecation notices
- Confirmation that the app is ready for deployment

Project: Open Knowledge Studio (React 19, Vite 8, TypeScript 7, Tailwind CSS 4)
