---
description: Full production build pipeline with verification
agent: build
---

Run the complete CI pipeline in order:
1. `npm run typecheck` — must pass with 0 errors
2. `npm test` — all 227 tests must pass
3. `npm run build` — production build to `dist/`

If any step fails, diagnose and fix the issue before moving to the next step. Report the final build output with file sizes.
