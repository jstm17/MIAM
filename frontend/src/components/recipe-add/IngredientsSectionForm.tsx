import { useGetAllIngredients } from "@/hooks/ingredients/useGetAllIngredients";
import type { AddRecipeFormData } from "@/schemas/addRecipeForm.schemas";
import type { UpdateRecipeFormData } from "@/schemas/updateRecipeForm.schemas";
import { Carrot, MinusCircle, Plus } from "lucide-react";
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { TextInput } from "../shared/TextInput";
import { Typography } from "../shared/Typography";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

type IngredientsSectionFormProps = {
  control: Control<AddRecipeFormData | UpdateRecipeFormData>;
  register: UseFormRegister<AddRecipeFormData | UpdateRecipeFormData>;
  setValue: UseFormSetValue<AddRecipeFormData | UpdateRecipeFormData>;
  errors: FieldErrors<AddRecipeFormData | UpdateRecipeFormData>;
};
export const IngredientsSectionForm = ({
  control,
  register,
  setValue,
  errors,
}: IngredientsSectionFormProps) => {
  const { ingredients } = useGetAllIngredients();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const handleIngredientChange = (val: string, index: number) => {
    setValue(`ingredients.${index}.ingredient`, val);
  };

  return (
    <div className="">
      <div className="mb-4 py-1 flex gap-2 items-center justify-center bg-primary/10 rounded-t-xl border-b border-primary">
        <Carrot />
        <Typography className="text-lg" weight="semibold">
          Ingrédients
        </Typography>
      </div>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[1fr_2fr_36px] gap-4">
          <Label>Quantité *</Label>
          <Label>Ingrédient *</Label>
          <span />
        </div>
        {fields.map((field, index) => (
          <div
            className="grid grid-cols-[1fr_2fr_36px] gap-2 items-start"
            key={field.id}
          >
            <TextInput
              capitalize
              placeholder="Ex. 100g"
              type="text"
              error={errors.ingredients?.[index]?.quantity?.message}
              {...register(`ingredients.${index}.quantity`)}
            />
            <TextInput
              placeholder="Ex. Beurre"
              capitalize
              type="text"
              list={`ingredients-list-${index}`}
              error={errors.ingredients?.[index]?.ingredient?.message}
              {...register(`ingredients.${index}.ingredient`)}
              onChange={(e) => {
                register(`ingredients.${index}.ingredient`).onChange(e);
                handleIngredientChange(e.target.value, index);
              }}
            />
            <datalist id={`ingredients-list-${index}`}>
              {ingredients.map((ingredient) => (
                <option key={ingredient} value={ingredient} />
              ))}
            </datalist>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              <MinusCircle />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ ingredient: "", quantity: "" })}
        >
          <Plus />
          Ajouter un ingrédient
        </Button>
      </div>
    </div>
  );
};
