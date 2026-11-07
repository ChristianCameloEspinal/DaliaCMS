import type { ButtonHTMLAttributes } from 'react';

interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
}

export function Switch({
  checked,
  onChange,
  leftLabel = 'No',
  rightLabel = 'Si',
  className = '',
  ...props
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`grid h-8 w-full grid-cols-2 rounded-md border border-slate-300 bg-slate-100 p-0.5 text-xs font-medium text-slate-500 shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-slate-500 ${className}`}
      {...props}
    >
      <span
        className={`flex items-center justify-center rounded-[5px] transition-colors ${
          checked ? 'text-slate-500' : 'bg-white text-slate-900 shadow-sm'
        }`}
      >
        {leftLabel}
      </span>
      <span
        className={`flex items-center justify-center rounded-[5px] transition-colors ${
          checked ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
        }`}
      >
        {rightLabel}
      </span>
    </button>
  );
}
