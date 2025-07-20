-- Insert sample templates data (this would be used for template selection)
-- Note: In a real app, you might want a separate templates table

-- Sample data for testing (remove in production)
-- This assumes you have a test user created through Supabase Auth

-- You can uncomment and modify these after creating a test user:
/*
-- Sample page
INSERT INTO public.pages (user_id, username, bio, template, color_scheme)
VALUES (
  'your-user-id-here',
  'johndoe',
  'Welcome to my bio page! Check out my links below.',
  'creator',
  'default'
);

-- Sample links
INSERT INTO public.links (page_id, title, url, icon, sort_order)
VALUES 
  ('page-id-here', 'My Website', 'https://example.com', 'globe', 1),
  ('page-id-here', 'Twitter', 'https://twitter.com/johndoe', 'twitter', 2),
  ('page-id-here', 'Instagram', 'https://instagram.com/johndoe', 'instagram', 3);
*/
