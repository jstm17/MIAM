import { SearchCookingTimeContent } from "@/components/search/SearchCookingTimeContent";
import { SearchBar } from "@/components/search/SearchInput";
import { SearchRecipeContent } from "@/components/search/SearchRecipeContent";
import { Layout } from "@/components/shared/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Timer, UtensilsCrossed } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const defaultTab =
    searchParams.get("tab") === "cooking-time" ? "cooking-time" : "recipe";

  return (
    <Layout className="overflow-x-hidden gap-2 pb-[calc(74px+env(safe-area-inset-bottom))]">
      <SearchBar />

      <Tabs
        defaultValue={defaultTab}
        onValueChange={(val) => {
          if (val === "cooking-time") {
            setSearchParams({ tab: "cooking-time" });
          } else {
            setSearchParams({});
          }
        }}
        className="relative mr-auto w-full flex flex-col mt-2"
      >
        <TabsList className="w-full justify-start rounded-none border-b p-0 sticky top-0 z-40 bg-background">
          <TabsTrigger
            value="recipe"
            className="relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none "
          >
            <UtensilsCrossed className="size-5 stroke-current text-muted-foreground group-data-[state=active]:text-foreground" />
          </TabsTrigger>
          <TabsTrigger
            value="cooking-time"
            className="overflow-hidden whitespace-nowrap text-ellipsis relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none "
          >
            <Timer className="size-5 stroke-current text-muted-foreground group-data-[state=active]:text-foreground" />
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="recipe"
          className="pt-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
        >
          <SearchRecipeContent />
        </TabsContent>
        <TabsContent value="cooking-time" className="pt-4">
          <SearchCookingTimeContent />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};
