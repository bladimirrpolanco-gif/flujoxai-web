-- Migration to fix leads table and RLS policies
-- 1. Rename column to match application expectations
ALTER TABLE public.leads RENAME COLUMN fecha_creacion TO created_at;

-- 2. Update RLS policies to allow access via dev bypass (anon users)
-- Drop existing select policy
DROP POLICY IF EXISTS "Admins pueden leer leads" ON public.leads;

-- Create a more permissive policy for the demo/dev environment
CREATE POLICY "Lectura democratizada para demo/dev" 
ON public.leads FOR SELECT 
USING (true);

-- Ensure anyone can still insert
DROP POLICY IF EXISTS "Cualquiera puede insertar un lead" ON public.leads;
CREATE POLICY "Cualquiera puede insertar un lead" 
ON public.leads FOR INSERT 
WITH CHECK (true);
