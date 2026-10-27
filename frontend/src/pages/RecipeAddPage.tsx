import { CookingTimeAddContent } from "@/components/cooking-time-add/CookingTimeAddContent";
import { RecipeAddContent } from "@/components/recipe-add/RecipeAddContent";
import { RecipeAddHeader } from "@/components/recipe-add/RecipeAddHeader";
import { Layout } from "@/components/shared/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  clearCookingTimeFormDraft,
  clearRecipeFormDraft,
  getFormDraftFlags,
  readAddTab,
  saveAddTab,
  subscribeFormDrafts,
  type AddTab,
} from "@/utils/formDraft";
import { Timer, UtensilsCrossed } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "react-router-dom";

export function RecipeAddPage() {
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const drafts = useSyncExternalStore(
    subscribeFormDrafts,
    getFormDraftFlags,
    getFormDraftFlags,
  );

  const [tab, setTab] = useState<AddTab>(() => {
    if (requestedTab === "cooking-time") return "add-cooking-time";
    if (requestedTab === "recipe") return "add-recipe";
    return readAddTab();
  });
  const [recipeFormKey, setRecipeFormKey] = useState(0);
  const [cookingTimeFormKey, setCookingTimeFormKey] = useState(0);

  useEffect(() => {
    if (requestedTab === "cooking-time") setTab("add-cooking-time");
    if (requestedTab === "recipe") setTab("add-recipe");
  }, [requestedTab]);

  useEffect(() => {
    saveAddTab(tab);
  }, [tab]);

  const title =
    tab === "add-recipe"
      ? "Ajouter une recette"
      : "Ajouter un temps de cuisson";

  const canClear =
    tab === "add-recipe" ? drafts.recipe : drafts.cookingTime;

  const clearCurrentForm = () => {
    if (tab === "add-recipe") {
      clearRecipeFormDraft();
      setRecipeFormKey((key) => key + 1);
      return;
    }
    clearCookingTimeFormDraft();
    setCookingTimeFormKey((key) => key + 1);
  };

  return (
    <Layout className="items-center pt-4 pb-[calc(env(safe-area-inset-bottom)+32px)]">
      <RecipeAddHeader
        title={title}
        tab={tab}
        canClear={canClear}
        onClear={clearCurrentForm}
      />
      <Tabs
        value={tab}
        onValueChange={(value) => {
          if (value === "add-recipe" || value === "add-cooking-time") setTab(value);
        }}
        className="relative mr-auto w-full flex flex-col mt-[20px]"
      >
        <TabsList className="w-full justify-start rounded-none border-b p-0 sticky top-0 z-40 bg-background">
          <TabsTrigger
            value="add-recipe"
            className="relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none "
          >
            <UtensilsCrossed className="size-5 stroke-current text-muted-foreground group-data-[state=active]:text-foreground" />
          </TabsTrigger>
          <TabsTrigger
            value="add-cooking-time"
            className="overflow-hidden whitespace-nowrap text-ellipsis relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none "
          >
            <Timer className="size-5 stroke-current text-muted-foreground group-data-[state=active]:text-foreground" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="add-recipe" className="py-4">
          <RecipeAddContent key={recipeFormKey} />
        </TabsContent>
        <TabsContent value="add-cooking-time" className="py-4">
          <CookingTimeAddContent key={cookingTimeFormKey} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
