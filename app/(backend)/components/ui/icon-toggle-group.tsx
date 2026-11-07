import type { ComponentType, SVGProps } from 'react';
import { Button } from '@/components/ui/button';

type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface IconToggleOption<T extends string> {
  value: T;
  label: string;
  Icon?: SvgIcon;
}

interface IconToggleGroupProps<T extends string> {
  options: readonly IconToggleOption<T>[];
  value: T | '';
  onChange: (value: T | '') => void;
  ariaLabel: string;
  allowDeselect?: boolean;
  className?: string;
}

export function IconToggleGroup<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  allowDeselect = true,
  className = '',
}: IconToggleGroupProps<T>) {
  const hasIcons = options.some((option) => option.Icon);

  return (
    <div className={`flex flex-wrap gap-1 ${className}`} role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const selected = value === option.value;
        const Icon = option.Icon;

        return (
          <Button
            key={option.value}
            type="button"
            variant="ghost"
            buttonSize={hasIcons ? 'iconSm' : 'sm'}
            selected={selected}
            title={option.label}
            aria-pressed={selected}
            aria-label={option.label}
            onClick={() => onChange(selected && allowDeselect ? '' : option.value)}
            className={hasIcons ? '' : 'flex-1'}
          >
            {Icon ? <Icon className="h-4 w-4" /> : option.label}
          </Button>
        );
      })}
    </div>
  );
}
