// Envía los leads y cotizaciones del sitio al Gestor (gestor.flujoxai.com),
// que es el CRM central. Nunca lanza error: si el Gestor no responde, el
// lead igual queda guardado en la base de datos del sitio.

const GESTOR_WEBHOOK_URL =
  process.env.GESTOR_WEBHOOK_URL || "https://gestor.flujoxai.com/api/webhooks/link-bio";
const GESTOR_WEBHOOK_SECRET = (process.env.GESTOR_WEBHOOK_SECRET || "").trim();

export type GestorLead = {
  name: string;
  whatsapp?: string;
  email?: string;
  business?: string;
  interest?: string;
  message?: string;
};

export async function sendLeadToGestor(lead: GestorLead, source: string): Promise<boolean> {
  if (!GESTOR_WEBHOOK_SECRET) {
    console.warn("GESTOR_WEBHOOK_SECRET no está configurado: el lead no se envió al Gestor.");
    return false;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(GESTOR_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-gestor-webhook-secret": GESTOR_WEBHOOK_SECRET,
      },
      body: JSON.stringify({
        event: "lead_captured",
        event_id: crypto.randomUUID(),
        occurred_at: new Date().toISOString(),
        source,
        lead: {
          name: (lead.name || "").slice(0, 200),
          whatsapp: (lead.whatsapp || "").slice(0, 40),
          email: (lead.email || "").slice(0, 300),
          business: (lead.business || "").slice(0, 200),
          interest: (lead.interest || "").slice(0, 200),
          message: (lead.message || "").slice(0, 3000),
        },
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error("El Gestor rechazó el lead:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("No se pudo enviar el lead al Gestor:", err);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
