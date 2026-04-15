import { DeleteRecipeDialog } from "@/components/dialog/DeleteRecipeDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToggleRecipeVisibility } from "@/hooks/recipes/useToggleRecipeVisibility";
import { useAuth } from "@/hooks/useAuth";
import { useGetSavedRecipes } from "@/hooks/users/useGetSavedRecipes";
import { useSaveRecipe } from "@/hooks/users/useSaveRecipe";
import { useUnsaveRecipe } from "@/hooks/users/useUnsaveRecipe";
import type { Recipe } from "@/types/recipe.types";
import {
  BookmarkIcon,
  Ellipsis,
  Eye,
  EyeOff,
  Pencil,
  Reply,
  Share,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ShareRecipeDialog } from "../dialog/ShareRecipeDialog";

export const RecipeDetailsImageActions = ({ recipe }: { recipe: Recipe }) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const { saveRecipe, isPending: isSaving } = useSaveRecipe();
  const { unsaveRecipe, isPending: isUnsaving } = useUnsaveRecipe();
  const { recipes: savedRecipes, isLoading: isLoadingSavedRecipes } =
    useGetSavedRecipes();
  const { toggleVisibility, isPending: isPendingVisibility } =
    useToggleRecipeVisibility();

  const { user, isLoading: isLoadingAuth } = useAuth();
  const { _id, addedBy, visible } = recipe;

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

  const handleToggleRecipeVisibility = (
    e: React.MouseEvent,
    recipeId: string,
    visible: boolean,
  ) => {
    e.preventDefault();
    toggleVisibility(recipeId, visible);
    toast.success(
      visible
        ? "La recette n'est plus visible par les autres"
        : "La recette est maintenant visible par les autres",
    );
  };

  return (
    <div className="absolute p-4 top-0 z-10 flex justify-between w-full">
      <Button
        size="icon-lg"
        variant="outline"
        aria-label="Retour"
        className="backdrop-blur-xs bg-black/10 dark:bg-black/10 hover:bg-muted/10 active:bg-muted/10 aria-expanded:bg-muted/10"
        onClick={() => navigate(-1)}
      >
        <Reply color="white" />
      </Button>
      <div className="flex gap-2 items-center">
        {!visible && <EyeOff color="white" className="drop-shadow-sm" />}
        <Button
          size="icon-lg"
          variant="outline"
          aria-label="Save Recipe"
          className="backdrop-blur-sm bg-black/10 dark:bg-black/10 hover:bg-muted/10 active:bg-muted/10 aria-expanded:bg-muted/10"
          onClick={(e) => handleSaveRecipe(e, _id, isSaved)}
          disabled={
            !user ||
            isLoadingAuth ||
            isSaving ||
            isUnsaving ||
            isLoadingSavedRecipes
          }
        >
          <BookmarkIcon
            fill={isSaved ? "currentColor" : "transparent"}
            className="text-white"
          />
        </Button>

        {isMyRecipe && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-lg"
                aria-label="More Options"
                className="backdrop-blur-xs bg-black/10 dark:bg-black/10 hover:bg-muted/10 active:bg-muted/10 aria-expanded:bg-muted/10"
              >
                <Ellipsis color="white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/recipe-edit/${_id}`);
                  }}
                >
                  <Pencil />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={isPendingVisibility}
                  onClick={(e) => handleToggleRecipeVisibility(e, _id, visible)}
                >
                  {visible ? (
                    <>
                      <EyeOff />
                      Masquer
                    </>
                  ) : (
                    <>
                      <Eye />
                      Exposer
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    setShareDialogOpen(true);
                  }}
                >
                  <Share />
                  Partager
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
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <DeleteRecipeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        recipeId={_id}
        navigate={() => navigate(-1)}
      />

      <ShareRecipeDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        recipe={recipe}
      />
    </div>
  );
};
