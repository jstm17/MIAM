import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Field } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Recipe } from "@/types/recipe.types";
import { ListFilter } from "lucide-react";
import { Typography } from "../shared/Typography";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { RecipeFiltersCategory } from "./RecipeFiltersCategory";
import { RecipeFiltersUser } from "./RecipeFiltersUser";
import { RecipeFiltersVisibility } from "./RecipeFiltersVisibility";

type RecipesFiltersProps = {
  title: string;
  originalRecipes: Recipe[];
  totalElement: number;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  selectedCategories?: string[];
  setSelectedCategories?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedUsers?: string[];
  setSelectedUsers?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedVisibility?: string[];
  setSelectedVisibility?: React.Dispatch<React.SetStateAction<string[]>>;
};

export const RecipesFilters = ({
  title,
  originalRecipes,
  totalElement,
  sort,
  setSort,
  selectedCategories,
  setSelectedCategories,
  selectedUsers,
  setSelectedUsers,
  selectedVisibility,
  setSelectedVisibility,
}: RecipesFiltersProps) => {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <div className="flex justify-between items-center">
          <Typography variant="body" className="text-muted-foreground">
            {totalElement} {title}
          </Typography>
          <Button variant="outline" size="icon-lg">
            <ListFilter />
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Trier</DrawerTitle>
        </DrawerHeader>
        <Field className="px-4">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="recent">
                  Du plus récent au plus ancien
                </SelectItem>
                <SelectItem value="oldest">
                  Du plus ancien au plus récent
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Separator className="mx-4 mt-4 h-px" />
        <DrawerHeader>
          <DrawerTitle className="">Filtrer</DrawerTitle>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4 gap-4 flex flex-col">
          {selectedCategories && setSelectedCategories && (
            <RecipeFiltersCategory
              selectedCategories={selectedCategories}
              originalRecipes={originalRecipes}
              setSelectedCategories={setSelectedCategories}
            />
          )}

          {selectedUsers && setSelectedUsers && (
            <RecipeFiltersUser
              selectedUsers={selectedUsers}
              originalRecipes={originalRecipes}
              setSelectedUsers={setSelectedUsers}
            />
          )}
          {selectedVisibility && setSelectedVisibility && (
            <RecipeFiltersVisibility
              selectedVisibility={selectedVisibility}
              originalRecipes={originalRecipes}
              setSelectedVisibility={setSelectedVisibility}
            />
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" size="lg">
              Fermer
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
