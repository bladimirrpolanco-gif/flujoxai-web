'use client';

import { useState } from 'react';
import { createComment } from '@/actions/comments';
import { MessageSquare, Send } from 'lucide-react';

export function CommentForm({ postSlug }: { postSlug: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError('');
    
    formData.append('post_slug', postSlug);
    
    try {
      const result = await createComment(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        // El formulario se resetea automáticamente si usamos form action o podemos dejarlo así
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al enviar tu comentario.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="bg-primary/10 border border-primary/20 text-primary p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3">
        <MessageSquare className="w-8 h-8 opacity-80" />
        <div>
          <h4 className="font-bold">¡Gracias por tu comentario!</h4>
          <p className="text-sm opacity-90 mt-1">Tu comentario ha sido publicado exitosamente.</p>
        </div>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-2 text-xs underline opacity-80 hover:opacity-100"
        >
          Escribir otro comentario
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
      <h4 className="font-bold text-lg flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Deja un comentario
      </h4>
      
      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="author_name" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input 
          type="text" 
          id="author_name" 
          name="author_name" 
          required 
          placeholder="Ej. Carlos Pérez"
          className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="content" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Tu mensaje <span className="text-red-500">*</span>
        </label>
        <textarea 
          id="content" 
          name="content" 
          required 
          rows={4}
          placeholder="¿Qué te pareció el artículo?"
          className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="mt-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Publicar Comentario
          </>
        )}
      </button>
    </form>
  );
}
