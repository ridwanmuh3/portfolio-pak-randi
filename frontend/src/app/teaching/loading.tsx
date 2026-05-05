import {
  PageHeaderSkeleton,
  SectionHeadingSkeleton,
  StatCardSkeleton,
  TableRowSkeleton,
  Bone,
} from '@/components/ui/Skeleton';

export default function TeachingLoading() {
  return (
    <>
      <PageHeaderSkeleton />

      {/* Current Courses */}
      <section className="mb-12">
        <SectionHeadingSkeleton />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="mb-3 flex items-center justify-between">
                <Bone className="h-5 w-16 rounded-full" />
                <Bone className="h-4 w-24" />
              </div>
              <Bone className="mb-1 h-5 w-48" />
              <Bone className="mb-3 h-3 w-36" />
              <Bone className="mb-2 h-4 w-full" />
              <Bone className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </section>

      {/* Past Courses Table */}
      <section className="mb-12">
        <SectionHeadingSkeleton />
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60">
              <tr>
                {['Code', 'Course Title', 'Level', 'Years'].map((h) => (
                  <th key={h} className="px-6 py-3">
                    <Bone className="h-3 w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {Array.from({ length: 4 }).map((_, i) => (
                <TableRowSkeleton key={i} cols={4} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Supervision */}
      <section>
        <SectionHeadingSkeleton />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </>
  );
}
