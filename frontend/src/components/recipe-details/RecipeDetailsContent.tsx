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
    <div className="bg-background rounded-t-4xl -mt-12 relative z-10 min-h-[calc(100dvh-100px-env(safe-area-inset-bottom))] flex flex-col gap-4 items-center">
      <span className="bg-muted w-25 h-1 block rounded-full mt-4"></span>
      <div className="text-center px-4">
        <Typography variant="h1" size="lg" weight="semibold">
          {recipe.name}
        </Typography>
        <span className="text-muted-foreground/60 text-xs px-4">
          Ajouté le {formatDate(recipe.createdAt)} par {recipe.addedBy.name}
        </span>
      </div>

      {(recipe.timePrep > 0 ||
        recipe.timeCook > 0 ||
        recipe.personsNumber > 0) && (
        <div className="flex justify-center w-full gap-2 px-4">
          {recipe.timePrep > 0 && (
            <Item
              variant={"muted"}
              size={"xs"}
              orientation="vertical"
              className="max-w-40"
            >
              <Timer />
              <div className="flex flex-col items-center">
                <span>{formatTime(recipe.timePrep || 0)}</span>
                <span className="text-muted-foreground/80 text-xs text-center">
                  de préparation
                </span>
              </div>
            </Item>
          )}
          {recipe.timeCook > 0 && (
            <Item
              variant={"muted"}
              size={"xs"}
              orientation="vertical"
              className="max-w-40"
            >
              <Microwave />
              <div className="flex flex-col items-center">
                <span>{formatTime(recipe.timeCook || 0)}</span>
                <span className="text-muted-foreground/80 text-xs">
                  de cuisson
                </span>
              </div>
            </Item>
          )}

          {recipe.personsNumber > 0 && (
            <Item
              variant={"muted"}
              size={"xs"}
              orientation="vertical"
              className="max-w-40"
            >
              <UsersRound />
              <div className="flex flex-col items-center">
                <span>{recipe.personsNumber}</span>
                <span className="text-muted-foreground/80 text-xs">
                  personnes
                </span>
              </div>
            </Item>
          )}
        </div>
      )}

      <Tabs
        defaultValue="ingredients"
        className="relative mr-auto w-full flex flex-col"
      >
        <TabsList className="w-full justify-start rounded-none border-b p-0 sticky -top-px z-40 bg-background">
          <TabsTrigger
            value="ingredients"
            className="group select-none touch-manipulation relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
          >
            <Typography
              variant="body"
              weight="semibold"
              className="text-muted-foreground group-data-[state=active]:text-foreground"
            >
              Ingrédients
            </Typography>
          </TabsTrigger>
          <TabsTrigger
            value="preparation"
            className="group select-none touch-manipulation relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
          >
            <Typography
              variant="body"
              weight="semibold"
              className="text-muted-foreground group-data-[state=active]:text-foreground"
            >
              Préparation
            </Typography>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ingredients" className="p-4">
          <IngredientsSection recipe={recipe} />
        </TabsContent>
        <TabsContent value="preparation" className="p-4">
          <PreparationSection recipe={recipe} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
