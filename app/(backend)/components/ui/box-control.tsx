'use client';

import { IconValueInput, type IconValueVariable } from '@/components/ui/input';
import type { ReactNode } from 'react';
import {
  BoxTopIcon,
  BoxRightIcon,
  BoxBottomIcon,
  BoxLeftIcon,
  BoxTopLeftIcon,
  BoxTopRightIcon,
  BoxBottomRightIcon,
  BoxBottomLeftIcon,
  BoxHorizontalIcon,
  BoxVerticalIcon,
  LetterSpacingIcon,
  LineHeightIcon,
  LinkItemIcon
} from '@/components/ui/icons';
import { useState } from 'react';
import { Group } from './group';
import { Button } from './button';

export type BoxSide = 'top' | 'right' | 'bottom' | 'left';
export type BoxCorner = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';
export type BoxAxis = 'horizontal' | 'vertical';
export type BoxTextSpacing = 'lineHeight' | 'letterSpacing';

type BoxValues<T extends string> = Partial<Record<T, string>>;

interface BoxSideControlProps {
  values: BoxValues<BoxSide>;
  onChange: (side: BoxSide, value: string) => void;
  onLinkedChange?: (values: BoxValues<BoxSide>) => void;
  ariaLabel: string;
  linked?: boolean;
  variableEditor?: ReactNode;
  variableOptions?: IconValueVariable[];
}

interface BoxCornerControlProps {
  values: BoxValues<BoxCorner>;
  onChange: (corner: BoxCorner, value: string) => void;
  onLinkedChange?: (values: BoxValues<BoxCorner>) => void;
  ariaLabel: string;
  linked?: boolean;
  variableEditor?: ReactNode;
  variableOptions?: IconValueVariable[];
}

interface BoxAxisControlProps {
  values: BoxValues<BoxAxis>;
  onChange: (axis: BoxAxis, value: string) => void;
  onLinkedChange?: (values: BoxValues<BoxAxis>) => void;
  ariaLabel: string;
  linked?: boolean;
  variableEditor?: ReactNode;
  variableOptions?: IconValueVariable[];
}

interface BoxTextSpacingControlProps {
  values: BoxValues<BoxTextSpacing>;
  onChange: (field: BoxTextSpacing, value: string) => void;
  ariaLabel: string;
  variableEditor?: ReactNode;
  variableOptions?: IconValueVariable[];
}

export function BoxSideControl({
  values,
  onChange,
  onLinkedChange,
  ariaLabel,
  linked: linkedProp,
  variableEditor,
  variableOptions = [],
}: BoxSideControlProps) {
  const linked = linkedProp ?? false;

  function handleChange(side: BoxSide, value: string) {
    if (!linked) {
      onChange(side, value);
      return;
    }

    const next = { top: value, right: value, bottom: value, left: value };
    if (onLinkedChange) {
      onLinkedChange(next);
      return;
    }

    (['top', 'right', 'bottom', 'left'] as const).forEach((linkedSide) => onChange(linkedSide, value));
  }

  return (
    <div
      className="grid grid-cols-2 grid-rows-2 gap-2 w-full"
      role="group"
      aria-label={ariaLabel}
    >
      <IconValueInput
        label="Derecha"
        icon={BoxRightIcon}
        value={values.right}
        hasVariable={true}
        unitType="magnitude"
        variableEditor={variableEditor}
        variableOptions={variableOptions}
        onChange={(value) => handleChange('right', value)}
      />
      <IconValueInput
        label="Superior"
        icon={BoxTopIcon}
        value={values.top}
        hasVariable={true}
        unitType="magnitude"
        variableEditor={variableEditor}
        variableOptions={variableOptions}
        onChange={(value) => handleChange('top', value)}
      />
      <IconValueInput
        label="Izquierda"
        icon={BoxLeftIcon}
        value={values.left}
        hasVariable={true}
        unitType="magnitude"
        variableEditor={variableEditor}
        variableOptions={variableOptions}
        onChange={(value) => handleChange('left', value)}
      />

      <IconValueInput
        label="Inferior"
        icon={BoxBottomIcon}
        value={values.bottom}
        hasVariable={true}
        unitType="magnitude"
        variableEditor={variableEditor}
        variableOptions={variableOptions}
        onChange={(value) => handleChange('bottom', value)}
      />
    </div>
  );
}

