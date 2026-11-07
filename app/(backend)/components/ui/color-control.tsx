import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as Icon from '@/components/ui/icons';
import { useState, type ReactNode } from 'react';
import { Modal } from '@/components/ui/modal';
import {
  VariableOptionsList,
  type IconValueVariable,
} from '@/components/ui/variable-options-list';

export function ColorControl({
  value,
  hasVariable,
  variableEditor,
  variableOptions = [],
  onChange,
  allowImage = false,
  onPickImage,
}: {
  hasVariable?: boolean;
  value?: string;
  variableEditor?: ReactNode;
  variableOptions?: IconValueVariable[];
  onChange: (value: string) => void;
  allowImage?: boolean;
  onPickImage?: () => void;
}) {
  const [variablesOpen, setVariablesOpen] = useState(false);
  const variableKey = value?.match(/^var\((--[a-z][a-z0-9-]*)\)$/)?.[1];
  const swatchColor = variableOptions.find((variable) => variable.key === variableKey)?.value ?? value;
  function handlePickImage() {
    if (onPickImage) {
      onPickImage();
      return;
    }

    console.info('Mock: seleccionar imagen de fondo');
  }

  return (
    <label className="block w-full" aria-label="Color picker" title="Color">
      <div
        className={`grid h-8 grid-cols-[1.5rem_minmax(0,1fr)_auto] items-center gap-1 rounded-sm border bg-slate-50 px-1.5 transition-colors focus-within:border-slate-900 focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-900 ${value ? 'border-slate-300' : 'border-slate-200'
          }`}
      >
        <span className="relative block h-6 w-6 overflow-hidden rounded-sm border border-slate-300">
          <span
            className="block h-full w-full"
            style={{ backgroundColor: swatchColor || '#000000' }}
          />
          <Input
            type="color"
            value={swatchColor?.match(/^#[\da-f]{6}$/i) ? swatchColor : '#000000'}
            onChange={(event) => onChange(event.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer border-0 p-0 opacity-0"
            aria-label="Seleccionar color"
          />
        </span>
        <span className="min-w-0 truncate text-xs text-slate-700">
          {value ? (value.startsWith('#') ? normalizeHex(value) : value) : 'Auto'}
        </span>
        <span className="flex items-center gap-1">
          {allowImage && (
            <Button
              type="button"
              onClick={handlePickImage}
              variant="subtle"
              buttonSize="sm"
              className="h-6 px-1.5 text-slate-500 hover:text-slate-900"
              aria-label="Seleccionar imagen"
              title="Seleccionar imagen"
            >
              <Icon.ImageIcon className="h-4 w-4" />
            </Button>
          )}
          {value && (
            <Button
              type="button"
              onClick={() => onChange('')}
              variant="subtle"
              buttonSize="sm"
              className="h-6 px-1.5 text-slate-500 hover:text-slate-900"
              aria-label="Quitar color"
              title="Quitar color"
            >
              <Icon.TrashIcon className="h-4 w-4" />
            </Button>
          )}
          {hasVariable && (
            <Button
              type="button"
              onClick={() => setVariablesOpen(true)}
              variant="subtle"
              buttonSize="sm"
              className="h-6 px-1.5 text-slate-500 hover:text-slate-900"
              aria-label="Ver variables para Color"
              title="Ver variables"
            >
              <Icon.TagIcon className="h-4 w-4" />
            </Button>
          )}
        </span>
      </div>
      {variablesOpen && (
        <Modal title="Variables" onClose={() => setVariablesOpen(false)}>
          {variableOptions.some((variable) => variable.type === 'color') && (
            <VariableOptionsList
              variables={variableOptions.filter((variable) => variable.type === 'color')}
              onSelect={(variable) => {
                onChange(`var(${variable.key})`);
                setVariablesOpen(false);
              }}
            />
          )}
          {variableEditor}
        </Modal>
      )}
    </label>
  );
}

function normalizeHex(value?: string) {
  if (!value) return '000000';
  return value.replace('#', '').toUpperCase();
}
