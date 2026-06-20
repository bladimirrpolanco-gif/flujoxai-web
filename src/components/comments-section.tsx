import { getComments } from '@/actions/comments';
import { CommentForm } from './comments-form';
import { CommentsListToggle } from './comments-list-toggle';

export async function CommentsSection({ postSlug }: { postSlug: string }) {
  const comments = await getComments(postSlug);

  return (
    <div className="mt-16 pt-10 border-t border-border">
      <h3 className="text-2xl font-bold mb-8">
        Comentarios ({comments.length})
      </h3>

      {/* Formulario */}
      <div className="mb-12">
        <CommentForm postSlug={postSlug} />
      </div>

      {/* Lista de comentarios desplegable */}
      <CommentsListToggle comments={comments} />
    </div>
  );
}
