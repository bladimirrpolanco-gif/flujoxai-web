import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

// Initialize Resend with the Environment Variable
const resendApiKey = process.env.RESEND_API_KEY || "re_dummy_key_for_local_testing";
const resend = new Resend(resendApiKey);

// FlujoXAI Email configuration
const ADMIN_EMAIL = "soporte@flujoxai.com"; // Tu email donde recibirás las alertas
const FROM_EMAIL = "onboarding@resend.dev"; // Email de envío por defecto de Resend (o tu dominio verificado si lo tienes)

export async function POST(req: NextRequest) {
  try {
    const { solucion, automatizacion, costoDesarrolloRD, costoDesarrolloUSD, lead } = await req.json();

    if (!lead || !lead.nombre || !lead.email || !lead.telefono) {
      return NextResponse.json(
        { error: "Faltan datos de contacto obligatorios en la solicitud." },
        { status: 400 }
      );
    }

    // 1. Armar descripción del mensaje para la DB de Supabase
    const solucionStr = 
      solucion === "chatbot_crm" ? "Chatbot WhatsApp + CRM Inteligente (RD$ 10,000)" :
      solucion === "chatbot_full" ? "Chatbot Full / Agente AI Autónomo (RD$ 20,000)" :
      "Solo Automatización de Procesos (Sujeto a evaluación)";

    const autoStr = 
      automatizacion === "simples" ? "Automatización Simple (+$300 USD)" :
      automatizacion === "complejas" ? "Integración Multisistema (+$400 USD)" :
      "Sin automatizaciones adicionales";

    const mensajePresupuesto = `[COTIZACIÓN AUTOMÁTICA FLUXOXAI]
- Solución Base: ${solucionStr}
- Automatizaciones: ${autoStr}
- Costo de Desarrollo estimado: RD$ ${costoDesarrolloRD.toLocaleString()} y $${costoDesarrolloUSD} USD.
- VPS Cliente ($80 USD/mes) + API OpenAI (~$30 USD/mes): ${solucion !== "solo_automatizacion" ? "Sí" : "No"}`;

    // 2. Insertar Lead en la base de datos de Supabase
    const { error: dbError } = await supabase.from("leads").insert([
      {
        nombre: lead.nombre,
        email: lead.email,
        telefono: lead.telefono,
        empresa: lead.empresa || "Particular",
        mensaje: mensajePresupuesto
      }
    ]);

    if (dbError) {
      console.error("❌ Error registering lead in Supabase:", dbError);
      // Continuamos con el envío del correo aunque falle la base de datos por redundancia de servicio
    }

    // 3. Preparar plantillas de correo electrónico en formato HTML premium

    // Template para el Cliente
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Tu Cotización Estimada - FlujoXAI</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); }
          .header { background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
          .header p { margin: 10px 0 0 0; font-size: 14px; color: #bfdbfe; }
          .content { padding: 30px; }
          .greeting { font-size: 16px; color: #e5e7eb; line-height: 1.6; }
          .card { background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 16px; padding: 20px; margin: 25px 0; }
          .card-title { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #3b82f6; letter-spacing: 1px; margin-bottom: 15px; }
          .item { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
          .item:last-child { margin-bottom: 0; }
          .item-label { color: #9ca3af; }
          .item-value { font-weight: 700; color: #ffffff; }
          .divider { height: 1px; background-color: rgba(255, 255, 255, 0.05); margin: 20px 0; }
          .infra-label { font-size: 13px; font-weight: 600; color: #f59e0b; margin-bottom: 10px; }
          .footer { background-color: #0d1117; padding: 25px 30px; text-align: center; border-t: 1px solid #1f2937; }
          .footer p { font-size: 11px; color: #4b5563; margin: 0 0 15px 0; }
          .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 30px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3); transition: all 0.3s; margin-top: 10px; }
          .btn-wa { display: inline-block; background-color: #059669; color: #ffffff !important; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 30px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.3); transition: all 0.3s; margin-top: 10px; margin-left: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Flujo<span style="color: #60a5fa;">xAI</span></h1>
            <p>Propuesta de Presupuesto Estimado y Automatización</p>
          </div>
          <div class="content">
            <p class="greeting">¡Hola, <strong>${lead.nombre}</strong>!</p>
            <p class="greeting" style="margin-top: 10px;">Muchas gracias por utilizar el Cotizador Automático de FlujoXAI. Evaluamos las necesidades de tu empresa <strong>${lead.empresa || "Particular"}</strong> y preparamos una propuesta de desarrollo técnico ajustada a tu medida:</p>
            
            <div class="card">
              <div class="card-title">Costo de Desarrollo (Pago Único — 1 mes de garantía)</div>
              ${costoDesarrolloRD > 0 ? `
                <div class="item">
                  <span class="item-label">Solución Base (${solucion === "chatbot_crm" ? "Chatbot + CRM" : "Chatbot Full/Agente AI"}):</span>
                  <span class="item-value">RD$ ${costoDesarrolloRD.toLocaleString()}</span>
                </div>
              ` : ""}
              ${costoDesarrolloUSD > 0 ? `
                <div class="item">
                  <span class="item-label">Automatización Premium (${automatizacion === "simples" ? "Fácil" : "Multisistema"}):</span>
                  <span class="item-value">$${costoDesarrolloUSD} USD</span>
                </div>
              ` : ""}
              ${solucion === "solo_automatizacion" && costoDesarrolloUSD === 0 ? `
                <div class="item">
                  <span class="item-label">Servicio de Automatización:</span>
                  <span class="item-value">Sujeto a evaluación técnica</span>
                </div>
              ` : ""}
            </div>

            ${solucion !== "solo_automatizacion" ? `
              <div class="card" style="border-color: rgba(245, 158, 11, 0.2);">
                <div class="infra-label">⚠️ Costo de Infraestructura Propia (Pago directo del Cliente)</div>
                <div class="item">
                  <span class="item-label">Servidor VPS Independiente:</span>
                  <span class="item-value">$80 USD / mes</span>
                </div>
                <div class="item">
                  <span class="item-label">Consumo Estimado de API de OpenAI:</span>
                  <span class="item-value">~$30 USD / mes (promedio)</span>
                </div>
                <p style="font-size: 11px; color: #9ca3af; margin: 10px 0 0 0; line-height: 1.4;">*El mantenimiento y soporte continuo con FlujoXAI es opcional. Nosotros te asistimos a configurar tu propia infraestructura independiente.</p>
              </div>
            ` : ""}

            <p class="greeting" style="margin-top: 25px;"><strong>¿Cuál es el siguiente paso?</strong></p>
            <p class="greeting" style="font-size: 14px; color: #9ca3af;">Si estás de acuerdo con el presupuesto estimado y deseas coordinar la entrega y fecha de inicio de tu proyecto, agenda una llamada técnica gratuita de 15 minutos con nuestro especialista:</p>
            
            <div style="text-align: center; margin-top: 25px; margin-bottom: 10px;">
              <a href="https://wa.me/18492597719?text=%C2%A1Hola%21%20Recib%C3%AD%20mi%20presupuesto%20autom%C3%A1tico%20de%20FlujoxAI%20por%20correo%20y%20me%20gustar%C3%ADa%20iniciar%20%F0%9F%A4%96" class="btn-wa">Confirmar por WhatsApp</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FlujoXAI — Antonio Polanco Ramírez · RNC 402-34117-048<br>Santo Domingo, República Dominicana</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Template para el Administrador (Tú)
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>🚨 NUEVO LEAD CALIFICADO - FlujoXAI</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #111827; border: 1px solid #374151; border-radius: 20px; overflow: hidden; }
          .header { background-color: #9333ea; padding: 25px; text-align: center; }
          .header h1 { margin: 0; font-size: 22px; color: #ffffff; }
          .content { padding: 30px; }
          .item { margin-bottom: 15px; font-size: 14px; }
          .label { font-weight: 700; color: #9ca3af; display: block; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
          .value { font-size: 15px; color: #ffffff; font-weight: 600; margin-top: 3px; display: block; }
          .btn-wa { display: inline-block; background-color: #25d366; color: #ffffff !important; font-weight: 700; font-size: 14px; text-decoration: none; padding: 10px 25px; border-radius: 8px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 Nuevo Presupuesto Calificado</h1>
          </div>
          <div class="content">
            <div class="item">
              <span class="label">Cliente:</span>
              <span class="value">${lead.nombre}</span>
            </div>
            <div class="item">
              <span class="label">Empresa:</span>
              <span class="value">${lead.empresa || "Particular"}</span>
            </div>
            <div class="item">
              <span class="label">Email:</span>
              <span class="value">${lead.email}</span>
            </div>
            <div class="item">
              <span class="label">Teléfono/WhatsApp:</span>
              <span class="value">${lead.telefono}</span>
            </div>
            <div style="height: 1px; background-color: rgba(255, 255, 255, 0.08); margin: 20px 0;"></div>
            <div class="item">
              <span class="label">Solución Solicitada:</span>
              <span class="value">${solucionStr}</span>
            </div>
            <div class="item">
              <span class="label">Automatización Adicional:</span>
              <span class="value">${autoStr}</span>
            </div>
            <div class="item">
              <span class="label">Presupuesto Estimado:</span>
              <span class="value" style="color: #4ade80; font-size: 18px;">
                RD$ ${costoDesarrolloRD.toLocaleString()} ${costoDesarrolloUSD > 0 ? `+ $${costoDesarrolloUSD} USD` : ""}
              </span>
            </div>
            <div style="text-align: center; margin-top: 25px;">
              <a href="https://wa.me/${lead.telefono.replace(/[^0-9]/g, "")}?text=%C2%A1Hola%20${encodeURIComponent(lead.nombre)}%21%20Soy%20Antonio%20de%20FlujoxAI.%20Recibimos%20tu%20cotizaci%C3%B3n%20para%20tu%20empresa%20y%20me%20gustar%C3%ADa%20ayudarte..." class="btn-wa" target="_blank">Contactar por WhatsApp Directo</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // 4. Enviar correos con Resend (con manejo de fallas si es testing local)
    if (resendApiKey === "re_dummy_key_for_local_testing") {
      console.log("⚠️ Resend API Key is missing. Simulating successful email dispatch in console:");
      console.log(`- TO: ${lead.email} (Client quote)`);
      console.log(`- TO: ${ADMIN_EMAIL} (Admin notification)`);
    } else {
      try {
        // Enviar al cliente
        await resend.emails.send({
          from: `FlujoXAI <${FROM_EMAIL}>`,
          to: lead.email,
          subject: "Tu Propuesta de Presupuesto Estimado - FlujoXAI",
          html: clientEmailHtml,
        });

        // Enviar al Administrador (Tú)
        await resend.emails.send({
          from: `FlujoXAI Alertas <${FROM_EMAIL}>`,
          to: ADMIN_EMAIL,
          subject: `🚨 Nuevo Presupuesto Calificado: ${lead.empresa || lead.nombre}`,
          html: adminEmailHtml,
        });

        console.log("✅ Emails sent successfully via Resend API");
      } catch (emailErr) {
        console.error("❌ Failed to send emails via Resend API:", emailErr);
        // Retornamos éxito parcial de base de datos de todas formas para no arruinar la experiencia del usuario
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("❌ Error in Quote API:", error);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado al procesar el presupuesto." },
      { status: 500 }
    );
  }
}