export function BoxCornerControl({
  values,
  onChange,
  onLinkedChange,
  ariaLabel,
  linked: linkedProp,
  variableEditor,
  variableOptions = [],
}: BoxCornerControlProps) {
  const linked = linkedProp ?? false;

  function handleChange(corner: BoxCorner, value: string) {
    if (!linked) {
      onChange(corner, value);
      return;
    }

    const next = { topLeft: value, topRight: value, bottomRight: value, bottomLeft: value };
    if (onLinkedChange) {
      onLinkedChange(next);
      return;
    }

    (['topLeft', 'topRight', 'bottomRight', 'bottomLeft'] as const).forEach((linkedCorner) => onChange(linkedCorner, value));
  }

  return (
    <div
      className="grid w-full grid-cols-2 grid-rows-2 gap-2"
      role="group"
      aria-label={ariaLabel}
    >
      <IconValueInput
        label="Superior izquierda"
        icon={BoxTopLeftIcon}
        value={values.topLeft}
        hasVariable={true}
        unitType="magnitude"
        variableEditor={variableEditor}
        variableOptions={variableOptions}
        onChange={(value) => handleChange('topLeft', value)}
      />

      <IconValueInput
        label="Superior derecha"
        icon={BoxTopRightIcon}
        value={values.topRight}
        hasVariable={true}
        unitType="magnitude"
        variableEditor={variableEditor}
        variableOptions={variableOptions}
        onChange={(value) => handleChange('topRight', value)}
      />
      <IconValueInput
        label="Inferior izquierda"
        icon={BoxBottomLeftIcon}
        value={values.bottomLeft}
        hasVariable={true}
        unitType="magnitude"
        variableEditor={variableEditor}
        variableOptions={variableOptions}
        onChange={(value) => handleChange('bottomLeft', value)}
      />

      <IconValueInput
        label="Inferior derecha"
        icon={BoxBottomRightIcon}
        value={values.bottomRight}
        hasVariable={true}
        unitType="magnitude"
        variableEditor={variableEditor}
        variableOptions={variableOptions}
        onChange={(value) => handleChange('bottomRight', value)}
      />
    </div>
  );
}

export function BoxAxisControl({
  values,
  onChange,
  onLinkedChange,
  ariaLabel,
  linked: linkedProp,
  variableEditor,
  variableOptions = [],
}: BoxAxisControlProps) {
  const linked = linkedProp ?? false;

  function handleChange(axis: BoxAxis, value: string) {
    if (!linked) {
      onChange(axis, value);
      return;
    }

    const next = { horizontal: value, vertical: value };
    if (onLinkedChange) {
      onLinkedChange(next);
      return;
    }

    (['horizontal', 'vertical'] as const).forEach((linkedAxis) => onChange(linkedAxis, value));
  }

  return (
    <div
      className="grid w-full grid-cols-2 gap-2"
      role="group"
      aria-label={ariaLabel}
    >
      <IconValueInput
        label="Horizontal"
        icon={BoxHorizontalIcon}
        value={values.horizontal}
        hasVariable={true}
        unitType="magnitude"
        variableEditor={variableEditor}
        variableOptions={variableOptions}
        onChange={(value) => handleChange('horizontal', value)}
      />

      <IconValueInput
        label="Vertical"
        icon={BoxVerticalIcon}
        value={values.vertical}
        hasVariable={true}
        unitType="magnitude"
        variableEditor={variableEditor}
        variableOptions={variableOptions}
        onChange={(value) => handleChange('vertical', value)}
      />
    </div>
  );
}

