import { type ReactNode } from 'react';
import { Label } from './label';

interface FieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  hint?: string;
  spacing?: 'none' | 'md';
  labelSize?: 'sm' | 'xs';
}

const SPACING_CLASSES = {
  none: '',
  md: 'mb-4',
} as const;

const LABEL_CLASSES = {
  sm: '',
  xs: 'mb-1 text-xs text-slate-600',
} as const;

export function Field({
  label,
  htmlFor,
  children,
  hint,
  spacing = 'md',
  labelSize = 'sm',
}: FieldProps) {
  return (
    <div className={SPACING_CLASSES[spacing]}>
      <Label htmlFor={htmlFor} className={LABEL_CLASSES[labelSize]}>
        {label}
      </Label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
