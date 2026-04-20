import { Typography } from "@/components/shared/Typography";
import { Item } from "@/components/ui/item";
import type { CookingTime } from "@/types/cookingTime.types";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { Microwave, NotepadText, Thermometer, Timer } from "lucide-react";
import Airfryer from "../../assets/airfryer.png";
import InstantPot from "../../assets/instant-pot.png";

export const CookingTimeDetailsContent = ({
  cookingTime,
}: {
  cookingTime: CookingTime;
}) => {
  console.log("cookingTime", cookingTime);
  return (
    <div className="bg-background rounded-t-4xl -mt-12 relative z-10 min-h-[calc(100dvh-42px-env(safe-area-inset-bottom))] flex flex-col gap-4 items-center">
      <span className="bg-muted w-25 h-1 block rounded-full mt-4"></span>
      <div className="text-center px-4">
        <Typography variant="h1" size="lg" weight="semibold">
          {cookingTime.name}
        </Typography>
        <span className="text-muted-foreground/60 text-xs px-4">
          Ajouté le {formatDate(cookingTime.createdAt)} par{" "}
          {cookingTime.addedBy.name}
        </span>
      </div>

      <div className="grid grid-cols-2 w-full gap-2 px-4">
        {cookingTime.device && (
          <Item variant={"muted"} size={"xs"} orientation="vertical">
            {cookingTime.device === "Instant Pot" && (
              <img
                src={InstantPot}
                alt="Instant Pot"
                className="h-[24px] w-[24px] dark:invert"
              />
            )}
            {cookingTime.device === "Airfryer" && (
              <img
                src={Airfryer}
                alt="Airfryer"
                className="h-[24px] w-[24px] dark:invert"
              />
            )}
            <div className="flex flex-col items-center">
              <span>{cookingTime.device}</span>
              <span className="text-muted-foreground/80 text-xs">Appareil</span>
            </div>
          </Item>
        )}
        {cookingTime.methodCook && (
          <Item variant={"muted"} size={"xs"} orientation="vertical">
            <Microwave />
            <div className="flex flex-col items-center">
              <span>{cookingTime.methodCook || 0}</span>
              <span className="text-muted-foreground/80 text-xs text-center">
                Méthode de cuisson
              </span>
            </div>
          </Item>
        )}
        {cookingTime.degreeCook > 0 && (
          <Item variant={"muted"} size={"xs"} orientation="vertical">
            <Thermometer />
            <div className="flex flex-col items-center">
              <span>{cookingTime.degreeCook}°C</span>
              <span className="text-muted-foreground/80 text-xs text-center">
                Température de cuisson
              </span>
            </div>
          </Item>
        )}
        {cookingTime.timeCook > 0 && (
          <Item variant={"muted"} size={"xs"} orientation="vertical">
            <Timer />
            <div className="flex flex-col items-center">
              <span>{formatTime(cookingTime.timeCook || 0)}</span>
              <span className="text-muted-foreground/80 text-xs text-center">
                Temps de cuisson
              </span>
            </div>
          </Item>
        )}
      </div>

      {cookingTime.notes && (
        <div className="px-4 w-full">
          <Item variant={"muted"} size={"xs"} orientation="vertical">
            <NotepadText />
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground/80 text-xs text-center">
                Notes
              </span>
              <span>{cookingTime.notes}</span>
            </div>
          </Item>
        </div>
      )}
    </div>
  );
};
