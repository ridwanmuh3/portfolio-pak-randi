import {
  PageHeaderSkeleton,
  SectionHeadingSkeleton,
  Bone,
  ChipGroupSkeleton,
} from '@/components/ui/Skeleton';

export default function ProjectsLoading() {
  return (
    <>
      <PageHeaderSkeleton />

      {/* Fundings */}
      <section className="mb-12">
        <SectionHeadingSkeleton />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Bone className="mb-2 h-5 w-72 max-w-full" />
                  <Bone className="mb-1 h-3 w-48" />
                </div>
                <Bone className="h-6 w-32 rounded-full" />
              </div>
              <Bone className="mt-3 h-4 w-full" />
              <Bone className="mt-2 h-4 w-3/4" />
              <Bone className="mt-4 h-7 w-40 rounded-lg" />
            </div>
          ))}
        </div>
      </section>

      {/* Showcase Projects */}
      <section>
        <SectionHeadingSkeleton />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
            >
              <Bone className="mb-2 h-3 w-20" />
              <Bone className="mb-2 h-5 w-32" />
              <Bone className="mb-2 h-4 w-full" />
              <Bone className="mb-4 h-4 w-3/4" />
              <ChipGroupSkeleton count={3} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
