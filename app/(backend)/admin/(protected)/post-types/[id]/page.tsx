import { notFound } from 'next/navigation';
import { getPostTypeById } from '@/core/post-types/post-type.service';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/alert';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updatePostTypeAction } from '../actions';

export default async function EditPostTypePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const postType = await getPostTypeById(id);
  if (!postType) {
    notFound();
  }

  return (
    <div className="max-w-lg">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">Editar post type</h2>

      <ErrorAlert message={error} />

      <form action={updatePostTypeAction} className="space-y-4">
        <input type="hidden" name="id" value={postType.id} />
        <Field label="post_type (slug)" htmlFor="post_type" hint="No se puede modificar">
          <Input id="post_type" value={postType.post_type} disabled />
        </Field>
        <Field label="Etiqueta" htmlFor="post_type_label">
          <Input
            id="post_type_label"
            name="post_type_label"
            defaultValue={postType.post_type_label}
            required
          />
        </Field>
        <Field label="Descripción" htmlFor="post_type_description" hint="Opcional">
          <Textarea
            id="post_type_description"
            name="post_type_description"
            rows={3}
            defaultValue={postType.post_type_description ?? ''}
          />
        </Field>
        <Button type="submit">Guardar cambios</Button>
      </form>
    </div>
  );
}
