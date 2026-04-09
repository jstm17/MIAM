import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export const RecipeDetailsSkeleton = ({ offsetY }: { offsetY: number }) => {
  return (
    <div className="min-h-dvh bg-background">
      <AspectRatio ratio={14 / 9} className="relative overflow-hidden">
        <Skeleton
          className="absolute inset-0 w-full h-full"
          style={{ transform: `translateY(${offsetY * 0.4}px)` }}
        />
      </AspectRatio>

      <div className="bg-background rounded-t-4xl -mt-6 relative z-10 min-h-full flex flex-col gap-4 items-center px-4 pb-18">
        <div className="bg-secondary w-12 h-1.25 block rounded-lg mt-2" />
        <Skeleton className="h-6 w-3/4 rounded-lg" />

        <div className="grid gap-4 grid-cols-3 w-full">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>

        <div className="mt-4 w-full">
          <div className="flex items-center justify-evenly gap-4 px-4">
            <Skeleton className="h-6 w-1/3 rounded-lg" />
            <Skeleton className="h-6 w-1/3 rounded-lg" />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <AspectRatio
                  ratio={1}
                  className="rounded-xl overflow-hidden border"
                >
                  <Skeleton className="h-full w-full" />
                </AspectRatio>
                <Skeleton className="h-4 w-1/3 mt-2 mx-auto rounded-lg" />
                <Skeleton className="h-3 w-3/4 mt-2 mx-auto rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
