import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useGetAllCategoriesVisibles } from "@/hooks/categories/useGetAllCategoriesVisibles";
import { useGetAllRecipesVisibles } from "@/hooks/recipes/useGetAllRecipesVisibles";
import { useSearchBar } from "@/hooks/search/useSearchBar";
import { useGetAllUsersVisibles } from "@/hooks/users/useGetAllUsersVisibles";
import { SearchIcon } from "lucide-react";
import { GroupInput } from "../shared/GroupInput";
import { Button } from "../ui/button";
import { SearchCategoryItem } from "./SearchCategoryItem";
import { SearchRecentItem } from "./SearchRecentItem";
import { SearchRecipeItem } from "./SearchRecipeItem";
import { SearchUserItem } from "./SearchUserItem";

export const SearchBar = () => {
  const { recipes } = useGetAllRecipesVisibles();
  const { categories } = useGetAllCategoriesVisibles();
  const { users } = useGetAllUsersVisibles();

  const {
    query,
    open,
    setOpen,
    filteredRecipes,
    filteredCategories,
    filteredUsers,
    hasResults,
    randomRecipes,
    randomCategories,
    randomUsers,
    recentSearches,
    getRecipesCount,
    getUserRecipesCount,
    handleRecipeSelect,
    handleCategorySelect,
    handleUserSelect,
    handleRecentSelect,
    handleQueryChange,
    handleClose,
    setRecentSearches,
  } = useSearchBar(recipes, categories, users);

  return (
    <div>
      <div data-slot="command-input-wrapper" className="p-4 pb-0">
        <GroupInput
          type="text"
          placeholder="Rechercher une recette, catégorie, chef..."
          onClick={() => setOpen(true)}
          inputGroupAddon={
            <SearchIcon className="size-4 shrink-0 text-foreground" />
          }
          groupAddonAlign="inline-start"
          inputGroupAddonClassName="pl-2!"
        />
      </div>

      <CommandDialog
        open={open}
        onOpenChange={handleClose}
        className="rounded-t-none!"
      >
        <Command
          className="rounded-t-none! shadow-md pb-0"
          shouldFilter={false}
        >
          <CommandInput
            placeholder="Rechercher une recette, catégorie, chef..."
            value={query}
            onValueChange={handleQueryChange}
          />
          <CommandList className="mt-1">
            {query && !hasResults && (
              <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
            )}

            {!query && (
              <>
                {recentSearches.length > 0 && (
                  <CommandGroup
                    heading={
                      <div className="flex justify-between items-center w-full p-0">
                        <span>Recherches récentes</span>
                        <Button
                          variant="link"
                          size="xs"
                          className="text-[0.6rem] text-muted-foreground hover:text-foreground -mlr-6 p-0 h-4"
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem("recentSearches");
                          }}
                        >
                          Effacer
                        </Button>
                      </div>
                    }
                  >
                    {recentSearches.map((search) => (
                      <SearchRecentItem
                        key={search.slug}
                        search={search}
                        onSelect={() => handleRecentSelect(search)}
                      />
                    ))}
                  </CommandGroup>
                )}
                {recentSearches.length > 0 && <CommandSeparator />}
                <CommandGroup heading="Recettes">
                  {randomRecipes.map((recipe) => (
                    <SearchRecipeItem
                      key={recipe._id}
                      recipe={recipe}
                      onSelect={() => handleRecipeSelect(recipe)}
                    />
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Catégories">
                  {randomCategories.map((category) => (
                    <SearchCategoryItem
                      key={category._id}
                      category={category}
                      recipesCount={getRecipesCount(category._id)}
                      onSelect={() => handleCategorySelect(category)}
                    />
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Chefs">
                  {randomUsers.map((user) => (
                    <SearchUserItem
                      key={user._id}
                      user={user}
                      recipesCount={getUserRecipesCount(user._id)}
                      onSelect={() => handleUserSelect(user)}
                    />
                  ))}
                </CommandGroup>
              </>
            )}

            {filteredRecipes.length > 0 && (
              <CommandGroup heading="Recettes">
                {filteredRecipes.map((recipe) => (
                  <SearchRecipeItem
                    key={recipe._id}
                    recipe={recipe}
                    onSelect={() => handleRecipeSelect(recipe)}
                  />
                ))}
              </CommandGroup>
            )}
            {filteredRecipes.length > 0 && filteredCategories.length > 0 && (
              <CommandSeparator />
            )}
            {filteredCategories.length > 0 && (
              <CommandGroup heading="Catégories">
                {filteredCategories.map((category) => (
                  <SearchCategoryItem
                    key={category._id}
                    category={category}
                    recipesCount={getRecipesCount(category._id)}
                    onSelect={() => handleCategorySelect(category)}
                  />
                ))}
              </CommandGroup>
            )}
            {filteredCategories.length > 0 && filteredUsers.length > 0 && (
              <CommandSeparator />
            )}
            {filteredUsers.length > 0 && (
              <CommandGroup heading="Chefs">
                {filteredUsers.map((user) => (
                  <SearchUserItem
                    key={user._id}
                    user={user}
                    recipesCount={getUserRecipesCount(user._id)}
                    onSelect={() => handleUserSelect(user)}
                  />
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};
