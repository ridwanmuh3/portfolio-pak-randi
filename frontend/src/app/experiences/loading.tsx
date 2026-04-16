import {
  PageHeaderSkeleton,
  SectionHeadingSkeleton,
  TimelineItemSkeleton,
  CardSkeleton,
  Bone,
  ChipGroupSkeleton,
} from '@/components/ui/Skeleton';

export default function ExperiencesLoading() {
  return (
    <>
      <PageHeaderSkeleton />

      {/* Download CV button */}
      <div className="mb-8">
        <Bone className="h-10 w-40 rounded-lg" />
      </div>

      {/* Experience Timeline */}
      <section className="mb-12">
        <SectionHeadingSkeleton />
        <ol className="relative space-y-6 border-l-2 border-dashed border-slate-200 pl-6 dark:border-slate-800">
          {Array.from({ length: 3 }).map((_, i) => (
            <TimelineItemSkeleton key={i} />
          ))}
        </ol>
      </section>

      {/* Education */}
      <section className="mb-12">
        <SectionHeadingSkeleton />
        <ol className="relative space-y-6 border-l-2 border-dashed border-slate-200 pl-6 dark:border-slate-800">
          {Array.from({ length: 2 }).map((_, i) => (
            <TimelineItemSkeleton key={i} />
          ))}
        </ol>
      </section>

      {/* Skills */}
      <section className="mb-12">
        <SectionHeadingSkeleton />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
            >
              <Bone className="mb-3 h-5 w-24" />
              <ChipGroupSkeleton count={5} />
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section>
        <SectionHeadingSkeleton />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-4"
            >
              <div className="flex-1">
                <Bone className="mb-1 h-5 w-48" />
                <Bone className="h-4 w-64" />
              </div>
              <Bone className="h-6 w-12 rounded-full" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
