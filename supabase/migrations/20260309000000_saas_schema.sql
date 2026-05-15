-- Migration to support Multi-tenant SaaS WhatsApp configuration
-- This table stores specific Meta/WhatsApp credentials for each client

CREATE TABLE IF NOT EXISTS public.configuracion_saas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    waba_id TEXT, -- WhatsApp Business Account ID
    phone_number_id TEXT, -- Phone Number ID
    access_token_enc TEXT, -- Encrypted Access Token
    verify_token TEXT, -- Custom verify token for this client's webhook
    nombre_negocio TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.configuracion_saas ENABLE ROW LEVEL SECURITY;

-- Policies: Clients can only see/edit their own configuration
CREATE POLICY "Users can view their own SaaS config"
ON public.configuracion_saas FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own SaaS config"
ON public.configuracion_saas FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SaaS config"
ON public.configuracion_saas FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_config_saas_updated_at
    BEFORE UPDATE ON public.configuracion_saas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index for fast lookup via WABA_ID (crucial for Webhooks)
CREATE INDEX IF NOT EXISTS idx_saas_waba_id ON public.configuracion_saas(waba_id);
