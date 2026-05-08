import { useGetAllIngredients } from "@/hooks/ingredients/useGetAllIngredients";
import { cn } from "@/lib/utils";
import type { RecipeFormData } from "@/schemas/recipeForm.schemas";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { useSwipeable } from "react-swipeable";
import { ShowSuggestions } from "../shared/ShowSuggestions";
import { TextInput } from "../shared/TextInput";

type Props = {
  id: string;
  index: number;
  total: number;
  register: UseFormRegister<RecipeFormData>;
  setValue: UseFormSetValue<RecipeFormData>;
  errors: FieldErrors<RecipeFormData>;
  remove: (index: number) => void;
  ingredients: ReturnType<typeof useGetAllIngredients>["ingredients"];
  showIndex: number | null;
  setShowIndex: (val: number | null) => void;
  inputValues: Record<number, string>;
  setInputValues: React.Dispatch<React.SetStateAction<Record<number, string>>>;
};

export const SortableIngredient = ({
  id,
  index,
  total,
  register,
  setValue,
  errors,
  remove,
  ingredients,
  showIndex,
  setShowIndex,
  inputValues,
  setInputValues,
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
    onSwipedRight: () => setShowDelete(false),
    delta: 40,
    trackTouch: true,
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  return (
    <div ref={setNodeRef} style={style} className="relative overflow-visible">
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
          isDragging && "bg-muted",
        )}
      >
        <div className="grid grid-cols-[40px_1fr_2fr] items-start">
          {/* Drag handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground p-2 w-full h-full"
          >
            <GripVertical
              className="size-4 m-auto"
              fill="currentColor"
            />
          </button>

          {/* Swipe zone */}
          <div
            {...swipeHandlers}
            style={{ touchAction: "pan-y" }}
            className="contents"
          >
            <TextInput
              capitalize
              placeholder="Ex. 100g"
              type="text"
              error={errors.ingredients?.[index]?.quantity?.message}
              className="rounded-r-none focus:z-10"
              {...register(`ingredients.${index}.quantity`)}
            />

            <ShowSuggestions
              inputValue={inputValues[index] ?? ""}
              items={ingredients}
              show={showIndex === index}
              setShow={(val) => setShowIndex(val ? index : null)}
              onSelect={(val) => {
                setValue(`ingredients.${index}.ingredient`, val);
                setInputValues((prev) => ({ ...prev, [index]: val }));
              }}
            >
              <TextInput
                placeholder="Ex. Beurre"
                capitalize
                type="text"
                className="rounded-l-none focus:z-10 -ml-px"
                error={errors.ingredients?.[index]?.ingredient?.message}
                {...register(`ingredients.${index}.ingredient`)}
                onChange={(e) => {
                  register(`ingredients.${index}.ingredient`).onChange(e);
                  setInputValues((prev) => ({
                    ...prev,
                    [index]: e.target.value,
                  }));
                  setShowIndex(index);
                }}
                onBlur={() => setTimeout(() => setShowIndex(null), 150)}
              />
            </ShowSuggestions>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
