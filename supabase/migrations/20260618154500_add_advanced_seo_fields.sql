-- Agregar campos de SEO avanzado a la tabla posts
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS focus_keyword TEXT;

-- Opcional: comentar en la tabla para futura referencia
COMMENT ON COLUMN public.posts.meta_title IS 'Título específico para Google (SEO). Si es nulo, se usa el title normal.';
COMMENT ON COLUMN public.posts.focus_keyword IS 'Palabra clave principal por la que se compite en este artículo.';
