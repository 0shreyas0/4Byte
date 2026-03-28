-- SUPABASE DATABASE SETUP FOR REAL-TIME CHAT
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create the chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_avatar TEXT,
    content TEXT, -- Made nullable since a message might only be an image
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'gif', 'pdf', 'file')),
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.1 Create Storage Bucket for Chat Attachments
-- (Run this in the Supabase Dashboard > Storage or use API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('chat-attachments', 'chat-attachments', true);

-- 1.2 Storage Policies
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'chat-attachments');
-- CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'chat-attachments');

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy to allow anyone to read messages (Public Read)
-- In a real app, you would restrict this to authenticated users or specific case members
CREATE POLICY "Allow public read access" 
ON public.chat_messages FOR SELECT 
USING (true);

-- 4. Create a policy to allow anyone to insert messages (Public Insert)
CREATE POLICY "Allow public insert access" 
ON public.chat_messages FOR INSERT 
WITH CHECK (true);

-- 5. Enable Realtime for the chat_messages table
-- Note: You might need to check if the publication 'supabase_realtime' exists first.
-- Most Supabase projects have it by default.
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;

-- Add table to the realtime publication
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
    ELSE
        CREATE PUBLICATION supabase_realtime FOR TABLE public.chat_messages;
    END IF;
END $$;

-- 6. Create index for faster retrieval by case_id
CREATE INDEX IF NOT EXISTS idx_chat_messages_case_id ON public.chat_messages(case_id);
