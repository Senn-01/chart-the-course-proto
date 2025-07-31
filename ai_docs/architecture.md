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
```