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
import type { CookingTime } from "@/types/cookingTime.types";
import type { Recipe } from "@/types/recipe.types";
import { ListFilter } from "lucide-react";
import { Typography } from "../shared/Typography";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { FavoriteFiltersCategory } from "./FavoriteFiltersCategory";
import { FavoriteFiltersType } from "./FavoriteFiltersType";
import { FavoriteFiltersUser } from "./FavoriteFiltersUser";
import { FavoriteFiltersVisibility } from "./FavoriteFiltersVisibility";

type FavoritesFiltersProps = {
  title: string;
  originalFavorites: (Recipe | CookingTime)[];
  totalElement: number;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  selectedTypes?: string[];
  setSelectedTypes?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategories?: string[];
  setSelectedCategories?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedUsers?: string[];
  setSelectedUsers?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedVisibility?: string[];
  setSelectedVisibility?: React.Dispatch<React.SetStateAction<string[]>>;
};

export const FavoritesFilters = ({
  title,
  originalFavorites,
  totalElement,
  sort,
  setSort,
  selectedTypes,
  setSelectedTypes,
  selectedCategories,
  setSelectedCategories,
  selectedUsers,
  setSelectedUsers,
  selectedVisibility,
  setSelectedVisibility,
}: FavoritesFiltersProps) => {
  return (
    <Drawer direction="right">
      <div className="flex justify-between items-center">
        <Typography variant="body" className="text-muted-foreground">
          {totalElement} {title}
        </Typography>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon-lg">
            <ListFilter />
          </Button>
        </DrawerTrigger>
      </div>
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
          {selectedTypes && setSelectedTypes && (
            <FavoriteFiltersType
              selectedTypes={selectedTypes}
              originalFavorites={originalFavorites}
              setSelectedTypes={setSelectedTypes}
            />
          )}
          {selectedCategories && setSelectedCategories && (
            <FavoriteFiltersCategory
              selectedCategories={selectedCategories}
              originalFavorites={originalFavorites}
              setSelectedCategories={setSelectedCategories}
            />
          )}

          {selectedUsers && setSelectedUsers && (
            <FavoriteFiltersUser
              selectedUsers={selectedUsers}
              originalFavorites={originalFavorites}
              setSelectedUsers={setSelectedUsers}
            />
          )}
          {selectedVisibility && setSelectedVisibility && (
            <FavoriteFiltersVisibility
              selectedVisibility={selectedVisibility}
              originalFavorites={originalFavorites}
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
