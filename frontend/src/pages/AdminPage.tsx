import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { Typography } from "@/components/shared/Typography";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Item } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { useGetAllAdmins } from "@/hooks/admins/useGetAllAdmins";
import { useUpdateAdmins } from "@/hooks/admins/useUpdateAdmins";
import { useGetAllCategories } from "@/hooks/categories/useGetAllCategories";
import { useGetAllCookingTimes } from "@/hooks/cooking-times/useGetAllCookingTimes";
import { useGetAllIngredients } from "@/hooks/ingredients/useGetAllIngredients";
import { useGetAllRecipes } from "@/hooks/recipes/useGetAllRecipes";
import { useGetAllUsers } from "@/hooks/users/useGetAllUsers";
import type { ApiError } from "@/types/error.types";
import { Carrot, ChefHat, Clock, Search, Tags, UsersRound, UtensilsCrossed } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const AdminPage = () => {
  const anchor = useComboboxAnchor();
  const { users, totalUsers, isLoading: isLoadingUsers } = useGetAllUsers();
  const { totalRecipes, isLoading: isLoadingRecipes } = useGetAllRecipes();
  const { totalCookingTimes, isLoading: isLoadingCookingTimes } =
    useGetAllCookingTimes();
  const { totalCategories, isLoading: isLoadingCategories } =
    useGetAllCategories();
  const { totalIngredients, isLoading: isLoadingIngredients } =
    useGetAllIngredients();

  const { admins, totalAdmins, isLoading: isLoadingAdmins } = useGetAllAdmins();
  const updateAdmins = useUpdateAdmins();
  const adminNames = useMemo(() => admins.map((admin) => admin.name), [admins]);
  const userNames = users.map((user) => user.name);

  const [selectedAdmins, setSelectedAdmins] = useState<string[]>(adminNames);

  useEffect(() => {
    setSelectedAdmins(adminNames);
  }, [adminNames]);

  const handleValueChange = (values: string[]) => {
    setSelectedAdmins(values);
  };

  const onSubmit = async () => {
    try {
      await updateAdmins.mutateAsync(selectedAdmins);
      toast.success("Mis à jour des administrateurs");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(apiError.message);
    }
  };

  if (
    isLoadingCategories ||
    isLoadingCookingTimes ||
    isLoadingIngredients ||
    isLoadingRecipes ||
    isLoadingUsers ||
    isLoadingAdmins
  )
    return <Loading />;

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-2 gap-4">
        <Item className="bg-muted flex flex-col items-center gap-0">
          <Typography size="xl" weight="bold" className="">
            {totalUsers}
          </Typography>

          <div className="flex gap-1 items-center">
            <ChefHat size={14} className="text-muted-foreground/80" />
            <span className="text-sm text-muted-foreground/80">Chefs</span>
          </div>
        </Item>
        <Item className="bg-muted flex flex-col items-center gap-0">
          <Typography size="xl" weight="bold" className="">
            {totalAdmins}
          </Typography>
            <div className="flex gap-1 items-center">
            <UsersRound size={14} className="text-muted-foreground/80" />
            <span className="text-sm text-muted-foreground/80">Admins</span>
          </div>
        </Item>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Item className="bg-muted flex flex-col items-center gap-0">
          <Typography size="xl" weight="bold" className="">
            {totalRecipes}
          </Typography>
           <div className="flex gap-1 items-center">
            <UtensilsCrossed size={14} className="text-muted-foreground/80" />
            <span className="text-sm text-muted-foreground/80">Recettes</span>
          </div>
        </Item>
        <Item className="bg-muted flex flex-col items-center gap-0">
          <Typography size="xl" weight="bold" className="">
            {totalCookingTimes}
          </Typography>
           <div className="flex gap-1 items-center">
            <Clock size={14} className="text-muted-foreground/80" />
            <span className="text-sm text-muted-foreground/80">Temps de cuisson</span>
          </div>
        </Item>
        <Item className="bg-muted flex flex-col items-center gap-0">
          <Typography size="xl" weight="bold" className="">
            {totalCategories}
          </Typography>
           <div className="flex gap-1 items-center">
            <Tags size={14} className="text-muted-foreground/80" />
            <span className="text-sm text-muted-foreground/80">Catégories</span>
          </div>
        </Item>
        <Item className="bg-muted flex flex-col items-center gap-0">
          <Typography size="xl" weight="bold" className="">
            {totalIngredients}
          </Typography>
         <div className="flex gap-1 items-center">
            <Carrot size={14} className="text-muted-foreground/80" />
            <span className="text-sm text-muted-foreground/80">Ingrédients</span>
          </div>
        </Item>
      </div>
      <Separator className="h-px" />
      <Typography weight="bold" className="text-center">
        Administrateurs
      </Typography>
      <Combobox
        multiple
        autoHighlight
        items={userNames}
        value={selectedAdmins}
        onValueChange={handleValueChange}
      >
        <div className="flex gap-2 items-center w-full relative">
          <Search
            size={20}
            className="size-4 shrink-0 text-foreground absolute left-2"
          />
          <ComboboxChips ref={anchor} className="w-full pl-8!">
            <ComboboxValue>
              {(values) => (
                <>
                  {values.map((value: string) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    placeholder={`${
                      selectedAdmins.length > 0 ? "" : "Recherche par nom"
                    }`}
                  />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
        </div>
        <ComboboxContent anchor={anchor} className="bg-popover/96">
          <ComboboxEmpty>
            Cet ingrédient n'est dans aucune recettes.
          </ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Button size="lg" onClick={onSubmit} disabled={updateAdmins.isPending}>
        Valider
      </Button>
    </Layout>
  );
};
