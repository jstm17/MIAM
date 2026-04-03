import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookmarkIcon, Ellipsis, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Recipe } from "@/types/recipe.types";

import { useNavigate } from "react-router";
import { useSaveRecipe } from "@/hooks/users/useSaveRecipe";
import { useAuth } from "@/hooks/useAuth";
import { useDeleteRecipe } from "@/hooks/recipes/useDeleteRecipe";
import { toast } from "sonner";
import { useGetSavedRecipes } from "@/hooks/users/useGetSavedRecipes";

type RecipeCardActionsProps = {
  recipe: Recipe;
  onRemove?: (id: string) => void;
};

export const RecipeCardActions = ({
  recipe,
  onRemove,
}: RecipeCardActionsProps) => {
  const navigate = useNavigate();
  const { saveRecipe, unsaveRecipe } = useSaveRecipe();
  const { deleteRecipe } = useDeleteRecipe();
  const { recipes: savedRecipes } = useGetSavedRecipes();

  const { user, refetchUser } = useAuth();
  const { _id, addedBy } = recipe;

  const isSaved = savedRecipes.some((r) => r._id === _id);
  const isMyRecipe =
    addedBy._id === user?._id || savedRecipes.some((r) => r._id === _id);

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

  const handleDeleteRecipe = (e: React.MouseEvent, recipeId: string) => {
    e.preventDefault();
    deleteRecipe(recipeId)
      .then((data) => {
        toast.success(data.message);
        onRemove?.(recipeId);
        refetchUser();
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  return (
    <div className="absolute top-2 right-2 z-10">
      {isMyRecipe ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="More Options"
              className="backdrop-blur-xs bg-transparent dark:bg-transparent hover:bg-muted/10 aria-expanded:bg-muted/10"
            >
              <Ellipsis className="text-white mix-blend-difference drop-shadow-[0_0_3px_rgba(0,0,0,1)]" />
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
                onClick={(e) => handleDeleteRecipe(e, _id)}
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
          className="backdrop-blur-sm bg-transparent dark:bg-transparent hover:bg-muted/10 aria-expanded:bg-muted/10"
          onClick={(e) => handleSaveRecipe(e, _id, isSaved)}
        >
          <BookmarkIcon
            fill={isSaved ? "currentColor" : undefined}
            className="text-white"
          />
        </Button>
      )}
    </div>
  );
};
