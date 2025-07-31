-- Fix work_sessions table schema to match application expectations

-- First, make initiative_id nullable as per the app requirements
ALTER TABLE public.work_sessions 
ALTER COLUMN initiative_id DROP NOT NULL;

-- Drop the completed_at column
ALTER TABLE public.work_sessions 
DROP COLUMN completed_at;

-- Add the missing columns that the app expects
ALTER TABLE public.work_sessions 
ADD COLUMN started_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN ended_at TIMESTAMPTZ,
ADD COLUMN completed BOOLEAN DEFAULT false,
ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing RLS policies to include update policy
CREATE POLICY "Users can update their own work sessions"
    ON public.work_sessions FOR UPDATE
    USING (auth.uid() = user_id);