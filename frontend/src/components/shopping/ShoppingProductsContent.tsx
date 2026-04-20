import { useAuth } from "@/hooks/useAuth";
import { useRemoveProductFromCart } from "@/hooks/users/useRemoveProductFromCart";
import { useUpdateProductInCart } from "@/hooks/users/useUpdateProductInCart";
import { Check, MinusCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { TextInput } from "../shared/TextInput";
import { Button } from "../ui/button";

export const ShoppingProductsContent = () => {
  const { user } = useAuth();
  const { removeProductFromCart, error: errorRemove } =
    useRemoveProductFromCart();
  const {
    updateProductInCart,
    isPending: isUpdating,
    error: errorUpdate,
  } = useUpdateProductInCart();
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isClickingSave = useRef(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const savedProducts = user?.savedProducts ?? [];

  const sortedProducts = [...savedProducts].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
  );

  const handleRemove = async (product: { _id: string; name: string }) => {
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

  const handleToggleChecked = async (product: {
    _id: string;
    name: string;
    checked?: boolean;
  }) => {
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

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditedName("");
  };

  const handleSaveEdit = async (product: { _id: string; name: string }) => {
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
      await updateProductInCart({
        name: product.name,
        newName: trimmedName,
      });
      setEditingProductId(null);
      setEditedName("");
    } catch {
      toast.error("Impossible de modifier le produit");
    }
  };

  if (sortedProducts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      {sortedProducts.map((product) => {
        const isChecked = Boolean(product.checked);
        const isEditing = editingProductId === product._id;

        return (
          <div
            key={product._id}
            className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl border py-1 px-2"
          >
            <div className="flex items-center gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                size="icon-xs"
                className="flex items-center justify-center rounded-sm border border-input bg-background text-foreground"
                aria-label={isChecked ? "Produit non coché" : "Produit coché"}
                onClick={() => handleToggleChecked(product)}
              >
                {isChecked && <Check className="size-4 text-primary" />}
              </Button>
              {isEditing ? (
                <TextInput
                  autoFocus
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={() => {
                    if (isClickingSave.current) return;
                    handleSaveEdit(product);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(product);
                    if (e.key === "Escape") handleCancelEdit();
                  }}
                  className="border-0 bg-transparent! p-0 h-6 rounded-sm focus:ring-0 focus-visible:ring-0"
                  placeholder="Modifier le produit"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => handleStartEditing(product._id, product.name)}
                  className={`text-sm text-left block w-full rounded-sm min-h-6 ${
                    isChecked ? "line-through text-muted-foreground/50" : ""
                  }`}
                >
                  {product.name}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isUpdating}
                  onMouseDown={() => {
                    isClickingSave.current = true;
                  }}
                  onClick={() => {
                    handleSaveEdit(product);
                    isClickingSave.current = false;
                  }}
                >
                  <Check className="size-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={removingIds.has(product._id)}
                  onClick={() => handleRemove(product)}
                >
                  <MinusCircle className="size-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
