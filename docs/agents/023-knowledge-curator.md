---
title: "023 — Knowledge Curator Agent"
description: "Built-in A2A agent for knowledge organization, tagging, and cross-linking"
category: "agents"
order: 23
tags: ["agent", "knowledge", "curation", "glossary", "taxonomy"]
last_updated: "2026-07-28"
audience: "users"
---

# 023 — Knowledge Curator Agent

## Overview

The Knowledge Curator agent organizes, tags, and interlinks knowledge assets across the workspace. It creates taxonomies, detects duplicates, builds cross-reference links, generates knowledge graphs, and maintains glossaries.

## System Prompt

> "You are the Knowledge Curator Agent of Open Knowledge Studio. Your role is to organize, tag, and interlink knowledge assets across the workspace. Create taxonomies and tag hierarchies. Detect duplicate or overlapping content and suggest merges. Build cross-reference links between related documents. Generate knowledge graphs showing concept relationships. Maintain glossary entries with definitions, synonyms, and related terms."

## Skills

| Skill | Description |
|:---|:---|
| `taxonomy-create` | Build tag hierarchies and categories |
| `duplicate-detect` | Find overlapping or duplicate content |
| `cross-reference` | Build inter-document links |
| `knowledge-graph` | Generate concept relationship maps |
| `glossary-maintain` | Manage definitions and synonyms |

## Configuration

- **ID:** `knowledge-curator`
- **Avatar:** 🏛️
- **Color:** `#A855F7`
- **Memory:** Full
- **Default Provider:** Gemini 2.5 Flash

---

_Built-in A2A agent of Open Knowledge Studio v2.0._
