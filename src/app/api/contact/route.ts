import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendLeadNotification } from "@/lib/notifications";
import { sendLeadToGestor } from "@/lib/gestor";
import { cleanText, EMAIL_RE, escapeHtml, getClientIp, isAllowedOrigin, logSecurityEvent, PHONE_RE, rateLimit } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    if (!isAllowedOrigin(req.headers)) {
      logSecurityEvent("contact.bad_origin", { ip, origin: req.headers.get("origin") });
      return NextResponse.json({ error: "Origen no permitido." }, { status: 403 });
    }
    if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
      logSecurityEvent("contact.rate_limited", { ip });
      return NextResponse.json({ error: "Demasiadas solicitudes. Intenta más tarde." }, { status: 429 });
    }

    const data = await req.json().catch(() => null);
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
    }
    const nombre = cleanText(data.nombre, 120);
    const telefono = cleanText(data.telefono, 30);
    const empresa = cleanText(data.empresa, 150);
    const email = cleanText(data.email, 254).toLowerCase();
    const mensaje = cleanText(data.mensaje, 3000);

    // Validación en el servidor (no confiar en el formulario del navegador)
    if (!nombre || !email || !telefono) {
      return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email) || !PHONE_RE.test(telefono)) {
      return NextResponse.json({ error: "Email o teléfono inválido." }, { status: 400 });
    }

    // Sanitizar los datos recibidos
    const safeData = {
      nombre: escapeHtml(nombre),
      telefono: escapeHtml(telefono),
      empresa: escapeHtml(empresa || "Particular"),
      email: escapeHtml(email),
      mensaje: escapeHtml(mensaje || ""),
    };

    // Insertar en la base de datos de forma segura desde el servidor
    const { error: dbError } = await supabaseAdmin.from('leads').insert([safeData]);

    if (dbError) {
      console.error("Error al registrar lead en Supabase:", dbError);
      return NextResponse.json({ error: "Ocurrió un error al guardar tu solicitud." }, { status: 500 });
    }

    // Enviar el lead al Gestor (CRM central). Va con los datos originales:
    // el Gestor escapa el texto al mostrarlo.
    await sendLeadToGestor({
      name: String(nombre),
      whatsapp: String(telefono),
      email: String(email),
      business: empresa ? String(empresa) : "",
      interest: "Asesoría (formulario web)",
      message: mensaje ? String(mensaje) : "",
    }, "web-contacto");

    // Disparar la notificación de sistema
    await sendLeadNotification(safeData);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Error en API de Contacto:", error);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
