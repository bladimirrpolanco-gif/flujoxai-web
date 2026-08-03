"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Download,
  Copy,
  Check,
  Search,
  Bot,
  MessageSquare,
  Zap,
  Database,
  ShoppingCart,
  BarChart3,
  Mail,
  Bell,
  FileText,
  Instagram,
  ChevronRight,
  Package,
  Star,
  ArrowLeft,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

/* ─────────────────────────────────────────
   PLANTILLAS N8N — JSON DATA
──────────────────────────────────────────── */
const templates = [
  {
    id: 1,
    title: "Chatbot WhatsApp con GPT-4",
    description:
      "Responde mensajes de WhatsApp automáticamente usando GPT-4. Incluye manejo de contexto, respuestas personalizadas y escalación a humano.",
    category: "WhatsApp",
    difficulty: "Intermedio",
    nodes: ["WhatsApp Trigger", "OpenAI", "IF", "Set", "WhatsApp Message"],
    nodeCount: 8,
    downloads: 1842,
    stars: 4.9,
    tags: ["IA", "Chatbot", "WhatsApp", "GPT-4"],
    icon: MessageSquare,
    color: "from-emerald-500/20 to-green-500/10",
    borderColor: "border-emerald-500/30",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    json: {
      name: "Chatbot WhatsApp con GPT-4",
      nodes: [
        {
          parameters: { updates: ["messages"] },
          id: "a1b2c3d4-0001",
          name: "WhatsApp Trigger",
          type: "n8n-nodes-base.whatsAppTrigger",
          typeVersion: 1,
          position: [240, 300],
          webhookId: "flujo-wa-trigger-001",
        },
        {
          parameters: {
            model: "gpt-4o-mini",
            messages: {
              values: [
                {
                  role: "system",
                  content:
                    "Eres un asistente virtual de FlujoxAI. Responde de manera amigable, profesional y concisa en español. Si no puedes ayudar, deriva al equipo humano.",
                },
                {
                  role: "user",
                  content: "={{ $json.message.text.body }}",
                },
              ],
            },
            options: { temperature: 0.7, maxTokens: 500 },
          },
          id: "a1b2c3d4-0002",
          name: "GPT-4 Chat",
          type: "@n8n/n8n-nodes-langchain.openAi",
          typeVersion: 1,
          position: [480, 300],
          credentials: { openAiApi: { id: "YOUR_OPENAI_CRED", name: "OpenAI" } },
        },
        {
          parameters: {
            conditions: {
              string: [
                {
                  value1: "={{ $json.message.text.body.toLowerCase() }}",
                  operation: "contains",
                  value2: "humano",
                },
              ],
            },
          },
          id: "a1b2c3d4-0003",
          name: "¿Requiere Humano?",
          type: "n8n-nodes-base.if",
          typeVersion: 1,
          position: [720, 300],
        },
        {
          parameters: {
            resource: "message",
            operation: "send",
            phoneNumberId: "={{ $env.WA_PHONE_ID }}",
            to: "={{ $('WhatsApp Trigger').item.json.from }}",
            textBody:
              "={{ $('GPT-4 Chat').item.json.choices[0].message.content }}",
          },
          id: "a1b2c3d4-0004",
          name: "Enviar Respuesta IA",
          type: "n8n-nodes-base.whatsApp",
          typeVersion: 1,
          position: [960, 200],
          credentials: {
            whatsAppApi: { id: "YOUR_WA_CRED", name: "WhatsApp Business" },
          },
        },
        {
          parameters: {
            resource: "message",
            operation: "send",
            phoneNumberId: "={{ $env.WA_PHONE_ID }}",
            to: "={{ $('WhatsApp Trigger').item.json.from }}",
            textBody:
              "Un momento, te conecto con un agente humano 👋. Tiempo de espera estimado: 5 minutos.",
          },
          id: "a1b2c3d4-0005",
          name: "Mensaje Escalación",
          type: "n8n-nodes-base.whatsApp",
          typeVersion: 1,
          position: [960, 400],
          credentials: {
            whatsAppApi: { id: "YOUR_WA_CRED", name: "WhatsApp Business" },
          },
        },
      ],
      connections: {
        "WhatsApp Trigger": { main: [[{ node: "GPT-4 Chat", type: "main", index: 0 }]] },
        "GPT-4 Chat": { main: [[{ node: "¿Requiere Humano?", type: "main", index: 0 }]] },
        "¿Requiere Humano?": {
          main: [
            [{ node: "Mensaje Escalación", type: "main", index: 0 }],
            [{ node: "Enviar Respuesta IA", type: "main", index: 0 }],
          ],
        },
      },
      active: false,
      settings: { executionOrder: "v1" },
      versionId: "flujo-001-v1",
      meta: { templateCredsSetupCompleted: false },
      tags: [{ createdAt: "2025-01-01", updatedAt: "2025-01-01", id: "1", name: "WhatsApp" }],
    },
  },
  {
    id: 2,
    title: "Calificador de Leads → Google Sheets",
    description:
      "Captura leads desde un formulario web, los califica con IA según criterios de negocio y los registra automáticamente en Google Sheets con score.",
    category: "CRM",
    difficulty: "Básico",
    nodes: ["Webhook", "OpenAI", "Google Sheets", "IF", "Send Email"],
    nodeCount: 6,
    downloads: 2104,
    stars: 4.8,
    tags: ["CRM", "Leads", "Google Sheets", "IA"],
    icon: Database,
    color: "from-blue-500/20 to-cyan-500/10",
    borderColor: "border-blue-500/30",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    iconBg: "bg-blue-500/15 text-blue-400",
    json: {
      name: "Calificador de Leads → Google Sheets",
      nodes: [
        {
          parameters: { httpMethod: "POST", path: "lead-capture", responseMode: "onReceived" },
          id: "b2c3d4e5-0001",
          name: "Captura Lead (Webhook)",
          type: "n8n-nodes-base.webhook",
          typeVersion: 1,
          position: [240, 300],
          webhookId: "lead-capture-001",
        },
        {
          parameters: {
            model: "gpt-4o-mini",
            messages: {
              values: [
                {
                  role: "system",
                  content:
                    "Eres un calificador de leads B2B. Dado el nombre, empresa, cargo, teléfono y mensaje de un prospecto, devuelve un JSON con: score (1-100), categoria (hot/warm/cold), razon (string breve), prioridad (alta/media/baja).",
                },
                {
                  role: "user",
                  content:
                    "Nombre: {{ $json.nombre }}\nEmpresa: {{ $json.empresa }}\nCargo: {{ $json.cargo }}\nMensaje: {{ $json.mensaje }}",
                },
              ],
            },
            options: { responseFormat: { type: "json_object" } },
          },
          id: "b2c3d4e5-0002",
          name: "Calificar Lead con IA",
          type: "@n8n/n8n-nodes-langchain.openAi",
          typeVersion: 1,
          position: [480, 300],
          credentials: { openAiApi: { id: "YOUR_OPENAI_CRED", name: "OpenAI" } },
        },
        {
          parameters: {
            operation: "append",
            documentId: { __rl: true, value: "YOUR_SHEET_ID", mode: "id" },
            sheetName: "Leads",
            columns: {
              mappingMode: "autoMapInputData",
              value: {
                nombre: "={{ $('Captura Lead (Webhook)').item.json.nombre }}",
                empresa: "={{ $('Captura Lead (Webhook)').item.json.empresa }}",
                score: "={{ JSON.parse($json.choices[0].message.content).score }}",
                categoria: "={{ JSON.parse($json.choices[0].message.content).categoria }}",
                fecha: "={{ $now.toISO() }}",
              },
            },
          },
          id: "b2c3d4e5-0003",
          name: "Registrar en Google Sheets",
          type: "n8n-nodes-base.googleSheets",
          typeVersion: 4,
          position: [720, 300],
          credentials: { googleSheetsOAuth2Api: { id: "YOUR_GSHEETS_CRED", name: "Google Sheets" } },
        },
      ],
      connections: {
        "Captura Lead (Webhook)": { main: [[{ node: "Calificar Lead con IA", type: "main", index: 0 }]] },
        "Calificar Lead con IA": { main: [[{ node: "Registrar en Google Sheets", type: "main", index: 0 }]] },
      },
      active: false,
      settings: { executionOrder: "v1" },
      versionId: "flujo-002-v1",
    },
  },
  {
    id: 3,
    title: "Notificación de Pedidos WooCommerce → WhatsApp",
    description:
      "Cuando llega un nuevo pedido en WooCommerce, notifica instantáneamente al dueño del negocio y al cliente por WhatsApp con los detalles del pedido.",
    category: "E-commerce",
    difficulty: "Básico",
    nodes: ["WooCommerce Trigger", "Set", "WhatsApp Message", "WhatsApp Message"],
    nodeCount: 5,
    downloads: 3291,
    stars: 4.9,
    tags: ["WooCommerce", "WhatsApp", "E-commerce", "Pedidos"],
    icon: ShoppingCart,
    color: "from-orange-500/20 to-amber-500/10",
    borderColor: "border-orange-500/30",
    badgeColor: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    iconBg: "bg-orange-500/15 text-orange-400",
    json: {
      name: "Notificación WooCommerce → WhatsApp",
      nodes: [
        {
          parameters: { event: "order.created" },
          id: "c3d4e5f6-0001",
          name: "Nuevo Pedido WooCommerce",
          type: "n8n-nodes-base.wooCommerceTrigger",
          typeVersion: 1,
          position: [240, 300],
          credentials: { wooCommerceApi: { id: "YOUR_WC_CRED", name: "WooCommerce" } },
        },
        {
          parameters: {
            values: {
              string: [
                { name: "cliente_wa", value: "={{ $json.billing.phone }}" },
                { name: "orden_id", value: "={{ $json.id }}" },
                { name: "total", value: "={{ $json.total }} {{ $json.currency }}" },
                {
                  name: "productos",
                  value: "={{ $json.line_items.map(i => i.name + ' x' + i.quantity).join(', ') }}",
                },
              ],
            },
          },
          id: "c3d4e5f6-0002",
          name: "Preparar Datos",
          type: "n8n-nodes-base.set",
          typeVersion: 3,
          position: [480, 300],
        },
        {
          parameters: {
            resource: "message",
            operation: "send",
            phoneNumberId: "={{ $env.WA_PHONE_ID }}",
            to: "={{ $env.OWNER_PHONE }}",
            textBody:
              "🛍️ *Nuevo Pedido #{{ $json.orden_id }}*\n\n👤 Cliente: {{ $('Nuevo Pedido WooCommerce').item.json.billing.first_name }} {{ $('Nuevo Pedido WooCommerce').item.json.billing.last_name }}\n📦 Productos: {{ $json.productos }}\n💰 Total: {{ $json.total }}\n\n¡Prepara el pedido!",
          },
          id: "c3d4e5f6-0003",
          name: "Notificar al Dueño",
          type: "n8n-nodes-base.whatsApp",
          typeVersion: 1,
          position: [720, 200],
          credentials: { whatsAppApi: { id: "YOUR_WA_CRED", name: "WhatsApp Business" } },
        },
        {
          parameters: {
            resource: "message",
            operation: "send",
            phoneNumberId: "={{ $env.WA_PHONE_ID }}",
            to: "={{ $json.cliente_wa }}",
            textBody:
              "✅ *¡Pedido confirmado!*\n\nHola {{ $('Nuevo Pedido WooCommerce').item.json.billing.first_name }}, recibimos tu pedido #{{ $json.orden_id }}.\n\n📦 {{ $json.productos }}\n💰 Total: {{ $json.total }}\n\nTe notificaremos cuando esté listo. ¡Gracias por tu compra! 🙏",
          },
          id: "c3d4e5f6-0004",
          name: "Confirmar al Cliente",
          type: "n8n-nodes-base.whatsApp",
          typeVersion: 1,
          position: [720, 400],
          credentials: { whatsAppApi: { id: "YOUR_WA_CRED", name: "WhatsApp Business" } },
        },
      ],
      connections: {
        "Nuevo Pedido WooCommerce": { main: [[{ node: "Preparar Datos", type: "main", index: 0 }]] },
        "Preparar Datos": {
          main: [
            [
              { node: "Notificar al Dueño", type: "main", index: 0 },
              { node: "Confirmar al Cliente", type: "main", index: 0 },
            ],
          ],
        },
      },
      active: false,
      settings: { executionOrder: "v1" },
      versionId: "flujo-003-v1",
    },
  },
  {
    id: 4,
    title: "Generador de Contenido para Redes Sociales",
    description:
      "Genera automáticamente posts, captions e ideas de contenido para Instagram, Facebook y LinkedIn usando IA. Programa para cada semana.",
    category: "IA",
    difficulty: "Intermedio",
    nodes: ["Schedule Trigger", "OpenAI", "Google Sheets", "Gmail", "Slack"],
    nodeCount: 7,
    downloads: 1567,
    stars: 4.7,
    tags: ["IA", "Redes Sociales", "Contenido", "Marketing"],
    icon: Sparkles,
    color: "from-purple-500/20 to-violet-500/10",
    borderColor: "border-purple-500/30",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    iconBg: "bg-purple-500/15 text-purple-400",
    json: {
      name: "Generador de Contenido para RRSS",
      nodes: [
        {
          parameters: { rule: { interval: [{ field: "weeks", weeksInterval: 1 }] } },
          id: "d4e5f6a7-0001",
          name: "Cada Lunes 8am",
          type: "n8n-nodes-base.scheduleTrigger",
          typeVersion: 1,
          position: [240, 300],
        },
        {
          parameters: {
            model: "gpt-4o",
            messages: {
              values: [
                {
                  role: "system",
                  content:
                    "Eres un experto en marketing digital para negocios latinoamericanos. Crea un plan de contenido semanal con 7 posts para Instagram, Facebook y LinkedIn. El negocio es: {{ $env.BUSINESS_NAME }}. Industria: {{ $env.BUSINESS_INDUSTRY }}. Devuelve JSON con array 'posts', cada uno con: dia, plataforma, caption, hashtags, tipo_contenido.",
                },
                { role: "user", content: "Genera el plan de contenido para esta semana." },
              ],
            },
            options: { responseFormat: { type: "json_object" }, temperature: 0.8 },
          },
          id: "d4e5f6a7-0002",
          name: "Generar Plan con GPT-4",
          type: "@n8n/n8n-nodes-langchain.openAi",
          typeVersion: 1,
          position: [480, 300],
          credentials: { openAiApi: { id: "YOUR_OPENAI_CRED", name: "OpenAI" } },
        },
        {
          parameters: {
            operation: "append",
            documentId: { __rl: true, value: "YOUR_SHEET_ID", mode: "id" },
            sheetName: "Contenido",
            columns: {
              mappingMode: "defineBelow",
              value: {
                semana: "={{ $now.toFormat('yyyy-WW') }}",
                posts_json: "={{ $json.choices[0].message.content }}",
                creado_en: "={{ $now.toISO() }}",
              },
            },
          },
          id: "d4e5f6a7-0003",
          name: "Guardar en Google Sheets",
          type: "n8n-nodes-base.googleSheets",
          typeVersion: 4,
          position: [720, 300],
          credentials: { googleSheetsOAuth2Api: { id: "YOUR_GSHEETS_CRED", name: "Google Sheets" } },
        },
      ],
      connections: {
        "Cada Lunes 8am": { main: [[{ node: "Generar Plan con GPT-4", type: "main", index: 0 }]] },
        "Generar Plan con GPT-4": { main: [[{ node: "Guardar en Google Sheets", type: "main", index: 0 }]] },
      },
      active: false,
      settings: { executionOrder: "v1" },
      versionId: "flujo-004-v1",
    },
  },
  {
    id: 5,
    title: "Reporte Diario de Ventas por WhatsApp",
    description:
      "Cada día a las 8pm consolida automáticamente las ventas del día desde Google Sheets o WooCommerce y envía un resumen visual por WhatsApp al equipo.",
    category: "Reportes",
    difficulty: "Básico",
    nodes: ["Schedule Trigger", "Google Sheets", "Code", "WhatsApp Message"],
    nodeCount: 5,
    downloads: 2873,
    stars: 4.8,
    tags: ["Reportes", "Ventas", "WhatsApp", "Google Sheets"],
    icon: BarChart3,
    color: "from-cyan-500/20 to-teal-500/10",
    borderColor: "border-cyan-500/30",
    badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    iconBg: "bg-cyan-500/15 text-cyan-400",
    json: {
      name: "Reporte Diario de Ventas → WhatsApp",
      nodes: [
        {
          parameters: {
            rule: { interval: [{ field: "hours", hoursInterval: 1, triggerAtHour: 20, triggerAtMinute: 0 }] },
          },
          id: "e5f6a7b8-0001",
          name: "Trigger 8pm Diario",
          type: "n8n-nodes-base.scheduleTrigger",
          typeVersion: 1,
          position: [240, 300],
        },
        {
          parameters: {
            operation: "read",
            documentId: { __rl: true, value: "YOUR_SHEET_ID", mode: "id" },
            sheetName: "Ventas",
            filtersUI: {
              values: [{ lookupColumn: "Fecha", lookupValue: "={{ $today.toFormat('yyyy-MM-dd') }}" }],
            },
          },
          id: "e5f6a7b8-0002",
          name: "Leer Ventas de Hoy",
          type: "n8n-nodes-base.googleSheets",
          typeVersion: 4,
          position: [480, 300],
          credentials: { googleSheetsOAuth2Api: { id: "YOUR_GSHEETS_CRED", name: "Google Sheets" } },
        },
        {
          parameters: {
            jsCode:
              "const ventas = items.map(i => i.json);\nconst total = ventas.reduce((acc, v) => acc + parseFloat(v.Monto || 0), 0);\nconst count = ventas.length;\nconst promedio = count > 0 ? (total / count).toFixed(2) : 0;\nconst maxVenta = ventas.reduce((max, v) => parseFloat(v.Monto) > parseFloat(max.Monto || 0) ? v : max, {});\nreturn [{ json: { total: total.toFixed(2), count, promedio, mejor_venta: maxVenta.Producto || 'N/A', mejor_monto: maxVenta.Monto || 0 } }];",
          },
          id: "e5f6a7b8-0003",
          name: "Calcular Métricas",
          type: "n8n-nodes-base.code",
          typeVersion: 2,
          position: [720, 300],
        },
        {
          parameters: {
            resource: "message",
            operation: "send",
            phoneNumberId: "={{ $env.WA_PHONE_ID }}",
            to: "={{ $env.OWNER_PHONE }}",
            textBody:
              "📊 *Reporte de Ventas — {{ $today.toFormat('dd/MM/yyyy') }}*\n\n💰 Total del Día: *RD${{ $json.total }}*\n🛍️ Ventas realizadas: *{{ $json.count }}*\n📈 Ticket promedio: *RD${{ $json.promedio }}*\n🏆 Mejor venta: *{{ $json.mejor_venta }}* (RD${{ $json.mejor_monto }})\n\n_Generado automáticamente por FlujoxAI_ 🤖",
          },
          id: "e5f6a7b8-0004",
          name: "Enviar Reporte",
          type: "n8n-nodes-base.whatsApp",
          typeVersion: 1,
          position: [960, 300],
          credentials: { whatsAppApi: { id: "YOUR_WA_CRED", name: "WhatsApp Business" } },
        },
      ],
      connections: {
        "Trigger 8pm Diario": { main: [[{ node: "Leer Ventas de Hoy", type: "main", index: 0 }]] },
        "Leer Ventas de Hoy": { main: [[{ node: "Calcular Métricas", type: "main", index: 0 }]] },
        "Calcular Métricas": { main: [[{ node: "Enviar Reporte", type: "main", index: 0 }]] },
      },
      active: false,
      settings: { executionOrder: "v1" },
      versionId: "flujo-005-v1",
    },
  },
  {
    id: 6,
    title: "Agente de Soporte con Base de Conocimiento",
    description:
      "Chatbot de soporte avanzado que busca respuestas en una base de conocimiento vectorial (Supabase) y responde con IA. Escala a humano si no encuentra respuesta.",
    category: "IA",
    difficulty: "Avanzado",
    nodes: ["WhatsApp Trigger", "Supabase", "OpenAI Embeddings", "OpenAI Chat", "IF", "WhatsApp"],
    nodeCount: 10,
    downloads: 987,
    stars: 4.9,
    tags: ["IA", "RAG", "Soporte", "Vectorial"],
    icon: Bot,
    color: "from-violet-500/20 to-purple-500/10",
    borderColor: "border-violet-500/30",
    badgeColor: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    iconBg: "bg-violet-500/15 text-violet-400",
    json: {
      name: "Agente de Soporte con RAG",
      nodes: [
        {
          parameters: { updates: ["messages"] },
          id: "f6a7b8c9-0001",
          name: "WhatsApp Trigger",
          type: "n8n-nodes-base.whatsAppTrigger",
          typeVersion: 1,
          position: [240, 300],
        },
        {
          parameters: {
            model: "text-embedding-3-small",
            input: "={{ $json.message.text.body }}",
          },
          id: "f6a7b8c9-0002",
          name: "Generar Embedding Pregunta",
          type: "@n8n/n8n-nodes-langchain.openAi",
          typeVersion: 1,
          position: [480, 300],
          credentials: { openAiApi: { id: "YOUR_OPENAI_CRED", name: "OpenAI" } },
        },
        {
          parameters: {
            operation: "executeQuery",
            query:
              "SELECT content, 1 - (embedding <=> '{{ $json.data[0].embedding }}') AS similarity FROM knowledge_base ORDER BY similarity DESC LIMIT 3;",
          },
          id: "f6a7b8c9-0003",
          name: "Buscar en Base de Conocimiento",
          type: "n8n-nodes-base.supabase",
          typeVersion: 1,
          position: [720, 300],
          credentials: { supabaseApi: { id: "YOUR_SUPABASE_CRED", name: "Supabase" } },
        },
        {
          parameters: {
            model: "gpt-4o-mini",
            messages: {
              values: [
                {
                  role: "system",
                  content:
                    "Eres un agente de soporte. Usa SOLO la siguiente información para responder:\n\n{{ $json.map(r => r.content).join('\\n\\n---\\n\\n') }}\n\nSi no puedes responder con esta información, responde exactamente: 'ESCALAR'",
                },
                { role: "user", content: "={{ $('WhatsApp Trigger').item.json.message.text.body }}" },
              ],
            },
          },
          id: "f6a7b8c9-0004",
          name: "Responder con Contexto",
          type: "@n8n/n8n-nodes-langchain.openAi",
          typeVersion: 1,
          position: [960, 300],
          credentials: { openAiApi: { id: "YOUR_OPENAI_CRED", name: "OpenAI" } },
        },
      ],
      connections: {
        "WhatsApp Trigger": { main: [[{ node: "Generar Embedding Pregunta", type: "main", index: 0 }]] },
        "Generar Embedding Pregunta": { main: [[{ node: "Buscar en Base de Conocimiento", type: "main", index: 0 }]] },
        "Buscar en Base de Conocimiento": { main: [[{ node: "Responder con Contexto", type: "main", index: 0 }]] },
      },
      active: false,
      settings: { executionOrder: "v1" },
      versionId: "flujo-006-v1",
    },
  },
  {
    id: 7,
    title: "Automatización de Facturas desde Google Sheets",
    description:
      "Genera facturas PDF automáticamente con los datos de un Google Sheet, las envía por correo al cliente y guarda una copia en Google Drive.",
    category: "Facturación",
    difficulty: "Intermedio",
    nodes: ["Google Sheets Trigger", "HTML Template", "PDF Generation", "Gmail", "Google Drive"],
    nodeCount: 6,
    downloads: 1432,
    stars: 4.6,
    tags: ["Facturas", "PDF", "Google Sheets", "Email"],
    icon: FileText,
    color: "from-yellow-500/20 to-amber-500/10",
    borderColor: "border-yellow-500/30",
    badgeColor: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    iconBg: "bg-yellow-500/15 text-yellow-400",
    json: {
      name: "Facturas Automáticas desde Google Sheets",
      nodes: [
        {
          parameters: {
            event: "rowAdded",
            documentId: { __rl: true, value: "YOUR_SHEET_ID", mode: "id" },
            sheetName: "Facturas",
          },
          id: "g7h8i9j0-0001",
          name: "Nueva Fila en Facturas",
          type: "n8n-nodes-base.googleSheetsTrigger",
          typeVersion: 1,
          position: [240, 300],
          credentials: { googleSheetsOAuth2Api: { id: "YOUR_GSHEETS_CRED", name: "Google Sheets" } },
        },
        {
          parameters: {
            html: "<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;margin:40px;color:#333} .header{display:flex;justify-content:space-between;border-bottom:2px solid #6366f1;padding-bottom:20px} .title{color:#6366f1;font-size:28px;font-weight:bold} table{width:100%;border-collapse:collapse;margin:20px 0} th{background:#6366f1;color:white;padding:10px} td{padding:10px;border-bottom:1px solid #eee} .total{font-size:20px;font-weight:bold;text-align:right;color:#6366f1}</style></head><body><div class='header'><div><div class='title'>FACTURA</div><div>N° {{ $json['Numero'] }}</div></div><div><div>Fecha: {{ $json['Fecha'] }}</div></div></div><h3>Cliente: {{ $json['Cliente'] }}</h3><p>Email: {{ $json['Email'] }}</p><table><tr><th>Descripción</th><th>Cantidad</th><th>Precio Unit.</th><th>Total</th></tr><tr><td>{{ $json['Servicio'] }}</td><td>{{ $json['Cantidad'] }}</td><td>RD${{ $json['Precio'] }}</td><td>RD${{ $json['Total'] }}</td></tr></table><div class='total'>TOTAL: RD${{ $json['Total'] }}</div></body></html>",
          },
          id: "g7h8i9j0-0002",
          name: "Generar HTML Factura",
          type: "n8n-nodes-base.html",
          typeVersion: 1,
          position: [480, 300],
        },
        {
          parameters: {
            sendTo: "={{ $('Nueva Fila en Facturas').item.json['Email'] }}",
            subject: "Factura N° {{ $('Nueva Fila en Facturas').item.json['Numero'] }} — FlujoxAI",
            message: "Hola {{ $('Nueva Fila en Facturas').item.json['Cliente'] }},\n\nAdjuntamos tu factura N° {{ $('Nueva Fila en Facturas').item.json['Numero'] }} por un valor de RD${{ $('Nueva Fila en Facturas').item.json['Total'] }}.\n\nGracias por tu preferencia.\n\nEquipo FlujoxAI",
          },
          id: "g7h8i9j0-0003",
          name: "Enviar por Gmail",
          type: "n8n-nodes-base.gmail",
          typeVersion: 2,
          position: [720, 300],
          credentials: { gmailOAuth2: { id: "YOUR_GMAIL_CRED", name: "Gmail" } },
        },
      ],
      connections: {
        "Nueva Fila en Facturas": { main: [[{ node: "Generar HTML Factura", type: "main", index: 0 }]] },
        "Generar HTML Factura": { main: [[{ node: "Enviar por Gmail", type: "main", index: 0 }]] },
      },
      active: false,
      settings: { executionOrder: "v1" },
      versionId: "flujo-007-v1",
    },
  },
  {
    id: 8,
    title: "Captura de Mensajes Instagram → CRM",
    description:
      "Captura automáticamente los mensajes directos de Instagram, extrae datos del lead con IA y los registra en tu CRM o Google Sheets.",
    category: "CRM",
    difficulty: "Intermedio",
    nodes: ["Instagram Trigger", "OpenAI", "HubSpot / Google Sheets", "WhatsApp Follow-up"],
    nodeCount: 6,
    downloads: 1123,
    stars: 4.7,
    tags: ["Instagram", "CRM", "Leads", "Social Media"],
    icon: Instagram,
    color: "from-pink-500/20 to-rose-500/10",
    borderColor: "border-pink-500/30",
    badgeColor: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    iconBg: "bg-pink-500/15 text-pink-400",
    json: {
      name: "Instagram DM → CRM con IA",
      nodes: [
        {
          parameters: { updates: ["messages"] },
          id: "h8i9j0k1-0001",
          name: "Instagram DM Trigger",
          type: "n8n-nodes-base.instagramTrigger",
          typeVersion: 1,
          position: [240, 300],
          credentials: { instagramApi: { id: "YOUR_IG_CRED", name: "Instagram" } },
        },
        {
          parameters: {
            model: "gpt-4o-mini",
            messages: {
              values: [
                {
                  role: "system",
                  content:
                    "Analiza el mensaje de Instagram y extrae información del lead. Devuelve JSON con: intencion (compra/consulta/soporte/otro), producto_interes (string o null), urgencia (alta/media/baja), resumen (max 50 chars).",
                },
                { role: "user", content: "={{ $json.message.text }}" },
              ],
            },
            options: { responseFormat: { type: "json_object" } },
          },
          id: "h8i9j0k1-0002",
          name: "Analizar Intención con IA",
          type: "@n8n/n8n-nodes-langchain.openAi",
          typeVersion: 1,
          position: [480, 300],
          credentials: { openAiApi: { id: "YOUR_OPENAI_CRED", name: "OpenAI" } },
        },
        {
          parameters: {
            operation: "append",
            documentId: { __rl: true, value: "YOUR_SHEET_ID", mode: "id" },
            sheetName: "Leads Instagram",
            columns: {
              mappingMode: "defineBelow",
              value: {
                usuario_ig: "={{ $('Instagram DM Trigger').item.json.from.username }}",
                mensaje: "={{ $('Instagram DM Trigger').item.json.message.text }}",
                intencion: "={{ JSON.parse($json.choices[0].message.content).intencion }}",
                urgencia: "={{ JSON.parse($json.choices[0].message.content).urgencia }}",
                fecha: "={{ $now.toISO() }}",
                origen: "Instagram DM",
              },
            },
          },
          id: "h8i9j0k1-0003",
          name: "Registrar en CRM",
          type: "n8n-nodes-base.googleSheets",
          typeVersion: 4,
          position: [720, 300],
          credentials: { googleSheetsOAuth2Api: { id: "YOUR_GSHEETS_CRED", name: "Google Sheets" } },
        },
      ],
      connections: {
        "Instagram DM Trigger": { main: [[{ node: "Analizar Intención con IA", type: "main", index: 0 }]] },
        "Analizar Intención con IA": { main: [[{ node: "Registrar en CRM", type: "main", index: 0 }]] },
      },
      active: false,
      settings: { executionOrder: "v1" },
      versionId: "flujo-008-v1",
    },
  },
  {
    id: 9,
    title: "Recordatorio de Citas por WhatsApp",
    description:
      "Lee los eventos de Google Calendar y envía recordatorios automáticos por WhatsApp a los clientes 24 horas y 1 hora antes de su cita.",
    category: "WhatsApp",
    difficulty: "Básico",
    nodes: ["Schedule Trigger", "Google Calendar", "Filter", "WhatsApp Message"],
    nodeCount: 5,
    downloads: 2640,
    stars: 4.8,
    tags: ["Citas", "WhatsApp", "Google Calendar", "Recordatorios"],
    icon: Bell,
    color: "from-teal-500/20 to-cyan-500/10",
    borderColor: "border-teal-500/30",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    iconBg: "bg-teal-500/15 text-teal-400",
    json: {
      name: "Recordatorio de Citas → WhatsApp",
      nodes: [
        {
          parameters: { rule: { interval: [{ field: "hours", hoursInterval: 1 }] } },
          id: "i9j0k1l2-0001",
          name: "Revisar Cada Hora",
          type: "n8n-nodes-base.scheduleTrigger",
          typeVersion: 1,
          position: [240, 300],
        },
        {
          parameters: {
            operation: "getAll",
            calendarId: { __rl: true, value: "primary", mode: "list" },
            timeMin: "={{ $now.toISO() }}",
            timeMax: "={{ $now.plus({ hours: 25 }).toISO() }}",
            singleEvents: true,
            orderBy: "startTime",
          },
          id: "i9j0k1l2-0002",
          name: "Obtener Eventos Próximos",
          type: "n8n-nodes-base.googleCalendar",
          typeVersion: 1,
          position: [480, 300],
          credentials: { googleCalendarOAuth2Api: { id: "YOUR_GCAL_CRED", name: "Google Calendar" } },
        },
        {
          parameters: {
            conditions: {
              string: [{ value1: "={{ $json.description }}", operation: "contains", value2: "WA:" }],
            },
          },
          id: "i9j0k1l2-0003",
          name: "Tiene Teléfono en Descripción?",
          type: "n8n-nodes-base.if",
          typeVersion: 1,
          position: [720, 300],
        },
        {
          parameters: {
            resource: "message",
            operation: "send",
            phoneNumberId: "={{ $env.WA_PHONE_ID }}",
            to: "={{ $json.description.match(/WA:(\\+?[\\d]+)/)[1] }}",
            textBody:
              "⏰ *Recordatorio de Cita*\n\nHola, te recordamos tu cita:\n\n📅 *{{ $json.summary }}*\n🕐 Fecha: {{ DateTime.fromISO($json.start.dateTime).toFormat('dd/MM/yyyy HH:mm') }}\n📍 {{ $json.location || 'Ver detalles en tu confirmación' }}\n\n¿Necesitas reagendar? Responde este mensaje 📲",
          },
          id: "i9j0k1l2-0004",
          name: "Enviar Recordatorio",
          type: "n8n-nodes-base.whatsApp",
          typeVersion: 1,
          position: [960, 300],
          credentials: { whatsAppApi: { id: "YOUR_WA_CRED", name: "WhatsApp Business" } },
        },
      ],
      connections: {
        "Revisar Cada Hora": { main: [[{ node: "Obtener Eventos Próximos", type: "main", index: 0 }]] },
        "Obtener Eventos Próximos": { main: [[{ node: "Tiene Teléfono en Descripción?", type: "main", index: 0 }]] },
        "Tiene Teléfono en Descripción?": { main: [[{ node: "Enviar Recordatorio", type: "main", index: 0 }]] },
      },
      active: false,
      settings: { executionOrder: "v1" },
      versionId: "flujo-009-v1",
    },
  },
  {
    id: 10,
    title: "Sync Emails de Clientes → Notion CRM",
    description:
      "Monitorea tu bandeja de entrada, clasifica los emails de clientes con IA y los registra automáticamente en tu base de datos de Notion como seguimiento.",
    category: "CRM",
    difficulty: "Intermedio",
    nodes: ["Gmail Trigger", "OpenAI", "IF", "Notion", "Gmail Reply"],
    nodeCount: 7,
    downloads: 876,
    stars: 4.6,
    tags: ["Email", "Notion", "CRM", "IA"],
    icon: Mail,
    color: "from-indigo-500/20 to-blue-500/10",
    borderColor: "border-indigo-500/30",
    badgeColor: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    iconBg: "bg-indigo-500/15 text-indigo-400",
    json: {
      name: "Emails de Clientes → Notion CRM",
      nodes: [
        {
          parameters: { filters: { labelIds: ["INBOX"], q: "is:unread" }, simplify: true },
          id: "j0k1l2m3-0001",
          name: "Nuevo Email en Bandeja",
          type: "n8n-nodes-base.gmailTrigger",
          typeVersion: 1,
          position: [240, 300],
          credentials: { gmailOAuth2: { id: "YOUR_GMAIL_CRED", name: "Gmail" } },
        },
        {
          parameters: {
            model: "gpt-4o-mini",
            messages: {
              values: [
                {
                  role: "system",
                  content:
                    "Analiza este email y devuelve JSON con: tipo (consulta/queja/pago/otro), prioridad (alta/media/baja), resumen (max 100 chars), requiere_respuesta (boolean), sentiment (positivo/neutro/negativo).",
                },
                {
                  role: "user",
                  content: "Asunto: {{ $json.subject }}\n\nCuerpo: {{ $json.text.substring(0, 1000) }}",
                },
              ],
              options: { responseFormat: { type: "json_object" } },
            },
          },
          id: "j0k1l2m3-0002",
          name: "Clasificar Email con IA",
          type: "@n8n/n8n-nodes-langchain.openAi",
          typeVersion: 1,
          position: [480, 300],
          credentials: { openAiApi: { id: "YOUR_OPENAI_CRED", name: "OpenAI" } },
        },
        {
          parameters: {
            databaseId: { __rl: true, value: "YOUR_NOTION_DB_ID", mode: "id" },
            title: "={{ $('Nuevo Email en Bandeja').item.json.subject }}",
            propertiesUi: {
              propertyValues: [
                { key: "Remitente", textValue: "={{ $('Nuevo Email en Bandeja').item.json.from.value[0].address }}" },
                { key: "Tipo", selectValue: "={{ JSON.parse($json.choices[0].message.content).tipo }}" },
                { key: "Prioridad", selectValue: "={{ JSON.parse($json.choices[0].message.content).prioridad }}" },
                { key: "Resumen", textValue: "={{ JSON.parse($json.choices[0].message.content).resumen }}" },
                { key: "Fecha", dateValue: "={{ $now.toISO() }}" },
              ],
            },
          },
          id: "j0k1l2m3-0003",
          name: "Crear Registro en Notion",
          type: "n8n-nodes-base.notion",
          typeVersion: 2,
          position: [720, 300],
          credentials: { notionApi: { id: "YOUR_NOTION_CRED", name: "Notion" } },
        },
      ],
      connections: {
        "Nuevo Email en Bandeja": { main: [[{ node: "Clasificar Email con IA", type: "main", index: 0 }]] },
        "Clasificar Email con IA": { main: [[{ node: "Crear Registro en Notion", type: "main", index: 0 }]] },
      },
      active: false,
      settings: { executionOrder: "v1" },
      versionId: "flujo-010-v1",
    },
  },
];

