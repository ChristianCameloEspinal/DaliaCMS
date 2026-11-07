'use client';

import type { ReactNode } from 'react';
import { Button } from './button';
import { XIcon } from './icons';

export function Modal({
  title,
  children,
  onClose,
}: {
  title?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Modal'}
    >
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          {title && <h2 className="truncate text-sm font-semibold text-slate-900">{title}</h2>}
          <Button
            type="button"
            variant="ghost"
            buttonSize="iconSm"
            aria-label="Cerrar"
            title="Cerrar"
            className="ml-auto"
            onClick={onClose}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="min-h-0 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
