import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as Icon from '@/components/ui/icons';

export interface PanelTab<T extends string> {
  key: T;
  label: string;
}

// Chrome de un panel lateral del editor (izquierdo/derecho): cabecera con
// pestañas y botón de cierre (+ buscador opcional en el izquierdo) y un cuerpo
// scrollable. El contenido por pestaña lo compone el editor que lo usa.
export function EditorSidePanel<T extends string>({
  side,
  tabs,
  activeTab,
  onTabChange,
  onCollapse,
  searchable = false,
  searchValue = '',
  onSearchChange,
  children,
}: {
  side: 'left' | 'right';
  tabs: PanelTab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  onCollapse: () => void;
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <aside
      className={`flex w-80 shrink-0 flex-col bg-white ${side === 'left' ? 'border-r' : 'border-l'
        } border-slate-200`}
    >
      <div className="border-b border-slate-200 px-2 pt-2">
        <div className="flex items-end gap-1" role="tablist" aria-label="Secciones del panel">
          {side === 'right' &&
            <Button
              type="button"
              variant="collapsed"
              buttonSize="iconSm"
              aria-label="Colapsar panel"
              title="Colapsar panel"
              className="mb-1"
              onClick={onCollapse}
            >
              <Icon.XIcon className="h-4 w-4" />
            </Button>
          }
          {tabs.map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onTabChange(tab.key)}
                className={`flex-1 border-b-2 px-2 py-2 text-sm font-medium transition ${selected
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-200 hover:text-slate-700'
                  }`}
              >
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
          {side === 'left' &&
            <Button
              type="button"
              variant="collapsed"
              buttonSize="iconSm"
              aria-label="Colapsar panel"
              title="Colapsar panel"
              className="mb-1"
              onClick={onCollapse}
            >
              <Icon.XIcon className="h-4 w-4" />
            </Button>
          }

        </div>
        {searchable && (
          <div className="pb-2 pt-2">
            <Input
              type="search"
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              placeholder="Buscar..."
            />
          </div>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </aside>
  );
}
