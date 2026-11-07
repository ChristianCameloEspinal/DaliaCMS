import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/alert';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createPostTypeAction } from '../actions';

export default async function NewPostTypePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="max-w-lg">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">Nuevo post type</h2>

      <ErrorAlert message={error} />

      <form action={createPostTypeAction} className="space-y-4">
        <Field label="post_type (slug)" htmlFor="post_type" hint="Minúsculas, números y guiones. Ej: service">
          <Input id="post_type" name="post_type" required autoFocus />
        </Field>
        <Field label="Etiqueta" htmlFor="post_type_label">
          <Input id="post_type_label" name="post_type_label" required />
        </Field>
        <Field label="Descripción" htmlFor="post_type_description" hint="Opcional">
          <Textarea id="post_type_description" name="post_type_description" rows={3} />
        </Field>
        <Button type="submit">Crear</Button>
      </form>
    </div>
  );
}
