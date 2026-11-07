'use client';

import { useState, type ReactNode } from 'react';
import type { EditorVariable } from '@/core/editor-variables/editor-variables.types';
import { IconToggleGroup } from '@/components/ui/icon-toggle-group';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import * as Icon from '@/components/ui/icons';
import { SpacingControl } from '@/components/ui/size-control';
import { Textarea } from '@/components/ui/textarea';
import type { MediaMap } from '@/media/media.types';
import {
  isContainer,
  type Block,
  type BlockLayout,
  type BlockType,
  type StyleDevice,
  type StyleState,
} from '../editor.types';
import { getStyleForEditing } from '../style-variants';
import {
  getAddableBlockTypes,
  getBlockInspectorDefinition,
  getBlockLabel,
} from './block-registry';
import { Group } from '@/components/ui/group';
import { VariablesPanel } from '@/components/editor/variables/variables-panel';
import { StyleStateTool } from '@/components/editor/tools/style-state-tool';
import { UniversalBlockTools } from '@/components/editor/tools/universal-block-tools';

export type InspectorTab = 'content' | 'style';

const VISIBILITY_DEVICES = [
  { value: 'desktop', label: 'Escritorio' },
  { value: 'tablet', label: 'Tablet' },
  { value: 'mobile', label: 'Movil' },
] as const satisfies readonly { value: StyleDevice; label: string }[];

interface BlockInspectorProps {
  block: Block;
  // Mapa de medios para resolver el puntero del bloque de imagen.
  media: MediaMap;
  variables: EditorVariable[];
  onVariablesChange: (variables: EditorVariable[]) => void;
  // Abre el selector de la biblioteca de medios.
  onPickMedia: () => void;
  onPatch: (patch: Partial<Block>) => void;
  // Escribe una propiedad CSS; un valor vacío la elimina.
  onStyle: (key: string, value: string) => void;
  onStylePatch: (patch: Record<string, string>) => void;
  styleDevice: StyleDevice;
  styleState: StyleState;
  onStyleStateChange: (state: StyleState) => void;
  // Añade un bloque hijo dentro del contenedor actual.
  onAddChild: (type: BlockType) => void;
  // Elimina un bloque hijo por id (p. ej. una columna).
  onRemoveChild: (childId: string) => void;
  tab: InspectorTab;
}

// Opciones de justificación y alineación de los contenedores flex.
function justifyOptions(direction: 'row' | 'column') {
  return direction === 'row'
    ? ([
      { value: 'flex-start', label: 'Inicio', Icon: Icon.AlignHorizontalJustifyStartIcon },
      { value: 'center', label: 'Centro', Icon: Icon.AlignHorizontalJustifyCenterIcon },
      { value: 'flex-end', label: 'Fin', Icon: Icon.AlignHorizontalJustifyEndIcon },
      { value: 'space-between', label: 'Separado', Icon: Icon.AlignHorizontalSpaceBetweenIcon },
      { value: 'space-around', label: 'Alrededor', Icon: Icon.AlignHorizontalSpaceAroundIcon },
    ] as const)
    : ([
      { value: 'flex-start', label: 'Inicio', Icon: Icon.AlignVerticalJustifyStartIcon },
      { value: 'center', label: 'Centro', Icon: Icon.AlignVerticalJustifyCenterIcon },
      { value: 'flex-end', label: 'Fin', Icon: Icon.AlignVerticalJustifyEndIcon },
      { value: 'space-between', label: 'Separado', Icon: Icon.AlignVerticalSpaceBetweenIcon },
      { value: 'space-around', label: 'Alrededor', Icon: Icon.AlignVerticalSpaceAroundIcon },
    ] as const);
}

function alignItemsOptions(direction: 'row' | 'column') {
  return direction === 'row'
    ? ([
      { value: 'stretch', label: 'Estirar', Icon: Icon.AlignVerticalDistributeCenterIcon },
      { value: 'flex-start', label: 'Inicio', Icon: Icon.AlignStartHorizontalIcon },
      { value: 'center', label: 'Centro', Icon: Icon.AlignCenterHorizontalIcon },
      { value: 'flex-end', label: 'Fin', Icon: Icon.AlignEndHorizontalIcon },
    ] as const)
    : ([
      { value: 'stretch', label: 'Estirar', Icon: Icon.AlignHorizontalDistributeCenterIcon },
      { value: 'flex-start', label: 'Inicio', Icon: Icon.AlignStartVerticalIcon },
      { value: 'center', label: 'Centro', Icon: Icon.AlignCenterVerticalIcon },
      { value: 'flex-end', label: 'Fin', Icon: Icon.AlignEndVerticalIcon },
    ] as const);
}

