'use client';

import { Button } from '@/components/ui/button';
import type { StyleState } from '../editor.types';

const STYLE_STATE_OPTIONS: { value: StyleState; label: string }[] = [
  { value: 'default', label: 'Defecto' },
  { value: 'hover', label: 'Hover' },
  { value: 'active', label: 'Activo' },
];

export function StyleStateTool({
  value,
  onChange,
}: {
  value: StyleState;
  onChange: (state: StyleState) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {STYLE_STATE_OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant="secondary"
          buttonSize="sm"
          selected={value === option.value}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
