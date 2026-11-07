import { listPostTypes } from '@/core/post-types/post-type.service';
import { POST_STATUSES, POST_STATUS_LABELS } from '@/core/posts/post.types';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ui/alert';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createPostAction } from '../actions';

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const postTypes = await listPostTypes();

  return (
    <div className="max-w-lg">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">Nuevo post</h2>

      <ErrorAlert message={error} />

      <form action={createPostAction} className="space-y-4">
        <Field label="Tipo" htmlFor="post_type">
          <Select id="post_type" name="post_type" required defaultValue="">
            <option value="" disabled>
              Selecciona un tipo
            </option>
            {postTypes.map((postType) => (
              <option key={postType.id} value={postType.post_type}>
                {postType.post_type_label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Título" htmlFor="post_title">
          <Input id="post_title" name="post_title" required autoFocus />
        </Field>
        <Field label="post_name (slug)" htmlFor="post_name" hint="Único dentro del tipo">
          <Input id="post_name" name="post_name" required />
        </Field>
        <Field label="Extracto" htmlFor="post_excerpt" hint="Opcional">
          <Textarea id="post_excerpt" name="post_excerpt" rows={2} />
        </Field>
        <p className="text-xs text-slate-500">
          El contenido se edita con el editor de bloques tras crear el post.
        </p>
        <Field label="Estado" htmlFor="post_status">
          <Select id="post_status" name="post_status" defaultValue="draft">
            {POST_STATUSES.map((status) => (
              <option key={status} value={status}>
                {POST_STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
        </Field>
        <Button type="submit">Crear</Button>
      </form>
    </div>
  );
}
