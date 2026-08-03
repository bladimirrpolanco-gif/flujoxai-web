"use client";

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Plus, Edit2, Trash2, Save, X, Search, FileJson, Loader2, Link as LinkIcon, Star, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[];
  icon: string;
  json_content: string;
  created_at: string;
}

interface TemplatesManagerProps {
  initialTemplates: Template[];
}

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'WhatsApp',
  difficulty: 'Intermedio',
  tags: '',
  icon: 'Workflow',
  json_content: '',
};

const ICONS = ['Workflow', 'MessageSquare', 'Mail', 'Zap', 'Database', 'ShoppingCart', 'BarChart3', 'Instagram', 'FileText', 'Sparkles'];
const CATEGORIES = ['WhatsApp', 'IA', 'Email', 'Social Media', 'E-commerce', 'Contenido', 'Otro'];
const DIFFICULTIES = ['Básico', 'Intermedio', 'Avanzado'];

export function TemplatesManager({ initialTemplates }: TemplatesManagerProps) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const openNew = () => {
    setEditingTemplate(null);
    setForm(EMPTY_FORM);
    setSaveMsg(null);
    setView('editor');
  };

  const openEdit = (template: Template) => {
    setEditingTemplate(template);
    setForm({
      title: template.title,
      description: template.description,
      category: template.category,
      difficulty: template.difficulty,
      tags: template.tags ? template.tags.join(', ') : '',
      icon: template.icon,
      json_content: template.json_content,
    });
    setSaveMsg(null);
    setView('editor');
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.json_content.trim()) {
      setSaveMsg({ type: 'err', text: 'Título, descripción y JSON son obligatorios.' });
      return;
    }

    // Validar JSON
    try {
      JSON.parse(form.json_content);
    } catch (e) {
      setSaveMsg({ type: 'err', text: 'El JSON no es válido. Revisa que sea un JSON bien formateado.' });
      return;
    }

    setSaving(true);
    setSaveMsg(null);

    const tagsArray = form.tags.split(',').map(t => t.trim()).filter(t => t !== '');

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      difficulty: form.difficulty,
      tags: tagsArray,
      icon: form.icon,
      json_content: form.json_content,
    };

    let error;
    let data: Template[] | null = null;

    if (editingTemplate) {
      const res = await supabase
        .from('custom_templates')
        .update(payload)
        .eq('id', editingTemplate.id)
        .select();
      error = res.error;
      data = res.data;
    } else {
      const res = await supabase
        .from('custom_templates')
        .insert(payload)
        .select();
      error = res.error;
      data = res.data;
    }

    setSaving(false);

    if (error) {
      setSaveMsg({ type: 'err', text: `Error al guardar: ${error.message}` });
      return;
    }

    if (data && data[0]) {
      setSaveMsg({ type: 'ok', text: '¡Plantilla guardada con éxito!' });
      if (editingTemplate) {
        setTemplates(templates.map(t => t.id === editingTemplate.id ? data![0] : t));
      } else {
        setTemplates([data[0], ...templates]);
      }
      setTimeout(() => {
        setView('list');
      }, 1500);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta plantilla? Esto no se puede deshacer.')) return;
    setDeleting(id);
    const { error } = await supabase.from('custom_templates').delete().eq('id', id);
    setDeleting(null);
    if (!error) {
      setTemplates(templates.filter(t => t.id !== id));
    } else {
      alert(`Error al eliminar: ${error.message}`);
    }
  };

  const filtered = templates.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  if (view === 'editor') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold">{editingTemplate ? 'Editar Plantilla' : 'Nueva Plantilla'}</h2>
            <p className="text-zinc-400 text-sm mt-1">Sube un workflow de n8n para mostrarlo en Recursos</p>
          </div>
          <button
            onClick={() => setView('list')}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400"
            title="Cerrar editor"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {saveMsg && (
          <div className={`p-4 rounded-xl flex items-center gap-2 ${
            saveMsg.type === 'ok' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {saveMsg.type === 'ok' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            {saveMsg.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">Título</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
                placeholder="Ej. Mi Chatbot de WhatsApp"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">Descripción Corta</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm h-24 focus:outline-none focus:border-cyan-500 resize-none"
                placeholder="Breve descripción de lo que hace este workflow..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-300">Categoría</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-300">Dificultad</label>
                <select
                  value={form.difficulty}
                  onChange={e => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
                >
                  {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-300">Ícono</label>
                <select
                  value={form.icon}
                  onChange={e => setForm({ ...form, icon: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
                >
                  {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-zinc-300">Etiquetas (separadas por coma)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
                  placeholder="IA, OpenAI, Ventas"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 flex flex-col">
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium mb-1 text-zinc-300">Contenido JSON (n8n)</label>
              <textarea
                value={form.json_content}
                onChange={e => setForm({ ...form, json_content: e.target.value })}
                className="w-full flex-1 bg-zinc-950 font-mono text-xs border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:border-cyan-500 min-h-[300px]"
                placeholder='Pega aquí el código JSON de tu workflow. Ej: {"nodes": [...], "connections": {...}}'
                spellCheck={false}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar Plantilla
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold">Plantillas Propias</h2>
          <p className="text-zinc-400 text-sm mt-1">Gestiona las plantillas customizadas que aparecerán en Recursos</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
        >
          <Plus className="h-4 w-4" />
          Nueva Plantilla
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar por título o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl bg-zinc-900/50"
            >
              <FileJson className="h-8 w-8 mx-auto mb-3 text-zinc-600" />
              <p className="text-zinc-400 font-medium">No hay plantillas guardadas</p>
            </motion.div>
          ) : (
            filtered.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-900 border border-white/10 rounded-xl p-5 hover:border-cyan-500/50 transition-colors group flex flex-col"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                      {t.category}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
                      {t.difficulty}
                    </span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(t)}
                      className="p-1.5 bg-zinc-800 hover:bg-cyan-600 rounded text-zinc-400 hover:text-white transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={deleting === t.id}
                      className="p-1.5 bg-zinc-800 hover:bg-red-600 rounded text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
                      title="Eliminar"
                    >
                      {deleting === t.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                
                <h3 className="font-bold text-white mb-2 line-clamp-1">{t.title}</h3>
                <p className="text-xs text-zinc-400 line-clamp-2 flex-1">{t.description}</p>
                
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{new Date(t.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1">
                    <FileJson className="h-3 w-3" />
                    {(t.json_content.length / 1024).toFixed(1)} kb
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
