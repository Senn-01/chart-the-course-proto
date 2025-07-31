-- Enable Realtime for all tables that need real-time updates

-- Drop existing publication if it exists
DROP PUBLICATION IF EXISTS supabase_realtime;

-- Create publication for realtime
CREATE PUBLICATION supabase_realtime;

-- Add tables to the publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.ideas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.initiatives;
ALTER PUBLICATION supabase_realtime ADD TABLE public.work_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.log_entries;