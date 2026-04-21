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
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type DeleteIngredientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  count?: number;
};

const Content = ({
  onDelete,
  onOpenChange,
  className,
}: {
  onDelete: () => void;
  onOpenChange: (open: boolean) => void;
  className?: string;
}) => (
  <div className={cn("grid gap-4", className)}>
    <Button
      size="lg"
      variant="destructive"
      onClick={() => {
        onDelete();
        onOpenChange(false);
      }}
    >
      Supprimer
    </Button>
  </div>
);

export function DeleteIngredientDialog({
  open,
  onOpenChange,
  onDelete,
  count = 1,
}: DeleteIngredientDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const description =
    count > 1
      ? `Êtes-vous sûr de vouloir supprimer ces ${count} ingrédients ? Cette action est irréversible.`
      : "Êtes-vous sûr de vouloir supprimer cet ingrédient ? Cette action est irréversible.";

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>
              Supprimer {count > 1 ? `${count} ingrédients` : "un ingrédient"}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <Content onDelete={onDelete} onOpenChange={onOpenChange} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent onClick={(e) => e.stopPropagation()}>
        <DrawerHeader>
          <DrawerTitle>
            Supprimer {count > 1 ? `${count} ingrédients` : "un ingrédient"}
          </DrawerTitle>
          <DialogDescription>{description}</DialogDescription>
        </DrawerHeader>
        <Content
          onDelete={onDelete}
          onOpenChange={onOpenChange}
          className="px-4 pb-[calc(16px+env(safe-area-inset-bottom))]"
        />
      </DrawerContent>
    </Drawer>
  );
}
