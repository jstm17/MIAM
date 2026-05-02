import { useAuth } from "@/hooks/useAuth";
import { useRemoveProductFromCart } from "@/hooks/users/useRemoveProductFromCart";
import { useReorderProducts } from "@/hooks/users/useReorderProducts";
import { useUpdateProductInCart } from "@/hooks/users/useUpdateProductInCart";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import { SortableProduct } from "./SortableProduct";

type Product = {
  _id: string;
  name: string;
  checked?: boolean;
  addedAt: string;
};

export const ShoppingProductsContent = () => {
  const { user } = useAuth();
  const { removeProductFromCart, error: errorRemove } =
    useRemoveProductFromCart();
  const {
    updateProductInCart,
    isPending: isUpdating,
    error: errorUpdate,
  } = useUpdateProductInCart();
  const { reorderProducts } = useReorderProducts();
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const isClickingSave = useRef(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const savedProducts = (user?.savedProducts ?? []) as Product[];

  const [orderedProducts, setOrderedProducts] =
    useState<Product[]>(savedProducts);

  useEffect(() => {
    setOrderedProducts(savedProducts);
  }, [savedProducts]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setOrderedProducts((prev) => {
      const oldIndex = prev.findIndex((p) => p._id === active.id);
      const newIndex = prev.findIndex((p) => p._id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      reorderProducts(reordered.map((p) => p.name)); // 👈 sauvegarde auto
      return reordered;
    });
  };

  const handleRemove = async (product: Product) => {
    setRemovingIds((prev) => new Set(prev).add(product._id));
    try {
      await removeProductFromCart(product.name);
    } catch {
      toast.error(errorRemove?.message ?? "Impossible de retirer le produit");
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(product._id);
        return next;
      });
    }
  };

  const handleToggleChecked = async (product: Product) => {
    try {
      await updateProductInCart({
        name: product.name,
        checked: !product.checked,
      });
    } catch {
      toast.error(errorUpdate?.message ?? "Impossible de modifier le produit");
    }
  };

  const handleStartEditing = (productId: string, currentName: string) => {
    setEditingProductId(productId);
    setEditedName(currentName);
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditedName("");
  };

  const handleSaveEdit = async (product: Product) => {
    const trimmedName = editedName.trim();
    if (!trimmedName) {
      toast.error("Le nom du produit ne peut pas être vide");
      return;
    }
    if (trimmedName === product.name) {
      handleCancelEdit();
      return;
    }
    try {
      await updateProductInCart({ name: product.name, newName: trimmedName });
      setEditingProductId(null);
      setEditedName("");
    } catch {
      toast.error("Impossible de modifier le produit");
    }
  };

  if (orderedProducts.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={orderedProducts.map((p) => p._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col">
          <Separator className="h-px" />
          {orderedProducts.map((product) => (
            <>
              <SortableProduct
                key={product._id}
                product={product}
                isEditing={editingProductId === product._id}
                editedName={editedName}
                setEditedName={setEditedName}
                isUpdating={isUpdating}
                isRemoving={removingIds.has(product._id)}
                isClickingSave={isClickingSave}
                onToggleChecked={() => handleToggleChecked(product)}
                onRemove={() => handleRemove(product)}
                onStartEditing={() =>
                  handleStartEditing(product._id, product.name)
                }
                onSaveEdit={() => handleSaveEdit(product)}
                onCancelEdit={handleCancelEdit}
              />
              <Separator className="h-px" />
            </>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
