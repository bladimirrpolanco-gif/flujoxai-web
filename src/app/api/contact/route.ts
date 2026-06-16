import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendLeadNotification } from "@/lib/notifications";

// Sanitización para evitar Inyección de HTML / XSS
function escapeHtml(unsafe: any): string {
  if (typeof unsafe !== 'string') return unsafe;
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    let { nombre, telefono, empresa, email, mensaje } = data;

    // Validación básica de campos requeridos
    if (!nombre || !email || !telefono) {
      return NextResponse.json({ error: "Faltan campos obligatorios." }, { status: 400 });
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
    const { error: dbError } = await supabase.from('leads').insert([safeData]);

    if (dbError) {
      console.error("Error al registrar lead en Supabase:", dbError);
      return NextResponse.json({ error: "Ocurrió un error al guardar tu solicitud." }, { status: 500 });
    }

    // Disparar la notificación de sistema
    await sendLeadNotification(safeData);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Error en API de Contacto:", error);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
