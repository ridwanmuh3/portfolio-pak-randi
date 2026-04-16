import {
  PageHeaderSkeleton,
  SectionHeadingSkeleton,
  CardSkeleton,
  Bone,
} from '@/components/ui/Skeleton';

export default function ResearchLoading() {
  return (
    <>
      <PageHeaderSkeleton />

      {/* Research Projects */}
      <section className="mb-12">
        <SectionHeadingSkeleton />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} lines={4} />
          ))}
        </div>
      </section>

      {/* Collaborators */}
      <section>
        <SectionHeadingSkeleton />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60"
            >
              <Bone className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex-1">
                <Bone className="mb-1 h-4 w-32" />
                <Bone className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
