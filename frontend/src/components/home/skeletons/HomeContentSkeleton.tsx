import { Skeleton } from "@/components/ui/skeleton";

export const HomeContentSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="justify-between flex items-center">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      {/* Recipe cards */}
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <Skeleton className="h-44 w-full rounded-2xl shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
