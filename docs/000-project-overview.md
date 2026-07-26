# 000 — Project Overview

**Open Knowledge Studio v1.0** is a zero-dependency, browser-native, multi-agent AI platform designed for offline-first research, writing, and data analysis. It operates entirely within your browser using IndexedDB for persistent memory and Transformers.js for zero-cost vector embeddings.

## 1. Vision & Mission

Our vision is to democratize access to advanced AI-powered research and knowledge management tools. We believe that users should not have to rely on expensive, proprietary, cloud-hosted services to manage their personal or professional knowledge bases. 

**Open Knowledge Studio** achieves this by:
- Running entirely in the browser (zero backend costs).
- Leveraging free, open-source LLM APIs (Gemini, Groq, etc.).
- Implementing a robust, 6-tier memory architecture using IndexedDB and Transformers.js.
- Providing a user-friendly, color-coded, real-time rendering interface.

## 2. Target Audience

The platform is designed for:
- **Researchers & Academics:** Who need to synthesize large volumes of literature and generate structured summaries with citations.
- **Public Health Professionals:** Who need to process epidemiological data, generate epi curves, and write reports.
- **Developers & Technical Writers:** Who need a powerful, offline-first documentation and knowledge management system.
- **Privacy-Conscious Users:** Who require their data to remain strictly on their local device.

## 3. Core Principles

1. **Zero Dependency:** The application must run without any backend server, database, or paid subscription.
2. **Offline-First:** The application must be fully functional without an internet connection (via Service Workers and local AI models).
3. **Multi-Agent Architecture:** Complex tasks are decomposed and handled by specialized, isolated agents (Coordinator, Researcher, Writer, etc.).
4. **Robust Memory:** A 6-tier memory system ensures that knowledge is retained, organized, and retrievable across sessions.
5. **Open Source:** The codebase is fully open-source and freely available for modification and distribution.

## 4. Success Metrics

- **Performance:** Semantic search queries must execute in <10ms.
- **Storage:** The system must support GB-scale storage via IndexedDB.
- **Offline Capability:** 100% of core features must be accessible offline.
- **Adoption:** The repository should serve as a reference implementation for browser-native AI applications.