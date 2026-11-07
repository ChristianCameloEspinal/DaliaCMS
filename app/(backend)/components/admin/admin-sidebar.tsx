'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type SVGProps } from 'react';
import { logoutAction } from '@/app/(backend)/admin/(protected)/actions';

type IconType = (props: SVGProps<SVGSVGElement>) => React.ReactElement;

const NAV_ITEMS: { href: string; label: string; icon: IconType }[] = [
  { href: '/admin', label: 'Dashboard', icon: DashboardIcon },
  { href: '/admin/post-types', label: 'Post Types', icon: TypesIcon },
  { href: '/admin/posts', label: 'Posts', icon: PostsIcon },
  { href: '/admin/components', label: 'Components', icon: ComponentsIcon },
  { href: '/admin/media', label: 'Media', icon: MediaIcon },
  { href: '/admin/library', label: 'Library', icon: LibraryIcon },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);

  function isActive(href: string): boolean {
    if (href === '/admin') return pathname === '/admin';
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside
      onMouseEnter={()=>setCollapsed(false)}
      onMouseLeave={()=>setCollapsed(true)}
      className={`${
        collapsed ? 'w-16' : 'w-56'
      } flex shrink-0 flex-col border-r border-slate-200 bg-white p-3 transition-[width] duration-200 h-screen`}
    >
      <div className="mb-6 flex items-center justify-between">
        {!collapsed && (
          <span className="px-1 text-lg font-semibold text-slate-900">Dalia CMS</span>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
        >
          <ChevronIcon className={`h-4 w-4 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                collapsed ? 'justify-center px-0' : ''
              } ${
                active
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Información y acciones de usuario, ancladas al pie del sidebar. */}
      <div className="mt-3 border-t border-slate-200 pt-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <span
              title={email}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600"
            >
              {email.charAt(0).toUpperCase()}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <LogoutIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                {email.charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs text-slate-600" title={email}>
                {email}
              </span>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                <LogoutIcon className="h-5 w-5 shrink-0" />
                <span>Cerrar sesión</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
}

// Iconos inline (sin dependencias externas), stroke con currentColor.
function iconBase(props: SVGProps<SVGSVGElement>) {
  return {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  };
}

function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase(props)}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function TypesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase(props)}>
      <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3H4a1 1 0 0 0-1 1v5.59A2 2 0 0 0 3.83 11l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z" />
      <circle cx="7.5" cy="7.5" r="1" />
    </svg>
  );
}

function PostsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase(props)}>
      <path d="M4 3h12l4 4v14H4z" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </svg>
  );
}

function ComponentsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase(props)}>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <path d="M14 17h6" />
      <path d="M17 14v6" />
    </svg>
  );
}

function MediaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase(props)}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function LibraryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase(props)}>
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
      <rect x="6" y="3" width="4" height="4" rx="1" />
      <rect x="14" y="10" width="4" height="4" rx="1" />
      <rect x="8" y="17" width="4" height="4" rx="1" />
    </svg>
  );
}

function ChevronIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase(props)}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconBase(props)}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
