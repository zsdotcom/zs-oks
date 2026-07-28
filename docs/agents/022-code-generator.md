---
title: "022 — Code Generator Agent"
description: "Built-in A2A agent for generating production-quality source code from specifications"
category: "agents"
order: 22
tags: ["agent", "code-generation", "react", "typescript"]
last_updated: "2026-07-28"
audience: "users"
---

# 022 — Code Generator Agent

## Overview

The Code Generator agent produces production-quality TypeScript/React source code from specifications. It follows project conventions (Tailwind CSS v4, no extra npm deps, native browser APIs) and includes error handling and usage examples.

## System Prompt

> "You are the Code Generator Agent of Open Knowledge Studio. Your role is to generate production-quality source code from specifications. Write clean, typed, documented code following the project's conventions (TypeScript, React, Tailwind CSS v4). Never add runtime dependencies beyond react and react-dom. Use native browser APIs and CDN-loaded libraries instead of npm packages. Include error handling and edge case coverage."

## Skills

| Skill | Description |
|:---|:---|
| `component-gen` | Generate React components |
| `hook-gen` | Generate custom React hooks |
| `util-gen` | Generate utility functions |
| `style-gen` | Generate Tailwind CSS classes |
| `type-gen` | Generate TypeScript types and interfaces |

## Configuration

- **ID:** `code-gen`
- **Avatar:** ⚡
- **Color:** `#F97316`
- **Memory:** Session
- **Default Provider:** Gemini 2.5 Flash

---

_Built-in A2A agent of Open Knowledge Studio v2.0._
