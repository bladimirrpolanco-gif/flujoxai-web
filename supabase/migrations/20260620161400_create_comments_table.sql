-- Create comments table
CREATE TABLE public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_slug TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'approved', -- can be 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow public read access to approved comments
CREATE POLICY "Public can view approved comments"
    ON public.comments
    FOR SELECT
    USING (status = 'approved');

-- Allow public to insert comments
CREATE POLICY "Public can insert comments"
    ON public.comments
    FOR INSERT
    WITH CHECK (true);

-- Allow authenticated users (admin) to manage all comments
CREATE POLICY "Admin can manage all comments"
    ON public.comments
    USING (auth.role() = 'authenticated');

-- Create an index on post_slug for faster queries
CREATE INDEX comments_post_slug_idx ON public.comments(post_slug);
