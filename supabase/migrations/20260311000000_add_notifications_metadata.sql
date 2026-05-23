-- Migration to add metadata column to notificaciones table
ALTER TABLE public.notificaciones ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
