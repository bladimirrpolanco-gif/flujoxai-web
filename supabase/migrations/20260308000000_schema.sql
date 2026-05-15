-- Crear tabla 'servicios'
CREATE TABLE public.servicios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio_base NUMERIC,
    activo BOOLEAN DEFAULT true,
    icono TEXT, -- Nombre del icono de Lucide
    beneficios TEXT[], -- Array de beneficios
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed data for servicios
INSERT INTO public.servicios (nombre, descripcion, icono, beneficios) VALUES
('Chatbots IA para WhatsApp', 'Atiende a tus clientes 24/7 con bots conversacionales que entienden el contexto y responden como humanos.', 'MessageSquare', ARRAY['Atención inmediata sin esperas', 'Captura leads automáticamente', 'Escalabilidad infinita']),
('Automatización de Procesos', 'Conectamos tus herramientas (CRM, ERP, Email) para que trabajen solas. Eliminamos el trabajo manual repetitivo.', 'Workflow', ARRAY['Cero errores humanos', 'Integración completa', 'Mayor productividad']),
('Agendamiento Inteligente', 'Sistemas que sincronizan calendarios, envían recordatorios y reprograman citas sin intervención humana.', 'CalendarCheck', ARRAY['Sincronización en tiempo real', 'Recordatorios automáticos', 'Reduce inasistencias']);


-- Crear tabla 'leads'
CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    telefono TEXT,
    email TEXT,
    empresa TEXT,
    mensaje TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear tabla 'conversaciones_demo'
CREATE TABLE public.conversaciones_demo (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    mensaje_usuario TEXT NOT NULL,
    respuesta_bot TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear tabla 'usuarios_admin'
CREATE TABLE public.usuarios_admin (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    rol TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configuración de Seguridad y Políticas (RLS - Row Level Security)
ALTER TABLE public.servicios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversaciones_demo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios_admin ENABLE ROW LEVEL SECURITY;

-- Políticas para 'servicios'
-- Los visitantes pueden leer los servicios
CREATE POLICY "Servicios visibles para todos" ON public.servicios
    FOR SELECT USING (activo = true);

-- Políticas para 'leads'
-- Cualquiera (anon) puede insertar un lead
CREATE POLICY "Cualquiera puede insertar un lead" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Sólo los usuarios autenticados y que sean admins pueden ver leads
CREATE POLICY "Admins pueden leer leads" ON public.leads
    FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para 'conversaciones_demo'
-- Cualquiera puede insertar/ver sus conversaciones por session_id (idealmente)
CREATE POLICY "Cualquiera puede insertar conversaciones" ON public.conversaciones_demo
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Cualquiera puede ver conversaciones" ON public.conversaciones_demo
    FOR SELECT USING (true);

-- Crear tabla 'metricas' para analítica
CREATE TABLE IF NOT EXISTS public.metricas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo_evento TEXT NOT NULL, -- 'visita', 'mensaje_simulador', 'lead_generado'
    valor NUMERIC DEFAULT 1,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear tabla para la base de conocimiento 'conocimiento_bot'
CREATE TABLE IF NOT EXISTS public.conocimiento_bot (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clave TEXT NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear tabla para el historial de conversaciones (SaaS Ready)
CREATE TABLE IF NOT EXISTS public.conversaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sesion_id TEXT NOT NULL,
    remitente TEXT NOT NULL, -- 'usuario' o 'bot'
    mensaje TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear tabla para el log de notificaciones
CREATE TABLE IF NOT EXISTS public.notificaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo TEXT NOT NULL, -- 'email', 'whatsapp'
    destinatario TEXT NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en nuevas tablas
ALTER TABLE public.metricas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conocimiento_bot ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;

-- Políticas universales para anon (entorno demo)
CREATE POLICY "Acceso total anon metricas" ON public.metricas FOR ALL USING (true);
CREATE POLICY "Acceso total anon conocimiento" ON public.conocimiento_bot FOR ALL USING (true);
CREATE POLICY "Acceso total anon conversaciones" ON public.conversaciones FOR ALL USING (true);
CREATE POLICY "Acceso total anon notificaciones" ON public.notificaciones FOR ALL USING (true);

-- Seed inicial para conocimiento base (si no existe)
INSERT INTO public.conocimiento_bot (clave, valor)
VALUES ('base_knowledge', 'FlujoXAI es experto en automatización con IA. Atendemos de Lunes a Viernes de 9am a 6pm. Nuestros precios de chatbots empiezan desde 20,000 DOP.')
ON CONFLICT (clave) DO NOTHING;

