"use client";

import { useState } from 'react';
import { deleteComment, replyToComment } from '@/actions/comments';
import { MessageSquare, Trash2, Reply, Check, User, Calendar, ExternalLink } from 'lucide-react';

export function CommentsManager({ initialComments }: { initialComments: any[] }) {
  const [comments, setComments] = useState(initialComments);
  const [selectedComment, setSelectedComment] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este comentario?')) return;
    
    setIsSubmitting(true);
    const res = await deleteComment(id);
    setIsSubmitting(false);
    
    if (res.success) {
      setComments(comments.filter(c => c.id !== id));
      setSelectedComment(null);
    } else {
      alert(res.error);
    }
  };

  const handleReply = async (id: string) => {
    setIsSubmitting(true);
    const res = await replyToComment(id, replyText);
    setIsSubmitting(false);

    if (res.success) {
      setComments(comments.map(c => c.id === id ? { ...c, admin_reply: replyText } : c));
      setSelectedComment(null);
      setReplyText('');
    } else {
      alert(res.error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-DO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Autor</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Artículo</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Comentario</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Estado</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {comments.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-zinc-500 text-sm">No hay comentarios aún.</td>
              </tr>
            )}
            {comments.map((comment) => (
              <tr key={comment.id} onClick={() => { setSelectedComment(comment); setReplyText(comment.admin_reply || ''); }} className="hover:bg-zinc-800/50 cursor-pointer transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-sm font-bold flex-shrink-0">
                      {comment.author_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <span className="text-sm font-medium text-white">{comment.author_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-zinc-400 truncate max-w-[150px]">{comment.post_slug}</td>
                <td className="px-4 py-3 text-sm text-zinc-300 truncate max-w-[200px]">{comment.content}</td>
                <td className="px-4 py-3">
                  {comment.admin_reply ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                      <Check className="w-3 h-3" /> Respondido
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400">
                      Pendiente
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-zinc-500">{formatDate(comment.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedComment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedComment(null)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" /> Gestionar Comentario
              </h3>
              <a href={`/blog/${selectedComment.post_slug}`} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                Ver artículo <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold">
                  {selectedComment.author_name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedComment.author_name}</h4>
                  <p className="text-xs text-zinc-500">{formatDate(selectedComment.created_at)}</p>
                </div>
              </div>
              <div className="bg-zinc-800 rounded-xl p-4 text-sm text-zinc-300 leading-relaxed mb-6">
                {selectedComment.content}
              </div>

              <div className="border-t border-zinc-800 pt-6">
                <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <Reply className="w-4 h-4 text-emerald-500" /> Tu respuesta (Pública)
                </h4>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escribe aquí la respuesta que verán todos en el blog..."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  rows={4}
                />
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800 flex gap-3 mt-auto">
              <button
                onClick={() => handleDelete(selectedComment.id)}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" /> Borrar
              </button>
              <button
                onClick={() => handleReply(selectedComment.id)}
                disabled={isSubmitting || !replyText.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : selectedComment.admin_reply ? 'Actualizar Respuesta' : 'Responder Públicamente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