// Inspector del bloque seleccionado, al estilo de Elementor: pestaña de
// contenido (texto/imagen/contenedor) y pestaña de estilo (controles clicables
// que se traducen en propiedades CSS inline del bloque).
export function BlockInspector({
  block,
  media,
  variables,
  onVariablesChange,
  onPickMedia,
  onPatch,
  onStyle,
  onStylePatch,
  styleDevice,
  styleState,
  onStyleStateChange,
  onAddChild,
  onRemoveChild,
  tab,
}: BlockInspectorProps) {
  const style = getStyleForEditing(block, styleDevice, styleState);
  const variableEditor = (
    <VariablesPanel filterText="" variables={variables} onChange={onVariablesChange} />
  );
  return (
    <div className="space-y-4 p-4">
        {tab === 'content' ? (
          <ContentTabFields
            block={block}
            media={media}
            onPickMedia={onPickMedia}
            onPatch={onPatch}
            onAddChild={onAddChild}
            onRemoveChild={onRemoveChild}
          />
        ) : (
          <>
            <StyleStateTool value={styleState} onChange={onStyleStateChange} />
            <UniversalBlockTools
              block={block}
              style={style}
              align={block.align}
              onPatch={onPatch}
              onAlign={(align) => onPatch({ align })}
              onStyle={onStyle}
              onStylePatch={onStylePatch}
              variables={variables}
              variableEditor={variableEditor}
            />
          </>
        )}
    </div>
  );
}

function ContentTabFields({
  block,
  media,
  onPickMedia,
  onPatch,
  onAddChild,
  onRemoveChild,
}: {
  block: Block;
  media: MediaMap;
  onPickMedia: () => void;
  onPatch: (patch: Partial<Block>) => void;
  onAddChild: (type: BlockType) => void;
  onRemoveChild: (childId: string) => void;
}) {
  const inspector = getBlockInspectorDefinition(block.type);
  const hasContainerContent = inspector.content === 'container' || isContainer(block.type);

  return (
    <>
      {/* <ContentSection title="Contenido">
        {hasContainerContent ? (
          <ContainerFields
            block={block}
            onPatch={onPatch}
            onAddChild={onAddChild}
            onRemoveChild={onRemoveChild}
          />
        ) : (
          <ContentFields block={block} media={media} onPickMedia={onPickMedia} onPatch={onPatch} />
        )}
      </ContentSection> */}

      <ContentSection title="Accesibilidad">
        <AccessibilityFields block={block} media={media} onPatch={onPatch} />
      </ContentSection>

      <ContentSection title="Adaptabilidad">
        <AdaptabilityFields block={block} onPatch={onPatch} />
      </ContentSection>
    </>
  );
}

