"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { CookingTime } from "@/types/cookingTime.types";
import type { Recipe } from "@/types/recipe.types";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";

type FavoriteFiltersUserProps = {
  selectedUsers: string[];
  originalFavorites: (Recipe | CookingTime)[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>> | undefined;
};
export function FavoriteFiltersUser({
  selectedUsers,
  originalFavorites,
  setSelectedUsers,
}: FavoriteFiltersUserProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const users = Array.from(
    new Map(
      originalFavorites
        .filter((recipe) => recipe.addedBy?._id && recipe.addedBy?.name)
        .map((recipe) => [recipe.addedBy._id, recipe.addedBy.name]),
    ).entries(),
  ).map(([id, name]) => ({ id, name }));

  const toggleUser = (chefId: string) => {
    if (setSelectedUsers) {
      setSelectedUsers((prev) =>
        prev.includes(chefId)
          ? prev.filter((id) => id !== chefId)
          : [...prev, chefId],
      );
    }
  };

  const allSelected = selectedUsers.length === users.length;
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-full flex-col gap-2 border border-input p-2 rounded-xl dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40"
    >
      <div className="flex items-center justify-between gap-2 w-full">
        <CollapsibleTrigger className="flex items-center gap-2 w-full">
          <ChevronsUpDown size={20} />
          <span className="text-start text-base">Par chefs</span>
        </CollapsibleTrigger>
        <div className="flex items-center space-x-2">
          <Checkbox checked={false} />
          <Switch
            id="filter-mode"
            checked={allSelected}
            onCheckedChange={(checked) => {
              if (setSelectedUsers) {
                setSelectedUsers(checked ? users.map((user) => user.id) : []);
              }
            }}
            className={allSelected ? "bg-primary" : "bg-input"}
          />
          <Checkbox checked={true} />
        </div>
      </div>

      <CollapsibleContent className="flex flex-col gap-2 mt-2">
        {users.map((user) => (
          <Field orientation="horizontal" className="" key={user.id}>
            <Checkbox
              id={user.id}
              name={user.id}
              checked={selectedUsers.includes(user.id)}
              onCheckedChange={() => toggleUser(user.id)}
            />
            <FieldLabel htmlFor={user.id} className="font-normal text-md">
              {user.name}
              <span className="text-muted-foreground text-xs ml-1">
                (
                {
                  originalFavorites.filter((r) => r.addedBy?._id === user.id)
                    .length
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
