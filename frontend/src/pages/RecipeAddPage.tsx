import { CookingTimeAddContent } from "@/components/cooking-time-add/CookingTimeAddContent";
import { RecipeAddContent } from "@/components/recipe-add/RecipeAddContent";
import { Layout } from "@/components/shared/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export function RecipeAddPage() {
  const [searchParams] = useSearchParams();

  const defaultTab =
    searchParams.get("tab") === "cooking-time"
      ? "add-cooking-time"
      : "add-recipe";

  const [tab, setTab] = useState(defaultTab);

  const title =
    tab === "add-recipe"
      ? "Ajouter une recette"
      : "Ajouter un temps de cuisson";

  return (
    <Layout
      title={title}
      titleSize="lg"
      className="items-center pt-4 pb-[calc(env(safe-area-inset-bottom)+32px)]"
    >
      <Tabs
        value={tab}
        onValueChange={setTab}
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
          <RecipeAddContent />
        </TabsContent>
        <TabsContent value="add-cooking-time" className="py-4">
          <CookingTimeAddContent />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
