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

# Architecture Document: Chart The Course
**Version:** 1.1 (Verified)
**Date:** July 29, 2025

## 1. System Overview

This document outlines the technical architecture for the `Chart The Course` MVP. The system is designed as a modern web application with a decoupled frontend and a Backend-as-a-Service (BaaS) provider to ensure scalability and rapid development.

### High-Level Diagram

[ User Browser ]
|
v
[ Next.js Frontend (Hosted on Vercel) ]
|   /|  
|    | (Auth, DB Queries, Storage)
|    |
v   /|  
[ Supabase (BaaS) ]
|
| (Server-to-Server API Calls)
v
[ OpenAI API (GPT, Whisper) ]



## 2. Tech Stack

- **Frontend Framework:** **Next.js 14+** (with React 18+)
- **Styling:** **Tailwind CSS** for utility-first styling.
- **Backend Services:** **Supabase**
  - **Database:** PostgreSQL
  - **Authentication:** Supabase Auth (Email/Password, Google/GitHub OAuth)
  - **Serverless Logic:** Supabase Edge Functions (Deno/TypeScript)
  - **File Storage:** Supabase Storage (for voice notes)
- **AI Services:** **OpenAI API**
  - **Language Model:** `gpt-4o-mini` for structured JSON output.
  - **Transcription:** `whisper-1` for voice-to-text.

## 3. Database Schema (PostgreSQL)

