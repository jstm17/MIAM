import { CookingTimeAddContent } from "@/components/cooking-time-add/CookingTimeAddContent";
import { RecipeAddContent } from "@/components/recipe-add/RecipeAddContent";
import { Layout } from "@/components/shared/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export function RecipeAddPage() {
  const [tab, setTab] = useState("add-recipe");
  const [searchParams] = useSearchParams();

  const defaultTab =
    searchParams.get("tab") === "cooking-time"
      ? "add-cooking-time"
      : "add-recipe";

  const title =
    tab === "add-recipe"
      ? "Ajouter une recette"
      : "Ajouter un temps de cuisson";

  return (
    <Layout
      title={title}
      titleSize="lg"
      className="items-center pt-4 pb-[calc(env(safe-area-inset-bottom)+48px)]"
    >
      <Tabs
        value={tab}
        onValueChange={setTab}
        defaultValue={defaultTab}
        className="relative mr-auto w-full flex flex-col mt-2"
      >
        <TabsList className="w-full justify-start rounded-none border-b p-0 sticky top-0 z-40 bg-background">
          <TabsTrigger
            value="add-recipe"
            className="relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none "
          >
            <UtensilsCrossed className="size-5" />
          </TabsTrigger>
          <TabsTrigger
            value="add-cooking-time"
            className="overflow-hidden whitespace-nowrap text-ellipsis relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none "
          >
            <Timer className="size-5" />
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="add-recipe"
          className="p-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
        >
          <RecipeAddContent />
        </TabsContent>
        <TabsContent
          value="add-cooking-time"
          className="p-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
        >
          <CookingTimeAddContent />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
