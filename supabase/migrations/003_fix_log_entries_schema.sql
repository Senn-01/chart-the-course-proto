-- Fix log_entries table schema to match application expectations

-- First, drop the unique constraint temporarily
ALTER TABLE public.log_entries
DROP CONSTRAINT IF EXISTS unique_log_entry_per_day;

-- Rename columns to match TypeScript types
ALTER TABLE public.log_entries 
RENAME COLUMN content_structured TO content;

ALTER TABLE public.log_entries 
RENAME COLUMN original_transcript TO transcription;

-- Add missing audio_url column
ALTER TABLE public.log_entries 
ADD COLUMN audio_url TEXT;

-- Drop log_date column as it's not used in the app
ALTER TABLE public.log_entries 
DROP COLUMN log_date;

-- Add user_id to existing insert if missing (for RLS)
-- This is handled by the app, so we just need to ensure the column exists