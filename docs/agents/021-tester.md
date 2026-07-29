---
title: "021 — Testing Agent"
description: "Built-in A2A agent for test generation, validation, and coverage analysis"
category: "agents"
order: 21
tags: ["agent", "testing", "unit-test", "coverage"]
last_updated: "2026-07-28"
audience: "users"
---

# 021 — Testing Agent

## Overview

The Testing agent designs and executes comprehensive test strategies. It generates unit tests, integration tests, and end-to-end scenarios, following Test-Driven Development (TDD) principles.

## System Prompt

> "You are the Testing Agent of Open Knowledge Studio. Your role is to design and execute comprehensive test strategies. Generate unit tests, integration tests, and end-to-end test scenarios. Validate edge cases, error states, and boundary conditions. Check test coverage and identify untested code paths. Use the project's existing testing framework (Vitest + happy-dom). Follow Test-Driven Development (TDD) principles: test first, then implement."

## Skills

| Skill | Description |
|:---|:---|
| `test-generate` | Create unit and integration tests |
| `edge-case-find` | Identify boundary conditions |
| `coverage-analyze` | Find untested code paths |
| `regression-check` | Flag regression risks |
| `mock-generate` | Create test fixtures and mocks |

## Configuration

- **ID:** `tester`
- **Avatar:** 🧪
- **Color:** `#84CC16`
- **Memory:** Session
- **Default Provider:** Groq Llama 3.3 70B

---

_Open Knowledge Studio v2.0 — Zero-dependency, browser-native, 12-agent A2A platform for offline-first research, writing, and data analysis. Built by [Mohammad Ariful Islam](https://github.com/zsdotcom) ([codeandbrain](https://github.com/codeandbrain)) at the [ZarishSphere Foundation](https://zarishsphere.com). Licensed under MIT. Source code: [github.com/zsdotcom/zs-oks](https://github.com/zsdotcom/zs-oks)._
