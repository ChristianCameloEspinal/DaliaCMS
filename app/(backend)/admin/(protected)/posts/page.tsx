import Link from 'next/link';
import { listPostTypes } from '@/core/post-types/post-type.service';
import { listPosts } from '@/core/posts/post.service';
import { POST_STATUS_LABELS, type PostStatus } from '@/core/posts/post.types';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/alert';
import { changePostStatusAction, deletePostAction } from './actions';

function getStatusActions(status: string): { label: string; status: PostStatus }[] {
  switch (status) {
    case 'draft':
      return [
        { label: 'Publicar', status: 'published' },
        { label: 'Archivar', status: 'archived' },
      ];
    case 'published':
      return [
        { label: 'Pasar a borrador', status: 'draft' },
        { label: 'Archivar', status: 'archived' },
      ];
    case 'archived':
      return [{ label: 'Restaurar a borrador', status: 'draft' }];
    default:
      return [];
  }
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; error?: string }>;
}) {
  const { type, error } = await searchParams;
  const [postTypes, posts] = await Promise.all([
    listPostTypes(),
    listPosts(type ? { post_type: type } : undefined),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Posts</h2>
        <Link href="/admin/posts/new">
          <Button>Nuevo post</Button>
        </Link>
      </div>

      <ErrorAlert message={error} />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin/posts"
          className={`rounded-md px-3 py-1 text-sm ${
            !type ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-600'
          }`}
        >
          Todos
        </Link>
        {postTypes.map((postType) => (
          <Link
            key={postType.id}
            href={`/admin/posts?type=${postType.post_type}`}
            className={`rounded-md px-3 py-1 text-sm ${
              type === postType.post_type
                ? 'bg-slate-900 text-white'
                : 'border border-slate-300 bg-white text-slate-600'
            }`}
          >
            {postType.post_type_label}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">Título</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-4 py-2">
                  <div className="font-medium text-slate-900">{post.post_title}</div>
                  <div className="text-xs text-slate-500">{post.post_name}</div>
                </td>
                <td className="px-4 py-2 font-mono text-xs">{post.post_type}</td>
                <td className="px-4 py-2">
                  {POST_STATUS_LABELS[post.post_status as PostStatus] ?? post.post_status}
                </td>
                <td className="px-4 py-2 text-slate-500">
                  {post.post_date ? new Date(post.post_date).toLocaleDateString('es-ES') : '—'}
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link href={`/admin/posts/${post.id}`}>
                      <Button variant="secondary">Editar</Button>
                    </Link>
                    {post.post_status === 'published' && (
                      <Link href={`/${post.post_name}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary">Ver</Button>
                      </Link>
                    )}
                    {getStatusActions(post.post_status).map((action) => (
                      <form key={action.status} action={changePostStatusAction}>
                        <input type="hidden" name="id" value={post.id} />
                        <input type="hidden" name="status" value={action.status} />
                        <Button type="submit" variant="secondary">
                          {action.label}
                        </Button>
                      </form>
                    ))}
                    <form action={deletePostAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <Button type="submit" variant="danger">
                        Eliminar
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  No hay posts todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
