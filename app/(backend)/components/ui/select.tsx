import { type SelectHTMLAttributes } from 'react';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

const SIZE_CLASSES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  icon: 'h-9 w-9 p-0',
  iconSm: 'h-8 w-8 p-0',
  collapsed: 'w-10 py-3',
} as const;

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  controlSize?: keyof typeof SIZE_CLASSES;
  options?: readonly SelectOption[];
}

export function Select({
  className = '',
  controlSize = 'sm',
  options,
  children,
  ...props
}: SelectProps) {
  return (
    <select
      className={`w-[100px] h-8 truncate rounded-md border border-slate-300 bg-white font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 disabled:cursor-not-allowed disabled:opacity-50 ${SIZE_CLASSES[controlSize]} ${className}`}
      {...props}
    >
      {options
        ? options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className='w-2'
            >
              {option.label}
            </option>
          ))
        : children}
    </select>
  );
}