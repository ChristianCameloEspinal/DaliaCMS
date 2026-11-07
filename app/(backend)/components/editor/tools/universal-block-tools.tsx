'use client';

import { useState, type ReactNode } from 'react';
import type { EditorVariable } from '@/core/editor-variables/editor-variables.types';
import {
  BoxSideControl,
  BoxTextSpacingControl,
  LinkedBoxAxisGroup,
  LinkedBoxCornerGroup,
  LinkedBoxSideGroup,
} from '@/components/ui/box-control';
import { ColorControl } from '@/components/ui/color-control';
import { IconToggleGroup } from '@/components/ui/icon-toggle-group';
import { IconValueInput, type IconValueVariable } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ShadowControl } from '@/components/ui/shadow-control';
import { Group } from '@/components/ui/group';
import * as Icon from '@/components/ui/icons';
import type { Block, BlockAlign, BlockLayout } from '../editor.types';
import {
  SELECT_FONT_FAMILY_PRESETS,
  SELECT_FONT_SIZE_PRESETS,
  SELECT_FONT_WEIGHT_PRESETS,
  SELECT_TEXT_DECORATION_PRESETS,
} from '../editor.presets';

const TEXT_ALIGN_OPTIONS = [
  { value: 'left', label: 'Izquierda', Icon: Icon.AlignLeftIcon },
  { value: 'center', label: 'Centro', Icon: Icon.AlignCenterIcon },
  { value: 'right', label: 'Derecha', Icon: Icon.AlignRightIcon },
  { value: 'justify', label: 'Justificado', Icon: Icon.AlignJustifiedIcon },
] as const;

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

const TEXT_DECORATION_OPTIONS = [
  { value: 'none', label: 'Ninguno', Icon: Icon.XIcon },
  { value: 'underline', label: 'Subrayado', Icon: Icon.UnderlineIcon },
  { value: 'line-through', label: 'Tachado', Icon: Icon.StrikeIcon },
] as const;

const FONT_STYLE_OPTIONS = [
  { value: 'normal', label: 'Normal', Icon: Icon.TextIcon },
  { value: 'italic', label: 'Cursiva', Icon: Icon.ItalicIcon },
] as const;

const TEXT_TRANSFORM_OPTIONS = [
  { value: 'none', label: 'Normal', Icon: Icon.NoneIcon },
  { value: 'uppercase', label: 'Mayusculas', Icon: Icon.CaseUpperIcon },
  { value: 'lowercase', label: 'Minusculas', Icon: Icon.CaseLowerIcon },
  { value: 'capitalize', label: 'Capitalizar', Icon: Icon.CaseSensitiveIcon },
] as const;

const BORDER_STYLE_OPTIONS = [
  { value: 'none', label: 'Ninguno', Icon: Icon.NoneIcon },
  { value: 'solid', label: 'Solido', Icon: Icon.BorderSolidIcon },
  { value: 'dashed', label: 'Guiones', Icon: Icon.BorderDashedIcon },
  { value: 'dotted', label: 'Puntos', Icon: Icon.BorderDottedIcon },
] as const;

const OBJECT_FIT_OPTIONS = [
  { value: '', label: 'Auto' },
  { value: 'contain', label: 'Contener' },
  { value: 'cover', label: 'Cubrir' },
  { value: 'fill', label: 'Rellenar' },
  { value: 'none', label: 'Original' },
] as const;

const ASPECT_RATIO_OPTIONS = [
  { value: '', label: 'Auto' },
  { value: '1 / 1', label: '1:1' },
  { value: '4 / 3', label: '4:3' },
  { value: '3 / 2', label: '3:2' },
  { value: '16 / 9', label: '16:9' },
  { value: '21 / 9', label: '21:9' },
  { value: '3 / 4', label: '3:4' },
  { value: '9 / 16', label: '9:16' },
] as const;

const OBJECT_POSITION_VERTICAL_OPTIONS = [
  { value: '', label: 'Auto' },
  { value: 'top', label: 'Arriba' },
  { value: 'center', label: 'Centro' },
  { value: 'bottom', label: 'Abajo' },
] as const;

