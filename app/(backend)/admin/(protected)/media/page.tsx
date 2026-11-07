import { listMedia } from '@/media/media.service';
import { AdminStatusMessage } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { uploadMediaFromPage } from './actions';

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; uploaded?: string }>;
}) {
  const { error, uploaded } = await searchParams;
  const items = await listMedia();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Media</h2>
        <p className="text-sm text-slate-500">
          Biblioteca de archivos. Las imágenes se guardan en{' '}
          <code className="font-mono text-xs">public/uploads/&lt;año&gt;/&lt;mes&gt;</code>.
        </p>
      </div>

      <AdminStatusMessage id="media-uploaded" message={uploaded ? 'Archivo subido.' : ''} tone="success" />
      <AdminStatusMessage id="media-error" message={error ?? ''} tone="error" persistent />

      <form
        action={uploadMediaFromPage}
        className="mb-6 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          className="text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-slate-800"
        />
        <Button type="submit">Subir</Button>
      </form>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          No hay archivos todavía.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            >
              <div className="aspect-square bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.alt ?? item.original_name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-2">
                <div className="truncate text-xs font-medium text-slate-700" title={item.original_name}>
                  {item.original_name}
                </div>
                <div className="text-xs text-slate-400">
                  {new Date(item.created_at).toLocaleDateString('es-ES')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
