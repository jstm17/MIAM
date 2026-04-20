import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { CookingTime } from "@/types/cookingTime.types";
import { motion, MotionValue } from "framer-motion";
import { Skeleton } from "../ui/skeleton";
import { CookingTimeDetailsImageActions } from "./CookingTimeDetailsImageActions";

type CookingTimeDetailsImageProps = {
  cookingTime: CookingTime;
  y: MotionValue<string>;
};
export const CookingTimeDetailsImage = ({
  cookingTime,
  y,
}: CookingTimeDetailsImageProps) => {
  return (
    <div className="relative">
      <CookingTimeDetailsImageActions cookingTime={cookingTime} />
      <AspectRatio ratio={1} className=" overflow-hidden">
        {cookingTime?.image ? (
          <motion.img
            src={cookingTime?.image}
            alt="CookingTime"
            className="absolute inset-0 object-cover w-full h-full "
            style={{
              y,
            }}
          />
        ) : (
          <Skeleton className="w-full h-full bg-border" />
        )}
      </AspectRatio>
    </div>
  );
};
