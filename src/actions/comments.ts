'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createComment(formData: FormData) {
  const post_slug = formData.get('post_slug') as string;
  const author_name = formData.get('author_name') as string;
  const author_email = 'anonimo@flujoxai.com'; // Dummy email since UI doesn't ask for it anymore
  const content = formData.get('content') as string;

  if (!post_slug || !author_name || !content) {
    return { error: 'El nombre y el mensaje son requeridos' };
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
  if (!user) return { error: 'No autorizado' };

  const { error } = await adminSupabase.from('comments').delete().eq('id', id);
  if (error) {
    console.error('Error deleting comment:', error);
    return { error: 'Error al borrar el comentario' };
  }
  return { success: true };
}

export async function replyToComment(id: string, reply: string) {
  const adminSupabase = await getAdminSupabase();
  const { data: { user } } = await adminSupabase.auth.getUser();
  if (!user) return { error: 'No autorizado' };

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
