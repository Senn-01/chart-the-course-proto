# Project Brief: Chart The Course
**Version:** 2.0
**Date:** July 29, 2025

## 1. Executive Summary

`Chart The Course` is a minimalist SaaS web application designed for knowledge workers, creators, and solo entrepreneurs. It acts as a high-level strategic orchestrator for personal and professional development. Its core purpose is to translate abstract vision into consistent, focused daily effort. Unlike project management tools that track tasks, this application measures and gamifies the application of deep work, acting as a performance tool for intellectual and creative output.

## 2. Core Principles

- **Strategic Meta-Layer:** The application sits above detailed task managers and specialized tools, helping the user decide *what* to work on and *why*.
- **Measure Effort, Not Tasks:** The atomic unit of productivity is a timed, focused work session, not a checked-off task.
- **Simplicity and Focus:** The UI is minimalist and non-intrusive. The user is a capable professional who needs a sharp tool, not hand-holding.
- **AI as a Silent Partner:** Artificial intelligence is used to reduce friction (e.g., voice-to-log) and provide structure, but it does not dictate action.
- **Consistency over Intensity:** The system is designed to motivate consistent, daily engagement through subtle, long-term feedback loops.

## 3. User Flow Logic

This outlines a typical journey through the application:

1.  **Exploring Ideas:** The user dumps all raw ideas into **Uncharted Territories**. This is a quick, frictionless process to log potential expeditions.
2.  **Defining a Course:** The user processes the `Uncharted Territories`. Ephemeral ideas are discarded. Significant ideas are promoted to become an **Initiative**, at which point the user must assign `Impact` and `Effort` scores.
3.  **Mapping the Voyage:** The user navigates to **The Chart Room**. This module displays all Initiatives on a 2x2 Impact/Effort matrix, providing a strategic map of all potential voyages.
4.  **Aligning the Compass:** Before setting sail, the user reviews their **True North Compass**. They see their mission, values, and defined `toolStack`. This reinforces the "why" of the journey.
5.  **The Daily Expedition:** The user decides to begin work. They go to **The Daily Expedition** module, select an Initiative to focus on, and a 90-minute timer begins in a minimalist "Focus Mode."
6.  **Making a Log Entry:** Upon completion of the timer, a `WorkSession` is automatically logged. At the end of the day, the user opens the **Captain's Log**, where they can record a free-form voice entry about their progress. An AI agent transcribes and structures this log.
7.  **Reading the Wake:** The user visits **Reading the Wake** to see their progress visualized through activity heatmaps, streaks, and charts showing how their effort is allocated across their Initiatives.

## 4. Module Breakdown

### 4.1. Uncharted Territories
- **Objective:** High-speed, low-friction capture of all incoming ideas and potential projects.
- **Functionality:** Text input for new `Ideas`; Triage actions: Promote to `Initiative`, Archive, Discard.
- **Entities:** `Idea`
- **Footer Quote:** _"The best people possess a feeling for beauty, the courage to take risks, the discipline to tell the truth, the capacity for sacrifice."_

### 4.2. True North Compass
- **Objective:** To establish and refine the user's core strategic identity using an AI co-pilot.
- **Functionality:** AI-guided generation of a structured `Vision` document containing the user's mission, values, goals, and `toolStack`.
- **Entities:** `Vision`
- **Footer Quote:** _"There is nothing noble in being superior to your fellow man; true nobility is being superior to your former self."_

### 4.3. The Chart Room
- **Objective:** To provide a high-level strategic map of all potential work.
- **Functionality:** Visualize all `Initiatives` on a 2x2 Impact/Effort matrix; Manually mark an `Initiative` as "completed."
- **Entities:** `Initiative`
- **Footer Quote:** _"Never mistake motion for action."_

### 4.4. The Daily Expedition
- **Objective:** To facilitate a timed, focused deep work session on a single, chosen `Initiative`.
- **Functionality:** Start a 90-minute work session; Select an `Initiative`; A minimalist timer view that includes the user's mission statement.
- **Entities:** `WorkSession`
- **Footer Quote:** _"Courage is grace under pressure."_

### 4.5. Captain's Log
- **Objective:** To provide a simple, powerful tool for daily qualitative review and learning.
- **Functionality:** Voice-based logging; AI-driven transcription and structuring of log entries; Displays a daily summary of `WorkSessions` and completed `Initiatives`.
- **Entities:** `LogEntry`
- **Footer Quote:** _"There is no friend as loyal as a book."_

### 4.6. Reading the Wake
- **Objective:** To motivate consistency through clear, high-signal performance data.
- **Functionality:** Activity heatmap; Streaks for `WorkSessions` and `Reflections`; Charts showing effort allocation across `Initiatives`.
- **Entities:** Aggregates data from `WorkSession` and `LogEntry`.
- **Footer Quote:** _"The world is a fine place and worth fighting for..."_

## 5. MVP Technical Architecture

- **Framework:** **Next.js (React)** - For a unified frontend and simple API layer, built for performance and future mobile adaptability.
- **Backend & Database:** **Supabase** - Leverages a managed PostgreSQL database, authentication, file storage (for voice notes), and serverless edge functions for all backend logic and AI API calls.
- **AI Services:** **OpenAI API** - A single provider for `gpt-4o-mini` (structuring AI) and `Whisper` (voice transcription).

## 6. Future Considerations (Post-MVP)

- **The Crew:** Allowing users to share their `Reading the Wake` dashboard with a small, private accountability group.
- **The First Mate:** An AI agent that analyzes analytics and logs to provide strategic observations.
- **Signal Flares:** API connections to pull data from other apps (calendars, code repositories) to enrich the `Captain's Log`.