export function BoxTextSpacingControl({
  values,
  onChange,
  ariaLabel,
  variableEditor,
  variableOptions = [],
}: BoxTextSpacingControlProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-2" role="group" aria-label={ariaLabel}>
      <IconValueInput
        label="Alto de linea"
        icon={LineHeightIcon}
        value={values.lineHeight}
        hasVariable={true}
        unitType="magnitude"
        variableEditor={variableEditor}
        variableOptions={variableOptions}
        onChange={(value) => onChange('lineHeight', value)}
      />

      <IconValueInput
        label="Separacion de letras"
        icon={LetterSpacingIcon}
        value={values.letterSpacing}
        hasVariable={true}
        unitType="magnitude"
        variableEditor={variableEditor}
        variableOptions={variableOptions}
        onChange={(value) => onChange('letterSpacing', value)}
      />
    </div>
  );
}

export function LinkedBoxSideGroup({
  label,
  values,
  onChange,
  onLinkedChange,
  ariaLabel,
  variableEditor,
  variableOptions = [],
}: {
  label: string;
  values: Partial<Record<BoxSide, string>>;
  onChange: (side: BoxSide, value: string) => void;
  onLinkedChange?: (values: Partial<Record<BoxSide, string>>) => void;
  ariaLabel: string;
  variableEditor?: ReactNode;
  variableOptions?: IconValueVariable[];
}) {
  const [linked, setLinked] = useState(false);

  return (
    <Group label={label} action={<LinkedValuesButton linked={linked} onToggle={() => setLinked((current) => !current)} />}>
      <BoxSideControl
        values={values}
        onChange={onChange}
        onLinkedChange={onLinkedChange}
        ariaLabel={ariaLabel}
        linked={linked}
        variableEditor={variableEditor}
        variableOptions={variableOptions}
      />
    </Group>
  );
}

export function LinkedBoxCornerGroup({
  label,
  values,
  onChange,
  onLinkedChange,
  ariaLabel,
  variableEditor,
  variableOptions = [],
}: {
  label: string;
  values: Partial<Record<BoxCorner, string>>;
  onChange: (corner: BoxCorner, value: string) => void;
  onLinkedChange?: (values: Partial<Record<BoxCorner, string>>) => void;
  ariaLabel: string;
  variableEditor?: ReactNode;
  variableOptions?: IconValueVariable[];
}) {
  const [linked, setLinked] = useState(false);

  return (
    <Group label={label} action={<LinkedValuesButton linked={linked} onToggle={() => setLinked((current) => !current)} />}>
      <BoxCornerControl
        values={values}
        onChange={onChange}
        onLinkedChange={onLinkedChange}
        ariaLabel={ariaLabel}
        linked={linked}
        variableEditor={variableEditor}
        variableOptions={variableOptions}
      />
    </Group>
  );
}

export function LinkedBoxAxisGroup({
  label,
  values,
  onChange,
  onLinkedChange,
  ariaLabel,
  variableEditor,
  variableOptions = [],
}: {
  label: string;
  values: Partial<Record<BoxAxis, string>>;
  onChange: (axis: BoxAxis, value: string) => void;
  onLinkedChange?: (values: Partial<Record<BoxAxis, string>>) => void;
  ariaLabel: string;
  variableEditor?: ReactNode;
  variableOptions?: IconValueVariable[];
}) {
  const [linked, setLinked] = useState(false);

  return (
    <Group label={label} action={<LinkedValuesButton linked={linked} onToggle={() => setLinked((current) => !current)} />}>
      <BoxAxisControl
        values={values}
        onChange={onChange}
        onLinkedChange={onLinkedChange}
        ariaLabel={ariaLabel}
        linked={linked}
        variableEditor={variableEditor}
        variableOptions={variableOptions}
      />
    </Group>
  );
}

export function LinkedValuesButton({ linked, onToggle }: { linked: boolean; onToggle: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      buttonSize="iconSm"
      selected={linked}
      onClick={onToggle}
      aria-pressed={linked}
      aria-label={linked ? 'Desvincular valores' : 'Vincular valores'}
      title={linked ? 'Desvincular valores' : 'Vincular valores'}
      className="h-6 w-6 p-[0]"
    >
      <LinkItemIcon className="h-3.5 w-3.5" />
    </Button>
  );
}