const OBJECT_POSITION_HORIZONTAL_OPTIONS = [
  { value: '', label: 'Auto' },
  { value: 'left', label: 'Izquierda' },
  { value: 'center', label: 'Centro' },
  { value: 'right', label: 'Derecha' },
] as const;

const POSITION_OPTIONS = [
  { value: '', label: 'Por defecto' },
  { value: 'static', label: 'Static' },
  { value: 'relative', label: 'Relative' },
  { value: 'absolute', label: 'Absolute' },
  { value: 'fixed', label: 'Fixed' },
  { value: 'sticky', label: 'Sticky' },
] as const;

const OVERFLOW_OPTIONS = [
  { value: '', label: 'Por defecto' },
  { value: 'visible', label: 'Visible' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'auto', label: 'Auto' },
  { value: 'scroll', label: 'Scroll' },
] as const;

const BLOCK_WRAP = [
  { value: 'normal', label: 'Normal', Icon: Icon.WidthNormalIcon },
  { value: 'wide', label: 'Ancho', Icon: Icon.WidthWideIcon },
  { value: 'full', label: 'Completo', Icon: Icon.WidthFullIcon },
] as const;

const PADDING_KEYS = {
  top: 'paddingTop',
  right: 'paddingRight',
  bottom: 'paddingBottom',
  left: 'paddingLeft',
} as const;

const MARGIN_KEYS = {
  top: 'marginTop',
  right: 'marginRight',
  bottom: 'marginBottom',
  left: 'marginLeft',
} as const;

const RADIUS_KEYS = {
  topLeft: 'borderTopLeftRadius',
  topRight: 'borderTopRightRadius',
  bottomRight: 'borderBottomRightRadius',
  bottomLeft: 'borderBottomLeftRadius',
} as const;

const BORDER_WIDTH_KEYS = {
  top: 'borderTopWidth',
  right: 'borderRightWidth',
  bottom: 'borderBottomWidth',
  left: 'borderLeftWidth',
} as const;

export function UniversalBlockTools({
  block,
  style,
  align,
  onPatch,
  onAlign,
  onStyle,
  onStylePatch,
  variables,
  variableEditor,
}: {
  block: Block;
  style: Record<string, string>;
  align: BlockAlign | undefined;
  onPatch: (patch: Partial<Block>) => void;
  onAlign: (align: BlockAlign | undefined) => void;
  onStyle: (key: string, value: string) => void;
  onStylePatch: (patch: Record<string, string>) => void;
  variables: EditorVariable[];
  variableEditor: ReactNode;
}) {
  const layout = block.layout ?? {};
  const patchLayout = createLayoutPatcher(layout, onPatch);
  const gapValues = splitAxisGap(layout.gap);
  const layoutDirection = block.type === 'columns' ? 'row' : layout.direction ?? 'column';
  const objectPosition = splitObjectPosition(style.objectPosition);

  function patchObjectPosition(axis: 'vertical' | 'horizontal', value: string) {
    onStyle(
      'objectPosition',
      joinObjectPosition(
        axis === 'vertical' ? value : objectPosition.vertical,
        axis === 'horizontal' ? value : objectPosition.horizontal
      )
    );
  }

  return (
    <>
      <LayoutTool
        block={block}
        style={style}
        align={align}
        gapValues={gapValues}
        layoutDirection={layoutDirection}
        onAlign={onAlign}
        onStyle={onStyle}
        patchLayout={patchLayout}
        variables={variables}
        variableEditor={variableEditor}
      />
      <PositionTool style={style} variables={variables} onStyle={onStyle} />
      <TypographyTool
        style={style}
        onStyle={onStyle}
        variables={variables}
        variableEditor={variableEditor}
      />
      <SpacingTool
        style={style}
        onStyle={onStyle}
        onStylePatch={onStylePatch}
        variables={variables}
        variableEditor={variableEditor}
      />
      <DimensionTool
        style={style}
        onStyle={onStyle}
        variables={variables}
        variableEditor={variableEditor}
      />
      <ColorTool
        style={style}
        onStyle={onStyle}
        variables={variables}
        variableEditor={variableEditor}
      />
      <ShadowTool
        style={style}
        onStyle={onStyle}
        variables={variables}
        variableEditor={variableEditor}
      />
      <ImageTool
        style={style}
        objectPosition={objectPosition}
        onStyle={onStyle}
        patchObjectPosition={patchObjectPosition}
      />
      <BorderTool
        style={style}
        onStyle={onStyle}
        onStylePatch={onStylePatch}
        variables={variables}
        variableEditor={variableEditor}
      />
    </>
  );
}

