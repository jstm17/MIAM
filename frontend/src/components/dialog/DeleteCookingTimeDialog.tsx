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
import { useDeleteCookingTime } from "@/hooks/cooking-times/useDeleteCookingTime";
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

type DeleteCookingTimeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cookingTimeId: string;
  navigate?: () => void;
};
export function DeleteCookingTimeDialog({
  open,
  onOpenChange,
  cookingTimeId,
  navigate,
}: DeleteCookingTimeDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-106.25"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Supprimer le temps de cuisson</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce temps de cuisson ? <br />{" "}
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm
            onOpenChange={onOpenChange}
            cookingTimeId={cookingTimeId}
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
          <DrawerTitle>Supprimer le temps de cuisson</DrawerTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer ce temps de cuisson ? <br />{" "}
            Cette action est irréversible.
          </DialogDescription>
        </DrawerHeader>
        <ProfileForm
          className="px-4"
          onOpenChange={onOpenChange}
          cookingTimeId={cookingTimeId}
          navigate={navigate}
        />
      </DrawerContent>
    </Drawer>
  );
}

type ProfileFormProps = {
  className?: string;
  onOpenChange: (open: boolean) => void;
  cookingTimeId: string;
  navigate?: () => void;
};

function ProfileForm({
  className,
  onOpenChange,
  cookingTimeId,
  navigate,
}: ProfileFormProps) {
  const { deleteCookingTime, isPending } = useDeleteCookingTime();
  const { refetchUser } = useAuth();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    deleteCookingTime(cookingTimeId)
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
