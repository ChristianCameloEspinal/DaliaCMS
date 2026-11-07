import { ReactNode } from "react";

export function Group({
  label,
  action,
  children,
  className = "",
}: {
  className?: string;
  label: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex-1">
      <div className={`mb-1 flex min-h-6 items-center justify-between gap-2 ${className}`}>
        <div className="text-xs font-medium text-slate-600">{label}</div>
        {action}
      </div>
      {children}
    </div>
  );
}