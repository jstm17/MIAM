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
import { useClearShoppingList } from "@/hooks/users/useClearShoppingList";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

type ShoppingClearCartDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export function ShoppingClearCartDialog({
  open,
  onOpenChange,
}: ShoppingClearCartDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Vider la liste de course</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir vider votre liste de course ? <br />{" "}
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm onOpenChange={onOpenChange} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-[calc(16px+env(safe-area-inset-bottom))]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Vider la liste de course</DrawerTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir vider votre liste de course ? <br /> Cette
            action est irréversible.
          </DialogDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" onOpenChange={onOpenChange} />
      </DrawerContent>
    </Drawer>
  );
}

type ProfileFormProps = {
  className?: string;
  onOpenChange: (open: boolean) => void;
};

function ProfileForm({ className, onOpenChange }: ProfileFormProps) {
  const { clearShoppingList, isPending } = useClearShoppingList();

  const onSubmit = async () => {
    try {
      await clearShoppingList();
      toast.success("Liste de course vidée avec succès");
      onOpenChange(false);
    } catch {
      toast.error("Impossible de vider la liste de course");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onSubmit();
      }}
      className={cn("grid items-start gap-6", className)}
    >
      <Button
        type="submit"
        disabled={isPending}
        size="lg"
        variant="destructive"
      >
        {isPending ? <Spinner /> : "Vider"}
      </Button>
    </form>
  );
}
