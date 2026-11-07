import { redirect } from 'next/navigation';

export default async function LegacyPatternPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/components/${id}`);
}
