import { redirect } from 'next/navigation';
import { getSession } from '@/core/auth/auth.service';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminShell } from '@/components/admin/admin-shell';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex h-max overflow-hidden">
      <AdminSidebar email={session.email} />
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
