-- MIGRATION SCRIPT: Run this in Supabase SQL Editor to enable Multi-Media Chat

-- 1. Add new columns to chat_messages if they don't exist
DO $$ 
BEGIN 
    -- Add message_type column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='message_type') THEN
        ALTER TABLE public.chat_messages ADD COLUMN message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'gif', 'pdf', 'file'));
    END IF;

    -- Add file_url column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_messages' AND column_name='file_url') THEN
        ALTER TABLE public.chat_messages ADD COLUMN file_url TEXT;
    END IF;

    -- Make content nullable (optional, since messages can be purely images)
    ALTER TABLE public.chat_messages ALTER COLUMN content DROP NOT NULL;
END $$;

-- 2. Create the Storage Bucket for Chat Attachments
-- This might fail if it already exists, so we wrap it in a try-catch style block
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage Policies (Allow anyone to upload and read for demo purposes)
-- NOTE: In production, restrict 'INSERT' to authenticated users.

-- Allow public read access to attachments
CREATE POLICY "Public Attachment Read"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-attachments');

-- Allow public upload access to attachments
CREATE POLICY "Public Attachment Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-attachments');

-- Allow public update/delete (Optional for demo)
CREATE POLICY "Public Attachment Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'chat-attachments');

-- 4. Ensure Realtime is enabled for the table (Re-running is safe)
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;

-- Refresh schema cache (Supabase specific)
NOTIFY pgrst, 'reload schema';
