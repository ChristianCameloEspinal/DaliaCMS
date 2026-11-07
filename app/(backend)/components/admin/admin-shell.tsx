'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

// Un eslabon del breadcrumb. Sin `href` = eslabon final no enlazable.
export type Crumb = { label: string; href?: string };
export type AdminNoticeTone = 'success' | 'error' | 'info' | 'warning';
export type AdminNoticeInput = {
  id?: string;
  message: string;
  tone?: AdminNoticeTone;
  durationMs?: number;
  persistent?: boolean;
};

type AdminNotice = Required<Pick<AdminNoticeInput, 'message' | 'tone'>> & {
  id: string;
  durationMs: number;
  persistent: boolean;
};

type AdminNoticeContextValue = {
  notify: (notice: AdminNoticeInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const DEFAULT_NOTICE_DURATION_MS = 4000;
const BreadcrumbContext = createContext<(crumbs: Crumb[] | null) => void>(() => {});
const AdminNoticeContext = createContext<AdminNoticeContextValue | null>(null);

// Permite a un componente cliente fijar el breadcrumb con datos que la ruta no conoce.
export function useBreadcrumb(crumbs: Crumb[] | null) {
  const setCrumbs = useContext(BreadcrumbContext);
  const key = JSON.stringify(crumbs);
  useEffect(() => {
    setCrumbs(crumbs);
    return () => setCrumbs(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, setCrumbs]);
}

// API global de avisos del panel. Sirve para editores, plugins o cualquier componente cliente.
export function useAdminNotice() {
  const context = useContext(AdminNoticeContext);
  if (!context) {
    throw new Error('useAdminNotice debe usarse dentro de AdminShell.');
  }
  return context;
}

// Puente para paginas server: emite un aviso en el AdminShell a partir de props.
export function AdminStatusMessage({
  message,
  tone = 'info',
  durationMs,
  persistent,
  id,
}: AdminNoticeInput) {
  const { notify } = useAdminNotice();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!message || notifiedRef.current) return;
    notifiedRef.current = true;
    notify({ id, message, tone, durationMs, persistent });
  }, [durationMs, id, message, notify, persistent, tone]);

  return null;
}

const SEGMENT_LABELS: Record<string, string> = {
  admin: 'Inicio',
  'post-types': 'Post Types',
  posts: 'Posts',
  components: 'Components',
  media: 'Media',
  library: 'Library',
  new: 'Nuevo',
};

const SECTION_HREFS: Record<string, string> = {
  'post-types': '/admin/post-types',
  posts: '/admin/posts',
  components: '/admin/components',
  media: '/admin/media',
  library: '/admin/library',
};

function crumbsFromPathname(pathname: string): Crumb[] {
  const segments = pathname.replace(/^\/+|\/+$/g, '').split('/');
  if (segments[0] !== 'admin') return [{ label: 'Inicio', href: '/admin' }];

  const crumbs: Crumb[] = [{ label: 'Inicio', href: '/admin' }];
  const rest = segments.slice(1);
  rest.forEach((segment, index) => {
    const isLast = index === rest.length - 1;
    const known = SEGMENT_LABELS[segment];
    const label = known ?? 'Editar';
    const href = !isLast ? SECTION_HREFS[segment] : undefined;
    crumbs.push({ label, href });
  });
  return crumbs;
}

function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta" className="flex h-[1rem] items-center justify-start gap-1 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1">
            {index > 0 && <span className="text-slate-300">{'>'}</span>}
            {item.href && !isLast ? (
              <Link href={item.href} className="text-slate-500 hover:text-slate-900">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-slate-900' : 'text-slate-500'}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

const NOTICE_STYLES: Record<AdminNoticeTone, string> = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-slate-200 bg-slate-50 text-slate-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
};

function AdminNoticeViewport({
  notices,
  onDismiss,
}: {
  notices: AdminNotice[];
  onDismiss: (id: string) => void;
}) {
  if (notices.length === 0) return null;

  return (
    <div className="flex flex-1 items-center justify-end overflow-visible">
      <div className="flex max-w-full flex-row-reverse items-center gap-2">
        {notices.map((notice, index) => (
          <div
            key={notice.id}
            role={notice.tone === 'error' ? 'alert' : 'status'}
            className={`notice-item relative flex shrink-0 items-start justify-between gap-3 overflow-hidden rounded-md border px-3 py-2 text-sm transition-opacity duration-200 ${NOTICE_STYLES[notice.tone]}`}
            style={{ opacity: index === 0 ? 1 : 0.5 }}
          >
            {!notice.persistent && notice.durationMs > 0 && (
              <span
                aria-hidden="true"
                className="notice-progress absolute inset-x-0 bottom-0 h-1 origin-left bg-current opacity-15"
                style={{ animationDuration: `${notice.durationMs}ms` }}
              />
            )}
            <span className="max-w-[18rem] truncate">{notice.message}</span>
            <button
              type="button"
              onClick={() => onDismiss(notice.id)}
              className="rounded px-1 text-current opacity-60 hover:opacity-100"
              aria-label="Cerrar aviso"
            >
              x
            </button>
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes notice-progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        .notice-progress {
          animation-name: notice-progress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [crumbs, setCrumbs] = useState<Crumb[] | null>(null);
  const [notices, setNotices] = useState<AdminNotice[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const items = crumbs ?? crumbsFromPathname(pathname);
  const setBreadcrumb = useMemo(() => (next: Crumb[] | null) => setCrumbs(next), []);

  const dismiss = useMemo(
    () => (id: string) => {
      const timer = timersRef.current.get(id);
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
      setNotices((current) => current.filter((notice) => notice.id !== id));
    },
    [],
  );

  const noticeContext = useMemo<AdminNoticeContextValue>(() => {
    const clear = () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
      setNotices([]);
    };

    const notify = (input: AdminNoticeInput) => {
      const id =
        input.id ?? `notice-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      const notice: AdminNotice = {
        id,
        message: input.message,
        tone: input.tone ?? 'info',
        durationMs: input.durationMs ?? DEFAULT_NOTICE_DURATION_MS,
        persistent: input.persistent ?? false,
      };

      const previousTimer = timersRef.current.get(id);
      if (previousTimer) {
        clearTimeout(previousTimer);
        timersRef.current.delete(id);
      }

      setNotices((current) => [notice, ...current.filter((item) => item.id !== id)]);

      if (!notice.persistent && notice.durationMs > 0) {
        const timer = setTimeout(() => dismiss(id), notice.durationMs);
        timersRef.current.set(id, timer);
      }

      return id;
    };

    return { notify, dismiss, clear };
  }, [dismiss]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  return (
    <BreadcrumbContext.Provider value={setBreadcrumb}>
      <AdminNoticeContext.Provider value={noticeContext}>
        <div className="flex flex-1 flex-col h-screen" >
          <div className="border-b border-slate-200 bg-white px-6 py-2">
            <div className="flex items-center justify-between gap-4 h-8">
              <Breadcrumb items={items} />
              <AdminNoticeViewport notices={notices} onDismiss={dismiss} />
            </div>
          </div>
          <main className="min-h-0 flex-1 overflow-y-scroll h-full">{children}</main>
        </div>
      </AdminNoticeContext.Provider>
    </BreadcrumbContext.Provider>
  );
}
