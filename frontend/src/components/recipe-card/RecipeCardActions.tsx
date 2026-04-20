import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookmarkIcon,
  Ellipsis,
  Eye,
  EyeOff,
  Pencil,
  Share,
  Trash,
} from "lucide-react";

import type { Recipe } from "@/types/recipe.types";

import { useToggleRecipeVisibility } from "@/hooks/recipes/useToggleRecipeVisibility";
import { useAuth } from "@/hooks/useAuth";
import { useGetSavedRecipes } from "@/hooks/users/useGetSavedRecipes";
import { useSaveRecipe } from "@/hooks/users/useSaveRecipe";
import { useUnsaveRecipe } from "@/hooks/users/useUnsaveRecipe";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { DeleteRecipeDialog } from "../dialog/DeleteRecipeDialog";
import { ShareRecipeDialog } from "../dialog/ShareRecipeDialog";

type RecipeCardActionsProps = {
  recipe: Recipe;
};

export const RecipeCardActions = ({ recipe }: RecipeCardActionsProps) => {
  const navigate = useNavigate();
  const { saveRecipe, isPending: isSaving } = useSaveRecipe();
  const { unsaveRecipe, isPending: isUnsaving } = useUnsaveRecipe();
  const { recipes: savedRecipes } = useGetSavedRecipes();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const { toggleVisibility, isPending: isPendingVisibility } =
    useToggleRecipeVisibility();
  const { user, isLoading } = useAuth();
  const { _id, slug, addedBy, visible } = recipe;
  const isSaved = savedRecipes.some((r) => r._id === _id);
  const isMyRecipe = addedBy._id === user?._id;

  useEffect(() => {
    if (!openDropdown) return;

    const startScrollY = window.scrollY;
    const THRESHOLD = 25;

    const handleScroll = () => {
      const diff = Math.abs(window.scrollY - startScrollY);

      if (diff > THRESHOLD) {
        setOpenDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [openDropdown]);

  const handleSaveRecipe = (
    e: React.MouseEvent,
    recipeId: string,
    isSaved: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();
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
    e.stopPropagation();
    toggleVisibility(recipeId, visible);
    toast.success(
      visible
        ? "La recette n'est plus visible par les autres"
        : "La recette est maintenant visible par les autres",
    );
  };

  return (
    <div className="absolute top-2 right-2 z-10">
      {!user ? (
        <Button
          size="icon-lg"
          variant="outline"
          aria-label="Save Recipe"
          className="backdrop-blur-sm bg-black/10 dark:bg-black/10 hover:bg-muted/10 active:bg-muted/10 aria-expanded:bg-muted/10"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShareDialogOpen(true);
          }}
        >
          <Share className="text-white" />
        </Button>
      ) : !isLoading && isMyRecipe ? (
        <DropdownMenu
          open={openDropdown}
          onOpenChange={setOpenDropdown}
          modal={false}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon-lg"
              aria-label="More Options"
              className="backdrop-blur-xs bg-black/10 dark:bg-black/10 hover:bg-muted/10 active:bg-muted/10 aria-expanded:bg-muted/10"
              onClick={(e) => e.stopPropagation()}
            >
              <Ellipsis color="white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-fit">
            <DropdownMenuGroup>
              <DropdownMenuItem
                disabled={isSaving || isUnsaving}
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/recipe-edit/${slug}`);
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
                    Rendre privé
                  </>
                ) : (
                  <>
                    <Eye />
                    Rendre public
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
      ) : (
        <Button
          size="icon-lg"
          variant="outline"
          aria-label="Save Recipe"
          className="backdrop-blur-sm bg-black/10 dark:bg-black/10 hover:bg-muted/10 active:bg-muted/10 aria-expanded:bg-muted/10"
          onClick={(e) => handleSaveRecipe(e, _id, isSaved)}
          disabled={isLoading || isSaving || isUnsaving}
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
      />

      <ShareRecipeDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        recipe={recipe}
      />
    </div>
  );
};
