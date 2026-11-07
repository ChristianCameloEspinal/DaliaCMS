import type { Block } from '@/components/editor/editor.types';
import * as Icon from '@/components/ui/icons';

export interface PatternListItem {
  id: string;
  label: string;
  blocks: Block[];
  dirty?: boolean;
}

// Biblioteca de componentes del panel izquierdo: opcionalmente permite crear un
// componente sincronizado desde la selección, y lista los existentes para insertar.
export function PatternLibrary({
  patterns,
  canCreate,
  onCreate,
  onInsert,
  filterText = '',
}: {
  patterns: PatternListItem[];
  canCreate?: boolean;
  onCreate?: () => void;
  onInsert: (patternId: string) => void;
  filterText?: string;
}) {
  const query = filterText.trim().toLowerCase();
  const filteredPatterns =
    query.length === 0
      ? patterns
      : patterns.filter((pattern) => pattern.label.toLowerCase().includes(query));

  return (
    <div className="space-y-4 p-4">
      {query && (
        <p className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
          Filtrando por "{filterText.trim()}"
        </p>
      )}
      {onCreate && (
        <button
          type="button"
          onClick={onCreate}
          disabled={!canCreate}
          className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Crear Component desde selección
        </button>
      )}

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Components sincronizados
        </h3>
        {filteredPatterns.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 p-3 text-sm text-slate-400">
            Aún no hay Components.
          </p>
        ) : (
          filteredPatterns.map((pattern) => (
            <button
              key={pattern.id}
              type="button"
              onClick={() => onInsert(pattern.id)}
              className="flex w-full items-center justify-between gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-left text-sm hover:bg-slate-50"
            >
              <span className="min-w-0">
                <span className="block truncate font-medium text-slate-800">{pattern.label}</span>
                <span className="text-xs text-slate-500">
                  {pattern.blocks.length} {pattern.blocks.length === 1 ? 'bloque' : 'bloques'}
                  {pattern.dirty ? ' · cambios pendientes' : ''}
                </span>
              </span>
              <Icon.PlusIcon className="h-4 w-4 shrink-0 text-slate-500" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// Panel del inspector cuando el bloque seleccionado es una referencia a componente.
export function PatternReferencePanel({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-4 p-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Component sincronizado
        </div>
        <p className="mt-2 text-sm font-medium text-slate-900">{label}</p>
        <p className="mt-1 text-sm text-slate-500">
          Selecciona un bloque dentro del Component en el lienzo para editar su contenido compartido.
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Eliminar referencia
      </button>
    </div>
  );
}
