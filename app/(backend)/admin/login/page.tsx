import { redirect } from 'next/navigation';
import { getSession } from '@/core/auth/auth.service';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ErrorAlert } from '@/components/ui/alert';
import { loginAction } from './actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) {
    redirect('/admin');
  }

  const { error } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-slate-900">Dalia CMS</h1>
        <p className="mb-6 text-sm text-slate-500">Inicia sesión para acceder al panel</p>

        <ErrorAlert message={error} />

        <form action={loginAction} className="space-y-4">
          <Field label="Correo electrónico" htmlFor="email">
            <Input id="email" name="email" type="email" required autoFocus />
          </Field>
          <Field label="Contraseña" htmlFor="password">
            <Input id="password" name="password" type="password" required />
          </Field>
          <Button type="submit" className="w-full">
            Iniciar sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
