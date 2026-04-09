import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookmarkIcon, Ellipsis, Pencil, Trash } from "lucide-react";

import type { Recipe } from "@/types/recipe.types";

import { useAuth } from "@/hooks/useAuth";
import { useGetSavedRecipes } from "@/hooks/users/useGetSavedRecipes";
import { useSaveRecipe } from "@/hooks/users/useSaveRecipe";
import { useState } from "react";
import { useNavigate } from "react-router";
import { DeleteRecipeDialog } from "./DeleteRecipeDialog";

type RecipeCardActionsProps = {
  recipe: Recipe;
  onRemove?: (id: string) => void;
};

export const RecipeCardActions = ({
  recipe,
  onRemove,
}: RecipeCardActionsProps) => {
  const navigate = useNavigate();
  const { saveRecipe, unsaveRecipe, loading: saving } = useSaveRecipe();
  const { recipes: savedRecipes } = useGetSavedRecipes();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const { _id, addedBy } = recipe;
  const isSaved = savedRecipes.some((r) => r._id === _id);
  const isMyRecipe = addedBy._id === user?._id;

  const handleSaveRecipe = (
    e: React.MouseEvent,
    recipeId: string,
    isSaved: boolean,
  ) => {
    e.preventDefault();
    if (isSaved) {
      unsaveRecipe(recipeId);
    } else {
      saveRecipe(recipeId);
    }
  };

  return (
    <div className="absolute top-2 right-2 z-10">
      {!authLoading && isMyRecipe ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="More Options"
              className="backdrop-blur-xs bg-black/10 dark:bg-black/10 hover:bg-muted/10 aria-expanded:bg-muted/10"
            >
              <Ellipsis color="white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-fit">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={(e) => handleSaveRecipe(e, _id, isSaved)}
              >
                {isSaved ? (
                  <>
                    <BookmarkIcon fill="currentColor" />
                    Retirer des favoris
                  </>
                ) : (
                  <>
                    <BookmarkIcon />
                    Ajouter aux favoris
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/recipe-edit/${_id}`);
                }}
              >
                <Pencil />
                Modifier la recette
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setDeleteDialogOpen(true);
                }}
                variant="destructive"
              >
                <Trash />
                Supprimer la recette
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          size={"icon"}
          variant="outline"
          aria-label="Save Recipe"
          className="backdrop-blur-sm bg-black/10 dark:bg-black/10 hover:bg-muted/10 aria-expanded:bg-muted/10"
          onClick={(e) => handleSaveRecipe(e, _id, isSaved)}
          disabled={!user || authLoading || saving}
        >
          <BookmarkIcon
            fill={isSaved ? "currentColor" : "transparent"}
            className="text-white"
          />
        </Button>
      )}

      <DeleteRecipeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        recipeId={_id}
        onRemove={onRemove}
      />
    </div>
  );
};
