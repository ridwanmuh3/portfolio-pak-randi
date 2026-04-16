import {
  PageHeaderSkeleton,
  SectionHeadingSkeleton,
  Bone,
  ChipGroupSkeleton,
} from '@/components/ui/Skeleton';

export default function ServicesLoading() {
  return (
    <>
      <PageHeaderSkeleton />

      {/* Journal Reviews */}
      <section className="mb-12">
        <SectionHeadingSkeleton />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Bone className="h-2 w-2 shrink-0 rounded-full" />
                <Bone className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Committees */}
      <section className="mb-12">
        <SectionHeadingSkeleton />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-4"
            >
              <div className="flex-1">
                <Bone className="mb-1 h-5 w-56" />
                <Bone className="h-4 w-40" />
              </div>
              <Bone className="h-6 w-12 rounded-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Talks */}
      <section className="mb-12">
        <SectionHeadingSkeleton />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
            >
              <Bone className="mb-2 h-5 w-72 max-w-full" />
              <Bone className="mb-3 h-4 w-48" />
              <div className="flex gap-4">
                <Bone className="h-3 w-32" />
                <Bone className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Memberships */}
      <section>
        <SectionHeadingSkeleton />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          <ChipGroupSkeleton count={4} />
        </div>
      </section>
    </>
  );
}
