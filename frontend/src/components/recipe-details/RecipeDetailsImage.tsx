import placeholederImage from "@/assets/placeholder-image.jpg";
import { DeleteRecipeDialog } from "@/components/recipe-card/DeleteRecipeDialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

type RecipeDetailsImageProps = {
  recipe: Recipe;
  offsetY: number;
};
export const RecipeDetailsImage = ({
  recipe,
  offsetY,
}: RecipeDetailsImageProps) => {
  const navigate = useNavigate();

  const { saveRecipe, isPending: isSaving } = useSaveRecipe();
  const { unsaveRecipe, isPending: isUnsaving } = useUnsaveRecipe();
  const { recipes: savedRecipes, isLoading: isLoadingSavedRecipes } =
    useGetSavedRecipes();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
  };

  return (
    <div className="relative">
      <div className="absolute p-4 top-0 z-10 flex justify-between w-full">
        <Button
          size="icon"
          variant="outline"
          aria-label="Retour"
          className="backdrop-blur-xs bg-black/10 dark:bg-black/10 hover:bg-muted/10 aria-expanded:bg-muted/10"
          onClick={() => navigate(-1)}
        >
          <Reply color="white" />
        </Button>
        <div className="flex gap-2">
          <Button
            size={"icon"}
            variant="outline"
            aria-label="Save Recipe"
            className="backdrop-blur-sm bg-black/10 dark:bg-black/10 hover:bg-muted/10 aria-expanded:bg-muted/10"
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
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/recipe-edit/${_id}`);
                    }}
                  >
                    <Pencil />
                    Modifier la recette
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isPendingVisibility}
                    onClick={(e) =>
                      handleToggleRecipeVisibility(e, _id, visible)
                    }
                  >
                    {visible ? (
                      <>
                        <EyeOff />
                        Masquer la recette
                      </>
                    ) : (
                      <>
                        <Eye />
                        Exposer la recette
                      </>
                    )}
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
          )}
        </div>
      </div>
      <AspectRatio
        ratio={14 / 9}
        className="relative overflow-hidden"
        style={{ marginTop: "calc(-1 * env(safe-area-inset-top))" }}
      >
        <img
          src={recipe?.image || placeholederImage}
          alt="Recipe"
          className="absolute inset-0 object-cover w-full h-full"
          style={{
            transform: `translateY(${offsetY * 0.4}px)`,
            marginTop: "calc(-1 * env(safe-area-inset-top))",
            paddingTop: "env(safe-area-inset-top)",
          }}
        />
      </AspectRatio>

      <DeleteRecipeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        recipeId={_id}
        navigate={() => navigate(-1)}
      />
    </div>
  );
};
