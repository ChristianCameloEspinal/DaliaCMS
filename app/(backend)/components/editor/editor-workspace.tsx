'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { POST_STATUSES, POST_STATUS_LABELS } from '@/core/posts/post.types';
import type { EditorVariable } from '@/core/editor-variables/editor-variables.types';
import { blockAlignStyle, siteContainerStyle } from '@/core/editor-variables/editor-variables.styles';
import { useAdminNotice, useBreadcrumb } from '@/components/admin/admin-shell';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Media, MediaMap } from '@/media/media.types';
import { EditorHeader } from '@/components/editor/editor-header';
import { EditorSidePanel } from '@/components/editor/editor-side-panel';
import { EditorCanvas } from '@/components/editor/editor-canvas';
import { BlockInserter } from '@/components/editor/blocks/block-inserter';
import { BlockHtmlOutline } from '@/components/editor/blocks/block-html-outline';
import { Navigator } from '@/components/editor/editor-navigator';
import { PatternLibrary, PatternReferencePanel } from '@/components/editor/patterns/pattern-library';
import { VariablesPanel } from '@/components/editor/variables/variables-panel';
import { BlockPreviewer } from '@/components/editor/blocks/block-previewer';
import { getBlockLabel } from '@/components/editor/blocks/block-registry';
import { type Block, type BlockType, type StyleState } from './editor.types';
import {
  createBlock,
  findBlockById,
  insertBlock,
  insertBlockAtIndex,
  mapBlockById,
  removeBlockById,
  moveBlockToIndex,
  serializeDocument,
} from './editor.helpers';
import { BlockInspector, type InspectorTab } from './blocks/block-inspector';
import { HistoryPanel } from './history/history-panel';
import {
  cloneSnapshot,
  createHistoryEntry,
  pushHistoryEntry,
  restoreRevisionSnapshot,
  type EditorHistoryEntry,
  type EditorPageSettings,
  type EditorRevisionSummary,
  type EditorSnapshot,
} from './history/actions';
import { MediaLibrary } from '@/media/media-library';
import { useBlockDragDrop } from './hooks/use-block-drag-drop';
import { useEditorMedia } from './hooks/use-editor-media';
import { useEditorPatterns, type EditorPatternItem } from './hooks/use-editor-patterns';
import {
  deviceWidthToStyleDevice,
  patchBlockStyleVariant,
  patchBlockStyleVariantMany,
} from './style-variants';
type LeftBranch = 'settings' | 'elements' | 'structure' | 'variables';
type LeftTab = 'settings' | 'blocks' | 'patterns' | 'media' | 'navigator' | 'structure' | 'variables';
type RightBranch = 'content' | 'history';
type RightTab = InspectorTab | 'history';

const LEFT_PANEL_TREE: Record<
  LeftBranch,
  { defaultTab: LeftTab; tabs: { key: LeftTab; label: string }[] }
> = {
  settings: { defaultTab: 'settings', tabs: [{ key: 'settings', label: 'Ajustes' }] },
  elements: {
    defaultTab: 'blocks',
    tabs: [
      { key: 'blocks', label: 'Blocks' },
      { key: 'patterns', label: 'Components' },
      { key: 'media', label: 'Media' },
    ],
  },
  structure: {
    defaultTab: 'navigator',
    tabs: [
      { key: 'navigator', label: 'Navegador' },
      { key: 'structure', label: 'Estructura SEO' },
    ],
  },
  variables: { defaultTab: 'variables', tabs: [{ key: 'variables', label: 'Variables' }] },
};

const RIGHT_PANEL_TREE: Record<
  RightBranch,
  { defaultTab: RightTab; tabs: { key: RightTab; label: string }[] }
> = {
  content: {
    defaultTab: 'content',
    tabs: [
      { key: 'content', label: 'Contenido' },
      { key: 'style', label: 'Estilo' },
    ],
  },
  history: { defaultTab: 'history', tabs: [{ key: 'history', label: 'Historia' }] },
};

