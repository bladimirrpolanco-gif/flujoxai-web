-- Agregar columna de imagen de portada a la tabla posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS cover_image TEXT;
