import { useAddProductToCart } from "@/hooks/users/useAddProductToCart";
import { Carrot, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GroupInput } from "../shared/GroupInput";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const formatProductName = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) return "";

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

export const ShoppingSearchBar = () => {
  const [inputValue, setInputValue] = useState("");
  const { addProductToCart, isPending } = useAddProductToCart();
  const handleSelect = async (name: string) => {
    const formattedName = formatProductName(name);

    // empêche ajout si vide / espaces
    if (!formattedName) {
      toast.error("Ajoute un produit");
      return;
    }

    try {
      await addProductToCart(formattedName);
      setInputValue("");
    } catch (error) {
      if (error) {
        toast.error("Ce produit est déjà dans la liste");
        return;
      }

      toast.error("Impossible d'ajouter le produit");
    }
  };

  const handleBlur = () => {
    setInputValue(formatProductName(inputValue));
  };
  return (
    <div className="flex gap-2">
      <GroupInput
        type="text"
        value={inputValue}
        placeholder="Ex. 1kg de carrottes"
        inputGroupAddon={<Carrot className="size-4 shrink-0 text-foreground" />}
        groupAddonAlign="inline-start"
        inputGroupAddonClassName="pl-2!"
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSelect(inputValue);
          }
        }}
      />
      <Button
        size="icon-lg"
        onClick={() => handleSelect(inputValue)}
        disabled={isPending}
      >
        {isPending ? <Spinner /> : <Plus />}
      </Button>
    </div>
  );
};
