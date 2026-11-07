import Link from 'next/link';
import { listPostTypes } from '@/core/post-types/post-type.service';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/alert';
import { deletePostTypeAction } from './actions';

export default async function PostTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const postTypes = await listPostTypes();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Post Types</h2>
        <Link href="/admin/post-types/new">
          <Button>Nuevo post type</Button>
        </Link>
      </div>

      <ErrorAlert message={error} />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">post_type</th>
              <th className="px-4 py-2">Etiqueta</th>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Sistema</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {postTypes.map((postType) => (
              <tr key={postType.id}>
                <td className="px-4 py-2 font-mono text-xs">{postType.post_type}</td>
                <td className="px-4 py-2">{postType.post_type_label}</td>
                <td className="px-4 py-2 text-slate-500">{postType.post_type_description ?? '—'}</td>
                <td className="px-4 py-2">{postType.post_type_system ? 'Sí' : 'No'}</td>
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/post-types/${postType.id}`}>
                      <Button variant="secondary">Editar</Button>
                    </Link>
                    {!postType.post_type_system && (
                      <form action={deletePostTypeAction}>
                        <input type="hidden" name="id" value={postType.id} />
                        <Button type="submit" variant="danger">
                          Eliminar
                        </Button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {postTypes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                  No hay post types todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
