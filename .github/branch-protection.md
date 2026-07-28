# Branch Protection Rules — Automated Setup

**Repository:** zsdotcom/zs-oks
**Target:** Apply these settings via `gh` CLI in GitHub Settings > Branches.

## Rules to Apply

### `main` branch (Production)

| Setting | Value |
|---------|-------|
| Require PR before merging | ✅ |
| Required approvals | 1 |
| Dismiss stale reviews when new commits pushed | ✅ |
| Require status checks | `TypeCheck & Test` |
| Require branches to be up to date | ✅ |
| Require merge queue | ❌ (optional) |
| Restrict who can push | ✅ (only CODEOWNERS) |
| Allow force pushes | ❌ |
| Allow deletions | ❌ |
| Do not allow bypass | ✅ |

### `develop` branch (Integration)

| Setting | Value |
|---------|-------|
| Require PR before merging | ✅ |
| Required approvals | 1 |
| Require status checks | `TypeCheck & Test` |
| Require branches to be up to date | ✅ |
| Allow force pushes | ❌ |
| Allow deletions | ❌ |

---

## Auto-Apply via GitHub CLI

Run the following command once to apply branch protection:

```bash
# Protect main branch
gh api -X PUT repos/zsdotcom/zs-oks/branches/main/protection \
  --input - << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["TypeCheck & Test"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null
}
EOF

# Protect develop branch (lighter)
gh api -X PUT repos/zsdotcom/zs-oks/branches/develop/protection \
  --input - << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["TypeCheck & Test"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null
}
EOF
```

> **Note:** The authenticated user (`gh auth status`) must have `admin` access to the repository.

## Status Checks Reference

Required checks that must pass before merging to `main`:

| Check Name | Source | Description |
|------------|--------|-------------|
| `TypeCheck & Test` | `ci.yml` | TypeScript compile + Vitest tests + Vite build |
| `E2E Tests` | `ci.yml` | Playwright end-to-end tests (PRs only) |
| `CodeQL Analysis` | `codeql-analysis.yml` | Security and quality analysis |

## Exemptions

The following labels bypass stale/closure rules:
- `keep` — prevents stale bot from marking an issue/PR
- `security` — exempts from stale and requires security review
- `dependencies` — exempts from stale (managed by Dependabot)
