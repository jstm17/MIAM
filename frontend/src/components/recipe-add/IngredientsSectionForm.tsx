import { useGetAllIngredients } from "@/hooks/ingredients/useGetAllIngredients";
import type { RecipeFormData } from "@/schemas/recipeForm.schemas";
import { parseClipboardIngredients } from "@/utils/parseClipboardIngredients";
import {
  closestCenter,
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Carrot, ClipboardPaste, Plus } from "lucide-react";
import { useState } from "react";
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { toast } from "sonner";
import { PasteDialog } from "../dialog/pasteDialog";
import { Typography } from "../shared/Typography";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { SortableIngredient } from "./SortableIngredient";

type IngredientsSectionFormProps = {
  control: Control<RecipeFormData>;
  register: UseFormRegister<RecipeFormData>;
  setValue: UseFormSetValue<RecipeFormData>;
  errors: FieldErrors<RecipeFormData>;
};

export const IngredientsSectionForm = ({
  control,
  register,
  setValue,
  errors,
}: IngredientsSectionFormProps) => {
  const { ingredients } = useGetAllIngredients();
  const [showIndex, setShowIndex] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState<Record<number, string>>({});

  const [isPasteDialogOpen, setIsPasteDialogOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "ingredients",
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) move(oldIndex, newIndex);
  };

  const handlePasteIngredients = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const parsedIngredients = parseClipboardIngredients(text);
      if (!parsedIngredients.length) return;

      for (let i = fields.length - 1; i >= 0; i--) remove(i);
      parsedIngredients.forEach(({ ingredient, quantity }) =>
        append({ ingredient, quantity }),
      );
      toast.success("Ingrédients collés avec succès !");
    } catch {
      setPasteText("");
      setIsPasteDialogOpen(true);
    }
  };

  const handleManualPasteSubmit = () => {
    const parsedIngredients = parseClipboardIngredients(pasteText);
    if (parsedIngredients.length) {
      for (let i = fields.length - 1; i >= 0; i--) remove(i);
      parsedIngredients.forEach(({ ingredient, quantity }) =>
        append({ ingredient, quantity }),
      );
      toast.success("Ingrédients collés avec succès !");
    }
    setIsPasteDialogOpen(false);
  };

  return (
    <div className="">
      <div className="mb-4 py-2 flex gap-2 items-center justify-center bg-primary/10 border-t border-primary">
        <Carrot size={20} />
        <Typography className="text-lg" weight="semibold">
          Ingrédients
        </Typography>
        <Button
          type="button"
          variant="outline"
          onClick={handlePasteIngredients}
          className="absolute right-4"
          size="icon"
        >
          <ClipboardPaste className="size-4" />
        </Button>
      </div>

      <div className="flex flex-col max-w-lg">
        <div className="grid grid-cols-[40px_1fr_2fr] gap-2 mb-1">
          <span />
          <Label>Quantité</Label>
          <Label>Ingrédient</Label>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field, index) => (
              <SortableIngredient
                key={field.id}
                id={field.id}
                index={index}
                total={fields.length}
                register={register}
                setValue={setValue}
                errors={errors}
                remove={remove}
                ingredients={ingredients}
                showIndex={showIndex}
                setShowIndex={setShowIndex}
                inputValues={inputValues}
                setInputValues={setInputValues}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          className="mt-2 mx-4"
          size="lg"
          type="button"
          variant="outline"
          onClick={() => append({ ingredient: "", quantity: "" })}
        >
          <Plus />
          Ajouter un ingrédient
        </Button>
      </div>

      <PasteDialog
        open={isPasteDialogOpen}
        onOpenChange={setIsPasteDialogOpen}
        pasteText={pasteText}
        setPasteText={setPasteText}
        onSubmit={handleManualPasteSubmit}
        title="Coller vos ingrédients"
        description="Votre navigateur bloque la lecture automatique du presse-papier. Veuillez coller vos ingrédients dans le champ ci-dessous."
        placeholder="Ex: 120 g de beurre..."
      />
    </div>
  );
};
