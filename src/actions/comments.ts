'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { isAdminUser } from '@/lib/admin';
import { headers } from 'next/headers';
import { cleanText, getClientIp, logSecurityEvent, rateLimit } from '@/lib/security';

export async function createComment(formData: FormData) {
  const hdrs = await headers();
  const ip = getClientIp(hdrs);
  if (!rateLimit(`comment:${ip}`, 3, 10 * 60 * 1000)) {
    logSecurityEvent("comment.rate_limited", { ip });
    return { error: 'Demasiados comentarios seguidos. Intenta más tarde.' };
  }

  const post_slug = cleanText(formData.get('post_slug'), 200);
  const author_name = cleanText(formData.get('author_name'), 80);
  const author_email = 'anonimo@flujoxai.com'; // Dummy email since UI doesn't ask for it anymore
  const content = cleanText(formData.get('content'), 2000);

  if (!post_slug || !author_name || !content) {
    return { error: 'El nombre y el mensaje son requeridos' };
  }
  if (!/^[a-z0-9-]{1,200}$/i.test(post_slug)) {
    return { error: 'Artículo inválido' };
  }
  // Solo se puede comentar en un artículo publicado que exista
  const { data: post } = await supabase.from('posts').select('slug').eq('slug', post_slug).maybeSingle();
  if (!post) {
    return { error: 'Artículo no encontrado' };
  }
  // Filtro anti-spam básico: máximo 2 enlaces por comentario
  if ((content.match(/https?:\/\//gi) || []).length > 2) {
    logSecurityEvent("comment.spam_links", { ip, post_slug });
    return { error: 'El comentario tiene demasiados enlaces' };
  }

  const { error } = await supabase.from('comments').insert({
    post_slug,
    author_name,
    author_email,
    content,
    status: 'approved', // Por defecto los aprobamos para que aparezcan de inmediato
  });

  if (error) {
    console.error('Error creating comment:', error);
    return { error: 'Error al enviar el comentario' };
  }

  revalidatePath(`/blog/${post_slug}`);
  return { success: true };
}

export async function getComments(post_slug: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_slug', post_slug)
    .eq('status', 'approved')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data;
}

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

// Helper for admin operations
async function getAdminSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );
}

export async function deleteComment(id: string) {
  const adminSupabase = await getAdminSupabase();
  const { data: { user } } = await adminSupabase.auth.getUser();
  if (!user || !(await isAdminUser(adminSupabase, user.id))) return { error: 'No autorizado' };

  const { error } = await adminSupabase.from('comments').delete().eq('id', id);
  if (error) {
    console.error('Error deleting comment:', error);
    return { error: 'Error al borrar el comentario' };
  }
  return { success: true };
}

export async function replyToComment(id: string, rawReply: string) {
  const reply = cleanText(rawReply, 2000);
  const adminSupabase = await getAdminSupabase();
  const { data: { user } } = await adminSupabase.auth.getUser();
  if (!user || !(await isAdminUser(adminSupabase, user.id))) return { error: 'No autorizado' };

  // Primero obtenemos el comentario
  const { data: comment } = await adminSupabase
    .from('comments')
    .select('post_slug')
    .eq('id', id)
    .single();

  const { error } = await adminSupabase
    .from('comments')
    .update({ admin_reply: reply })
    .eq('id', id);

  if (error) {
    console.error('Error replying to comment:', error);
    return { error: 'Error al enviar la respuesta' };
  }

  if (comment?.post_slug) {
    revalidatePath(`/blog/${comment.post_slug}`);
  }

  return { success: true };
}