function ContentSection({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="border-t border-slate-200 pt-3 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-2 py-1 text-left text-sm font-semibold text-slate-900"
        aria-expanded={open}
      >
        <span>{title}</span>
        <Icon.NavChevron
          className={`h-3.5 w-3.5 text-slate-500 transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && <div className="mt-3 space-y-3">{children}</div>}
    </section>
  );
}

// Controles de un contenedor (group/columns/column): disposición flex + añadir
// bloques hijos (o columnas).
function ContainerFields({
  block,
  onPatch,
  onAddChild,
  onRemoveChild,
}: {
  block: Block;
  onPatch: (patch: Partial<Block>) => void;
  onAddChild: (type: BlockType) => void;
  onRemoveChild: (childId: string) => void;
}) {
  const layout = block.layout ?? {};
  const children = block.children ?? [];
  const layoutDirection = block.type === 'columns' ? 'row' : layout.direction ?? 'column';

  // Aplica un parche al layout; un valor vacío/undefined elimina la propiedad.
  function patchLayout(patch: Partial<BlockLayout>) {
    const next: BlockLayout = { ...layout };
    for (const [key, value] of Object.entries(patch)) {
      if (value === '' || value === undefined) {
        delete next[key as keyof BlockLayout];
      } else {
        // @ts-expect-error índice dinámico sobre BlockLayout
        next[key] = value;
      }
    }
    onPatch({ layout: next });
  }

  return (
    <>
      {block.type === 'group' && (
        <Group label="Orientación">
          <IconToggleGroup
            options={[
              { value: 'column', label: 'Vertical', Icon: Icon.OrderVerticalIcon },
              { value: 'row', label: 'Horizontal', Icon: Icon.OrderHorizontalIcon },
            ]}
            value={layout.direction ?? 'column'}
            onChange={(value) => patchLayout({ direction: value as 'row' | 'column' })}
            ariaLabel="Orientacion"
            allowDeselect={false}
          />
        </Group>
      )}

      <Group label="Separación entre elementos">
        <SpacingControl value={layout.gap} onChange={(value) => patchLayout({ gap: value })} />
      </Group>

      {(block.type === 'group' || block.type === 'columns') && (
        <Group label={block.type === 'columns' ? 'Alineación vertical' : 'Alineación transversal'}>
          <IconToggleGroup
            options={alignItemsOptions(layoutDirection)}
            value={layout.align ?? (block.type === 'columns' ? 'stretch' : '')}
            onChange={(value) => patchLayout({ align: value })}
            ariaLabel="Alineacion transversal"
          />
        </Group>
      )}

      {block.type === 'group' && (
        <Group label="Justificación">
          <IconToggleGroup
            options={justifyOptions(layoutDirection)}
            value={layout.justify ?? ''}
            onChange={(value) => patchLayout({ justify: value })}
            ariaLabel="Justificacion"
          />
        </Group>
      )}

      {block.type === 'columns' ? (
        <Group label={`Columnas (${children.length})`}>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onAddChild('column')}
              className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              + Columna
            </button>
            <button
              type="button"
              onClick={() => {
                const last = children[children.length - 1];
                if (last) onRemoveChild(last.id);
              }}
              disabled={children.length <= 1}
              className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              − Columna
            </button>
          </div>
        </Group>
      ) : (
        <Group label="Añadir dentro">
          <div className="flex flex-wrap gap-1">
            {getAddableBlockTypes().map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onAddChild(type)}
                className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                + {getBlockLabel(type)}
              </button>
            ))}
          </div>
        </Group>
      )}
    </>
  );
}

function ContentFields({
  block,
  media,
  onPickMedia,
  onPatch,
}: {
  block: Block;
  media: MediaMap;
  onPickMedia: () => void;
  onPatch: (patch: Partial<Block>) => void;
}) {
  const inspector = getBlockInspectorDefinition(block.type);

  if (inspector.content === 'image') {
    const ref = block.mediaId ? media[block.mediaId] : undefined;
    const previewUrl = ref?.url ?? block.url;
    return (
      <>
        <Group label="Imagen">
          {previewUrl ? (
            <div className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={block.text || ref?.alt || ''}
                className="max-h-40 w-full rounded-md border border-slate-200 object-contain"
              />
              <button
                type="button"
                onClick={onPickMedia}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Reemplazar imagen
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onPickMedia}
              className="w-full rounded-md border border-dashed border-slate-300 bg-white px-3 py-6 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Seleccionar imagen
            </button>
          )}
        </Group>
      </>
    );
  }

  if (block.type === 'list') {
    return (
      <Group label="Elementos de la lista">
        <Textarea
          value={block.text}
          onChange={(event) => onPatch({ text: event.target.value })}
          rows={6}
        />
      </Group>
    );
  }

  if (!inspector.textRows) {
    return (
      <Group label="Texto del título">
        <Input
          type="text"
          value={block.text}
          onChange={(event) => onPatch({ text: event.target.value })}
          placeholder="Texto del título"
          className="font-semibold"
        />
      </Group>
    );
  }

  return (
    <Group label={block.type === 'quote' ? 'Texto de la cita' : 'Texto del párrafo'}>
      <Textarea
        value={block.text}
        onChange={(event) => onPatch({ text: event.target.value })}
        rows={block.type === 'quote' ? 3 : 6}
      />
    </Group>
  );
}

function AccessibilityFields({
  block,
  media,
  onPatch,
}: {
  block: Block;
  media: MediaMap;
  onPatch: (patch: Partial<Block>) => void;
}) {
  const ref = block.mediaId ? media[block.mediaId] : undefined;

  return (
    <>
      {block.type === 'image' && (
        <Group label="Texto alternativo (alt)">
          <Input
            type="text"
            value={block.text}
            placeholder={ref?.alt ?? undefined}
            onChange={(event) => onPatch({ text: event.target.value })}
          />
        </Group>
      )}

      <Group label="Etiqueta ARIA">
        <Input
          type="text"
          value={block.ariaLabel ?? ''}
          onChange={(event) => onPatch({ ariaLabel: event.target.value })}
        />
      </Group>

      <Group label="Titulo">
        <Input
          type="text"
          value={block.title ?? ''}
          onChange={(event) => onPatch({ title: event.target.value })}
        />
      </Group>
    </>
  );
}

function AdaptabilityFields({
  block,
  onPatch,
}: {
  block: Block;
  onPatch: (patch: Partial<Block>) => void;
}) {
  return (
    <Group label="Visibilidad">
      <div className="space-y-2">
        {VISIBILITY_DEVICES.map((device) => (
          <div
            key={device.value}
            className="grid grid-cols-[72px_minmax(0,1fr)] items-center gap-2"
          >
            <span className="text-xs font-medium text-slate-500">{device.label}</span>
            <Switch
              checked={block.visibility?.[device.value] ?? true}
              leftLabel="Oculto"
              rightLabel="Visible"
              onChange={(checked) =>
                onPatch({
                  visibility: {
                    ...block.visibility,
                    [device.value]: checked,
                  },
                })
              }
            />
          </div>
        ))}
      </div>
    </Group>
  );
}
