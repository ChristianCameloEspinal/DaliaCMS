import Link from 'next/link';
import { Button } from '@/components/ui/button';
import * as Icon from '@/components/ui/icons';

// Resoluciones cerradas para simular el lienzo del editor.
const DEVICES = [
  { label: 'Movil', width: 375, Icon: Icon.MobileIcon },
  { label: 'Tablet', width: 768, Icon: Icon.TabletIcon },
  { label: 'Desktop', width: 1920, Icon: Icon.DesktopIcon },
] as const;

// Barra superior del editor (estilo Gutenberg), compartida por el editor de
// páginas y componentes. Las acciones de historial son placeholders.
export function EditorHeader({
  backHref,
  title,
  subtitle,
  pageSettingsViewActive,
  blocksViewActive,
  navigatorViewActive,
  variablesViewActive,
  contentViewActive,
  historyViewActive,
  deviceWidth,
  onTogglePageSettingsView,
  onToggleBlocksView,
  onToggleNavigatorView,
  onToggleVariablesView,
  onToggleContentView,
  onToggleHistoryView,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onChangeDeviceWidth,
  publicHref,
  submitLabel,
}: {
  backHref: string;
  title: string;
  subtitle?: string;
  pageSettingsViewActive?: boolean;
  blocksViewActive: boolean;
  navigatorViewActive: boolean;
  variablesViewActive?: boolean;
  contentViewActive: boolean;
  historyViewActive: boolean;
  deviceWidth: number;
  onTogglePageSettingsView?: () => void;
  onToggleBlocksView: () => void;
  onToggleNavigatorView: () => void;
  onToggleVariablesView?: () => void;
  onToggleContentView: () => void;
  onToggleHistoryView: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onChangeDeviceWidth: (width: number) => void;
  publicHref?: string;
  submitLabel: string;
}) {


  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white">
      <div className="flex min-w-0 items-center gap-1 px-3">

        <Link
          href={backHref}
          className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-900 hover:text-white"
          aria-label="Volver"
          title="Volver"
        >
          <Icon.ArrowLeftIcon className="h-4 w-4" />
        </Link>

        {onTogglePageSettingsView && (
          <Button
            type="button"
            selected={pageSettingsViewActive}
            variant="ghost"
            buttonSize="icon"
            aria-label="Abrir ajustes de la pagina"
            aria-pressed={pageSettingsViewActive}
            title="Ajustes de la pagina"
            onClick={onTogglePageSettingsView}
          >
            <Icon.GearIcon className="h-4 w-4" />
          </Button>
        )}

        <Button
          type="button"
          selected={blocksViewActive}
          variant="ghost"
          buttonSize="icon"
          aria-label="Abrir bloques"
          aria-pressed={blocksViewActive}
          title="Bloques"
          onClick={onToggleBlocksView}
        >
          <Icon.CubeIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          selected={navigatorViewActive}
          variant="ghost"
          buttonSize="icon"
          aria-label="Abrir navegador"
          aria-pressed={navigatorViewActive}
          title="Navegador"
          onClick={onToggleNavigatorView}
        >
          <Icon.ListIcon className="h-4 w-4" />
        </Button>

        {onToggleVariablesView && (
          <Button
            type="button"
            selected={variablesViewActive}
            variant="ghost"
            buttonSize="icon"
            aria-label="Abrir variables"
            aria-pressed={variablesViewActive}
            title="Variables"
            onClick={onToggleVariablesView}
          >
            <Icon.TagIcon className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          buttonSize="icon"
          aria-label="Deshacer"
          title="Deshacer"
          disabled={!canUndo}
          onClick={onUndo}
        >
          <Icon.UndoIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          buttonSize="icon"
          aria-label="Rehacer"
          title="Rehacer"
          disabled={!canRedo}
          onClick={onRedo}
        >
          <Icon.RedoIcon className="h-4 w-4" />
        </Button>
        <div className="ml-2 min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{title || 'Sin título'}</p>
          {subtitle && <p className="truncate text-xs text-slate-500">{subtitle}</p>}
        </div>



      </div>

      <div className="flex min-w-0 items-center gap-1 px-3">
        {/* {publicHref && (
          <Link
            href={publicHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Vista previa
          </Link>
        )} */}

        <div
          className="flex items-center gap-0.5 rounded-md border border-slate-300 bg-white p-0.5 shadow-sm"
          role="radiogroup"
          aria-label="Resolucion del dispositivo"
        >
          {DEVICES.map((device) => (
            <Button
              key={device.label}
              type="button"
              variant="ghost"
              buttonSize="iconSm"
              selected={deviceWidth === device.width}
              aria-pressed={deviceWidth === device.width}
              aria-label={device.label}
              title={device.label}
              onClick={() => onChangeDeviceWidth(device.width)}
            >
              <device.Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <Button
          type="button"
          selected={contentViewActive}
          variant="ghost"
          buttonSize="icon"
          aria-label={contentViewActive ? 'Cerrar contenido' : 'Abrir contenido'}
          aria-pressed={contentViewActive}
          title="Contenido"
          onClick={onToggleContentView}
        >
          <Icon.PanelIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          selected={historyViewActive}
          variant="ghost"
          buttonSize="icon"
          aria-label={historyViewActive ? 'Cerrar historia' : 'Abrir historia'}
          aria-pressed={historyViewActive}
          title="Historia"
          onClick={onToggleHistoryView}
        >
          <Icon.HistoryIcon className="h-4 w-4" />
        </Button>

        <Button type="submit" variant="ghost" buttonSize="icon" aria-label="Guardar" title="Guardar">
          <Icon.SaveIcon className="h-4 w-4" />
        </Button>


        {publicHref && (
          <Link
            href={publicHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md hover:bg-slate-900 hover:text-white"
            aria-label="Vista previa"
            title="Vista previa"
          >
            <Icon.LinkIcon className="h-4 w-4" />
          </Link>
        )}

      </div>
    </header>
  );
}
