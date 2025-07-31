-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends Supabase auth.users)
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

-- Create indexes for better query performance
CREATE INDEX idx_ideas_user_id ON public.ideas(user_id);
CREATE INDEX idx_initiatives_user_id ON public.initiatives(user_id);
CREATE INDEX idx_initiatives_status ON public.initiatives(status);
CREATE INDEX idx_work_sessions_user_id ON public.work_sessions(user_id);
CREATE INDEX idx_work_sessions_initiative_id ON public.work_sessions(initiative_id);
CREATE INDEX idx_work_sessions_completed_at ON public.work_sessions(completed_at);
CREATE INDEX idx_log_entries_user_id ON public.log_entries(user_id);
CREATE INDEX idx_log_entries_log_date ON public.log_entries(log_date);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Ideas policies
CREATE POLICY "Users can view their own ideas"
    ON public.ideas FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ideas"
    ON public.ideas FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas"
    ON public.ideas FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas"
    ON public.ideas FOR DELETE
    USING (auth.uid() = user_id);

-- Vision policies
CREATE POLICY "Users can view their own vision"
    ON public.vision FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vision"
    ON public.vision FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vision"
    ON public.vision FOR UPDATE
    USING (auth.uid() = user_id);

-- Initiatives policies
CREATE POLICY "Users can view their own initiatives"
    ON public.initiatives FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own initiatives"
    ON public.initiatives FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own initiatives"
    ON public.initiatives FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own initiatives"
    ON public.initiatives FOR DELETE
    USING (auth.uid() = user_id);

-- Work sessions policies
CREATE POLICY "Users can view their own work sessions"
    ON public.work_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own work sessions"
    ON public.work_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Log entries policies
CREATE POLICY "Users can view their own log entries"
    ON public.log_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own log entries"
    ON public.log_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own log entries"
    ON public.log_entries FOR UPDATE
    USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vision_updated_at BEFORE UPDATE ON public.vision
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();