import { Typography } from "@/components/shared/Typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllRecipesByMe } from "@/hooks/recipes/useGetAllRecipesByMe";
import { useGetSavedRecipes } from "@/hooks/users/useGetSavedRecipes";
import { ProfileMyRecipesContent } from "./ProfileMyRecipesContent";
import { ProfileSavedRecipesContent } from "./ProfileSavedRecipesContent";
import { ProfileContentSkeleton } from "./skeletons/ProfileContentSkeleton";

export const ProfileContent = () => {
  const { recipes, totalRecipes, isLoading } = useGetAllRecipesByMe();
  const {
    recipes: savedRecipes,
    totalRecipes: totalSavedRecipes,
    isLoading: savedRecipesIsLoading,
  } = useGetSavedRecipes();

  if (isLoading || savedRecipesIsLoading) return <ProfileContentSkeleton />;
  return (
    <Tabs
      defaultValue="my-recipes"
      className="relative mr-auto w-full flex flex-col"
    >
      <TabsList className="w-full justify-start rounded-none border-b p-0 sticky top-0 z-40 bg-background">
        <TabsTrigger
          value="my-recipes"
          className="relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
        >
          <Typography variant="body" weight="semibold">
            Mes recettes
          </Typography>
        </TabsTrigger>
        <TabsTrigger
          value="saved-recipes"
          className="relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none "
        >
          <Typography variant="body" weight="semibold">
            Recettes enregistrées
          </Typography>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="my-recipes" className="p-4">
        <ProfileMyRecipesContent
          recipes={recipes}
          totalElement={totalRecipes}
          // setRecipes={setRecipes}
          // setTotalRecipes={setTotalRecipes}
        />
      </TabsContent>
      <TabsContent value="saved-recipes" className="p-4">
        <ProfileSavedRecipesContent
          recipes={savedRecipes}
          totalElement={totalSavedRecipes}
          // setRecipes={setRecipes}
          // setTotalRecipes={setTotalRecipes}
        />
      </TabsContent>
    </Tabs>
  );
};
