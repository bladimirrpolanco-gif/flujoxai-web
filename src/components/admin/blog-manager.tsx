"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import {
  Plus, Edit2, Trash2, Eye, EyeOff, Save, X, Search,
  FileText, Calendar, CheckCircle, Clock, AlertCircle, ExternalLink
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  seo_keywords: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogManagerProps {
  initialPosts: Post[];
}

const EMPTY_FORM = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  seo_keywords: '',
  published_at: '',
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function BlogManager({ initialPosts }: BlogManagerProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Cuando cambia el título, generar slug automáticamente (solo en artículo nuevo)
  useEffect(() => {
    if (!editingPost && form.title) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, editingPost]);

  const openNew = () => {
    setEditingPost(null);
    setForm(EMPTY_FORM);
    setPreviewMode(false);
    setView('editor');
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt ?? '',
      seo_keywords: post.seo_keywords ?? '',
      published_at: post.published_at
        ? new Date(post.published_at).toISOString().slice(0, 16)
        : '',
    });
    setPreviewMode(false);
    setView('editor');
  };

  const handleSave = async (asDraft = false) => {
    if (!form.title.trim() || !form.slug.trim() || !form.content.trim()) {
      setSaveMsg({ type: 'err', text: 'Título, slug y contenido son obligatorios.' });
      return;
    }

    setSaving(true);
    setSaveMsg(null);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      content: form.content.trim(),
      excerpt: form.excerpt.trim(),
      seo_keywords: form.seo_keywords.trim(),
      published_at: asDraft
        ? null
        : (form.published_at ? new Date(form.published_at).toISOString() : new Date().toISOString()),
    };

    let error;
    let data: Post[] | null = null;

    if (editingPost) {
      const res = await supabase
        .from('posts')
        .update(payload)
        .eq('id', editingPost.id)
        .select();
      error = res.error;
      data = res.data;
    } else {
      const res = await supabase
        .from('posts')
        .insert(payload)
        .select();
      error = res.error;
      data = res.data;
    }

    setSaving(false);

    if (error) {
      setSaveMsg({ type: 'err', text: error.message });
      return;
    }

    setSaveMsg({ type: 'ok', text: asDraft ? 'Guardado como borrador.' : '¡Artículo publicado!' });

    // Actualizar lista local
    if (data && data.length > 0) {
      const saved = data[0];
      if (editingPost) {
        setPosts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      } else {
        setPosts((prev) => [saved, ...prev]);
      }
      setEditingPost(saved);
    }

    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este artículo? Esta acción no se puede deshacer.')) return;
    setDeleting(id);
    await supabase.from('posts').delete().eq('id', id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
    if (editingPost?.id === id) {
      setView('list');
      setEditingPost(null);
    }
  };

  const isPublished = (post: Post) =>
    post.published_at !== null && new Date(post.published_at) <= new Date();

  const filtered = posts.filter((p) =>
    [p.title, p.slug, p.excerpt].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  // ─── LIST VIEW ───────────────────────────────────────────────
  if (view === 'list') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Artículos del Blog</h2>
            <p className="text-zinc-400 text-sm mt-0.5">{posts.length} artículo(s) en total</p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Nuevo Artículo
          </button>
        </div>

        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Lista */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">{search ? 'Sin resultados' : 'No hay artículos todavía'}</p>
            {!search && (
              <button onClick={openNew} className="mt-4 text-blue-500 hover:text-blue-400 text-sm font-semibold">
                + Crear el primer artículo
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => {
              const published = isPublished(post);
              return (
                <div
                  key={post.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-zinc-700 transition-all"
                >
                  {/* Estado */}
                  <div className="flex-shrink-0">
                    {published ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Publicado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full">
                        <Clock className="w-3 h-3" /> Borrador
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm leading-snug line-clamp-1">{post.title}</p>
                    <p className="text-zinc-500 text-xs mt-1 font-mono">/blog/{post.slug}</p>
                    {post.excerpt && (
                      <p className="text-zinc-400 text-xs mt-1 line-clamp-1">{post.excerpt}</p>
                    )}
                  </div>

                  {/* Fecha */}
                  <div className="hidden md:flex items-center gap-1 text-xs text-zinc-500 flex-shrink-0">
                    <Calendar className="w-3 h-3" />
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'Sin fecha'}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {published && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                        title="Ver en el blog"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => openEdit(post)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting === post.id}
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ─── EDITOR VIEW ─────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header del editor */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => setView('list')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium transition"
        >
          <X className="w-4 h-4" /> Volver a la lista
        </button>

        <div className="flex items-center gap-2">
          {/* Toggle preview */}
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition ${
              previewMode
                ? 'bg-zinc-700 border-zinc-600 text-white'
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
            }`}
          >
            {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {previewMode ? 'Editar' : 'Vista previa'}
          </button>

          {/* Guardar borrador */}
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition disabled:opacity-50"
          >
            <Clock className="w-4 h-4" />
            Borrador
          </button>

          {/* Publicar */}
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando…' : (editingPost?.published_at ? 'Actualizar' : 'Publicar')}
          </button>
        </div>
      </div>

      {/* Mensaje de estado */}
      {saveMsg && (
        <div className={`flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl ${
          saveMsg.type === 'ok'
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {saveMsg.type === 'ok' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {saveMsg.text}
        </div>
      )}

      {previewMode ? (
        /* ── VISTA PREVIA ── */
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <p className="text-[11px] font-bold text-blue-500 uppercase tracking-widest mb-3">Vista Previa</p>
          <h1 className="text-3xl font-bold text-white mb-4 leading-snug">{form.title || 'Sin título'}</h1>
          {form.excerpt && <p className="text-zinc-400 text-base mb-6 italic">{form.excerpt}</p>}
          <div
            className="prose prose-invert prose-sm max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-zinc-300 prose-a:text-blue-400"
            dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-zinc-500">El contenido aparecerá aquí…</p>' }}
          />
        </div>
      ) : (
        /* ── FORMULARIO ── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-4">

            {/* Título */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Título *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="El título de tu artículo..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-lg font-semibold placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Slug (URL) *
              </label>
              <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600">
                <span className="px-4 text-zinc-600 text-sm font-mono flex-shrink-0">/blog/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                  placeholder="nombre-del-articulo"
                  className="flex-1 bg-transparent py-3 pr-4 text-blue-400 font-mono text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Resumen */}
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Resumen / Excerpt
              </label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="Una o dos frases que resumen el artículo (aparece en las tarjetas del blog y en Google)..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              />
            </div>

            {/* Contenido HTML */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Contenido (HTML) *
                </label>
                <span className="text-[11px] text-zinc-600">Usa &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt;...</span>
              </div>
              <textarea
                rows={18}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                placeholder={`<h2>Título de sección</h2>\n<p>Tu párrafo aquí...</p>\n\n<h3>Subtítulo</h3>\n<p>Más contenido...</p>\n\n<ul>\n  <li>Punto 1</li>\n  <li>Punto 2</li>\n</ul>`}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-green-400 font-mono text-sm placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-y"
              />
            </div>
          </div>

          {/* Columna lateral */}
          <div className="space-y-4">

            {/* Publicación */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">📅 Publicación</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Fecha y hora</label>
                  <input
                    type="datetime-local"
                    value={form.published_at}
                    onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-[11px] text-zinc-600 mt-1.5">Vacío = borrador. Con fecha = publicado.</p>
                </div>

                {/* Estado visual */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                  form.published_at
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}>
                  {form.published_at ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  {form.published_at ? 'Se publicará en la fecha indicada' : 'Se guardará como borrador'}
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">🔍 SEO</h3>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Palabras clave</label>
                <textarea
                  rows={3}
                  value={form.seo_keywords}
                  onChange={(e) => setForm((f) => ({ ...f, seo_keywords: e.target.value }))}
                  placeholder="automatización, IA, chatbots, RD..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
                <p className="text-[11px] text-zinc-600 mt-1.5">Separadas por coma. Ayudan a posicionar en Google.</p>
              </div>
            </div>

            {/* Guía rápida */}
            <div className="bg-blue-600/10 border border-blue-600/20 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-blue-400 mb-3">💡 HTML rápido</h3>
              <div className="space-y-1.5 text-xs font-mono text-zinc-400">
                <p>&lt;h2&gt;Sección&lt;/h2&gt;</p>
                <p>&lt;h3&gt;Subtítulo&lt;/h3&gt;</p>
                <p>&lt;p&gt;Párrafo&lt;/p&gt;</p>
                <p>&lt;strong&gt;Negrita&lt;/strong&gt;</p>
                <p>&lt;em&gt;Cursiva&lt;/em&gt;</p>
                <p>&lt;ul&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/ul&gt;</p>
                <p>&lt;ol&gt;&lt;li&gt;Paso&lt;/li&gt;&lt;/ol&gt;</p>
                <p>&lt;blockquote&gt;Cita&lt;/blockquote&gt;</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
