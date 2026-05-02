import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Check, GripVertical, Trash2 } from "lucide-react";
import { TextInput } from "../shared/TextInput";
import { Button } from "../ui/button";

const SWIPE_THRESHOLD = 60;
const MAX_OFFSET = 80;

type Product = {
  _id: string;
  name: string;
  checked?: boolean;
  addedAt: string;
};

type SortableProductProps = {
  product: Product;
  isEditing: boolean;
  editedName: string;
  setEditedName: (v: string) => void;
  isUpdating: boolean;
  isRemoving: boolean;
  isClickingSave: React.MutableRefObject<boolean>;
  onToggleChecked: () => void;
  onRemove: () => void;
  onStartEditing: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
};

export const SortableProduct = ({
  product,
  isEditing,
  editedName,
  setEditedName,
  isUpdating,
  isClickingSave,
  onToggleChecked,
  onRemove,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
}: SortableProductProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product._id });

  const x = useMotionValue(0);
  const isChecked = Boolean(product.checked);

  const backgroundColor = useTransform(
    x,
    [-MAX_OFFSET, -SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD, MAX_OFFSET],
    ["#ef4444", "#ef4444", "#ffffff", "#22c55e", "#22c55e"],
  );

  const handleSwipeEnd = () => {
    const currentX = x.get();
    if (currentX < -SWIPE_THRESHOLD) onRemove();
    else if (currentX > SWIPE_THRESHOLD) onToggleChecked();
    animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className="relative overflow-hidden"
    >
      {/* Background avec icônes */}
      <motion.div
        className="absolute inset-0 flex items-center justify-between px-4"
        style={{ backgroundColor }}
      >
        <Check className="size-5 text-white" />
        <Trash2 className="size-5 text-white" />
      </motion.div>

      {/* Contenu swipeable */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -MAX_OFFSET, right: MAX_OFFSET }}
        dragElastic={0.1}
        style={{ x }}
        onDragEnd={handleSwipeEnd}
        className={cn(
          "relative grid grid-cols-[auto_1fr_auto] items-center gap-2 py-2 pr-2 bg-background rounded-md",
          isDragging && "bg-background2 rounded-none",
        )}
      >
        <GripVertical
          className="size-4 text-muted-foreground cursor-grab touch-none w-10 outline-none focus:ring-0"
          fill="currentColor"
          {...attributes}
          {...listeners}
          onPointerDown={(e) => {
            e.stopPropagation(); // 👈 empêche le swipe quand on drag
            listeners?.onPointerDown?.(e);
          }}
        />

        <div className="flex items-center w-full min-w-0">
          {isEditing ? (
            <TextInput
              autoFocus
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={() => {
                if (isClickingSave.current) return;
                onSaveEdit();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSaveEdit();
                if (e.key === "Escape") onCancelEdit();
              }}
              className="border-0 bg-transparent! p-0 h-6 rounded-sm focus:ring-0 focus-visible:ring-0"
              placeholder="Modifier le produit"
            />
          ) : (
            <button
              type="button"
              onClick={onStartEditing}
              className={`text-sm text-left block w-full rounded-sm min-h-6 ${
                isChecked ? "line-through text-muted-foreground/50" : ""
              }`}
            >
              {product.name}
            </button>
          )}
        </div>
        {isEditing && (
          <Button
            variant="ghost"
            size="icon"
            disabled={isUpdating}
            onMouseDown={() => {
              isClickingSave.current = true;
            }}
            onClick={() => {
              onSaveEdit();
              isClickingSave.current = false;
            }}
          >
            <Check className="size-4" />
          </Button>
        )}
      </motion.div>
    </div>
  );
};
