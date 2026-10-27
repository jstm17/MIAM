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
import type { AddTab } from "@/utils/formDraft";

type ClearAddFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tab: AddTab;
  onConfirm: () => void;
};

export function ClearAddFormDialog({
  open,
  onOpenChange,
  tab,
  onConfirm,
}: ClearAddFormDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const description =
    tab === "add-recipe"
      ? "Êtes-vous sûr de vouloir effacer cette recette ?"
      : "Êtes-vous sûr de vouloir effacer ce temps de cuisson ?";

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Vider le formulaire</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <ClearFormActions onOpenChange={onOpenChange} onConfirm={onConfirm} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-[calc(16px+env(safe-area-inset-bottom))]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Vider le formulaire</DrawerTitle>
          <DialogDescription>{description}</DialogDescription>
        </DrawerHeader>
        <ClearFormActions
          className="px-4"
          onOpenChange={onOpenChange}
          onConfirm={onConfirm}
        />
      </DrawerContent>
    </Drawer>
  );
}

type ClearFormActionsProps = {
  className?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

function ClearFormActions({
  className,
  onOpenChange,
  onConfirm,
}: ClearFormActionsProps) {
  return (
    <form
      onSubmit={(event) => {
        event.stopPropagation();
        event.preventDefault();
        onConfirm();
        onOpenChange(false);
      }}
      className={cn("grid items-start gap-6", className)}
    >
      <Button type="submit" size="lg" variant="destructive">
        Vider
      </Button>
    </form>
  );
}
