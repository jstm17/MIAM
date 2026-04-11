import { Skeleton } from "@/components/ui/skeleton";

export const ProfileHeaderSkeleton = () => {
  return (
    <div className="flex items-center justify-between w-full p-4">
      <Skeleton className="h-9 w-9 rounded-lg" />
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-9 w-9 rounded-lg" />
    </div>
  );
};
