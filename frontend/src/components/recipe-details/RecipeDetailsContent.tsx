import { Typography } from "@/components/shared/Typography";
import { Item } from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Recipe } from "@/types/recipe.types";
import { formatDate } from "@/utils/formatDate";
import { formatTime } from "@/utils/formatTime";
import { Microwave, Timer, UsersRound } from "lucide-react";
import { IngredientsSection } from "./IngredientsSection";
import { PreparationSection } from "./PreparationSection";

export const RecipeDetailsContent = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div className="bg-background rounded-t-4xl -mt-12 relative z-10 min-h-[calc(100dvh-42px-env(safe-area-inset-bottom))] flex flex-col gap-4 items-center">
      <span className="bg-muted w-25 h-1 block rounded-full mt-4"></span>
      <div className="text-center">
        <Typography variant="h1" size="lg" weight="semibold">
          {recipe.name}
        </Typography>
        <span className="text-muted-foreground/60 text-xs">
          Ajouté le {formatDate(recipe.createdAt)} par {recipe.addedBy.name}
        </span>
      </div>
      <div className="flex justify-between w-full gap-2 px-4">
        <Item variant={"muted"} size={"xs"} orientation="vertical">
          <Timer />
          <div className="flex flex-col items-center">
            <span>{formatTime(recipe.timePrep || 0)}</span>
            <span className="text-muted-foreground/80 text-xs">
              de preparation
            </span>
          </div>
        </Item>
        <Item variant={"muted"} size={"xs"} orientation="vertical">
          <Microwave />
          <div className="flex flex-col items-center">
            <span>{formatTime(recipe.timeCook || 0)}</span>
            <span className="text-muted-foreground/80 text-xs">de cuisson</span>
          </div>
        </Item>
        <Item variant={"muted"} size={"xs"} orientation="vertical">
          <UsersRound />
          <div className="flex flex-col items-center">
            <span>{recipe.personsNumber}</span>
            <span className="text-muted-foreground/80 text-xs">personnes</span>
          </div>
        </Item>
      </div>

      <Tabs
        defaultValue="ingredients"
        className="relative mr-auto w-full flex flex-col"
      >
        <TabsList className="w-full justify-start rounded-none border-b p-0 sticky -top-px z-40 bg-background">
          <TabsTrigger
            value="ingredients"
            className="relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
          >
            <Typography variant="body" weight="semibold">
              Ingrédients
            </Typography>
          </TabsTrigger>
          <TabsTrigger
            value="preparation"
            className="relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
          >
            <Typography variant="body" weight="semibold">
              Préparation
            </Typography>
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="ingredients"
          className="p-4 pb-[calc(74px+env(safe-area-inset-bottom))]"
        >
          <IngredientsSection recipe={recipe} />
        </TabsContent>
        <TabsContent
          value="preparation"
          className="p-4 pb-[calc(74px+env(safe-area-inset-bottom))]"
        >
          <PreparationSection recipe={recipe} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
