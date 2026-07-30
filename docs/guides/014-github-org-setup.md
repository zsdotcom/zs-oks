---
title: "014 — GitHub Organization Setup"
description: "Step-by-step guide to set up teams and permissions in your GitHub organization"
category: "guides"
order: 14
tags: ["github", "organization", "teams", "permissions", "setup"]
last_updated: "2026-07-30"
audience: "org-owners"
---

# 014 — GitHub Organization Setup Guide

---

## 1. What's a GitHub Organization?

Think of a GitHub organization like a **shared office space** for your projects. Instead of each project living under your personal account, they all live under one roof (the organization).

**Teams** are like **badges** that grant access. Each person can wear multiple badges:
- The "Admin" badge lets you manage settings
- The "Docs" badge lets you edit documentation
- The "Dev" badge lets you edit the code

---

## 2. Teams You Need for This Project

Based on the CODEOWNERS file in this repository, you need these teams:

| Team Name | What They Own | Who Should Be In It |
|-----------|---------------|---------------------|
| `admin` | CI/CD workflows, repo settings | You (the main maintainer) |
| `codeandbrain` | Source code, default owner of everything | Your main developer account |
| `arwazarish` | Source code, tests | A developer collaborator |
| `devopsariful` | Docker, server config, CI/CD | A DevOps collaborator |
| `healthbgd` | Documentation, guides, README | A content maintainer |

Since you're a solo developer, you'll likely be the only member of all these teams - and that's perfectly fine! Having separate teams just means CODEOWNERS can automatically request review from you when changes are made to specific parts of the project.

---

## 3. How to Create a Team (Step by Step)

1. **Go to your organization page**: https://github.com/zsdotcom

2. **Click the "Teams" tab** near the top of the page

3. **Click the green "New team" button**

4. **Fill in the team details**:
   - **Team name**: Enter the name (e.g., `codeandbrain`)
   - **Description**: Something like "Main development team"
   - **Visibility**: Choose **Visible** (this is required for CODEOWNERS to work)
   - Leave "Close team" unchecked

5. **Click "Create team"** (green button)

6. **Add members**: On the next page, type your GitHub username and add yourself

7. **Repeat** steps 3-6 for each team:
   - `admin` (already exists ✅)
   - `codeandbrain`
   - `arwazarish`
   - `devopsariful`
   - `healthbgd`

---

## 4. Give Each Team Write Access to Your Repository

For CODEOWNERS to work, each team needs **Write** permission to the repository. Here's how:

1. **Go to your repository**: https://github.com/zsdotcom/zs-oks

2. **Click "Settings"** (top tab bar)

3. **Click "Collaborators and teams"** in the left sidebar (under "Access")

4. **Click "Add teams"** (green button)

5. **Start typing** the team name (e.g., `codeandbrain`) and select it

6. **Change the permission** from "Read" to **"Write"** using the dropdown

7. **Click "Add teams"** to confirm

8. **Repeat** for all your teams

---

## 5. Verify It's Working

After adding teams:

1. Go to your repository on GitHub
2. Click "Settings" → "Collaborators and teams"
3. You should see all your teams listed with **Write** permission
4. The CODEOWNERS file will now correctly assign ownership

---

## 6. Common Issues & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| "Team not found" in CODEOWNERS | Team was set to "Secret" visibility | Go to Team settings, change to "Visible" |
| "No reviewer assigned" | Team doesn't have Write access | Add the team to the repo with Write permission |
| PR requires review but you're the only one | CODEOWNERS is working as designed | You can merge anyway — it's just a reminder |
| New member can't push | They're not in any team with Write access | Add them to the appropriate team |

---

## 7. Managing Members Later

To add someone new to a team:
1. Go to https://github.com/orgs/zsdotcom/teams
2. Click the team name (e.g., `codeandbrain`)
3. Click "Add member"
4. Type their GitHub username and click "Add"

To remove someone:
1. Same page — find their name
2. Click the "..." menu next to their name
3. Click "Remove from team"

---

## 8. How CODEOWNERS Uses These Teams

The CODEOWNERS file (`.github/CODEOWNERS`) says "who owns what" in the repository. For example:

```
docs/ @zsdotcom/healthbgd
```

This means anyone in the `healthbgd` team will be automatically asked to review any changes to the `docs/` folder. It's like an automatic "heads up" when someone touches your area.

After you create the teams, the updated CODEOWNERS file will use them properly. No code changes needed — just the teams existing is enough.
