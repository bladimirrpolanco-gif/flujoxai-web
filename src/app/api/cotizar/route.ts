import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "re_dummy_key_for_local_testing";
const resend = new Resend(resendApiKey);

const ADMIN_EMAIL = "soporte@flujoxai.com";
const FROM_EMAIL = "diagnostico@flujoxai.com";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { tipoNegocio, problema, volumen, herramientas, nivelSolucion, lead } = data;

    if (!lead || !lead.nombre || !lead.email || !lead.telefono) {
      return NextResponse.json({ error: "Faltan datos de contacto obligatorios." }, { status: 400 });
    }

    // 1. Determinar precios y solución
    let precio = "RD$15,000 – RD$35,000";
    let titleSolucion = "Chatbot Inteligente para WhatsApp";
    
    if (nivelSolucion === "empresarial") {
      precio = "RD$35,000 – RD$80,000";
      titleSolucion = "Sistema de Automatización Empresarial";
    } else if (nivelSolucion === "ia_avanzada") {
      precio = "RD$80,000 – RD$250,000+";
      titleSolucion = "Agente de IA y Arquitectura Avanzada";
    }

    // 2. Armar resumen para la DB (Guardando todas las respuestas en el campo 'mensaje')
    const herramientasStr = herramientas && herramientas.length > 0 ? herramientas.join(", ") : "Ninguna";
    const mensajeCompleto = `[DIAGNÓSTICO INTELIGENTE]
- Industria: ${tipoNegocio}
- Objetivo: ${problema}
- Volumen: ${volumen} msjs/mes
- Herramientas Actuales: ${herramientasStr}
-------------------------
- Solución Recomendada: ${titleSolucion}
- Presupuesto Estimado: ${precio} (Pago Único)`;

    // 3. Insertar Lead en Supabase
    const { error: dbError } = await supabase.from("leads").insert([
      {
        nombre: lead.nombre,
        email: lead.email,
        telefono: lead.telefono,
        empresa: lead.empresa || "Particular",
        mensaje: mensajeCompleto
      }
    ]);

    if (dbError) {
      console.error("❌ Error registering lead in Supabase:", dbError);
    }

    // 4. Preparar plantillas de correo
    const clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Diagnóstico Inteligente - FlujoXAI</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
          .header { background: linear-gradient(135deg, #10b981, #059669); padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
          .header p { margin: 10px 0 0 0; font-size: 14px; color: #a7f3d0; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 16px; color: #e4e4e7; line-height: 1.6; margin-bottom: 25px; }
          
          .card { background-color: #09090b; border: 1px solid #27272a; border-radius: 16px; padding: 25px; margin-bottom: 25px; }
          .card-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #10b981; letter-spacing: 1px; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
          
          .item { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 14px; align-items: center; }
          .item:last-child { margin-bottom: 0; }
          .item-label { color: #a1a1aa; font-weight: 500; }
          .item-value { font-weight: 700; color: #ffffff; text-align: right; max-width: 60%; }
          
          .price-box { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 20px; text-align: center; margin-top: 30px; }
          .price-label { font-size: 11px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
          .price-amount { font-size: 28px; font-weight: 900; color: #ffffff; margin: 0; }
          .price-note { font-size: 11px; color: #a1a1aa; margin-top: 5px; font-weight: 500; }
          
          .warning-box { border-left: 4px solid #f59e0b; background: rgba(245, 158, 11, 0.05); padding: 15px; border-radius: 0 12px 12px 0; margin: 25px 0; }
          .warning-box p { margin: 0; font-size: 12px; color: #d4d4d8; line-height: 1.5; }
          
          .footer { background-color: #09090b; padding: 30px; text-align: center; border-t: 1px solid #27272a; }
          .btn-wa { display: inline-block; background-color: #25d366; color: #ffffff !important; font-weight: 800; font-size: 15px; text-decoration: none; padding: 14px 35px; border-radius: 12px; transition: all 0.3s; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Diagnóstico Inteligente</h1>
            <p>FlujoXAI™</p>
          </div>
          <div class="content">
            <p class="greeting">¡Hola, <strong>${lead.nombre}</strong>!</p>
            <p class="greeting" style="margin-top: 10px;">Hemos analizado los requerimientos operativos de <strong>${lead.empresa || "tu negocio"}</strong>. Basado en tu sector y herramientas actuales, esta es la solución óptima para eliminar tareas manuales y aumentar tu eficiencia:</p>
            
            <div class="card">
              <div class="card-title">Perfil Analizado</div>
              <div class="item"><span class="item-label">Industria:</span><span class="item-value">${tipoNegocio}</span></div>
              <div class="item"><span class="item-label">Objetivo:</span><span class="item-value">${problema}</span></div>
              <div class="item"><span class="item-label">Volumen:</span><span class="item-value">${volumen} msjs/mes</span></div>
              <div class="item"><span class="item-label">Herramientas:</span><span class="item-value" style="font-size: 12px;">${herramientasStr}</span></div>
            </div>

            <div class="card" style="border-color: rgba(16, 185, 129, 0.3);">
              <div class="card-title" style="color: #10b981;">Solución Recomendada</div>
              <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #ffffff;">${titleSolucion}</h3>
              
              <div class="item"><span class="item-label">Ahorro Operativo:</span><span class="item-value" style="color: #34d399;">20 - 100 horas/mes</span></div>
              <div class="item"><span class="item-label">Tiempo de Respuesta:</span><span class="item-value" style="color: #34d399;">< 1 minuto, 24/7</span></div>
              
              <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.1);">
                <div class="card-title" style="color: #a1a1aa; font-size: 10px;">Costos Operativos (Infraestructura Externa)</div>
                <div class="item"><span class="item-label" style="font-size: 12px;">Servidor VPS:</span><span class="item-value" style="font-size: 12px;">~ $80 USD / año</span></div>
                <div class="item"><span class="item-label" style="font-size: 12px;">Consumo API (IA):</span><span class="item-value" style="font-size: 12px;">~ $30 USD / mes (Por consumo)</span></div>
                
                <div style="margin-top: 15px; padding: 10px; background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 8px;">
                  <div class="item" style="margin-bottom: 5px;"><span class="item-label" style="font-size: 12px; color: #10b981; font-weight: bold;">Garantía FlujoXAI:</span><span class="item-value" style="font-size: 12px; color: #10b981; font-weight: bold;">1 Mes Gratis (Calibración)</span></div>
                  <div class="item" style="margin-bottom: 0;"><span class="item-label" style="font-size: 11px;">Mantenimiento Posterior:</span><span class="item-value" style="font-size: 11px;">Opcional y Adicional</span></div>
                </div>
              </div>
              
              <div class="price-box">
                <div class="price-label">Inversión Estimada</div>
                <h2 class="price-amount">${precio}</h2>
                <div class="price-note">50% INICIAL / 50% A LA ENTREGA</div>
              </div>
            </div>

            <div class="warning-box">
              <p><strong>Nota:</strong> Cada solución es 100% personalizada según los procesos, integraciones y nivel de automatización específico requerido por tu empresa. El monto exacto se define en nuestra llamada de inicio.</p>
            </div>

            <div style="text-align: center; margin-top: 35px;">
              <p style="font-size: 14px; color: #a1a1aa; margin-bottom: 15px;">Un especialista ya está revisando tu perfil. Escríbenos por WhatsApp para coordinar la implementación:</p>
              <a href="https://wa.me/18492597719?text=${encodeURIComponent(`¡Hola! Recibí el diagnóstico inteligente para mi empresa *${lead.empresa}*. Me gustaría coordinar una llamada para la solución: ${titleSolucion}`)}" class="btn-wa">Coordinar Implementación</a>
            </div>
          </div>
          <div class="footer">
            <p style="font-size: 12px; color: #71717a; margin: 0;">&copy; ${new Date().getFullYear()} FlujoXAI — Automatización Empresarial con Inteligencia Artificial.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          h2 { color: #10b981; margin-top: 0; }
          .data-row { margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; }
          strong { color: #4b5563; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>🚨 Nuevo Diagnóstico Calificado</h2>
          <div class="data-row"><strong>Nombre:</strong> ${lead.nombre}</div>
          <div class="data-row"><strong>Empresa:</strong> ${lead.empresa}</div>
          <div class="data-row"><strong>Teléfono:</strong> ${lead.telefono}</div>
          <div class="data-row"><strong>Email:</strong> ${lead.email}</div>
          <br>
          <div class="data-row"><strong>Industria:</strong> ${tipoNegocio}</div>
          <div class="data-row"><strong>Objetivo:</strong> ${problema}</div>
          <div class="data-row"><strong>Volumen:</strong> ${volumen}</div>
          <div class="data-row"><strong>Herramientas:</strong> ${herramientasStr}</div>
          <br>
          <div class="data-row"><strong>Solución:</strong> ${titleSolucion}</div>
          <div class="data-row"><strong>Presupuesto Prometido:</strong> <span style="color:#10b981; font-weight:bold;">${precio}</span></div>
          
          <div style="margin-top: 20px;">
            <a href="https://wa.me/${lead.telefono.replace(/[^0-9]/g, "")}?text=¡Hola ${encodeURIComponent(lead.nombre)}! Soy Antonio de FlujoxAI. Ya analizamos el perfil de tu empresa y la solución recomendada es..." style="background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Contactar Cliente por WhatsApp</a>
          </div>
        </div>
      </body>
      </html>
    `;

    if (resendApiKey === "re_dummy_key_for_local_testing") {
      console.log("⚠️ Simulating emails locally...");
    } else {
      try {
        await resend.emails.send({
          from: `Diagnóstico FlujoXAI <${FROM_EMAIL}>`,
          to: lead.email,
          subject: "Resultados de tu Diagnóstico Inteligente - FlujoXAI",
          html: clientEmailHtml,
        });

        await resend.emails.send({
          from: `FlujoXAI Alertas <${FROM_EMAIL}>`,
          to: ADMIN_EMAIL,
          subject: `🚨 Lead: ${lead.empresa || lead.nombre} (${tipoNegocio})`,
          html: adminEmailHtml,
        });
      } catch (emailErr) {
        console.error("❌ Failed to send emails:", emailErr);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("❌ Error in Quote API:", error);
    return NextResponse.json({ error: "Ocurrió un error inesperado." }, { status: 500 });
  }
}
