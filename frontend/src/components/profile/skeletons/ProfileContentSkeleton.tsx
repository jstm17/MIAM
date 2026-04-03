// components/skeletons/ProfileContentSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export const ProfileContentSkeleton = () => {
  return (
    <div className="w-full flex flex-col">
      {/* Tabs */}
      <div className="w-full flex border-b sticky top-0 z-40 bg-background">
        <Skeleton className="h-5 w-36 m-2" />
        <Skeleton className="h-5 w-48 m-2" />
      </div>

      {/* Recipe cards */}
      <div className="p-4 flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-3 items-center">
            <Skeleton className="h-20 w-20 rounded-xl shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