function LayoutTool({
  block,
  style,
  align,
  gapValues,
  layoutDirection,
  onAlign,
  onStyle,
  patchLayout,
  variables,
  variableEditor,
}: {
  block: Block;
  style: Record<string, string>;
  align: BlockAlign | undefined;
  gapValues: { horizontal?: string; vertical?: string };
  layoutDirection: 'row' | 'column';
  onAlign: (align: BlockAlign | undefined) => void;
  onStyle: (key: string, value: string) => void;
  patchLayout: (patch: Partial<BlockLayout>) => void;
  variables: IconValueVariable[];
  variableEditor: ReactNode;
}) {
  const blockAlign = align ?? 'normal';

  return (
    <ToolSection title="Layout">
      <div className="flex flex-wrap gap-2">
        <Group label="Disposicion">
          <IconToggleGroup
            options={BLOCK_WRAP}
            value={blockAlign}
            onChange={(value) => onAlign(value === 'normal' || value === '' ? undefined : value)}
            ariaLabel="Alineacion del bloque"
            allowDeselect={false}
          />
        </Group>

        <Group label="Direccion">
          <IconToggleGroup
            options={[
              { value: 'column', label: 'Vertical', Icon: Icon.OrderVerticalIcon },
              { value: 'row', label: 'Horizontal', Icon: Icon.OrderHorizontalIcon },
            ]}
            value={block.layout?.direction ?? 'column'}
            onChange={(value) => patchLayout({ direction: value as 'row' | 'column' })}
            ariaLabel="Orientacion"
            allowDeselect={false}
          />
        </Group>
      </div>

      <LinkedBoxAxisGroup
        label="Separacion entre elementos"
        values={gapValues}
        onChange={(axis, value) => {
          const next = { ...gapValues, [axis]: value };
          patchLayout({ gap: joinAxisGap(next.vertical, next.horizontal) });
        }}
        onLinkedChange={(values) => patchLayout({ gap: joinAxisGap(values.vertical, values.horizontal) })}
        ariaLabel="Separacion entre elementos por ejes"
        variableOptions={variables}
        variableEditor={variableEditor}
      />

      <div className="flex flex-wrap gap-2">
        <Group label="Alineacion">
          <IconToggleGroup
            options={alignItemsOptions(layoutDirection)}
            value={block.layout?.align ?? ''}
            onChange={(value) => patchLayout({ align: value })}
            ariaLabel="Alineacion transversal"
          />
        </Group>

        <Group label="Envoltura">
          <IconToggleGroup
            options={[
              { value: 'nowrap', label: 'No envolver', Icon: Icon.NoneIcon },
              { value: 'wrap', label: 'Envolver', Icon: Icon.TextWrapIcon },
            ]}
            value={block.layout?.wrap ? 'wrap' : 'nowrap'}
            onChange={(value) => patchLayout({ wrap: value === 'wrap' ? true : undefined })}
            ariaLabel="Ajuste de linea"
            allowDeselect={false}
          />
        </Group>

        <Group label="Overflow">
          <Select
            options={OVERFLOW_OPTIONS}
            value={style.overflow ?? ''}
            onChange={(event) => onStyle('overflow', event.target.value)}
          />
        </Group>
      </div>

      <Group label="Justificacion">
        <IconToggleGroup
          options={justifyOptions(layoutDirection)}
          value={block.layout?.justify ?? ''}
          onChange={(value) => patchLayout({ justify: value })}
          ariaLabel="Justificacion"
        />
      </Group>
    </ToolSection>
  );
}