interface EditorWorkspaceProps {
  initialBlocks: Block[];
  name?: string;
  pageSettings: EditorPageSettings;
  // Etiqueta del post type para el breadcrumb.
  postTypeLabel: string;
  initialVariables: EditorVariable[];
  patterns: EditorPatternItem[];
  // Biblioteca de medios para el selector y mapa inicial de punteros resueltos.
  mediaItems: Media[];
  initialMedia: MediaMap;
  revisions?: EditorRevisionSummary[];
  backHref: string;
  publicHref?: string;
  notice?: {
    saved?: boolean;
    error?: string;
  };
}

export function EditorWorkspace({
  initialBlocks,
  name = 'content',
  pageSettings,
  postTypeLabel,
  initialVariables,
  patterns: initialPatterns,
  mediaItems,
  initialMedia,
  revisions = [],
  backHref,
  publicHref,
  notice,
}: EditorWorkspaceProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [editorVariables, setEditorVariables] = useState<EditorVariable[]>(initialVariables);
  const [settings, setSettings] = useState<EditorPageSettings>(pageSettings);
  const [selectedId, setSelectedId] = useState<string | null>(initialBlocks[0]?.id ?? null);
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [leftSearch, setLeftSearch] = useState('');
  const { notify } = useAdminNotice();
  const savedNotice = notice?.saved ?? false;
  const errorNotice = notice?.error ?? '';
  const [deviceWidth, setDeviceWidth] = useState(1280);
  const [styleState, setStyleState] = useState<StyleState>('default');
  const [leftPanel, setLeftPanel] = useState<{
    branch: LeftBranch;
    tab: LeftTab;
    collapsed: boolean;
  }>({ branch: 'elements', tab: 'blocks', collapsed: false });
  const [rightPanel, setRightPanel] = useState<{
    branch: RightBranch;
    tab: RightTab;
    collapsed: boolean;
  }>({ branch: 'content', tab: 'content', collapsed: false });
  const [undoHistory, setUndoHistory] = useState<EditorHistoryEntry[]>([]);
  const [redoHistory, setRedoHistory] = useState<EditorHistoryEntry[]>([]);
  const lastTextHistoryAtRef = useRef(0);

  // Breadcrumb contextual del editor.
  useBreadcrumb([
    { label: postTypeLabel, href: `/admin/posts?type=${settings.post_type}` },
    { label: settings.post_title || 'Sin titulo' },
    { label: 'Editar pagina' },
  ]);

  useEffect(() => {
    if (savedNotice) {
      notify({
        id: 'post-content-saved',
        message: 'Contenido guardado.',
        tone: 'success',
      });
    }
    if (errorNotice) {
      notify({
        id: 'post-content-error',
        message: errorNotice,
        tone: 'error',
        persistent: true,
      });
    }
  }, [errorNotice, notify, savedNotice]);

  const {
    patterns,
    setPatterns,
    patternMap,
    updatePatternBlocks,
    buildPatternFromBlock,
    buildPatternReference,
  } = useEditorPatterns(initialPatterns);

  function createSnapshot(): EditorSnapshot {
    return cloneSnapshot({
      blocks,
      patterns,
      selectedId,
      selectedPatternId,
    });
  }

  function restoreSnapshot(snapshot: EditorSnapshot) {
    const next = cloneSnapshot(snapshot);
    setBlocks(next.blocks);
    setPatterns(next.patterns);
    setSelectedId(next.selectedId ?? next.blocks[0]?.id ?? null);
    setSelectedPatternId(next.selectedPatternId ?? null);
  }

  function restoreRevision(revision: EditorRevisionSummary) {
    const restored = restoreRevisionSnapshot(revision, patterns);
    if (!restored) {
      notifyChange('No se pudo leer el snapshot guardado.', 'warning');
      return;
    }

    recordHistory('Antes de restaurar snapshot');
    setBlocks(restored.blocks);
    setSelectedId(restored.blocks[0]?.id ?? null);
    setSelectedPatternId(null);

    if (restored.settings) {
      setSettings((current) => ({
        ...current,
        ...restored.settings,
      }));
    }

    if (restored.patterns) {
      setPatterns(restored.patterns);
    }

    setRightPanel({ branch: 'content', tab: 'content', collapsed: false });
    notifyChange('Snapshot restaurado. Guarda para hacerlo permanente.', 'info');
  }

  function recordHistory(label: string) {
    const entry = createHistoryEntry(label, createSnapshot());
    setUndoHistory((current) => pushHistoryEntry(current, entry));
    setRedoHistory([]);
  }

  function undo() {
    const entry = undoHistory[undoHistory.length - 1];
    if (!entry) return;

    setRedoHistory((current) =>
      pushHistoryEntry(current, createHistoryEntry('Estado antes de deshacer', createSnapshot()))
    );
    setUndoHistory((current) => current.slice(0, -1));
    restoreSnapshot(entry.snapshot);
    notifyChange(`Deshecho: ${entry.label}.`, 'info');
  }

  function redo() {
    const entry = redoHistory[redoHistory.length - 1];
    if (!entry) return;

    setUndoHistory((current) =>
      pushHistoryEntry(current, createHistoryEntry('Estado antes de rehacer', createSnapshot()))
    );
    setRedoHistory((current) => current.slice(0, -1));
    restoreSnapshot(entry.snapshot);
    notifyChange('Cambio rehecho.', 'info');
  }

  const activePattern = useMemo(
    () =>
      selectedPatternId ? patterns.find((pattern) => pattern.id === selectedPatternId) ?? null : null,
    [patterns, selectedPatternId]
  );
  const activeBlocks = activePattern?.blocks ?? blocks;
  const styleDevice = deviceWidthToStyleDevice(deviceWidth);
  const selected = useMemo(
    () => (selectedId ? findBlockById(activeBlocks, selectedId) : null),
    [activeBlocks, selectedId]
  );
  const statusLabel =
    POST_STATUS_LABELS[settings.post_status as keyof typeof POST_STATUS_LABELS] ??
    settings.post_status;
  const resolvedInitialMedia = useMemo(
    () => ({
      ...Object.fromEntries(mediaItems.map((item) => [item.id, { url: item.url, alt: item.alt }])),
      ...initialMedia,
    }),
    [initialMedia, mediaItems]
  );
  const serializedBlocks = useMemo(() => serializeDocument(blocks), [blocks]);
  const serializedPatterns = useMemo(() => {
    const entries = patterns.map((pattern) => ({
      id: pattern.id,
      label: pattern.label,
      content: serializeDocument(pattern.blocks),
      isNew: pattern.isNew,
    }));
    return {
      changed: JSON.stringify(
        entries.filter((_, index) => patterns[index].isNew || patterns[index].dirty)
      ),
      revision: JSON.stringify(entries),
    };
  }, [patterns]);
  const leftTabs = LEFT_PANEL_TREE[leftPanel.branch].tabs;
  const leftTab = leftPanel.tab;
  const leftCollapsed = leftPanel.collapsed;
  const rightTabs = RIGHT_PANEL_TREE[rightPanel.branch].tabs;
  const rightTab = rightPanel.tab;
  const rightCollapsed = rightPanel.collapsed;

  function selectBlock(id: string, patternId: string | null = null) {
    setSelectedId(id);
    setSelectedPatternId(patternId);
    setRightPanel({ branch: 'content', tab: 'content', collapsed: false });
  }

  function openBlockStylePanel(id: string, patternId: string | null = null) {
    setSelectedId(id);
    setSelectedPatternId(patternId);
    setRightPanel({ branch: 'content', tab: 'style', collapsed: false });
  }

  function toggleLeftBranch(branch: LeftBranch) {
    setLeftPanel((current) =>
      current.branch === branch && !current.collapsed
        ? { ...current, collapsed: true }
        : {
          branch,
          tab: LEFT_PANEL_TREE[branch].defaultTab,
          collapsed: false,
        }
    );
  }

  function openLeftTab(tab: LeftTab) {
    setLeftPanel((current) => ({ ...current, tab, collapsed: false }));
  }

  function toggleRightBranch(branch: RightBranch) {
    setRightPanel((current) =>
      current.branch === branch && !current.collapsed
        ? { ...current, collapsed: true }
        : {
          branch,
          tab: RIGHT_PANEL_TREE[branch].defaultTab,
          collapsed: false,
        }
    );
  }

  function openRightTab(tab: RightTab) {
    setRightPanel((current) => ({ ...current, tab, collapsed: false }));
  }

  function collapseRightPanel() {
    setRightPanel((current) => ({ ...current, collapsed: true }));
  }

  function openBlocksPanel() {
    setLeftPanel({ branch: 'elements', tab: 'blocks', collapsed: false });
  }

  function notifyChange(message: string, tone: 'success' | 'info' | 'warning' = 'success') {
    notify({ message, tone });
  }

  const setActiveBlocks = useCallback(
    (update: (prev: Block[]) => Block[], label = 'Cambio de bloques') => {
      recordHistory(label);
      if (selectedPatternId) {
        updatePatternBlocks(selectedPatternId, update);
        return;
      }
      setBlocks(update);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedPatternId, updatePatternBlocks, blocks, patterns, selectedId]
  );

  // Anade un bloque dentro del contenedor `parentId` (o en la raiz si es null).
  function addBlock(type: BlockType, parentId: string | null = null) {
    const block = createBlock(type);
    setActiveBlocks((prev) => insertBlock(prev, parentId, block), `Bloque anadido: ${getBlockLabel(type)}`);
    selectBlock(block.id, selectedPatternId);
    notifyChange(`Bloque anadido: ${getBlockLabel(type)}.`, 'success');
  }

  function quickAddBlock(
    type: BlockType,
    target: { parentId: string | null; index: number; patternId: string | null }
  ) {
    const block = createBlock(type);
    recordHistory(`Bloque anadido: ${getBlockLabel(type)}`);
    if (target.patternId) {
      updatePatternBlocks(target.patternId, (prev) =>
        insertBlockAtIndex(prev, target.parentId, target.index, block)
      );
    } else {
      setBlocks((prev) => insertBlockAtIndex(prev, target.parentId, target.index, block));
    }
    selectBlock(block.id, target.patternId);
    notifyChange(`Bloque anadido: ${getBlockLabel(type)}.`, 'success');
  }

  function patchBlock(id: string, patch: Partial<Block>) {
    setActiveBlocks(
      (prev) => mapBlockById(prev, id, (block) => ({ ...block, ...patch })),
      'Bloque actualizado'
    );
  }

  function patchPreviewText(id: string, text: string, patternId: string | null) {
    const update = (prev: Block[]) => mapBlockById(prev, id, (block) => ({ ...block, text }));
    const now = Date.now();
    if (now - lastTextHistoryAtRef.current > 1000) {
      recordHistory('Texto actualizado');
      lastTextHistoryAtRef.current = now;
    }
    if (patternId) {
      updatePatternBlocks(patternId, update);
      return;
    }
    setBlocks(update);
  }

  // Escribe/elimina una propiedad CSS del bloque indicado en el dispositivo/estado activo.
  function patchStyle(id: string, key: string, value: string) {
    const update = (prev: Block[]) =>
      mapBlockById(prev, id, (block) =>
        patchBlockStyleVariant({ block, device: styleDevice, state: styleState, key, value })
      );
    setActiveBlocks(update, 'Estilo actualizado');
  }

  function patchStyles(id: string, patch: Record<string, string>) {
    const update = (prev: Block[]) =>
      mapBlockById(prev, id, (block) =>
        patchBlockStyleVariantMany({ block, device: styleDevice, state: styleState, patch })
      );
    setActiveBlocks(update, 'Estilos actualizados');
  }

  function removeBlock(id: string) {
    setActiveBlocks((prev) => removeBlockById(prev, id), 'Bloque eliminado');
    setSelectedId((current) => (current === id ? null : current));
    if (selectedPatternId) {
      setSelectedPatternId(null);
    }
    notifyChange('Bloque eliminado.', 'warning');
  }

  function createSyncedPatternFromSelected() {
    if (!selected || selectedPatternId) return;
    const built = buildPatternFromBlock(selected);
    if (!built) return;
    recordHistory('Patron creado desde seleccion');
    setPatterns((prev) => [...prev, built.pattern]);
    setBlocks((prev) => mapBlockById(prev, selected.id, () => built.reference));
    setLeftPanel({ branch: 'elements', tab: 'patterns', collapsed: false });
    selectBlock(built.reference.id, null);
    notifyChange('Patron creado desde la seleccion.', 'success');
  }

  function insertPattern(patternId: string) {
    const reference = buildPatternReference(patternId);
    recordHistory('Patron insertado');
    setBlocks((prev) => insertBlock(prev, null, reference));
    selectBlock(reference.id, null);
    notifyChange('Patron insertado en la pagina.', 'success');
  }

  const { draggingId, dropTarget, handleDragStart, handleDragOver, handleDrop, handleDragEnd } =
    useBlockDragDrop({
      onMove: (movingId, target) => {
        const insertIndex = target.position === 'before' ? target.index : target.index + 1;
        const moved = movingId !== target.id;
        if (!moved) return false;
        setActiveBlocks(
          (prev) => moveBlockToIndex(prev, movingId, target.parentId, insertIndex),
          'Bloque reordenado'
        );
        notifyChange('Bloque reordenado.', 'info');
        return true;
      },
    });

  const { library, media, pickerOpen, setPickerOpen, handleSelectMedia, handleUploadedMedia } =
    useEditorMedia({
      initialLibrary: mediaItems,
      initialMedia: resolvedInitialMedia,
      onSelectMedia: (item) => {
        if (selected) {
          patchBlock(selected.id, { mediaId: item.id, url: undefined });
        }
        notifyChange(`Media aplicada: ${item.alt || item.id}.`, 'success');
      },
    });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Inputs ocultos: el form (server action) recibe bloques + metadatos. */}
      <input type="hidden" name={name} value={serializedBlocks} readOnly />
      <input type="hidden" name="patterns" value={serializedPatterns.changed} readOnly />
      <input
        type="hidden"
        name="revision_patterns"
        value={serializedPatterns.revision}
        readOnly
      />
      <input type="hidden" name="post_title" value={settings.post_title} readOnly />
      <input type="hidden" name="post_name" value={settings.post_name} readOnly />
      <input type="hidden" name="post_excerpt" value={settings.post_excerpt ?? ''} readOnly />
      <input type="hidden" name="post_status" value={settings.post_status} readOnly />
      <input type="hidden" name="post_meta_title" value={settings.post_meta_title ?? ''} readOnly />
      <input
        type="hidden"
        name="post_meta_description"
        value={settings.post_meta_description ?? ''}
        readOnly
      />

      <EditorHeader
        backHref={backHref}
        title={settings.post_title}
        subtitle={`/${settings.post_name} - ${statusLabel}`}
        pageSettingsViewActive={leftPanel.branch === 'settings' && !leftCollapsed}
        blocksViewActive={leftPanel.branch === 'elements' && !leftCollapsed}
        navigatorViewActive={leftPanel.branch === 'structure' && !leftCollapsed}
        variablesViewActive={leftPanel.branch === 'variables' && !leftCollapsed}
        contentViewActive={rightPanel.branch === 'content' && !rightCollapsed}
        historyViewActive={rightPanel.branch === 'history' && !rightCollapsed}
        deviceWidth={deviceWidth}
        onTogglePageSettingsView={() => toggleLeftBranch('settings')}
        onToggleBlocksView={() => toggleLeftBranch('elements')}
        onToggleNavigatorView={() => toggleLeftBranch('structure')}
        onToggleVariablesView={() => toggleLeftBranch('variables')}
        onToggleContentView={() => toggleRightBranch('content')}
        onToggleHistoryView={() => toggleRightBranch('history')}
        canUndo={undoHistory.length > 0}
        canRedo={redoHistory.length > 0}
        onUndo={undo}
        onRedo={redo}
        onChangeDeviceWidth={setDeviceWidth}
        publicHref={publicHref}
        submitLabel="Publicar"
      />

      <div className="flex min-h-0 flex-1 overflow-hidden bg-white">
        {/* IZQUIERDA: bloques / navegador / componentes (colapsable). */}
        {!leftCollapsed && (
          <EditorSidePanel
            side="left"
            searchable
            searchValue={leftSearch}
            onSearchChange={setLeftSearch}
            tabs={leftTabs}
            activeTab={leftTab}
            onTabChange={openLeftTab}
            onCollapse={() => setLeftPanel((current) => ({ ...current, collapsed: true }))}
          >
            {leftTab === 'settings' ? (
              <PageConfig settings={settings} onChange={setSettings} />
            ) : leftTab === 'blocks' ? (
              <BlockInserter onAdd={(type) => addBlock(type, null)} filterText={leftSearch} />
            ) : leftTab === 'patterns' ? (
              <PatternLibrary
                patterns={patterns}
                canCreate={Boolean(selected && !selectedPatternId && selected.type !== 'pattern')}
                onCreate={createSyncedPatternFromSelected}
                onInsert={insertPattern}
                filterText={leftSearch}
              />
            ) : leftTab === 'media' ? (
              <MediaPanel items={library} onSelect={handleSelectMedia} filterText={leftSearch} />
            ) : leftTab === 'navigator' ? (
              <Navigator
                blocks={blocks}
                selectedId={selectedId}
                onSelect={selectBlock}
                onRemove={removeBlock}
                filterText={leftSearch}
              />
            ) : leftTab === 'structure' ? (
              <BlockHtmlOutline
                title={settings.post_title}
                blocks={blocks}
                selectedId={selectedId}
                patterns={patternMap}
                onSelect={selectBlock}
                filterText={leftSearch}
              />
            ) : (
              <VariablesPanel
                filterText={leftSearch}
                variables={editorVariables}
                onChange={setEditorVariables}
              />
            )}
          </EditorSidePanel>
        )}

        {/* CENTRO: lienzo en vivo con selector de dispositivo. */}
        <EditorCanvas deviceWidth={deviceWidth}>
          <article style={siteContainerStyle(editorVariables)}>
            {blocks.length === 0 ? (
              <div style={blockAlignStyle()} className="mt-6">
                <p className="text-sm text-slate-400">
                  La pagina esta vacia. Anade elementos desde el panel de bloques.
                </p>
              </div>
            ) : (
              <div>
                {blocks.map((block, index) => (
                  <BlockPreviewer
                    key={block.id}
                    block={block}
                    depth={0}
                    index={index}
                    styleDevice={styleDevice}
                    styleState={styleState}
                    selectedId={selectedId}
                    selectedPatternId={selectedPatternId}
                    media={media}
                    patterns={patternMap}
                    onSelect={selectBlock}
                    onEdit={openBlockStylePanel}
                    onRemove={removeBlock}
                    draggingId={draggingId}
                    dropTarget={dropTarget}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                    onQuickAdd={quickAddBlock}
                    onOpenBlocksPanel={openBlocksPanel}
                    onTextChange={patchPreviewText}
                  />
                ))}
              </div>
            )}
          </article>
        </EditorCanvas>

        {/* DERECHA: bloque seleccionado. */}
        {!rightCollapsed && (
          <EditorSidePanel
            side="right"
            tabs={rightTabs}
            activeTab={rightTab}
            onTabChange={openRightTab}
            onCollapse={collapseRightPanel}
          >
            {rightTab === 'history' ? (
              <HistoryPanel
                undoHistory={undoHistory}
                redoHistory={redoHistory}
                revisions={revisions}
                onRestoreRevision={restoreRevision}
              />
            ) : selected ? (
              <BlockInspector
                key={`${selected.id}-${rightTab}`}
                block={selected}
                media={media}
                variables={editorVariables}
                onVariablesChange={setEditorVariables}
                onPickMedia={() => setPickerOpen(true)}
                onPatch={(patch) => patchBlock(selected.id, patch)}
                onStyle={(key, value) => patchStyle(selected.id, key, value)}
                onStylePatch={(patch) => patchStyles(selected.id, patch)}
                styleDevice={styleDevice}
                styleState={styleState}
                onStyleStateChange={setStyleState}
                onAddChild={(type) => addBlock(type, selected.id)}
                onRemoveChild={(childId) => removeBlock(childId)}
                tab={rightTab === 'style' ? 'style' : 'content'}
              />
            ) : (
              <div className="m-4 border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                Selecciona un bloque en el lienzo o en el navegador para editarlo.
              </div>
            )}
          </EditorSidePanel>
        )}

      </div>

      {pickerOpen && (
        <MediaLibrary
          items={library}
          onSelect={handleSelectMedia}
          onUploaded={handleUploadedMedia}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

function MediaPanel({
  items,
  filterText,
  onSelect,
}: {
  items: Media[];
  filterText: string;
  onSelect: (item: Media) => void;
}) {
  const query = filterText.trim().toLowerCase();
  const filteredItems = query
    ? items.filter((item) =>
      `${item.filename} ${item.original_name} ${item.alt ?? ''}`.toLowerCase().includes(query)
    )
    : items;

  return (
    <div className="space-y-3 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Media</div>
      {filteredItems.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 px-3 py-6 text-center text-sm text-slate-400">
          Sin archivos
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="group overflow-hidden rounded-md border border-slate-200 bg-white text-left hover:border-slate-900"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt ?? ''} className="aspect-square w-full object-cover" />
              <span className="block truncate px-2 py-1.5 text-xs text-slate-600 group-hover:text-slate-900">
                {item.alt || item.original_name || item.filename}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Pestana "Post": configuracion del post y meta SEO.
function PageConfig({
  settings,
  onChange,
}: {
  settings: EditorPageSettings;
  onChange: (updater: (prev: EditorPageSettings) => EditorPageSettings) => void;
}) {
  return (
    <div className="space-y-5 p-4">
      <div className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Configuracion
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Tipo</label>
          <Input
            tone="muted"
            value={settings.post_type}
            disabled
            readOnly
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Titulo</label>
          <Input
            type="text"
            value={settings.post_title}
            onChange={(event) => onChange((prev) => ({ ...prev, post_title: event.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">post_name (slug)</label>
          <Input
            type="text"
            value={settings.post_name}
            onChange={(event) => onChange((prev) => ({ ...prev, post_name: event.target.value }))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Extracto</label>
          <Textarea
            value={settings.post_excerpt ?? ''}
            onChange={(event) =>
              onChange((prev) => ({ ...prev, post_excerpt: event.target.value }))
            }
            rows={3}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Estado</label>
          <Select
            value={settings.post_status}
            onChange={(event) => onChange((prev) => ({ ...prev, post_status: event.target.value }))}
          >
            {POST_STATUSES.map((status) => (
              <option key={status} value={status}>
                {POST_STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="space-y-3 border-t border-slate-100 pt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">SEO</div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Meta titulo</label>
          <Input
            type="text"
            value={settings.post_meta_title ?? ''}
            onChange={(event) =>
              onChange((prev) => ({ ...prev, post_meta_title: event.target.value }))
            }
            placeholder="Por defecto: el titulo del post"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Meta descripcion</label>
          <Textarea
            value={settings.post_meta_description ?? ''}
            onChange={(event) =>
              onChange((prev) => ({ ...prev, post_meta_description: event.target.value }))
            }
            rows={3}
            placeholder="Por defecto: el extracto del post"
          />
        </div>
      </div>
    </div>
  );
}