const categories = ["Todos", "WhatsApp", "CRM", "IA", "E-commerce", "Reportes", "Facturación"];
const difficulties = ["Todos", "Básico", "Intermedio", "Avanzado"];

/* ─────────────────────────────────────────
   TOAST COMPONENT
──────────────────────────────────────────── */
function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-2xl shadow-emerald-500/30"
        >
          <Check className="h-4 w-4" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   TEMPLATE CARD
──────────────────────────────────────────── */
function TemplateCard({
  template,
  onCopy,
  onDownload,
}: {
  template: (typeof templates)[0];
  onCopy: (t: (typeof templates)[0]) => void;
  onDownload: (t: (typeof templates)[0]) => void;
}) {
  const Icon = template.icon;
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleCopy = () => {
    onCopy(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    onDownload(template);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`group relative rounded-2xl border ${template.borderColor} bg-card/60 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col`}
    >
      {/* Gradient overlay top */}
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${template.color.replace('/20', '/60').replace('/10', '/40')}`} />

      {/* Header */}
      <div className={`p-5 bg-gradient-to-br ${template.color}`}>
        <div className="flex items-start justify-between mb-3">
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${template.iconBg} ring-1 ring-white/10`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${template.badgeColor}`}>
              {template.category}
            </span>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
              {template.difficulty}
            </span>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground leading-tight mb-1.5 group-hover:text-primary transition-colors">
          {template.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {template.description}
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 px-5 py-3 border-y border-border/40 bg-muted/20">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold text-foreground">{template.nodeCount}</span> nodos
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Download className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold text-foreground">{template.downloads.toLocaleString()}</span> descargas
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-foreground">{template.stars}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="px-5 py-3 flex flex-wrap gap-1.5">
        {template.tags.map((tag) => (
          <span key={tag} className="text-[11px] px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/40">
            #{tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="px-5 pb-5 mt-auto flex items-center gap-2.5">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-xl text-xs font-bold transition-all duration-200 border ${
            copied
              ? "bg-emerald-500 text-white border-emerald-500"
              : "bg-muted/50 hover:bg-muted text-foreground border-border/50 hover:border-border"
          }`}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "¡Copiado!" : "Copiar JSON"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-xl text-xs font-bold transition-all duration-200 border ${
            downloaded
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-primary text-primary-foreground border-transparent hover:bg-primary/90"
          }`}
        >
          {downloaded ? <Check className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
          {downloaded ? "¡Descargado!" : "Descargar .json"}
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
──────────────────────────────────────────── */
export default function RecursosPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeDifficulty, setActiveDifficulty] = useState("Todos");
  const [toast, setToast] = useState({ show: false, message: "" });

  const showToast = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 2500);
  };

  const handleCopy = (template: (typeof templates)[0]) => {
    navigator.clipboard.writeText(JSON.stringify(template.json, null, 2));
    showToast(`¡JSON de "${template.title}" copiado!`);
  };

  const handleDownload = (template: (typeof templates)[0]) => {
    const blob = new Blob([JSON.stringify(template.json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}-n8n.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`¡Descargando "${template.title}"!`);
  };

  const filtered = templates.filter((t) => {
    const matchSearch =
      search === "" ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === "Todos" || t.category === activeCategory;
    const matchDiff = activeDifficulty === "Todos" || t.difficulty === activeDifficulty;
    return matchSearch && matchCat && matchDiff;
  });

  const totalDownloads = templates.reduce((acc, t) => acc + t.downloads, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toast message={toast.message} show={toast.show} />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 hero-grid opacity-30 pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[300px] h-[200px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6"
          >
            <Package className="h-4 w-4" />
            Recursos Gratuitos · FlujoxAI
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 leading-tight"
          >
            Plantillas{" "}
            <span className="gradient-text">n8n</span>
            <br />
            listas para usar
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Workflows de automatización curados por el equipo de FlujoxAI. Importa, adapta
            y empieza a automatizar tu negocio en minutos. <strong className="text-foreground">100% gratis.</strong>
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-8 text-sm"
          >
            {[
              { value: templates.length, label: "Plantillas", suffix: "" },
              { value: totalDownloads.toLocaleString(), label: "Descargas", suffix: "+" },
              { value: categories.length - 1, label: "Categorías", suffix: "" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-foreground">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-muted-foreground text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FILTERS ── */}
      <section className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 py-4 px-4">
        <div className="max-w-6xl mx-auto space-y-3">
          {/* Search */}
          <div className="relative max-w-md mx-auto md:mx-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar plantillas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-full bg-muted/50 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveCategory(cat)}
                className={`h-8 px-4 rounded-full text-xs font-bold transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                    : "bg-muted/50 text-muted-foreground border-border/50 hover:text-foreground hover:border-border"
                }`}
              >
                {cat}
              </motion.button>
            ))}
            <div className="w-px h-8 bg-border/40 mx-1" />
            {difficulties.map((diff) => (
              <motion.button
                key={diff}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveDifficulty(diff)}
                className={`h-8 px-4 rounded-full text-xs font-bold transition-all duration-200 border ${
                  activeDifficulty === diff
                    ? "bg-violet-500 text-white border-violet-500 shadow-lg shadow-violet-500/20"
                    : "bg-muted/50 text-muted-foreground border-border/50 hover:text-foreground hover:border-border"
                }`}
              >
                {diff}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> plantillas encontradas
            </p>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Volver al inicio
            </Link>
          </div>

          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 text-muted-foreground"
            >
              <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-semibold">No se encontraron plantillas</p>
              <p className="text-sm mt-1">Intenta con otra búsqueda o categoría</p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onCopy={handleCopy}
                    onDownload={handleDownload}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-primary/20 p-8 md:p-12 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-5">
                <Sparkles className="h-4 w-4" />
                ¿Necesitas algo más complejo?
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
                Creamos tu workflow
                <br />
                <span className="gradient-text">completamente a medida</span>
              </h2>
              <p className="text-muted-foreground mb-7 max-w-xl mx-auto">
                Estas plantillas son el punto de partida. Si necesitas una automatización
                personalizada para tu negocio, nuestro equipo te construye exactamente lo que necesitas.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/cotizador"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  <ChevronRight className="h-4 w-4" />
                  Cotizar mi automatización
                </Link>
                <a
                  href="https://wa.me/18492597719?text=Hola%2C%20me%20interesa%20una%20automatizaci%C3%B3n%20con%20n8n%20personalizada%20%F0%9F%A4%96"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 font-bold text-sm transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                  Hablar por WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