function PositionTool({
  style,
  variables,
  onStyle,
}: {
  style: Record<string, string>;
  variables: IconValueVariable[];
  onStyle: (key: string, value: string) => void;
}) {
  return (
    <ToolSection title="Posicion">
      <Group label="Tipo">
        <Select
          options={POSITION_OPTIONS}
          value={style.position ?? ''}
          onChange={(event) => onStyle('position', event.target.value)}
          className="w-full"
        />
      </Group>

      <Group label="Valores">
        <BoxSideControl
          values={{
            top: style.top,
            right: style.right,
            bottom: style.bottom,
            left: style.left,
          }}
          onChange={(side, value) => onStyle(side, value)}
          ariaLabel="Valores de posicion"
          variableOptions={variables}
        />
      </Group>
    </ToolSection>
  );
}

function TypographyTool({
  style,
  onStyle,
  variables,
  variableEditor,
}: {
  style: Record<string, string>;
  onStyle: (key: string, value: string) => void;
  variables: IconValueVariable[];
  variableEditor: ReactNode;
}) {
  return (
    <ToolSection title="Tipografia">
      <div className="flex flex-wrap gap-2">
        <Group label="Tamano">
          <Select
            options={SELECT_FONT_SIZE_PRESETS}
            value={style.fontSize}
            onChange={(event) => onStyle('fontSize', event.target.value)}
          />
        </Group>

        <Group label="Fuente">
          <Select
            options={SELECT_FONT_FAMILY_PRESETS}
            value={style.fontFamily ?? ''}
            onChange={(event) => onStyle('fontFamily', event.target.value)}
          />
        </Group>
      </div>

      <div className="flex flex-wrap gap-2">
        <Group label="Peso">
          <Select
            options={SELECT_FONT_WEIGHT_PRESETS}
            value={style.fontWeight}
            onChange={(event) => onStyle('fontWeight', event.target.value)}
          />
        </Group>

        <Group label="Decoracion">
          <IconToggleGroup
            options={TEXT_DECORATION_OPTIONS}
            value={style.textDecoration ?? 'none'}
            onChange={(value) => onStyle('textDecoration', value === 'none' ? '' : value)}
            ariaLabel="Decoracion del texto"
            allowDeselect={false}
          />
        </Group>
      </div>

      <div className="flex flex-wrap gap-2">
        <Group label="Estilo">
          <IconToggleGroup
            options={FONT_STYLE_OPTIONS}
            value={style.fontStyle ?? 'normal'}
            onChange={(value) => onStyle('fontStyle', value === 'normal' ? '' : value)}
            ariaLabel="Estilo de fuente"
            allowDeselect={false}
          />
        </Group>

        <Group label="Transformacion">
          <IconToggleGroup
            options={TEXT_TRANSFORM_OPTIONS}
            value={(style.textTransform || 'none') as (typeof TEXT_TRANSFORM_OPTIONS)[number]['value']}
            onChange={(value) => onStyle('textTransform', value === 'none' ? '' : value)}
            ariaLabel="Transformacion del texto"
            allowDeselect={false}
          />
        </Group>
      </div>

      <Group label="Espaciado">
        <BoxTextSpacingControl
          values={{
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing,
          }}
          onChange={(field, value) => onStyle(field, value)}
          ariaLabel="Espaciado de texto"
          variableOptions={variables}
          variableEditor={variableEditor}
        />
      </Group>

      <div className="flex flex-wrap gap-2">
        <Group label="Alineacion del texto">
          <IconToggleGroup
            options={TEXT_ALIGN_OPTIONS}
            value={style.textAlign as '' | (typeof TEXT_ALIGN_OPTIONS)[number]['value']}
            onChange={(value) => onStyle('textAlign', value)}
            ariaLabel="Alineacion del texto"
          />
        </Group>

        <Group label="Envoltura">
          <IconToggleGroup
            options={[
              { value: 'normal', label: 'Envolver', Icon: Icon.TextWrapIcon },
              { value: 'nowrap', label: 'No envolver', Icon: Icon.NoneIcon },
            ]}
            value={style.whiteSpace === 'nowrap' ? 'nowrap' : 'normal'}
            onChange={(value) => onStyle('whiteSpace', value === 'normal' ? '' : 'nowrap')}
            ariaLabel="Ajuste de texto"
            allowDeselect={false}
          />
        </Group>
      </div>
    </ToolSection>
  );
}

