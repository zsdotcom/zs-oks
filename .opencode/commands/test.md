---
description: Run tests with an optional pattern filter
subtask: true
---

Run tests: `npm test{{#if .}} -- -t "{{.}}"{{/if}}`

Wait for results. If any test fails, analyze the failure, fix the issue, and re-run until all pass. Report the final test results (files passed, total tests, duration).

The test suite uses Vitest with happy-dom environment. Coverage thresholds: 80% statements, 75% branches, 85% functions, 80% lines.
