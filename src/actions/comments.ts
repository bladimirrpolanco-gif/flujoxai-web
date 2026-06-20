'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createComment(formData: FormData) {
  const supabase = createClient();
  
  const post_slug = formData.get('post_slug') as string;
  const author_name = formData.get('author_name') as string;
  const author_email = formData.get('author_email') as string;
  const content = formData.get('content') as string;

  if (!post_slug || !author_name || !author_email || !content) {
    return { error: 'Todos los campos son requeridos' };
  }

  const { error } = await supabase.from('comments').insert({
    post_slug,
    author_name,
    author_email,
    content,
    status: 'approved', // Por defecto los aprobamos para que aparezcan de inmediato, luego puedes cambiarlo a 'pending' si recibes mucho spam
  });

  if (error) {
    console.error('Error creating comment:', error);
    return { error: 'Error al enviar el comentario' };
  }

  revalidatePath(`/blog/${post_slug}`);
  return { success: true };
}

export async function getComments(post_slug: string) {
  const supabase = createClient();

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
