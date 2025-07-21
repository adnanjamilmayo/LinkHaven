-- Update existing links to use new icon values
-- This script updates any existing links that might have old icon values

-- Update any links with old emoji-based icons to use new icon values
UPDATE links 
SET icon = 'globe' 
WHERE icon IS NULL OR icon = '';

-- Update any links that might have old values to new ones
UPDATE links 
SET icon = 'twitter' 
WHERE icon = '🐦';

UPDATE links 
SET icon = 'instagram' 
WHERE icon = '📷';

UPDATE links 
SET icon = 'linkedin' 
WHERE icon = '💼';

UPDATE links 
SET icon = 'youtube' 
WHERE icon = '📺';

UPDATE links 
SET icon = 'tiktok' 
WHERE icon = '🎵';

UPDATE links 
SET icon = 'facebook' 
WHERE icon = '📘';

UPDATE links 
SET icon = 'github' 
WHERE icon = '💻';

UPDATE links 
SET icon = 'email' 
WHERE icon = '✉️';

UPDATE links 
SET icon = 'phone' 
WHERE icon = '📞';

UPDATE links 
SET icon = 'whatsapp' 
WHERE icon = '💬';

UPDATE links 
SET icon = 'telegram' 
WHERE icon = '✈️';

UPDATE links 
SET icon = 'globe' 
WHERE icon = '🌐'; 