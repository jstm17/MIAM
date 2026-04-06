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
import { useAuth } from "@/hooks/useAuth";
import { useGetSavedRecipes } from "@/hooks/users/useGetSavedRecipes";
import { useSaveRecipe } from "@/hooks/users/useSaveRecipe";
import type { Recipe } from "@/types/recipe.types";
import { BookmarkIcon, Ellipsis, Pencil, Reply, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

type ImageSectionProps = {
  recipe: Recipe;
  offsetY: number;
};
export const ImageSection = ({ recipe, offsetY }: ImageSectionProps) => {
  const navigate = useNavigate();

  const { saveRecipe, unsaveRecipe } = useSaveRecipe();
  const { recipes: savedRecipes } = useGetSavedRecipes();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { user } = useAuth();
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
      <AspectRatio ratio={14 / 9} className="relative overflow-hidden">
        <img
          src={recipe?.image || placeholederImage}
          alt="Recipe"
          className="absolute inset-0 object-cover w-full h-full"
          style={{ transform: `translateY(${offsetY * 0.4}px)` }}
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
