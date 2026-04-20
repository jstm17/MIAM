import { Skeleton } from "@/components/ui/skeleton";

export const ProfileContentSkeleton = () => {
  return (
    <div className="w-full flex flex-col">
      {/* Tabs */}
      <div className="w-full flex border-b sticky justify-around top-0 z-40 bg-background gap-4 p-2">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-6" />
      </div>

      <div className="justify-between flex items-center p-4 pb-0">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>

      {/* Recipe cards */}
      <div className="p-4 flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <Skeleton className="h-44 w-full rounded-2xl shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
