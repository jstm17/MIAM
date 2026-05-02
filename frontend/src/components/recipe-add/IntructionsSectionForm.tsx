import type { RecipeFormData } from "@/schemas/recipeForm.schemas";
import { ClipboardList, ClipboardPaste, Plus } from "lucide-react";
import { useState } from "react";
import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
import { toast } from "sonner";

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

import { parseClipboardSteps } from "@/utils/parseClipboardSteps";
import { PasteDialog } from "../dialog/pasteDialog";
import { Typography } from "../shared/Typography";
import { Button } from "../ui/button";
import { SortableStep } from "./SortableStep";

type InstructionsSectionFormProps = {
  control: Control<RecipeFormData>;
  register: UseFormRegister<RecipeFormData>;
  errors: FieldErrors<RecipeFormData>;
};

export const InstructionsSectionForm = ({
  control,
  register,
  errors,
}: InstructionsSectionFormProps) => {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "instructions",
  });

  const [isPasteDialogOpen, setIsPasteDialogOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // desktop : commence à drag après 8px de mouvement souris
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // mobile : attend 200ms avant d'activer le drag
        tolerance: 8, // annule si le doigt bouge de >8px pendant le délai (= swipe détecté)
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((item) => item.id === active.id);
    const newIndex = fields.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      move(oldIndex, newIndex);
    }
  };

  const handlePasteSteps = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const steps = parseClipboardSteps(text);
      if (!steps.length) return;

      // Supprime tous les champs existants puis recrée
      for (let i = fields.length - 1; i >= 0; i--) remove(i);
      steps.forEach((content) => append({ content }));
    } catch {
      setPasteText("");
      setIsPasteDialogOpen(true);
    }
  };

  const handleManualPasteSubmit = () => {
    const steps = parseClipboardSteps(pasteText);
    if (steps.length) {
      for (let i = fields.length - 1; i >= 0; i--) remove(i);
      steps.forEach((content) => append({ content }));
      toast.success("Étapes collées avec succès !");
    }
    setIsPasteDialogOpen(false);
  };

  return (
    <div>
      <div className="border-t border-primary mb-4 py-2 flex gap-2 items-center justify-center bg-primary/10">
        <ClipboardList size={20} />
        <Typography className="text-lg" weight="semibold">
          Préparation
        </Typography>
        <Button
          type="button"
          variant="outline"
          onClick={handlePasteSteps}
          className="absolute right-4"
          size="icon"
        >
          <ClipboardPaste className="size-4" />
        </Button>
      </div>

      <div className="flex flex-col">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            {fields.map((field, index) => (
              <SortableStep
                key={field.id}
                id={field.id}
                index={index}
                total={fields.length}
                register={register}
                errors={errors}
                remove={remove}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ content: "" })}
          className="mx-4 mt-2"
          size="lg"
        >
          <Plus className="mr-2 size-4" />
          Ajouter une étape
        </Button>
      </div>

      <PasteDialog
        open={isPasteDialogOpen}
        onOpenChange={setIsPasteDialogOpen}
        pasteText={pasteText}
        setPasteText={setPasteText}
        onSubmit={handleManualPasteSubmit}
        title="Coller vos étapes"
        description="Votre navigateur bloque la lecture automatique du presse-papier. Veuillez coller vos étapes dans le champ ci-dessous."
        placeholder="Ex. Préchauffez le four...Mélangez les ingrédients..."
      />
    </div>
  );
};
