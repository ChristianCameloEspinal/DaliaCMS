import { countPostTypes } from '@/core/post-types/post-type.service';
import { countPosts, countPostsByStatus } from '@/core/posts/post.service';

export default async function DashboardPage() {
  const [totalPosts, totalPostTypes, published, drafts] = await Promise.all([
    countPosts(),
    countPostTypes(),
    countPostsByStatus('published'),
    countPostsByStatus('draft'),
  ]);

  const stats = [
    { label: 'Posts totales', value: totalPosts },
    { label: 'Post types', value: totalPostTypes },
    { label: 'Publicados', value: published },
    { label: 'Borradores', value: drafts },
  ];

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-slate-900">Dashboard</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-slate-500">{stat.label}</div>
            <div className="mt-1 text-2xl font-semibold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
