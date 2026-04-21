"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminIngredient } from "@/types/ingredient.types";
import { ImageUp, Trash2, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { TextInput } from "../shared/TextInput";
import { AspectRatio } from "../ui/aspect-ratio";
import { Skeleton } from "../ui/skeleton";

type Props = {
  ingredients: AdminIngredient[];
  onDelete: (id: string) => void;
  onResetUrl: (id: string) => void;
  onDeleteMany: (ids: string[]) => void;
  onResetUrlMany: (ids: string[]) => void;
  onUpdateUrl?: (id: string, url: string) => Promise<void>;
};

export const IngredientsTable = ({
  ingredients,
  onDelete,
  onResetUrl,
  onDeleteMany,
  onResetUrlMany,
  onUpdateUrl,
}: Props) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState<{ [key: string]: string }>({});
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleAll = () => {
    if (selected.length === ingredients.length) setSelected([]);
    else setSelected(ingredients.map((i) => i._id));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleUpdateUrl = async (id: string) => {
    const url = urlInput[id];
    if (!url || !onUpdateUrl) return;

    setIsUpdating(true);
    try {
      await onUpdateUrl(id, url);
      setUrlInput((prev) => ({ ...prev, [id]: "" }));
      setOpenPopover(null);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-card shadow-sm">
      {selected.length > 0 && (
        <div className="flex items-center gap-2 p-3 border-b bg-muted/50 rounded-t-2xl">
          <span className="text-sm text-muted-foreground flex-1">
            {selected.length} sélectionné(s)
          </span>
          <Button
            size="icon-lg"
            variant="outline"
            onClick={() => {
              onResetUrlMany(selected);
              setSelected([]);
            }}
          >
            <ImageUp className="size-4" />
          </Button>
          <Button
            size="icon-lg"
            variant="destructive"
            onClick={() => {
              onDeleteMany(selected);
              setSelected([]);
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <Checkbox
                checked={
                  selected.length === ingredients.length &&
                  ingredients.length > 0
                }
                onCheckedChange={toggleAll}
              />
            </TableHead>

            <TableHead>Nom</TableHead>
            <TableHead>
              <UtensilsCrossed size={16} />
            </TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {ingredients.map((ingredient) => {
            const isChecked = selected.includes(ingredient._id);

            return (
              <TableRow key={ingredient._id}>
                {/* Checkbox */}
                <TableCell>
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleOne(ingredient._id)}
                  />
                </TableCell>

                {/* Nom */}
                <TableCell className="font-medium">{ingredient.name}</TableCell>

                {/* Nb recettes */}
                <TableCell>{ingredient.recipesCount}</TableCell>

                <Popover
                  open={openPopover === ingredient._id}
                  onOpenChange={(open) =>
                    setOpenPopover(open ? ingredient._id : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <TableCell>
                      <AspectRatio
                        ratio={1}
                        className="rounded-xl overflow-hidden border bg-white"
                      >
                        {ingredient.url ? (
                          <img
                            src={ingredient.url}
                            className="object-contain h-full w-full"
                          />
                        ) : (
                          <Skeleton className="h-full w-full" />
                        )}
                      </AspectRatio>
                    </TableCell>
                  </PopoverTrigger>
                  <PopoverContent className="w-64" align="end">
                    <PopoverHeader>
                      <PopoverTitle className="font-semibold">
                        Changer l'url
                      </PopoverTitle>
                    </PopoverHeader>
                    <div className="space-y-2">
                      <TextInput
                        placeholder="https://..."
                        value={urlInput[ingredient._id] || ""}
                        onChange={(e) =>
                          setUrlInput((prev) => ({
                            ...prev,
                            [ingredient._id]: e.target.value,
                          }))
                        }
                        disabled={isUpdating}
                      />
                      <Button
                        size="lg"
                        onClick={() => handleUpdateUrl(ingredient._id)}
                        disabled={!urlInput[ingredient._id] || isUpdating}
                        className="w-full"
                      >
                        {isUpdating ? "Mise à jour..." : "Valider"}
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Actions */}
                <TableCell className="text-right space-x-2">
                  <Button
                    size="icon-lg"
                    variant="outline"
                    onClick={() => onResetUrl(ingredient._id)}
                  >
                    <ImageUp className="size-4" />
                  </Button>

                  <Button
                    size="icon-lg"
                    variant="destructive"
                    onClick={() => onDelete(ingredient._id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
