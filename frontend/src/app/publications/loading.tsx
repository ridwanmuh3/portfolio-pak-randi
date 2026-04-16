import {
  PageHeaderSkeleton,
  PublicationItemSkeleton,
  Bone,
} from '@/components/ui/Skeleton';

export default function PublicationsLoading() {
  return (
    <>
      <PageHeaderSkeleton />

      {/* Filter bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Bone key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
        <Bone className="h-10 w-72 rounded-lg" />
      </div>

      {/* Publication list */}
      <ol className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <PublicationItemSkeleton key={i} />
        ))}
      </ol>
    </>
  );
}
