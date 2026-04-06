import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export const RecipeDetailsSkeleton = ({ offsetY }: { offsetY: number }) => {
  return (
    <div>
      <AspectRatio ratio={14 / 9} className="relative overflow-hidden">
        <Skeleton
          className="absolute inset-0 object-cover w-full h-full"
          style={{ transform: `translateY(${offsetY * 0.4}px)` }}
        />
      </AspectRatio>
    </div>
  );
};
