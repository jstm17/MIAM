import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export const RecipeDetailsSkeleton = () => {
  return (
    <div className="min-h-dvh bg-background">
      <AspectRatio ratio={1} className="relative overflow-hidden">
        <Skeleton
          className="absolute inset-0 w-full h-full"
          // style={{ offsetY }}
        />
      </AspectRatio>

      <div className="bg-background rounded-t-4xl -mt-8 relative z-10 min-h-[calc(100dvh-100px-env(safe-area-inset-bottom))] flex flex-col gap-4 items-center px-4">
        <div className="bg-muted w-25 h-1 block rounded-full mt-4" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3 -mt-1" />

        <div className="grid gap-4 grid-cols-3 w-full">
          <Skeleton className="h-21 rounded-xl" />
          <Skeleton className="h-21 rounded-xl" />
          <Skeleton className="h-21 rounded-xl" />
        </div>

        <div className="mt-4 w-full">
          <div className="flex items-center justify-evenly gap-4 px-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/3" />
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
