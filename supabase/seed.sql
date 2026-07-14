-- Seed inicial de admin para resets locales/dev.
-- Cuenta administradora principal.

INSERT INTO public.usuarios_admin (user_id, nombre, email, rol)
SELECT
  u.id,
  'Administrador' AS nombre,
  u.email,
  'admin' AS rol
FROM auth.users u
WHERE lower(u.email) = 'flujoxai@gmail.com'
ON CONFLICT (email) DO UPDATE
SET
  user_id = EXCLUDED.user_id,
  nombre = EXCLUDED.nombre,
  rol = EXCLUDED.rol;
