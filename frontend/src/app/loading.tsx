import {
  PageHeaderSkeleton,
  StatCardSkeleton,
  CardSkeleton,
  SectionHeadingSkeleton,
  Bone,
  ChipGroupSkeleton,
} from '@/components/ui/Skeleton';

export default function HomeLoading() {
  return (
    <>
      {/* Hero / Welcome */}
      <section>
        <PageHeaderSkeleton />
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          <Bone className="mb-3 h-4 w-full" />
          <Bone className="mb-3 h-4 w-full" />
          <Bone className="mb-3 h-4 w-3/4" />
          <Bone className="mb-6 h-4 w-full" />
          <div className="flex gap-3">
            <Bone className="h-10 w-28 rounded-lg" />
            <Bone className="h-10 w-28 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mt-10">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Recruitment */}
      <section className="mt-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/60">
          <Bone className="mb-2 h-4 w-40" />
          <Bone className="mb-3 h-6 w-48" />
          <Bone className="mb-2 h-4 w-full" />
          <Bone className="mb-4 h-4 w-3/4" />
          <ChipGroupSkeleton count={4} />
        </div>
      </section>

      {/* Research Interests */}
      <section className="mt-10">
        <SectionHeadingSkeleton />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} lines={2} />
          ))}
        </div>
      </section>
    </>
  );
}
