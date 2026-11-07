import { redirect } from 'next/navigation';

export default async function LegacyPostEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/posts/${id}`);
}
