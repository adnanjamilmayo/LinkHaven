-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom user profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pages table
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  template TEXT DEFAULT 'creator' CHECK (template IN ('creator', 'shop', 'coach')),
  color_scheme TEXT DEFAULT 'default',
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table
CREATE TABLE IF NOT EXISTS public.links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  click_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE NOT NULL,
  view_date DATE DEFAULT CURRENT_DATE,
  views INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_id, view_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_username ON public.pages(username);
CREATE INDEX IF NOT EXISTS idx_pages_user_id ON public.pages(user_id);
CREATE INDEX IF NOT EXISTS idx_links_page_id ON public.links(page_id);
CREATE INDEX IF NOT EXISTS idx_links_sort_order ON public.links(page_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_analytics_page_id ON public.analytics(page_id);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON public.analytics(view_date);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for pages
CREATE POLICY "Users can view own pages" ON public.pages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view pages for public access" ON public.pages
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own pages" ON public.pages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pages" ON public.pages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pages" ON public.pages
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for links
CREATE POLICY "Users can manage own links" ON public.links
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pages 
      WHERE pages.id = links.page_id 
      AND pages.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view active links" ON public.links
  FOR SELECT USING (is_active = true);

-- Allow anyone to update links (for increment_link_clicks)
CREATE POLICY "Anyone can update links" ON public.links
  FOR UPDATE USING (true);

-- RLS Policies for analytics
CREATE POLICY "Users can view own analytics" ON public.analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pages 
      WHERE pages.id = analytics.page_id 
      AND pages.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert analytics" ON public.analytics
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update analytics (for increment_page_views)
CREATE POLICY "Anyone can update analytics" ON public.analytics
  FOR UPDATE USING (true);

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update analytics
CREATE OR REPLACE FUNCTION public.increment_page_views(page_uuid UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.analytics (page_id, view_date, views)
  VALUES (page_uuid, CURRENT_DATE, 1)
  ON CONFLICT (page_id, view_date)
  DO UPDATE SET views = analytics.views + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment link clicks
CREATE OR REPLACE FUNCTION public.increment_link_clicks(link_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.links 
  SET click_count = click_count + 1 
  WHERE id = link_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
