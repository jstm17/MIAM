import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllCookingTimesByMe } from "@/hooks/cooking-times/useGetAllCookingTimesByMe";
import { useGetAllRecipesByMe } from "@/hooks/recipes/useGetAllRecipesByMe";
import { useGetFavorites } from "@/hooks/users/useGetFavorites";
import { BookmarkIcon, Timer, UtensilsCrossed } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { ProfileFavoritesContent } from "./ProfileFavoritesContent";
import { ProfileMyCookingTimesContent } from "./ProfileMyCookingTimesContent";
import { ProfileMyRecipesContent } from "./ProfileMyRecipesContent";
import { ProfileContentSkeleton } from "./skeletons/ProfileContentSkeleton";

export const ProfileContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipes, totalRecipes, isLoading } = useGetAllRecipesByMe();
  const {
    cookingTimes,
    totalCookingTimes,
    isLoading: cookingTimesIsLoading,
  } = useGetAllCookingTimesByMe();
  const {
    recipes: savedRecipes,
    cookingTimes: savedCookingTimes,
    total: totalFavorites,
    isLoading: isLoadingFavorites,
  } = useGetFavorites();

  const favorites = [...savedRecipes, ...savedCookingTimes].sort((a, b) => {
    const dateA = new Date(a.savedAt).getTime();
    const dateB = new Date(b.savedAt).getTime();
    return dateB - dateA;
  });

  const validTabs = ["my-recipes", "my-cooking-times", "saved"];
  const tabParam = searchParams.get("tab");
  const defaultTab = validTabs.includes(tabParam ?? "")
    ? tabParam!
    : "my-recipes";

  if (isLoading || cookingTimesIsLoading || isLoadingFavorites)
    return <ProfileContentSkeleton />;

  return (
    <Tabs
      defaultValue={defaultTab}
      value={defaultTab}
      onValueChange={(val) => {
        if (val === "my-cooking-times") {
          setSearchParams({ tab: "my-cooking-times" });
        } else if (val === "saved") {
          setSearchParams({ tab: "saved" });
        } else {
          setSearchParams({});
        }
      }}
      className="relative mr-auto w-full flex flex-col"
    >
      <TabsList className="w-full justify-start rounded-none border-b p-0 sticky top-0 z-40 bg-background">
        <TabsTrigger
          value="my-recipes"
          className="group select-none touch-manipulation relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
        >
          <UtensilsCrossed className="size-5 stroke-current text-muted-foreground group-data-[state=active]:text-foreground" />
        </TabsTrigger>
        <TabsTrigger
          value="my-cooking-times"
          className="group select-none touch-manipulation overflow-hidden whitespace-nowrap text-ellipsis relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none "
        >
          <Timer className="size-5 stroke-current text-muted-foreground group-data-[state=active]:text-foreground" />
        </TabsTrigger>
        <TabsTrigger
          value="saved"
          className="group select-none touch-manipulation overflow-hidden whitespace-nowrap text-ellipsis relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none "
        >
          <BookmarkIcon className="size-5 stroke-current text-muted-foreground group-data-[state=active]:text-foreground" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="my-recipes" className="p-4">
        <ProfileMyRecipesContent
          recipes={recipes}
          totalElement={totalRecipes}
        />
      </TabsContent>
      <TabsContent value="my-cooking-times" className="p-4">
        <ProfileMyCookingTimesContent
          cookingTimes={cookingTimes}
          totalElement={totalCookingTimes}
        />
      </TabsContent>
      <TabsContent value="saved" className="p-4">
        <ProfileFavoritesContent
          favorites={favorites}
          totalElement={totalFavorites}
        />
      </TabsContent>
    </Tabs>
  );
};
