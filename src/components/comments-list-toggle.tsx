"use client";

import { useState } from 'react';
import { User, Calendar, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { ExpandableText } from './expandable-text';

export function CommentsListToggle({ comments }: { comments: any[] }) {
  const [showComments, setShowComments] = useState(false);

  if (comments.length === 0) {
    return (
      <p className="text-zinc-500 text-center py-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
        Aún no hay comentarios. ¡Sé el primero en opinar!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center justify-between w-full p-4 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition"
      >
        <div className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-200">
          <MessageSquare className="w-5 h-5 text-primary" />
          Ver Comentarios ({comments.length})
        </div>
        {showComments ? <ChevronUp className="w-5 h-5 text-zinc-500" /> : <ChevronDown className="w-5 h-5 text-zinc-500" />}
      </button>

      {showComments && (
        <div className="flex flex-col gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm">{comment.author_name}</h5>
                  <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {new Date(comment.created_at).toLocaleDateString('es-DO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line mt-2">
                <ExpandableText text={comment.content} maxLength={150} />
              </p>

              {/* Respuesta del Administrador */}
              {comment.admin_reply && (
                <div className="mt-4 ml-6 sm:ml-10 bg-primary/5 dark:bg-primary/10 border-l-2 border-primary p-4 rounded-r-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                      <User className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold text-primary">Equipo FlujoXAI</span>
                  </div>
                  <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
                    <ExpandableText text={comment.admin_reply} maxLength={150} />
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
