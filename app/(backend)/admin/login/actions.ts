'use server';

import { redirect } from 'next/navigation';
import { login } from '@/core/auth/auth.service';

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  try {
    await login(email, password);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
    redirect(`/admin/login?error=${encodeURIComponent(message)}`);
  }

  redirect('/admin');
}
