// SortableStep.tsx

import type { RecipeFormData } from "@/schemas/recipeForm.schemas";
import { useState } from "react";
import { type FieldErrors, type UseFormRegister } from "react-hook-form";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { motion } from "framer-motion";
import { GripVertical, Trash2 } from "lucide-react";
import { useSwipeable } from "react-swipeable";

import { cn } from "@/lib/utils";
import { TextAreaInput } from "../shared/TextAreaInput";
import { Label } from "../ui/label";

type Props = {
  id: string;
  index: number;
  total: number;
  register: UseFormRegister<RecipeFormData>;
  errors: FieldErrors<RecipeFormData>;
  remove: (index: number) => void;
};

export const SortableStep = ({
  id,
  index,
  total,
  register,
  errors,
  remove,
}: Props) => {
  const [showDelete, setShowDelete] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (total > 1) setShowDelete(true);
    },
    onSwipedRight: () => {
      setShowDelete(false);
    },
    delta: 40,
    trackTouch: true,
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <div ref={setNodeRef} style={style} className="relative overflow-hidden">
      {/* Delete background */}
      <div
        className={cn(
          "absolute inset-0 bg-destructive flex justify-end items-center",
          total === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        )}
        onClick={() => total > 1 && remove(index)}
      >
        <Trash2 className="size-5 mr-8 text-white" />
      </div>

      {/* Foreground */}
      <motion.div
        animate={{ x: showDelete ? -88 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className={cn(
          "bg-background relative z-10 py-2 pr-4 transition-colors",
          showDelete && "rounded-r-lg",
          isDragging && "bg-background2",
        )}
      >
        <div className="grid grid-cols-[40px_1fr] items-start">
          {/* Drag handle only */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground p-2 w-full h-full"
          >
            <GripVertical className="size-4 m-auto" fill="currentColor" />
          </button>

          {/* Swipe zone only */}
          <div {...swipeHandlers} style={{ touchAction: "pan-y" }}>
            <Label className="mb-2 block">Étape {index + 1}</Label>

            <TextAreaInput
              placeholder="Ex. Mélanger les ingrédients..."
              {...register(`instructions.${index}.content`)}
              error={errors.instructions?.[index]?.content?.message}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
