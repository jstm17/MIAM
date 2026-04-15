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
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useDeleteUser } from "@/hooks/users/useDeleteUser";
import { cn } from "@/lib/utils";
import type { ApiError } from "@/types/error.types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

type ProfileDeleteAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export function ProfileDeleteAccountDialog({
  open,
  onOpenChange,
}: ProfileDeleteAccountDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Supprimer le compte</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer votre compte ? <br /> Cette
              action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm onOpenChange={onOpenChange} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Supprimer le compte</DrawerTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer votre compte ? <br /> Cette
            action est irréversible.
          </DialogDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" onOpenChange={onOpenChange} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" size="lg">
              Annuler
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type ProfileFormProps = {
  className?: string;
  onOpenChange: (open: boolean) => void;
};

function ProfileForm({ className, onOpenChange }: ProfileFormProps) {
  const { deleteUser, isPending } = useDeleteUser();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      const res = await deleteUser();
      toast.success(res.message);
      logout();
      onOpenChange(false);
      navigate("/login");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(apiError.message);
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
      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? <Spinner /> : "Supprimer"}
      </Button>
    </form>
  );
}
