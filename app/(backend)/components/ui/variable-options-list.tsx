'use client';

export interface IconValueVariable {
  id: string;
  key: string;
  value: string;
  type: string;
}

export function VariableOptionsList({
  variables,
  onSelect,
}: {
  variables: IconValueVariable[];
  onSelect?: (variable: IconValueVariable) => void;
}) {
  if (variables.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 px-3 py-6 text-center text-sm text-slate-400">
        Sin variables guardadas
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {variables.map((variable) => (
        <button
          key={variable.id}
          type="button"
          disabled={!onSelect}
          onClick={() => onSelect?.(variable)}
          className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-left text-xs enabled:hover:border-slate-900"
        >
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              {variable.type === 'color' && (
                <span
                  className="h-4 w-4 shrink-0 rounded-sm border border-slate-300"
                  style={{ backgroundColor: variable.value }}
                />
              )}
              <code className="truncate font-medium text-slate-800">{variable.key}</code>
            </div>
            <div className="mt-1 truncate text-slate-500">{variable.value}</div>
          </div>
          <span className="rounded-sm bg-slate-100 px-1.5 py-1 text-[10px] font-medium uppercase text-slate-500">
            {variable.type}
          </span>
        </button>
      ))}
    </div>
  );
}