The following SQL statements define the core schema for the MVP.

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User table (managed by Supabase Auth, but this is the public view)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- UNCHARTED TERRITORIES Module: Table for raw ideas
CREATE TABLE public.ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VISION Module
CREATE TABLE public.vision (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    document JSONB, -- Stores the structured Vision document
    chat_history JSONB, -- Stores the OpenAI chat history
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- THE CHART ROOM Module
CREATE TABLE public.initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'backlog', -- 'backlog', 'active', 'completed', 'archived'
    impact INT CHECK (impact >= 1 AND impact <= 5),
    effort INT CHECK (effort >= 1 AND effort <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- THE DAILY EXPEDITION Module
CREATE TABLE public.work_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    initiative_id UUID NOT NULL REFERENCES public.initiatives(id) ON DELETE CASCADE,
    duration_minutes INT NOT NULL DEFAULT 90,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CAPTAIN'S LOG Module
CREATE TABLE public.log_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    content_structured JSONB, -- AI-structured achievements, blockers, etc.
    original_transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a unique constraint for one log entry per user per day
ALTER TABLE public.log_entries
ADD CONSTRAINT unique_log_entry_per_day UNIQUE (user_id, log_date);
````

## 4\. API & Serverless Logic (Supabase Edge Functions)

Backend logic will be encapsulated in serverless functions to handle secure API calls and business logic.

### 4.1. `promote-idea` Function

  - **Trigger:** HTTP POST from the `Uncharted Territories` interface.
  - **Input:** `{ "ideaId": "...", "impact": 4, "effort": 3 }`
  - **Logic:**
    1.  Authenticates the user.
    2.  Reads the `content` from the `ideas` table where `id = ideaId`.
    3.  Creates a new record in the `initiatives` table with the fetched content and the input `impact`/`effort` values.
    4.  Deletes the original record from the `ideas` table.
    5.  This entire process should be wrapped in a database transaction to ensure atomicity.

### 4.2. `vision-agent` Function

  - **Trigger:** HTTP POST from the `True North Compass` chat interface.
  - **Input:** `{ "newMessage": "..." }`
  - **Logic:**
    1.  Authenticates the user.
    2.  Fetches the user's existing `vision.chat_history` from Postgres.
    3.  Appends the `newMessage` to the history.
    4.  Makes a server-to-server call to the OpenAI API (`gpt-4o-mini`).
    5.  Parses the AI response. If it's a valid JSON `Vision` document, updates the `vision.document` field.
    6.  Appends the AI's response to `vision.chat_history`.

### 4.3. `captain-log-agent` Function

  - **Trigger:** HTTP POST from the `Captain's Log` module.
  - **Input:** `{ "audioFilePath": "path/to/voice_note.webm" }`
  - **Logic:**
    1.  Authenticates the user.
    2.  Downloads the audio file from Supabase Storage.
    3.  Sends the audio file to the OpenAI Whisper API for transcription.
    4.  Sends the transcript to the OpenAI GPT-4o-mini API to be structured.
    5.  Saves the structured JSON and transcript in a new `log_entries` record.

## 5\. Authentication

  - **Provider:** Supabase Auth.
  - **Methods (MVP):** Secure email/password login and password recovery. OAuth providers (Google, GitHub) will be enabled.
  - **Implementation:** The Next.js frontend will use the `@supabase/auth-helpers-nextjs` library to manage sessions, cookies, and protected routes. All database queries will be protected by Supabase's Row Level Security (RLS) policies.

## 6\. Deployment

  - **Frontend:** The Next.js application will be continuously deployed to **Vercel**.
  - **Backend:** Supabase Edge Functions will be deployed via the Supabase CLI.
  - **Environment Variables:** All sensitive keys (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `OPENAI_API_KEY`) will be managed as environment variables in Vercel and locally in a `.env.local` file.

<!-- end list -->

```


# UI/UX Design Document: Chart The Course
**Version:** 1.0
**Date:** July 29, 2025

## 1. Core UI/UX Principles

The user interface will be guided by a set of core principles that reflect the application's purpose as a tool for focus and clarity.

-   **Minimalism & Focus:** The design will be clean, with ample negative space to create a calm, uncluttered environment. We will subtract elements until the core functionality remains.
-   **Thematic Cohesion:** The nautical/exploration theme will be conveyed subtly through a muted color palette, classic typography, and deliberate language—not literal, skeuomorphic graphics.
-   **High-Signal, Low-Noise:** Information will be presented with clarity and purpose. We will avoid vanity metrics, complex charts, and distracting notifications.
-   **Frictionless Input:** The primary actions of capturing ideas and logging reflections must be instantaneous and seamless, with voice and keyboard shortcuts as first-class citizens.
-   **Satisfying Feedback:** Key interactions—completing a session, promoting an idea, extending a streak—will be accompanied by subtle, satisfying micro-interactions (animations, haptics on mobile) to reinforce positive habits.

## 2. Design System

### 2.1. Color Palette
-   **Background:** Off-white (`#F8F5F0`), reminiscent of aged paper or a ship's sail.
-   **Primary Text:** Dark, desaturated blue (`#2E4057`), like fountain pen ink.
-   **Accent/Action Color:** Muted gold/brass (`#C5A06D`), used for buttons, links, and active states.
-   **Muted/Secondary Text:** A soft grey (`#8A94A2`).
-   **Analytics Palette:** A sequential scale of blues for heatmaps and charts.

### 2.2. Typography
-   **Headings (H1, H2, Module Titles):** A classic serif font (e.g., **Lora** or **Playfair Display**) to evoke a literary, "logbook" feel.
-   **Body & UI Text:** A highly readable, clean sans-serif font (e.g., **Inter**).

### 2.3. Iconography
-   Minimalist, lightweight line icons (e.g., **Feather Icons**).

## 3. Global Elements

-   **Navigation:** A fixed, narrow sidebar on the left, containing only icons for the six main modules. On hover, a tooltip reveals the module name (e.g., "The Chart Room"). The current module's icon will be highlighted with the accent color.
-   **Footer:** A small, unobtrusive footer on each page will display the relevant Hemingway quote in a light, italicized font.

## 4. Module-Specific UI/UX

### 4.1. Uncharted Territories
-   **Objective:** To capture an idea with zero friction.
-   **Layout:** A single, prominent text input field is the focus at the top of the page. Below it, a clean, single-column list of `Idea` cards.
-   **Interactions:**
    -   Typing in the input field and pressing `Enter` adds the new `Idea` to the top of the list with a subtle "slide-in" animation. The input field immediately clears for the next idea.
    -   `Idea` cards are plain text. On hover, action buttons ("Promote," "Archive," "Discard") fade in to minimize visual clutter.
    -   Clicking "Promote" opens a small, inline form or a minimal modal to select `Impact` and `Effort` scores (1-5 dots).

### 4.2. True North Compass
-   **Objective:** To create and refine one's personal constitution.
-   **Layout:** A two-panel interface.
    -   **Left Panel (70% width):** Displays the rendered `Vision` document with clean typography.
    -   **Right Panel (30% width):** A standard chat interface for the AI "Co-Pilot."
-   **Interactions:** As the user interacts with the chat AI, the left panel will show a subtle loading state and then update smoothly when the AI provides a revised `Vision` document.

### 4.3. The Chart Room
-   **Objective:** To get a high-level strategic overview of all potential work.
-   **Layout:** A large 2x2 grid representing the Impact/Effort Matrix. Each `Initiative` is a "card" within its respective quadrant. The card displays only the `Initiative` name.
-   **Interactions:**
    -   Hovering over a card subtly enlarges it and fades in action buttons ("Archive," "Mark as Complete").
    -   The view is read-only by design. It is a map for making decisions, not a canvas for rearranging work.

### 4.4. The Daily Expedition
-   **Objective:** To facilitate a state of deep, uninterrupted focus.
-   **Layout (Pre-Session):** An extremely minimal screen with a single, large, centered button with the text "Begin The Daily Expedition."
-   **Layout (During Session):**
    -   Upon clicking the button and selecting an `Initiative`, the UI fades to an almost blank screen.
    -   **Center:** A large, clear countdown timer (e.g., `90:00`). Above it, in a smaller font, is the name of the current `Initiative`.
    -   **Bottom:** The user's one-sentence mission statement is visible but faint.
    -   There are no other navigation or UI elements. Pressing `ESC` will fade in a confirmation dialog to prevent accidental session termination.
-   **Interactions:** Upon completion, the screen shows a simple "Expedition Complete" message and an encouraging animation before returning the user to the dashboard.

### 4.5. Captain's Log
-   **Objective:** To make daily reflection an easy and insightful habit.
-   **Layout:** A reverse-chronological timeline. Each day is a section with a clear date heading. The day's summary (`WorkSessions`, `Milestones`) is listed, followed by the structured log entry.
-   **Interactions:**
    -   The "Record Today's Log" button, when clicked, opens a modal.
    -   The modal displays a large microphone icon and a subtle waveform visualization to show it's listening. A single "Stop Recording" button is present.
    -   After stopping, a loading indicator shows the AI is processing. The modal then closes and the new, formatted log entry appears in the timeline.

### 4.6. Reading the Wake
-   **Objective:** To visualize consistency and strategic alignment at a glance.
-   **Layout:** A clean, spacious dashboard.
    -   **Main Component:** A large calendar heatmap of the past year, showing the intensity of `WorkSessions` per day.
    -   **Side Components:** Two small "stat cards" for the current "Work Session Streak" and "Reflection Streak." A simple donut or bar chart showing "Effort Allocation by Initiative (Last 30 Days)."
-   **Interactions:** Hovering over any element (a day on the heatmap, a segment on the chart) provides a tooltip with precise data (e.g., "July 29, 2025: 3 Work Sessions," "Initiative 'X': 8 Sessions").

