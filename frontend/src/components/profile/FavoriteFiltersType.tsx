import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { CookingTime } from "@/types/cookingTime.types";
import type { Recipe } from "@/types/recipe.types";
import { ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";

type FavoriteFiltersTypeProps = {
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  originalFavorites: (Recipe | CookingTime)[];
};

const typeOptions = [
  { id: "recipes", label: "Recettes" },
  { id: "cooking-times", label: "Temps de cuisson" },
];

export const FavoriteFiltersType = ({
  selectedTypes,
  setSelectedTypes,
  originalFavorites,
}: FavoriteFiltersTypeProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const allSelected = selectedTypes.length === typeOptions.length;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-full flex-col gap-2 border border-input p-2 rounded-xl dark:bg-input/30"
    >
      <div className="flex items-center justify-between gap-2 w-full">
        <CollapsibleTrigger className="flex items-center gap-2 w-full">
          <ChevronsUpDown size={20} />
          <span className="text-start text-base">Par type</span>
        </CollapsibleTrigger>
        <div className="flex items-center space-x-2">
          <Checkbox checked={false} />
          <Switch
            id="filter-type-mode"
            checked={allSelected}
            onCheckedChange={(checked) =>
              setSelectedTypes(checked ? typeOptions.map((o) => o.id) : [])
            }
            className={allSelected ? "bg-primary" : "bg-input"}
          />
          <Checkbox checked={true} />
        </div>
      </div>

      <CollapsibleContent className="flex flex-col gap-2 mt-2">
        {typeOptions.map((option) => (
          <Field orientation="horizontal" key={option.id}>
            <Checkbox
              id={option.id}
              name={option.id}
              checked={selectedTypes.includes(option.id)}
              onCheckedChange={() => toggleType(option.id)}
            />
            <FieldLabel htmlFor={option.id} className="font-normal text-md">
              {option.label}
              <span className="text-muted-foreground text-xs ml-1">
                (
                {
                  originalFavorites.filter((f) =>
                    option.id === "recipes"
                      ? "ingredients" in f
                      : !("ingredients" in f),
                  ).length
                }
                )
              </span>
            </FieldLabel>
          </Field>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};
