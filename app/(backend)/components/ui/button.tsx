import { type ButtonHTMLAttributes } from 'react';

const VARIANT_CLASSES = {
  primary: 'bg-slate-900 text-white hover:bg-slate-700',
  secondary: 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50',
  danger: 'bg-red-600 text-white hover:bg-red-500',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  subtle: 'bg-transparent text-slate-500 hover:bg-slate-200',
  collapsed: 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900',
} as const;

const SELECTED_CLASSES = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800',
  secondary: 'border-slate-900 bg-slate-900 text-white hover:bg-slate-800',
  danger: 'bg-red-700 text-white hover:bg-red-600',
  ghost: 'bg-slate-900 text-white hover:bg-slate-800',
  subtle: 'bg-slate-900 text-white hover:bg-slate-800',
  collapsed: 'bg-slate-50 text-slate-900',
} as const;

const SIZE_CLASSES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  icon: 'h-9 w-9 p-0',
  iconSm: 'h-8 w-8 p-0',
  collapsed: 'w-10 py-3',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANT_CLASSES;
  buttonSize?: keyof typeof SIZE_CLASSES;
  selected?: boolean;
}

export function Button({
  variant = 'primary',
  buttonSize = 'md',
  selected,
  className = '',
  ...props
}: ButtonProps) {
  const colorClass = selected ? SELECTED_CLASSES[variant] : VARIANT_CLASSES[variant];

  return (
    <button
      className={`inline-flex cursor-pointer shrink-0 items-center justify-center rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${SIZE_CLASSES[buttonSize]} ${colorClass} ${className}`}
      {...props}
    />
  );
}
