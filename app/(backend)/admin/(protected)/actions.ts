'use server';

import { redirect } from 'next/navigation';
import { logout } from '@/core/auth/auth.service';

export async function logoutAction() {
  await logout();
  redirect('/admin/login');
}
