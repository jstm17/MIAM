"use client";

import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { CookingTime } from "@/types/cookingTime.types";
import { ChevronsUpDown } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";

type CookingTimeFiltersVisibilityProps = {
  selectedVisibility: string[];
  originalCookingTimes: CookingTime[];
  setSelectedVisibility:
    | React.Dispatch<React.SetStateAction<string[]>>
    | undefined;
};

const visibilityOptions = [
  { id: "visible", label: "Public" },
  { id: "hidden", label: "Privé" },
];

export function CookingTimeFiltersVisibility({
  selectedVisibility,
  originalCookingTimes,
  setSelectedVisibility,
}: CookingTimeFiltersVisibilityProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleVisibility = (visibilityId: string) => {
    if (setSelectedVisibility) {
      setSelectedVisibility((prev) =>
        prev.includes(visibilityId)
          ? prev.filter((id) => id !== visibilityId)
          : [...prev, visibilityId],
      );
    }
  };

  const allSelected = selectedVisibility.length === visibilityOptions.length;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-full flex-col gap-2 border border-input p-2 rounded-xl dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40"
    >
      <div className="flex items-center justify-between gap-2 w-full">
        <CollapsibleTrigger className="flex items-center gap-2 w-full">
          <ChevronsUpDown size={20} />
          <span className="text-start text-base">Par visibilité</span>
        </CollapsibleTrigger>
        <div className="flex items-center space-x-2">
          <Checkbox checked={false} />
          <Switch
            id="filter-mode"
            checked={allSelected}
            onCheckedChange={(checked) => {
              if (setSelectedVisibility) {
                setSelectedVisibility(
                  checked ? visibilityOptions.map((option) => option.id) : [],
                );
              }
            }}
            className={allSelected ? "bg-primary" : "bg-input"}
          />
          <Checkbox checked={true} />
        </div>
      </div>

      <CollapsibleContent className="flex flex-col gap-2 mt-2">
        {visibilityOptions.map((option) => (
          <Field orientation="horizontal" className="" key={option.id}>
            <Checkbox
              id={option.id}
              name={option.id}
              checked={selectedVisibility.includes(option.id)}
              onCheckedChange={() => toggleVisibility(option.id)}
            />
            <FieldLabel htmlFor={option.id} className="font-normal text-md">
              {option.label}
              <span className="text-muted-foreground text-xs ml-1">
                (
                {
                  originalCookingTimes.filter((cookingTime) =>
                    option.id === "visible"
                      ? cookingTime.visible
                      : !cookingTime.visible,
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
