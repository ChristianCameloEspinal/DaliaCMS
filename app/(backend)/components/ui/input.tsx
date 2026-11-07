
'use client';

import {
  useState,
  type ComponentType,
  type ReactNode,
  type SVGProps,
  type InputHTMLAttributes,
} from 'react';
import { Button } from './button';
import { TagIcon } from '@/components/ui/icons';
import { Modal } from './modal';
import {
  VariableOptionsList,
  type IconValueVariable,
} from '@/components/ui/variable-options-list';

const MAGNITUDE_UNITS = ['px', 'rem', 'em', '%', 'vw', 'vh', 'vmin', 'vmax'] as const;

const SIZE_CLASSES = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-sm',
} as const;

const TONE_CLASSES = {
  default: '',
  muted: 'bg-slate-50 text-slate-500',
} as const;

const NUMBER_CONTROL_CLASSES =
  '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

export type { IconValueVariable } from '@/components/ui/variable-options-list';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  controlSize?: keyof typeof SIZE_CLASSES;
  tone?: keyof typeof TONE_CLASSES;
}

export function Input({
  className = '',
  controlSize = 'md',
  tone = 'default',
  ...props
}: InputProps) {
  return (
    <input
      style={{
        "margin": 0
      }}
      className={`w-full rounded-md border border-slate-300 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 ${NUMBER_CONTROL_CLASSES} ${SIZE_CLASSES[controlSize]} ${TONE_CLASSES[tone]} ${className}`}
      {...props}
    />
  );
}

export function IconValueInput({
  label,
  icon: Icon,
  value,
  hasVariable,
  unitType,
  variableEditor,
  variableOptions = [],
  onChange,
}: {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  value?: string;
  hasVariable?: boolean;
  unitType?: 'magnitude';
  variableEditor?: ReactNode;
  variableOptions?: IconValueVariable[];
  onChange: (value: string) => void;
}) {
  const [variablesOpen, setVariablesOpen] = useState(false);
  const magnitude = unitType === 'magnitude' && !value?.startsWith('var(')
    ? parseMagnitude(value)
    : null;
  const inputValue = magnitude ? magnitude.amount : value ?? '';

  function handleValueChange(nextValue: string) {
    if (!magnitude) {
      onChange(nextValue);
      return;
    }

    onChange(nextValue === '' ? '' : `${nextValue}${magnitude.unit}`);
  }

  function handleUnitChange(nextUnit: MagnitudeUnit) {
    if (!magnitude || magnitude.amount === '') return;
    onChange(`${magnitude.amount}${nextUnit}`);
  }

  return (
    <label className="block" aria-label={label} title={label}>
      {/* <span className="sr-only">{label}</span> */}
      <div
        className={`flex h-8 items-center gap-1 rounded-sm border bg-slate-50 pl-1.5 ${!hasVariable ? `pr-1.5` : `pr-0`} transition-colors focus-within:border-slate-900 focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-900 ${value ? 'border-slate-300' : 'border-slate-200'
          }`}
      >
        <span>
          <Icon className="h-6 w-4 text-slate-500" />
        </span>
        <Input
          type={magnitude ? 'number' : 'text'}
          min={magnitude ? 0 : undefined}
          value={inputValue}
          onChange={(event) => handleValueChange(event.target.value)}
          controlSize="sm"
          className="h-6 border-0 bg-transparent px-0 text-xs focus:border-transparent focus:ring-0"
          style={{
            padding: 0,
            boxShadow: 'none',
          }}
        />

        {magnitude && (
          <select
            value={magnitude.unit}
            onChange={(event) => handleUnitChange(event.target.value as MagnitudeUnit)}
            aria-label={`Unidad de ${label}`}
            title={`Unidad de ${label}`}
            className="appearance-none pr-0 h-6 cursor-pointer rounded-sm border-0 bg-transparent px-0 text-[10px] font-medium text-slate-500 focus:outline-none focus:ring-0"
          >
            {MAGNITUDE_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        )}
        {hasVariable && (
          <Button
            type="button"
            onClick={() => setVariablesOpen(true)}
            variant="subtle"
            buttonSize="sm"
            className="px-1.5 text-[10px] text-slate-500 hover:text-slate-900"
            aria-label={`Ver variables para ${label}`}
            title="Ver variables"
          >
            <TagIcon className="h-6 w-4" />
          </Button>
        )}
        {variablesOpen && (
          <Modal title="Variables" onClose={() => setVariablesOpen(false)}>
            {variableOptions.length > 0 && (
              <VariableOptionsList
                variables={variableOptions}
                onSelect={(variable) => {
                  onChange(`var(${variable.key})`);
                  setVariablesOpen(false);
                }}
              />
            )}
            {variableEditor}
          </Modal>
        )}
      </div>
    </label>
  );
}

type MagnitudeUnit = (typeof MAGNITUDE_UNITS)[number];

function parseMagnitude(value?: string): { amount: string; unit: MagnitudeUnit } {
  if (!value) return { amount: '', unit: 'px' };

  const match = value.trim().match(/^(-?\d*\.?\d+)(px|rem|em|%|vw|vh|vmin|vmax)$/);
  if (!match) return { amount: '', unit: 'px' };

  return {
    amount: match[1],
    unit: match[2] as MagnitudeUnit,
  };
}
