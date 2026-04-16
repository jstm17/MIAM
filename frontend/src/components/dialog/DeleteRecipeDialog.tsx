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
  DrawerContent,
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
  navigate?: () => void;
};
export function DeleteRecipeDialog({
  open,
  onOpenChange,
  recipeId,
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
            navigate={navigate}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="pb-[calc(16px+env(safe-area-inset-bottom))]"
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
          navigate={navigate}
        />
      </DrawerContent>
    </Drawer>
  );
}

type ProfileFormProps = {
  className?: string;
  onOpenChange: (open: boolean) => void;
  recipeId: string;
  navigate?: () => void;
};

function ProfileForm({
  className,
  onOpenChange,
  recipeId,
  navigate,
}: ProfileFormProps) {
  const { deleteRecipe, isPending } = useDeleteRecipe();
  const { refetchUser } = useAuth();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteRecipe(recipeId)
      .then((data) => {
        toast.success(data.message);
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
      <Button
        onClick={handleDelete}
        disabled={isPending}
        size="lg"
        variant="destructive"
      >
        {isPending ? <Spinner /> : "Supprimer"}
      </Button>
    </div>
  );
}
