import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

const FONT_SIZE_PRESETS = [
  { slug: 'small', label: 'Pequeño', value: '0.875rem' },
  { slug: 'medium', label: 'Mediano', value: '1rem' },
  { slug: 'large', label: 'Grande', value: '1.5rem' },
  { slug: 'x-large', label: 'Enorme', value: '2.25rem' },
];

const SPACING_PRESETS = [
  { slug: '20', label: 'XS', value: '0.5rem' },
  { slug: '30', label: 'S', value: '1rem' },
  { slug: '40', label: 'M', value: '1.5rem' },
  { slug: '50', label: 'L', value: '2rem' },
  { slug: '60', label: 'XL', value: '3rem' },
];

export function pxToNumber(value?: string): number | '' {
  if (!value || !value.endsWith('px')) return '';
  const numberValue = parseInt(value, 10);
  return Number.isNaN(numberValue) ? '' : numberValue;
}

export function PxInput({
  value,
  onChange,
  placeholder,
  min = 0,
  className = 'w-20',
}: {
  value: number | '';
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  className?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <Input
        type="number"
        min={min}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value === '' ? '' : `${event.target.value}px`)}
        controlSize="sm"
        className={className}
      />
      <span className="text-xs text-slate-400">px</span>
    </div>
  );
}

export function FontSizeControl({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  const preset = FONT_SIZE_PRESETS.find((option) => option.value === value);
  const isCustom = !!value && !preset;
  const selectValue = preset ? preset.slug : isCustom ? 'custom' : '';

  return (
    <div className="space-y-2">
      <Select
        value={selectValue}
        onChange={(event) => {
          const next = event.target.value;
          if (next === '') return onChange('');
          if (next === 'custom') return onChange(value && value.endsWith('px') ? value : '16px');
          const found = FONT_SIZE_PRESETS.find((option) => option.slug === next);
          if (found) onChange(found.value);
        }}
      >
        <option value="">Por defecto</option>
        {FONT_SIZE_PRESETS.map((option) => (
          <option key={option.slug} value={option.slug}>
            {option.label}
          </option>
        ))}
        <option value="custom">Personalizado</option>
      </Select>
      {isCustom && <PxInput value={pxToNumber(value)} onChange={onChange} placeholder="16" />}
    </div>
  );
}

export function SpacingControl({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap gap-1">
        {SPACING_PRESETS.map((preset) => (
          <Button
            key={preset.slug}
            type="button"
            onClick={() => onChange(value === preset.value ? '' : preset.value)}
            variant={value === preset.value ? 'primary' : 'secondary'}
            buttonSize="sm"
            className="py-0.5"
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <PxInput value={pxToNumber(value)} onChange={onChange} placeholder="0" />
    </div>
  );
}

