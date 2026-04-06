import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Field, FieldLabel } from "@/components/ui/field";
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
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

type RecipesFiltersProps = {
  title: string;
  originalRecipes: Recipe[];
  totalElement: number;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

export const RecipesFilters = ({
  title,
  originalRecipes,
  totalElement,
  sort,
  setSort,
  selectedCategories,
  setSelectedCategories,
}: RecipesFiltersProps) => {
  const categories = Array.from(
    new Set(
      originalRecipes
        .flatMap((r) => r.categories || [])
        .filter((c) => c && c.name)
        .map((c) => c.name)
    )
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <div className="flex justify-between items-center">
          <Typography variant="body" className="text-muted-foreground">
            {totalElement} {title}
          </Typography>
          <Button variant="outline" size="icon">
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
            <SelectContent position="item-aligned">
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
          <div className="flex items-center justify-between">
            <DrawerTitle>Filtrer</DrawerTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="filter-mode">Rien</Label>
              <Switch
                id="filter-mode"
                checked={selectedCategories.length === categories.length}
                onCheckedChange={(checked) => {
                  setSelectedCategories(checked ? categories : []);
                }}
                className="bg-input"
              />
              <Label htmlFor="filter-mode">Tout</Label>
            </div>
          </div>
          <DrawerDescription>Par catégories</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4">
          {categories.map((category) => (
            <Field orientation="horizontal" className="mb-2" key={category}>
              <Checkbox
                id={category}
                name={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <FieldLabel htmlFor={category} className="font-normal">
                {category}
                <span className="text-muted-foreground text-xs ml-1">
                  (
                  {
                    originalRecipes.filter((r) =>
                      (r.categories || []).some((c) => c && c.name === category),
                    ).length
                  }
                  )
                </span>
              </FieldLabel>
            </Field>
          ))}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Fermer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
