import { Typography } from "@/components/shared/Typography";
import { Item } from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Recipe } from "@/types/recipe.types";
import { formatTime } from "@/utils/formatTime";
import { ChefHat, Timer, UsersRound } from "lucide-react";
import { IngredientsSection } from "./IngredientsSection";
import { PreparationSection } from "./PreparationSection";

export const RecipeDetailsContent = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div className="bg-background rounded-t-4xl -mt-6 relative z-10 min-h-full flex flex-col gap-4 items-center">
      <span className="bg-muted w-25 h-1 block rounded-full mt-4"></span>
      <Typography variant="h1" size="lg" weight="semibold">
        {recipe.name}
      </Typography>
      <div className="flex justify-between w-full gap-2 px-4">
        <Item variant={"muted"} size={"xs"} orientation="vertical">
          <Timer />
          {formatTime(recipe.time)}
        </Item>
        <Item variant={"muted"} size={"xs"} orientation="vertical">
          <UsersRound />
          Pour {recipe.personsNumber} pers.
        </Item>
        <Item variant={"muted"} size={"xs"} orientation="vertical">
          <ChefHat />
          <span className="text-center">Par {recipe.addedBy.name}</span>
        </Item>
      </div>

      <Tabs
        defaultValue="ingredients"
        className="relative mr-auto w-full flex flex-col"
      >
        <TabsList className="w-full justify-start rounded-none border-b p-0 sticky top-6 z-40 bg-background">
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
          className="p-4 pb-[calc(48px-env(safe-area-inset-bottom))]"
        >
          <IngredientsSection recipe={recipe} />
        </TabsContent>
        <TabsContent
          value="preparation"
          className="p-4 pb-[calc(48px-env(safe-area-inset-bottom))]"
        >
          <PreparationSection recipe={recipe} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