function SpacingTool({
  style,
  onStyle,
  onStylePatch,
  variables,
  variableEditor,
}: {
  style: Record<string, string>;
  onStyle: (key: string, value: string) => void;
  onStylePatch: (patch: Record<string, string>) => void;
  variables: IconValueVariable[];
  variableEditor: ReactNode;
}) {
  return (
    <ToolSection title="Espaciado">
      <LinkedBoxSideGroup
        label="Padding"
        values={{
          top: style.paddingTop ?? style.padding,
          right: style.paddingRight ?? style.padding,
          bottom: style.paddingBottom ?? style.padding,
          left: style.paddingLeft ?? style.padding,
        }}
        onChange={(side, value) => onStyle(PADDING_KEYS[side], value)}
        onLinkedChange={(values) =>
          onStylePatch({
            padding: values.top ?? '',
            paddingTop: '',
            paddingRight: '',
            paddingBottom: '',
            paddingLeft: '',
          })
        }
        ariaLabel="Padding por lados"
        variableOptions={variables}
        variableEditor={variableEditor}
      />

      <LinkedBoxSideGroup
        label="Margen"
        values={{
          top: style.marginTop,
          right: style.marginRight,
          bottom: style.marginBottom,
          left: style.marginLeft,
        }}
        onChange={(side, value) => onStyle(MARGIN_KEYS[side], value)}
        onLinkedChange={(values) =>
          onStylePatch({
            margin: values.top ?? '',
            marginTop: '',
            marginRight: '',
            marginBottom: '',
            marginLeft: '',
          })
        }
        ariaLabel="Margen por lados"
        variableOptions={variables}
        variableEditor={variableEditor}
      />
    </ToolSection>
  );
}

function DimensionTool({
  style,
  onStyle,
  variables,
  variableEditor,
}: {
  style: Record<string, string>;
  onStyle: (key: string, value: string) => void;
  variables: IconValueVariable[];
  variableEditor: ReactNode;
}) {
  return (
    <ToolSection title="Dimensiones">
      <Group label="Alto">
        <div className="grid grid-cols-2 items-center gap-2">
          <span className="col-span-2">
            <IconValueInput
              label="Ancho"
              icon={Icon.WidthIcon}
              value={style.width}
              hasVariable={true}
              unitType="magnitude"
              variableOptions={variables}
              variableEditor={variableEditor}
              onChange={(value) => onStyle('width', value)}
            />
          </span>
          <IconValueInput
            label="Ancho minimo"
            icon={Icon.MinWidthIcon}
            value={style.minWidth}
            hasVariable={true}
            unitType="magnitude"
            variableOptions={variables}
            variableEditor={variableEditor}
            onChange={(value) => onStyle('minWidth', value)}
          />
          <IconValueInput
            label="Ancho maximo"
            icon={Icon.MaxWidthIcon}
            value={style.maxWidth}
            hasVariable={true}
            unitType="magnitude"
            variableOptions={variables}
            variableEditor={variableEditor}
            onChange={(value) => onStyle('maxWidth', value)}
          />
        </div>
      </Group>
      <Group label="Ancho">
        <div className="grid grid-cols-2 items-center gap-2">
          <span className="col-span-2">
            <IconValueInput
              label="Alto"
              icon={Icon.HeightIcon}
              value={style.height}
              hasVariable={true}
              unitType="magnitude"
              variableOptions={variables}
              variableEditor={variableEditor}
              onChange={(value) => onStyle('height', value)}
            />
          </span>
          <IconValueInput
            label="Alto minimo"
            icon={Icon.MinHeightIcon}
            value={style.minHeight}
            hasVariable={true}
            unitType="magnitude"
            variableOptions={variables}
            variableEditor={variableEditor}
            onChange={(value) => onStyle('minHeight', value)}
          />
          <IconValueInput
            label="Alto maximo"
            icon={Icon.MaxHeightIcon}
            value={style.maxHeight}
            hasVariable={true}
            unitType="magnitude"
            variableOptions={variables}
            variableEditor={variableEditor}
            onChange={(value) => onStyle('maxHeight', value)}
          />
        </div>
      </Group>
    </ToolSection>
  );
}

