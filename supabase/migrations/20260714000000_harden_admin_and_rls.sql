-- Harden admin access and close overly broad RLS policies.

-- Allow authenticated users to read only their own admin record.
CREATE POLICY "Users can read their own admin record"
  ON public.usuarios_admin
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Leads should be insertable by the public, but only readable/updatable by admins.
DROP POLICY IF EXISTS "Lectura democratizada para demo/dev" ON public.leads;
DROP POLICY IF EXISTS "Admins pueden leer leads" ON public.leads;
DROP POLICY IF EXISTS "Cualquiera puede insertar un lead" ON public.leads;

CREATE POLICY "Public can insert leads"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  );

CREATE POLICY "Admins can update leads"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  );

CREATE POLICY "Admins can delete leads"
  ON public.leads
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  );

-- Posts: public can read published articles only; admins manage content.
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Authenticated users can manage posts" ON public.posts;

CREATE POLICY "Public can view published posts"
  ON public.posts
  FOR SELECT
  TO anon, authenticated
  USING (published_at IS NOT NULL AND published_at <= now());

CREATE POLICY "Admins can manage posts"
  ON public.posts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  );

-- Comments: public can read approved comments and insert comments; admins manage all comments.
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
DROP POLICY IF EXISTS "Public can insert comments" ON public.comments;
DROP POLICY IF EXISTS "Admin can manage all comments" ON public.comments;

CREATE POLICY "Public can view approved comments"
  ON public.comments
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

CREATE POLICY "Public can insert comments"
  ON public.comments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage comments"
  ON public.comments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  );

-- Operational tables should not be public. Service-role server code bypasses RLS.
DROP POLICY IF EXISTS "Acceso total anon metricas" ON public.metricas;
DROP POLICY IF EXISTS "Acceso total anon conocimiento" ON public.conocimiento_bot;
DROP POLICY IF EXISTS "Acceso total anon conversaciones" ON public.conversaciones;
DROP POLICY IF EXISTS "Acceso total anon notificaciones" ON public.notificaciones;
DROP POLICY IF EXISTS "Cualquiera puede ver conversaciones" ON public.conversaciones_demo;
DROP POLICY IF EXISTS "Cualquiera puede insertar conversaciones" ON public.conversaciones_demo;

CREATE POLICY "Admins can read metrics"
  ON public.metricas
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  );

CREATE POLICY "Public can insert metrics"
  ON public.metricas
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage knowledge"
  ON public.conocimiento_bot
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  );

CREATE POLICY "Admins can read conversations"
  ON public.conversaciones
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  );

CREATE POLICY "Admins can insert conversations"
  ON public.conversaciones
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  );

CREATE POLICY "Admins can read notifications"
  ON public.notificaciones
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  );

CREATE POLICY "Admins can manage notifications"
  ON public.notificaciones
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  );

CREATE POLICY "Admins can read demo conversations"
  ON public.conversaciones_demo
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  );

CREATE POLICY "Admins can insert demo conversations"
  ON public.conversaciones_demo
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.usuarios_admin ua
      WHERE ua.user_id = auth.uid()
        AND ua.rol = 'admin'
    )
  );
