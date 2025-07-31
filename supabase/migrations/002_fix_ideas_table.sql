-- Fix ideas table schema to match application expectations

-- Add missing columns to ideas table
ALTER TABLE public.ideas 
ADD COLUMN title TEXT,
ADD COLUMN description TEXT,
ADD COLUMN tags TEXT[],
ADD COLUMN status TEXT DEFAULT 'captured' CHECK (status IN ('captured', 'explored', 'archived')),
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update existing rows to have a title from content
UPDATE public.ideas 
SET title = COALESCE(LEFT(content, 100), 'Untitled Idea');

-- Make title NOT NULL after setting values
ALTER TABLE public.ideas 
ALTER COLUMN title SET NOT NULL;

-- Drop the old content column since we now use title/description
ALTER TABLE public.ideas 
DROP COLUMN content;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ideas_updated_at
BEFORE UPDATE ON public.ideas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_ideas_user_id ON public.ideas(user_id);
CREATE INDEX idx_ideas_status ON public.ideas(status);
CREATE INDEX idx_ideas_created_at ON public.ideas(created_at DESC);