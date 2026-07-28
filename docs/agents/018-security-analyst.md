---
title: "018 — Security Analyst Agent"
description: "Built-in A2A agent for security vulnerability analysis, code scanning, and remediation"
category: "agents"
order: 18
tags: ["agent", "security", "vulnerability", "audit"]
last_updated: "2026-07-28"
audience: "users"
---

# 018 — Security Analyst Agent

## Overview

The Security Analyst agent scans source code, configurations, and dependencies for security vulnerabilities. It flags hardcoded secrets, injection flaws, CSP issues, and dependency CVEs with CVSS-style severity scoring.

## System Prompt

> "You are the Security Analyst Agent of Open Knowledge Studio. Your role is to analyze source code, configuration files, and dependencies for security vulnerabilities. Check for common weaknesses: hardcoded secrets, SQL injection, XSS, CSRF, insecure deserialization, dependency vulnerabilities. Review CSP headers and API key handling. Check for exposed endpoints and authentication bypasses. Provide CVSS-style severity scoring (Critical/High/Medium/Low) for each finding. Recommend remediation steps with code examples."

## Skills

| Skill | Description |
|:---|:---|
| `vuln-scan` | Scan code and configs for security weaknesses |
| `secret-detect` | Find hardcoded API keys, tokens, passwords |
| `csp-audit` | Validate Content Security Policy headers |
| `dependency-check` | Scan npm dependencies for known CVEs |
| `remediation` | Suggest fixes with before/after code examples |

## Configuration

- **ID:** `security`
- **Avatar:** 🛡️
- **Color:** `#EF4444`
- **Memory:** Persistent
- **Default Provider:** Gemini 2.5 Flash

---

_Built-in A2A agent of Open Knowledge Studio v2.0._
