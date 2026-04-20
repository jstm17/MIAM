"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { CookingTime } from "@/types/cookingTime.types";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";

type CookingTimeFiltersCategoryProps = {
  selectedCategories: string[];
  originalCookingTimes: CookingTime[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
};
export function CookingTimeFiltersCategory({
  selectedCategories,
  originalCookingTimes,
  setSelectedCategories,
}: CookingTimeFiltersCategoryProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const categories = Array.from(
    new Set(
      originalCookingTimes
        .flatMap((r) => r.categories || [])
        .map((c) => c?.name)
        .filter((name): name is string => !!name),
    ),
  );

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const allSelected = selectedCategories.length === categories.length;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-full flex-col gap-2 border border-input p-2 rounded-xl dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40"
    >
      <div className="flex items-center justify-between gap-2 w-full">
        <CollapsibleTrigger className="flex items-center gap-2 w-full">
          <ChevronsUpDown size={20} />
          <span className="text-start text-base">Par catégories</span>
        </CollapsibleTrigger>
        <div className="flex items-center space-x-2">
          <Checkbox checked={false} />
          <Switch
            id="filter-mode"
            checked={allSelected}
            onCheckedChange={(checked) => {
              setSelectedCategories(checked ? categories : []);
            }}
            className={allSelected ? "bg-primary" : "bg-input"}
          />
          <Checkbox checked={true} />
        </div>
      </div>

      <CollapsibleContent className="flex flex-col gap-2 mt-2">
        {categories.map((category) => (
          <Field orientation="horizontal" className="" key={category}>
            <Checkbox
              id={category}
              name={category}
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => toggleCategory(category)}
            />
            <FieldLabel htmlFor={category} className="font-normal text-md">
              {category}
              <span className="text-muted-foreground text-xs ml-1">
                (
                {
                  originalCookingTimes.filter((r) =>
                    (r.categories || []).some((c) => c && c.name === category),
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
}
