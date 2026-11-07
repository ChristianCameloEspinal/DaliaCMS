import { type TextareaHTMLAttributes } from 'react';

const SIZE_CLASSES = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-3 py-2 text-sm',
} as const;

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  controlSize?: keyof typeof SIZE_CLASSES;
}

export function Textarea({
  className = '',
  controlSize = 'md',
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={`w-full rounded-md border border-slate-300 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 ${SIZE_CLASSES[controlSize]} ${className}`}
      {...props}
    />
  );
}
