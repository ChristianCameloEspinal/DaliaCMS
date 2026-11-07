import type { ReactNode } from 'react';
import { BoxSideControl, LinkedBoxSideGroup, type BoxSide } from '@/components/ui/box-control';
import { ColorControl } from '@/components/ui/color-control';
import { IconValueInput, Input, type IconValueVariable } from '@/components/ui/input';
import { PxInput, pxToNumber } from '@/components/ui/size-control';
import * as Icon from '@/components/ui/icons'
import { Group } from './group';

const DEFAULT_SHADOW_COLOR = '#000000';

type ShadowValues = {
  sides: Partial<Record<BoxSide, string>>;
  blur?: string;
  color?: string;
  transparency?: string;
};

interface ShadowControlProps {
  value?: string;
  variableEditor?: ReactNode;
  variableOptions?: IconValueVariable[];
  onChange: (value: string) => void;
}

export function ShadowControl({
  value,
  variableEditor,
  variableOptions = [],
  onChange,
}: ShadowControlProps) {
  const shadow = parseShadow(value);

  function patchShadow(patch: Partial<ShadowValues>) {
    onChange(
      serializeShadow({
        ...shadow,
        ...patch,
        sides: { ...shadow.sides, ...patch.sides },
      })
    );
  }

  return (
    <div className="space-y-3">
      <ColorControl
        value={shadow.color}
        hasVariable={true}
        variableEditor={variableEditor}
        variableOptions={variableOptions}
        onChange={(color) => patchShadow({ color })}
      />

      <div className='flex flex-row gap-2'>


        <Group label={'Transparencia'} >
          <IconValueInput
            label="Transparencia"
            icon={Icon.TransparencyIcon}
            value={shadow.transparency}
            hasVariable={true}
            variableEditor={variableEditor}
            variableOptions={variableOptions}
            onChange={(transparency) => patchShadow({ transparency })}
          />
        </Group>

        <Group label={'Difuminado'} >
          <IconValueInput
            label="Difuminado"
            icon={Icon.BlurIcon}
            value={shadow.blur}
            hasVariable={true}
            unitType="magnitude"
            variableEditor={variableEditor}
            variableOptions={variableOptions}
            onChange={(blur) => patchShadow({ blur })}
          />
        </Group>
      </div>

      <LinkedBoxSideGroup
        label='Posición'
        values={shadow.sides}
        onChange={(side, nextValue) => patchShadow({ sides: { [side]: nextValue } })}
        ariaLabel="Sombra por lados"
        variableEditor={variableEditor}
        variableOptions={variableOptions}
      />

    </div>
  );
}

function parseShadow(value?: string): ShadowValues {
  if (!value) return { sides: {} };

  const shadows = value.split(',').map((shadow) => shadow.trim()).filter(Boolean);
  const sides: Partial<Record<BoxSide, string>> = {};
  let blur = '';
  let color = '';
  let transparency = '';

  for (const shadow of shadows) {
    const tokens = shadow.split(/\s+/);
    if (tokens.length < 4) continue;

    const [x, y, nextBlur, nextColor] = tokens;
    if (!blur) blur = nextBlur;
    if (!color && nextColor.startsWith('#')) {
      const parsedColor = parseHexWithAlpha(nextColor);
      color = parsedColor.color;
      transparency = parsedColor.transparency;
    }

    if (x === '0' && y.startsWith('-')) sides.top = y.slice(1);
    if (x === '0' && isPositiveLength(y)) sides.bottom = y;
    if (y === '0' && x.startsWith('-')) sides.left = x.slice(1);
    if (y === '0' && isPositiveLength(x)) sides.right = x;
  }

  return { sides, blur, color, transparency };
}

function serializeShadow({ sides, blur, color, transparency }: ShadowValues): string {
  const nextBlur = blur || '0px';
  const nextColor = withAlpha(color || DEFAULT_SHADOW_COLOR, transparency);
  const shadows = [
    sides.top ? `0 -${sides.top} ${nextBlur} ${nextColor}` : '',
    sides.right ? `${sides.right} 0 ${nextBlur} ${nextColor}` : '',
    sides.bottom ? `0 ${sides.bottom} ${nextBlur} ${nextColor}` : '',
    sides.left ? `-${sides.left} 0 ${nextBlur} ${nextColor}` : '',
  ].filter(Boolean);

  if (shadows.length > 0) return shadows.join(', ');
  if (blur || color) return `0 0 ${nextBlur} ${nextColor}`;
  return '';
}

function parseHexWithAlpha(value: string): { color: string; transparency: string } {
  if (!/^#[\da-f]{8}$/i.test(value)) return { color: value, transparency: '' };

  const alpha = parseInt(value.slice(7, 9), 16) / 255;
  const transparency = Math.round((1 - alpha) * 100);
  return {
    color: value.slice(0, 7),
    transparency: transparency > 0 ? String(transparency) : '',
  };
}

function withAlpha(color: string, transparency?: string): string {
  const normalizedColor = color || DEFAULT_SHADOW_COLOR;
  const amount = Number(transparency);
  if (!Number.isFinite(amount) || amount <= 0) return normalizedColor;

  const clamped = Math.max(0, Math.min(amount, 100));
  const alpha = Math.round((1 - clamped / 100) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${normalizedColor}${alpha}`;
}

function isPositiveLength(value: string): boolean {
  return value !== '0' && !value.startsWith('-');
}
