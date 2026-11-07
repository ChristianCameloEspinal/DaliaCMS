
import { Button } from '@/components/ui/button';
import * as Icon from '@/components/ui/icons';
import type { EditorHistoryEntry, EditorRevisionSummary } from './actions';

export function HistoryPanel({
  undoHistory,
  redoHistory,
  revisions,
  onRestoreRevision,
}: {
  undoHistory: EditorHistoryEntry[];
  redoHistory: EditorHistoryEntry[];
  revisions: EditorRevisionSummary[];
  onRestoreRevision: (revision: EditorRevisionSummary) => void;
}) {
  return (
    <div className="space-y-3 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Historia</div>

      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-600">Cambios locales</div>
        {undoHistory.length === 0 && redoHistory.length === 0 ? (
          <div className="rounded-md border border-dashed border-slate-300 px-3 py-4 text-center text-sm text-slate-400">
            Sin acciones registradas
          </div>
        ) : (
          <div className="space-y-1">
            {[...undoHistory].reverse().slice(0, 10).map((entry) => (
              <HistoryRow key={entry.id} label={entry.label} date={entry.createdAt} />
            ))}
            {redoHistory.length > 0 && (
              <div className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-500">
                {redoHistory.length} cambio(s) disponibles para rehacer
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2 border-t border-slate-100 pt-3">
        <div className="text-xs font-medium text-slate-600">Snapshots guardados</div>
        {revisions.length === 0 ? (
          <div className="rounded-md border border-dashed border-slate-300 px-3 py-4 text-center text-sm text-slate-400">
            Sin snapshots guardados
          </div>
        ) : (
          <div className="space-y-1">
            {revisions.map((revision) => (
              <HistoryRow
                key={revision.id}
                label={revision.label || revision.actionType || 'Guardado'}
                date={revision.createdAt}
                actionLabel="Restaurar"
                onAction={() => onRestoreRevision(revision)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function HistoryRow({
  label,
  date,
  actionLabel,
  onAction,
}: {
  label: string;
  date: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1.5">
      <div className="min-w-0">
        <div className="truncate text-xs text-slate-400">{label}</div>
        <div className="mt-0.5 text-sm text-slate-700">
          {new Date(date).toLocaleString('es-ES')}
        </div>
      </div>
      {onAction && actionLabel && (
        <Button
          type="button"
          variant="ghost"
          buttonSize="iconSm"
          onClick={onAction}
          aria-label={actionLabel}
          title={actionLabel}
        >
          <Icon.RestoreIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
