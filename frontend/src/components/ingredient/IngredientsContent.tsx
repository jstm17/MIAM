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
import { Search } from "lucide-react";
import React from "react";
import { IngredientsContentResults } from "./IngredientsContentResults";
export const IngredientsContent = () => {
  const [selectedIngredients, setSelectedIngredients] = React.useState<
    string[]
  >([]);

  const { ingredients, isLoading: isLoadingIngredients } =
    useGetAllIngredientsVisibles();
  const { recipes, isLoading: isLoadingRecipes } = useGetAllRecipesVisibles();
  const ingredientNames = ingredients.map((ingredient) => ingredient.name);
  const anchor = useComboboxAnchor();

  const resultRecipes = React.useMemo(() => {
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
    <div className="w-full flex flex-col gap-4">
      <div className="py-2">
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

      <IngredientsContentResults
        selectedIngredients={selectedIngredients}
        resultRecipes={resultRecipes}
        isLoading={isLoadingIngredients || isLoadingRecipes}
      />
    </div>
  );
};
