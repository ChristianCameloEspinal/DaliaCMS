import { ErrorAlert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { listPatterns } from '@/core/patterns/pattern.service';
import { parseDocument } from '@/components/editor/editor.helpers';
import { createPatternAction, deletePatternAction } from './actions';

export default async function ComponentsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const patterns = await listPatterns();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Components</h2>
          <p className="mt-1 text-sm text-slate-500">
            Bloques sincronizados que puedes insertar y editar desde las páginas.
          </p>
        </div>
      </div>

      <ErrorAlert message={error} />

      <form action={createPatternAction} className="mb-6 flex max-w-xl gap-2">
        <Input name="pattern_label" placeholder="Nombre del nuevo Component" required />
        <Button type="submit">Crear Component</Button>
      </form>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2">slug</th>
              <th className="px-4 py-2">Etiqueta</th>
              <th className="px-4 py-2">Bloques</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patterns.map((pattern) => (
              <tr key={pattern.id}>
                <td className="px-4 py-2 font-mono text-xs">{pattern.pattern_slug}</td>
                <td className="px-4 py-2">{pattern.pattern_label}</td>
                <td className="px-4 py-2 text-slate-500">
                  {parseDocument(pattern.content).blocks.length}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    <form action={deletePatternAction}>
                      <input type="hidden" name="id" value={pattern.id} />
                      <Button type="submit" variant="danger">
                        Eliminar
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {patterns.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  No hay Components todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
