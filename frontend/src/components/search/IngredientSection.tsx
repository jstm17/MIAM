import { Carrot, ChevronRight, Search } from "lucide-react";
import { Typography } from "../shared/Typography";

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

import { useGetAllIngredientsVisibles } from "@/hooks/ingredients/useGetAllIngredientsVisibles";
import { useGetAllRecipesVisibles } from "@/hooks/recipes/useGetAllRecipesVisibles";
import * as React from "react";
import { Link } from "react-router-dom";
import { IngredientCarousel } from "./IngredientCarousel";

const IngredientSectionHeader = () => (
  <div className="flex gap-2 px-4 items-center justify-between mb-1">
    <div className="flex gap-2 items-center">
      <Carrot />
      <Typography size="md" weight="bold">
        Ingrédients
      </Typography>
    </div>
    <Link to="/ingredients" className="flex gap-1 items-center">
      <Typography
        size="sm"
        variant="body"
        className="text-secondary-foreground/80"
      >
        Tout voir
      </Typography>
      <ChevronRight size={16} className="text-secondary-foreground/80" />
    </Link>
  </div>
);

export const IngredientSection = () => {
  const anchor = useComboboxAnchor();
  const [selectedIngredients, setSelectedIngredients] = React.useState<
    string[]
  >([]);

  const { ingredients, isLoading: isLoadingIngredients } =
    useGetAllIngredientsVisibles();
  const { recipes, isLoading: isLoadingRecipes } = useGetAllRecipesVisibles();
  const ingredientNames = ingredients.map((ingredient) => ingredient.name);

  const filteredRecipes = React.useMemo(() => {
    if (selectedIngredients.length === 0) return [];

    return recipes.filter((recipe) =>
      selectedIngredients.every((selected) =>
        recipe.ingredients.some(
          (recipeIngredient) =>
            recipeIngredient.ingredient?.name?.toLowerCase() ===
            selected.toLowerCase(),
        ),
      ),
    );
  }, [recipes, selectedIngredients]);

  return (
    <div className="min-h-68">
      <IngredientSectionHeader />

      <div className="px-4 py-2">
        <Combobox
          multiple
          autoHighlight
          items={ingredientNames}
          value={selectedIngredients}
          onValueChange={setSelectedIngredients}
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
                      placeholder={`${selectedIngredients.length > 0 ? "" : "Rechercher un ingrédient"}`}
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
      </div>

      <IngredientCarousel
        selectedIngredients={selectedIngredients}
        filteredRecipes={filteredRecipes}
        isLoading={isLoadingIngredients || isLoadingRecipes}
      />
    </div>
  );
};
