"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Recipe } from "@/types/recipe.types";
import { Checkbox } from "../ui/checkbox";
import { Field, FieldLabel } from "../ui/field";
import { Switch } from "../ui/switch";

type RecipeFiltersUserProps = {
  selectedUsers: string[];
  originalRecipes: Recipe[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>> | undefined;
};
export function RecipeFiltersUser({
  selectedUsers,
  originalRecipes,
  setSelectedUsers,
}: RecipeFiltersUserProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const users = Array.from(
    new Map(
      originalRecipes
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

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-full flex-col gap-2 border p-2 rounded-xl"
    >
      <div className="flex items-center justify-between gap-4 w-full">
        <CollapsibleTrigger className="flex items-center gap-2">
          <ChevronsUpDown size={20} />
          <span className="text-start">Par chefs</span>
        </CollapsibleTrigger>
        <div className="flex items-center space-x-2">
          <Checkbox checked={false} />
          <Switch
            id="filter-mode"
            checked={selectedUsers.length === users.length}
            onCheckedChange={(checked) => {
              if (setSelectedUsers) {
                setSelectedUsers(checked ? users.map((user) => user.id) : []);
              }
            }}
            className="bg-input"
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
            <FieldLabel htmlFor={user.id} className="font-normal">
              {user.name}
              <span className="text-muted-foreground text-xs ml-1">
                (
                {
                  originalRecipes.filter((r) => r.addedBy?._id === user.id)
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
