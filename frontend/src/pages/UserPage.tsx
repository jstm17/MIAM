import { EmptyCard } from "@/components/shared/EmptyCard";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserContentCookingTime } from "@/components/user/UserContentCookingTime";
import { UserHeader } from "@/components/user/UserHeader";
import { UserRecipeContent } from "@/components/user/UserRecipeContent";
import { useGetUserBySlug } from "@/hooks/users/useGetUserBySlug";
import { Timer, UtensilsCrossed } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export const UserPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, isLoading } = useGetUserBySlug(slug!);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const defaultTab =
    searchParams.get("tab") === "cooking-time" ? "cooking-time" : "recipe";

  if (isLoading) return <Loading />;

  if (!user) {
    return (
      <Layout
        header
        className="items-center pt-4 pb-[calc(env(safe-area-inset-bottom)+48px)]"
      >
        <EmptyCard
          title="Utilisateur non trouvé"
          description="Cet utilisateur n'existe pas."
          buttonText="Retour"
          onButtonClick={() => navigate(-1)}
        />
      </Layout>
    );
  }
  return (
    <Layout>
      <UserHeader user={user} />

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
            <UtensilsCrossed className="size-5" />
          </TabsTrigger>
          <TabsTrigger
            value="cooking-time"
            className="overflow-hidden whitespace-nowrap text-ellipsis relative rounded-none border-b-2 border-b-transparent p-2 bg-transparent font-semibold text-muted-foreground shadow-none transition-none focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:text-primary data-[state=active]:shadow-none "
          >
            <Timer className="size-5" />
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="recipe"
          className="p-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
        >
          <UserRecipeContent user={user} />
        </TabsContent>
        <TabsContent
          value="cooking-time"
          className="p-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
        >
          <UserContentCookingTime user={user} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};
