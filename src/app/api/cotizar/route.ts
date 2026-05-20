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
    const { categoriaServicio, tipoNegocio, problema, volumen, herramientas, nivelSolucion, tieneDiseno, lead } = data;

    if (!lead || !lead.nombre || !lead.email || !lead.telefono) {
      return NextResponse.json({ error: "Faltan datos de contacto obligatorios." }, { status: 400 });
    }

    const isDev = categoriaServicio === "web" || categoriaServicio === "app";

    // 1. Determinar precios y solución
    let precio = "";
    let titleSolucion = "";
    let mensajeCompleto = "";

    if (categoriaServicio === "automatizacion") {
      precio = "RD$15,000 – RD$35,000";
      titleSolucion = "Chatbot Inteligente para WhatsApp";
      if (nivelSolucion === "empresarial") {
        precio = "RD$35,000 – RD$80,000";
        titleSolucion = "Sistema de Automatización Empresarial";
      } else if (nivelSolucion === "ia_avanzada") {
        precio = "RD$80,000 – RD$250,000+";
        titleSolucion = "Agente de IA y Arquitectura Avanzada";
      }
      const herramientasStr = herramientas && herramientas.length > 0 ? herramientas.join(", ") : "Ninguna";
      mensajeCompleto = `[AUTOMATIZACIÓN]
- Industria: ${tipoNegocio}
- Objetivo: ${problema}
- Volumen: ${volumen}
- Herramientas: ${herramientasStr}
-------------------------
- Solución: ${titleSolucion}
- Presupuesto: ${precio} (50/50)`;
    } else {
      if (categoriaServicio === "web") {
        precio = "$300 - $350 USD";
        titleSolucion = "Página Web / Landing Page Corporativa";
      } else {
        precio = "Consultar con Asesor";
        titleSolucion = "Desarrollo de Aplicación a Medida";
      }
      mensajeCompleto = `[DESARROLLO SOFTWARE]
- Tipo: ${categoriaServicio.toUpperCase()}
- Industria: ${tipoNegocio}
- Tiene Diseño/Logo: ${tieneDiseno}
-------------------------
- Solución: ${titleSolucion}
- Presupuesto: ${precio} (50/50)`;
    }

    // 2. Insertar Lead en Supabase
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

    // 3. Preparar plantillas de correo
    let clientEmailHtml = "";

    if (categoriaServicio === "automatizacion") {
      const herramientasStr = herramientas && herramientas.length > 0 ? herramientas.join(", ") : "Ninguna";
      clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
          .header { background: linear-gradient(135deg, #10b981, #059669); padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
          .header p { margin: 10px 0 0 0; font-size: 14px; color: #a7f3d0; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 16px; color: #e4e4e7; line-height: 1.6; margin-bottom: 25px; }
          
          .card { background-color: #09090b; border: 1px solid #27272a; border-radius: 16px; padding: 25px; margin-bottom: 25px; }
          .card-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #10b981; letter-spacing: 1px; margin-bottom: 15px; }
          
          .item { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 14px; align-items: center; }
          .item-label { color: #a1a1aa; font-weight: 500; }
          .item-value { font-weight: 700; color: #ffffff; text-align: right; max-width: 60%; }
          
          .price-box { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 20px; text-align: center; margin-top: 30px; }
          .price-label { font-size: 11px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
          .price-amount { font-size: 28px; font-weight: 900; color: #ffffff; margin: 0; }
          .price-note { font-size: 11px; color: #a1a1aa; margin-top: 5px; font-weight: 500; }
          
          .btn-wa { display: inline-block; background-color: #25d366; color: #ffffff !important; font-weight: 800; font-size: 15px; text-decoration: none; padding: 14px 35px; border-radius: 12px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Diagnóstico Inteligente</h1><p>FlujoXAI™</p></div>
          <div class="content">
            <p class="greeting">¡Hola, <strong>${lead.nombre}</strong>!</p>
            <p class="greeting">Hemos analizado los requerimientos operativos de <strong>${lead.empresa || "tu negocio"}</strong>. Esta es la solución óptima para eliminar tareas manuales:</p>
            
            <div class="card">
              <div class="card-title">Perfil Analizado</div>
              <div class="item"><span class="item-label">Industria:</span><span class="item-value">${tipoNegocio}</span></div>
              <div class="item"><span class="item-label">Objetivo:</span><span class="item-value">${problema}</span></div>
              <div class="item"><span class="item-label">Volumen:</span><span class="item-value">${volumen}</span></div>
            </div>

            <div class="card" style="border-color: rgba(16, 185, 129, 0.3);">
              <div class="card-title" style="color: #10b981;">Solución Recomendada</div>
              <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #ffffff;">${titleSolucion}</h3>
              
              <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.1);">
                <div class="card-title" style="color: #a1a1aa; font-size: 10px;">Costos Operativos (Infraestructura Externa)</div>
                <div class="item"><span class="item-label" style="font-size: 12px;">Servidor VPS:</span><span class="item-value" style="font-size: 12px;">~ $80 USD / año</span></div>
                <div class="item"><span class="item-label" style="font-size: 12px;">Consumo API (IA):</span><span class="item-value" style="font-size: 12px;">~ $30 USD / mes</span></div>
                <div style="margin-top: 15px; padding: 10px; background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 8px;">
                  <div class="item"><span class="item-label" style="font-size: 12px; color: #10b981; font-weight: bold;">Garantía FlujoXAI:</span><span class="item-value" style="font-size: 12px; color: #10b981; font-weight: bold;">1 Mes Gratis</span></div>
                </div>
              </div>
              
              <div class="price-box">
                <div class="price-label">Inversión Estimada</div>
                <h2 class="price-amount">${precio}</h2>
                <div class="price-note">50% INICIAL / 50% A LA ENTREGA</div>
              </div>
            </div>

            <div style="text-align: center; margin-top: 35px;">
              <a href="https://wa.me/18492597719?text=${encodeURIComponent(`¡Hola! Recibí el diagnóstico para ${titleSolucion}`)}" class="btn-wa">Coordinar Implementación</a>
            </div>
          </div>
        </div>
      </body>
      </html>
      `;
    } else {
      clientEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #09090b; color: #f4f4f5; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #18181b; border: 1px solid #27272a; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
          .header { background: linear-gradient(135deg, #10b981, #059669); padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
          .header p { margin: 10px 0 0 0; font-size: 14px; color: #a7f3d0; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 16px; color: #e4e4e7; line-height: 1.6; margin-bottom: 25px; }
          
          .card { background-color: #09090b; border: 1px solid #27272a; border-radius: 16px; padding: 25px; margin-bottom: 25px; }
          .card-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #10b981; letter-spacing: 1px; margin-bottom: 15px; }
          
          .item { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 14px; align-items: center; }
          .item-label { color: #a1a1aa; font-weight: 500; }
          .item-value { font-weight: 700; color: #ffffff; text-align: right; max-width: 60%; }
          
          .price-box { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 12px; padding: 20px; text-align: center; margin-top: 30px; }
          .price-label { font-size: 11px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
          .price-amount { font-size: 28px; font-weight: 900; color: #ffffff; margin: 0; }
          .price-note { font-size: 11px; color: #a1a1aa; margin-top: 5px; font-weight: 500; }
          
          .btn-wa { display: inline-block; background-color: #25d366; color: #ffffff !important; font-weight: 800; font-size: 15px; text-decoration: none; padding: 14px 35px; border-radius: 12px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Propuesta de Desarrollo</h1><p>FlujoXAI™</p></div>
          <div class="content">
            <p class="greeting">¡Hola, <strong>${lead.nombre}</strong>!</p>
            <p class="greeting">Hemos analizado los requerimientos de <strong>${lead.empresa || "tu negocio"}</strong>. Esta es nuestra propuesta inicial de desarrollo de software:</p>
            
            <div class="card">
              <div class="card-title">Perfil Analizado</div>
              <div class="item"><span class="item-label">Industria:</span><span class="item-value">${tipoNegocio}</span></div>
              <div class="item"><span class="item-label">Tiene Diseño/Logo:</span><span class="item-value">${tieneDiseno}</span></div>
            </div>

            <div class="card" style="border-color: rgba(16, 185, 129, 0.3);">
              <div class="card-title" style="color: #10b981;">Servicio Solicitado</div>
              <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #ffffff;">${titleSolucion}</h3>
              
              <div style="margin-top: 20px; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.1);">
                <div class="card-title" style="color: #a1a1aa; font-size: 10px;">Infraestructura Externa</div>
                <div class="item"><span class="item-label" style="font-size: 12px;">Hosting y Dominio:</span><span class="item-value" style="font-size: 12px;">~ $40 - $80 USD / año</span></div>
                <p style="font-size: 10px; color: #a1a1aa; margin-top: 10px;">* El alojamiento web y nombre de dominio es un pago anual directo al proveedor (ej. Hostinger).</p>
              </div>
              
              <div class="price-box">
                <div class="price-label">Inversión Estimada</div>
                <h2 class="price-amount">${precio}</h2>
                <div class="price-note">50% INICIAL / 50% A LA ENTREGA</div>
              </div>
            </div>

            <div style="text-align: center; margin-top: 35px;">
              <a href="https://wa.me/18492597719?text=${encodeURIComponent(`¡Hola! Recibí la propuesta para Desarrollo de Software y me gustaría iniciar.`)}" class="btn-wa">Coordinar Implementación</a>
            </div>
          </div>
        </div>
      </body>
      </html>
      `;
    }

    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head><style>body { font-family: Arial; padding: 20px; }</style></head>
      <body>
        <h2>🚨 Nuevo Prospecto (${categoriaServicio.toUpperCase()})</h2>
        <p><strong>Nombre:</strong> ${lead.nombre}</p>
        <p><strong>Empresa:</strong> ${lead.empresa}</p>
        <p><strong>Teléfono:</strong> ${lead.telefono}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <hr>
        <p><strong>Detalles:</strong><br><pre>${mensajeCompleto}</pre></p>
      </body>
      </html>
    `;

    if (resendApiKey === "re_dummy_key_for_local_testing") {
      console.log("⚠️ Simulating emails locally...");
    } else {
      try {
        await resend.emails.send({
          from: `FlujoXAI Ventas <${FROM_EMAIL}>`,
          to: lead.email,
          subject: "Propuesta de Proyecto - FlujoXAI",
          html: clientEmailHtml,
        });

        await resend.emails.send({
          from: `FlujoXAI Alertas <${FROM_EMAIL}>`,
          to: ADMIN_EMAIL,
          subject: `🚨 Lead: ${lead.empresa || lead.nombre} (${categoriaServicio})`,
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
