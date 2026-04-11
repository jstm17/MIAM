import type { AddRecipeFormData } from "@/schemas/addRecipeForm.schemas";
import type { UpdateRecipeFormData } from "@/schemas/updateRecipeForm.schemas";
import { ClipboardList, MinusCircle, Plus } from "lucide-react";
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { TextAreaInput } from "../shared/TextAreaInput";
import { Typography } from "../shared/Typography";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

type InstructionsSectionFormProps = {
  control: Control<AddRecipeFormData | UpdateRecipeFormData>;
  register: UseFormRegister<AddRecipeFormData | UpdateRecipeFormData>;
  errors: FieldErrors<AddRecipeFormData | UpdateRecipeFormData>;
};
export const InstructionsSectionForm = ({
  control,
  register,
  errors,
}: InstructionsSectionFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "instructions",
  });
  return (
    <div className="">
      <div className="border-b border-primary mb-4 py-1 flex gap-2 items-center justify-center bg-primary/10 rounded-t-xl">
        <ClipboardList />
        <Typography className="text-lg" weight="semibold">
          Préparation
        </Typography>
      </div>
      <div className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-2">
            <Label htmlFor={`instructions.${index}.content`}>
              Étape {index + 1}
              {index === 0 && <span>*</span>}
            </Label>
            <div className="grid grid-cols-[1fr_36px] gap-2 items-start">
              <TextAreaInput
                placeholder="Ex. Mélanger le beurre..."
                {...register(`instructions.${index}.content`)}
                error={errors.instructions?.[index]?.content?.message}
              />
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <MinusCircle />
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ content: "" })}
        >
          <Plus />
          Ajouter une étape
        </Button>
      </div>
    </div>
  );
};
