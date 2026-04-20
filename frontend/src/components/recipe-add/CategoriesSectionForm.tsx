import { useGetAllCategories } from "@/hooks/categories/useGetAllCategories";
import { ChevronsUpDown, Plus, Tags, X } from "lucide-react";
import { useState } from "react";
import {
  useWatch,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
  type UseFormTrigger,
} from "react-hook-form";
import { GroupInput } from "../shared/GroupInput";
import { ShowSuggestions } from "../shared/ShowSuggestions";
import { Typography } from "../shared/Typography";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import type {
  FieldValues,
  Path
} from "react-hook-form";

type CategoriesSectionFormProps<T extends FieldValues> = {
  control: Control<T>;
  trigger: UseFormTrigger<T>;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T>;
};

export const CategoriesSectionForm = <T extends FieldValues>({
  control,
  setValue,
  errors,
  trigger,
}: CategoriesSectionFormProps<T>) => {
  const categories = useWatch({ control, name: "categories" as Path<T> }) as string[] || [];
  const { categories: allCategories } = useGetAllCategories();
  const [categoryInput, setCategoryInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addCategory = (val: string) => {
    if (!val.trim()) return;
    if (!categories.includes(val)) {
      setValue("categories" as Path<T>, [...categories, val] as never);
      trigger("categories" as Path<T>);
    }
    setCategoryInput("");
  };

  const removeCategory = (cat: string) => {
    setValue(
      "categories" as Path<T>,
      categories.filter((c) => c !== cat) as never,
    );
    trigger("categories" as Path<T>);
  };
  
  return (
    <div className="">
      <div className="border-b border-primary mb-4 py-1 rounded-t-xl flex gap-2 items-center justify-center bg-primary/10">
        <Tags size={20} />
        <Typography className="text-lg" weight="semibold">
          Catégories
        </Typography>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Catégories *</Label>
        {categories.length > 0 && (
          <div className="flex flex-wrap my-1 gap-1">
            {categories.map((cat) => (
              <span
                key={cat}
                className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full text-sm"
              >
                {cat}
                <X
                  className="size-3 cursor-pointer"
                  onClick={() => removeCategory(cat)}
                />
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <ShowSuggestions
            inputValue={categoryInput}
            items={allCategories}
            show={showSuggestions}
            setShow={setShowSuggestions}
            onSelect={(val) => addCategory(val)}
          >
            <GroupInput
              capitalize
              type="text"
              value={categoryInput}
              onChange={(e) => {
                setCategoryInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCategory(categoryInput);
                }
              }}
              error={(errors as FieldErrors<{ categories: string[] }>).categories?.message}
              placeholder="Ex. Dessert"
              inputGroupAddon={
                <ChevronsUpDown
                  className="cursor-pointer"
                  onClick={() => setShowSuggestions((prev) => !prev)}
                />
              }
              inputGroupAddonClassName="absolute right-0"
            />
          </ShowSuggestions>
          <Button
            type="button"
            size="icon-lg"
            variant="outline"
            onClick={() => addCategory(categoryInput)}
          >
            <Plus />
          </Button>
        </div>
        {/* <datalist id="categories-list">
          {allCategories.map((cat) => (
            <option key={cat._id} value={cat.name} />
          ))}
        </datalist> */}
      </div>
    </div>
  );
};
