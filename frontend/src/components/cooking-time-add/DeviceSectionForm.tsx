import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CookingTimeFormData } from "@/schemas/cookingTimeForm.schemas";
import type { FieldErrors, UseFormSetValue } from "react-hook-form";

type DeviceSectionFormProps = {
  setValue: UseFormSetValue<CookingTimeFormData>;
  errors: FieldErrors<CookingTimeFormData>;
  defaultValue?: string;
};

export function DeviceSectionForm({
  setValue,
  defaultValue,
}: DeviceSectionFormProps) {
  return (
    <Select
      defaultValue={defaultValue ?? undefined}
      onValueChange={(value) =>
        setValue("device", value === "" ? undefined : value)
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choisir un appareil" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Appareils</SelectLabel>
          <SelectItem value="Airfryer">Airfryer</SelectItem>
          <SelectItem value="Instant Pot">Instant Pot</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