function ColorTool({
  style,
  onStyle,
  variables,
  variableEditor,
}: {
  style: Record<string, string>;
  onStyle: (key: string, value: string) => void;
  variables: IconValueVariable[];
  variableEditor: ReactNode;
}) {
  return (
    <ToolSection title="Color">
      <Group label="Fondo">
        <ColorControl
          hasVariable={true}
          value={style.backgroundColor}
          variableOptions={variables}
          variableEditor={variableEditor}
          onChange={(value) => onStyle('backgroundColor', value)}
          allowImage
          onPickImage={() => console.info('Mock: seleccionar backgroundImage')}
        />
      </Group>

      <Group label="Texto">
        <ColorControl
          hasVariable={true}
          value={style.color}
          variableOptions={variables}
          variableEditor={variableEditor}
          onChange={(value) => onStyle('color', value)}
        />
      </Group>
    </ToolSection>
  );
}

function ShadowTool({
  style,
  onStyle,
  variables,
  variableEditor,
}: {
  style: Record<string, string>;
  onStyle: (key: string, value: string) => void;
  variables: IconValueVariable[];
  variableEditor: ReactNode;
}) {
  return (
    <ToolSection title="Sombra">
      <ShadowControl
        value={style.boxShadow}
        variableOptions={variables}
        variableEditor={variableEditor}
        onChange={(value) => onStyle('boxShadow', value)}
      />
    </ToolSection>
  );
}

function ImageTool({
  style,
  objectPosition,
  onStyle,
  patchObjectPosition,
}: {
  style: Record<string, string>;
  objectPosition: { vertical: string; horizontal: string };
  onStyle: (key: string, value: string) => void;
  patchObjectPosition: (axis: 'vertical' | 'horizontal', value: string) => void;
}) {
  return (
    <ToolSection title="Imagen">
      <div className="flex flex-wrap gap-2">
        <Group label="Ajuste">
          <Select
            options={OBJECT_FIT_OPTIONS}
            value={style.objectFit ?? ''}
            onChange={(event) => onStyle('objectFit', event.target.value)}
          />
        </Group>

        <Group label="Proporcion">
          <Select
            options={ASPECT_RATIO_OPTIONS}
            value={style.aspectRatio ?? ''}
            onChange={(event) => onStyle('aspectRatio', event.target.value)}
            className="w-full"
          />
        </Group>
      </div>

      <div className="flex flex-wrap gap-2">
        <Group label="Posicion vertical">
          <Select
            options={OBJECT_POSITION_VERTICAL_OPTIONS}
            value={objectPosition.vertical}
            onChange={(event) => patchObjectPosition('vertical', event.target.value)}
            className="w-full"
          />
        </Group>

        <Group label="Posicion horizontal">
          <Select
            options={OBJECT_POSITION_HORIZONTAL_OPTIONS}
            value={objectPosition.horizontal}
            onChange={(event) => patchObjectPosition('horizontal', event.target.value)}
            className="w-full"
          />
        </Group>
      </div>
    </ToolSection>
  );
}

