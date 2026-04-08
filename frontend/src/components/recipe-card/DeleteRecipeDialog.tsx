import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useDeleteRecipe } from "@/hooks/recipes/useDeleteRecipe";
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

type DeleteRecipeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId: string;
  onRemove?: (id: string) => void;
  navigate?: () => void;
};
export function DeleteRecipeDialog({
  open,
  onOpenChange,
  recipeId,
  onRemove,
  navigate,
}: DeleteRecipeDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-106.25"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Supprimer la recette</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette recette ? <br /> Cette
              action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            onOpenChange={onOpenChange}
            recipeId={recipeId}
            onRemove={onRemove}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <DrawerHeader className="text-left">
          <DrawerTitle>Supprimer la recette</DrawerTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette recette ? <br /> Cette
            action est irréversible.
          </DialogDescription>
        </DrawerHeader>
        <ProfileForm
          className="px-4"
          onOpenChange={onOpenChange}
          recipeId={recipeId}
          onRemove={onRemove}
          navigate={navigate}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Annuler</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type ProfileFormProps = {
  className?: string;
  onOpenChange: (open: boolean) => void;
  recipeId: string;
  onRemove?: (id: string) => void;
  navigate?: () => void;
};

function ProfileForm({
  className,
  onOpenChange,
  recipeId,
  onRemove,
  navigate,
}: ProfileFormProps) {
  const { deleteRecipe, loading } = useDeleteRecipe();
  const { refetchUser } = useAuth();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteRecipe(recipeId)
      .then((data) => {
        toast.success(data.message);
        onRemove?.(recipeId);
        onOpenChange(false);
        refetchUser();
        navigate?.();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className={cn("grid items-start gap-6", className)}>
      <Button onClick={handleDelete} disabled={loading}>
        {loading ? <Spinner /> : "Supprimer"}
      </Button>
    </div>
  );
}