function BorderTool({
  style,
  onStyle,
  onStylePatch,
  variables,
  variableEditor,
}: {
  style: Record<string, string>;
  onStyle: (key: string, value: string) => void;
  onStylePatch: (patch: Record<string, string>) => void;
  variables: IconValueVariable[];
  variableEditor: ReactNode;
}) {
  return (
    <ToolSection title="Borde">
      <Group label="Estilo">
        <IconToggleGroup
          options={BORDER_STYLE_OPTIONS}
          value={(style.borderStyle || 'none') as (typeof BORDER_STYLE_OPTIONS)[number]['value']}
          onChange={(value) => onStyle('borderStyle', value === 'none' ? '' : value)}
          ariaLabel="Estilo de borde"
          allowDeselect={false}
        />
      </Group>

      <LinkedBoxSideGroup
        label="Tamano"
        values={{
          top: style.borderTopWidth ?? style.borderWidth,
          right: style.borderRightWidth ?? style.borderWidth,
          bottom: style.borderBottomWidth ?? style.borderWidth,
          left: style.borderLeftWidth ?? style.borderWidth,
        }}
        onChange={(side, value) => onStyle(BORDER_WIDTH_KEYS[side], value)}
        onLinkedChange={(values) =>
          onStylePatch({
            borderWidth: values.top ?? '',
            borderTopWidth: '',
            borderRightWidth: '',
            borderBottomWidth: '',
            borderLeftWidth: '',
          })
        }
        ariaLabel="Tamano de borde por lados"
        variableOptions={variables}
        variableEditor={variableEditor}
      />

      <LinkedBoxCornerGroup
        label="Esquinas"
        values={{
          topLeft: style.borderTopLeftRadius ?? style.borderRadius,
          topRight: style.borderTopRightRadius ?? style.borderRadius,
          bottomRight: style.borderBottomRightRadius ?? style.borderRadius,
          bottomLeft: style.borderBottomLeftRadius ?? style.borderRadius,
        }}
        onChange={(corner, value) => onStyle(RADIUS_KEYS[corner], value)}
        onLinkedChange={(values) =>
          onStylePatch({
            borderRadius: values.topLeft ?? '',
            borderTopLeftRadius: '',
            borderTopRightRadius: '',
            borderBottomRightRadius: '',
            borderBottomLeftRadius: '',
          })
        }
        ariaLabel="Radio por esquinas"
        variableOptions={variables}
        variableEditor={variableEditor}
      />

      <Group label="Color">
        <ColorControl
          hasVariable={true}
          value={style.borderColor}
          variableOptions={variables}
          variableEditor={variableEditor}
          onChange={(value) => onStyle('borderColor', value)}
        />
      </Group>
    </ToolSection>
  );
}

function ToolSection({ title, children }: { title: string; children: ReactNode }) {
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

function createLayoutPatcher(
  layout: BlockLayout,
  onPatch: (patch: Partial<Block>) => void
) {
  return function patchLayout(patch: Partial<BlockLayout>) {
    const next: BlockLayout = { ...layout };
    for (const [key, value] of Object.entries(patch)) {
      if (value === '' || value === undefined) {
        delete next[key as keyof BlockLayout];
      } else {
        // @ts-expect-error indice dinamico sobre BlockLayout
        next[key] = value;
      }
    }
    onPatch({ layout: next });
  };
}

function splitAxisGap(value?: string): { horizontal?: string; vertical?: string } {
  if (!value) return {};
  const [vertical, horizontal = vertical] = value.trim().split(/\s+/, 2);
  return { horizontal, vertical };
}

function joinAxisGap(vertical?: string, horizontal?: string): string {
  if (!vertical && !horizontal) return '';
  const nextVertical = vertical || horizontal || '';
  const nextHorizontal = horizontal || vertical || '';
  return nextVertical === nextHorizontal ? nextVertical : `${nextVertical} ${nextHorizontal}`;
}

function splitObjectPosition(value?: string): { vertical: string; horizontal: string } {
  if (!value) return { vertical: '', horizontal: '' };

  let vertical = '';
  let horizontal = '';

  for (const token of value.trim().split(/\s+/)) {
    if ((token === 'left' || token === 'right') && !horizontal) {
      horizontal = token;
      continue;
    }

    if ((token === 'top' || token === 'bottom') && !vertical) {
      vertical = token;
      continue;
    }

    if (token === 'center') {
      if (!vertical) {
        vertical = token;
      } else if (!horizontal) {
        horizontal = token;
      }
    }
  }

  return {
    vertical: vertical || 'center',
    horizontal: horizontal || 'center',
  };
}

function joinObjectPosition(vertical?: string, horizontal?: string): string {
  if (!vertical && !horizontal) return '';
  return `${vertical || 'center'} ${horizontal || 'center'}`;
}
